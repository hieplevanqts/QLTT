import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import type { ModuleManifest, ModuleRegistryEntry, ReleaseType, ValidationContext, ValidationResult } from './types';
import { getRepoRoot } from './storage';

export class ValidationError extends Error {
  code: string;
  results: ValidationResult[];

  constructor(code: string, message: string, results: ValidationResult[]) {
    super(message);
    this.code = code;
    this.results = results;
  }
}

export interface ZipEntryInfo {
  entryName: string;
  isDirectory: boolean;
  size: number;
  getData: () => Buffer;
}

export interface ValidatedZipResult {
  moduleId: string;
  moduleRoot: string;
  manifest: ModuleManifest;
  entries: ZipEntryInfo[];
  results: ValidationResult[];
}

const normalizeZipPath = (entryName: string) =>
  entryName.replace(/\\/g, '/').replace(/^(\.\/)+/, '').replace(/^\/+/, '');

const isPathTraversal = (entryName: string) => {
  const normalized = normalizeZipPath(entryName);
  const segments = normalized.split('/');
  const hasParentSegment = segments.some((segment) => segment === '..');
  const isAbsolute = normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized);
  return hasParentSegment || isAbsolute;
};

const hasAllowedExtension = (entryName: string, allowExtensions: string[]) => {
  const ext = path.extname(entryName).toLowerCase();
  return ext.length > 0 && allowExtensions.includes(ext);
};

const parseModuleManifest = (buffer: Buffer) => {
  const json = buffer.toString('utf8');
  return JSON.parse(json) as ModuleManifest;
};

const toTitleLabel = (value: string) => {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => {
      const trimmed = segment.trim();
      if (!trimmed) return '';
      const isShort = trimmed.length <= 4 && /^[a-z0-9]+$/i.test(trimmed);
      if (isShort) {
        return trimmed.toUpperCase();
      }
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .filter(Boolean)
    .join(' ');
};

const toRouteExport = (moduleId: string) => {
  const parts = moduleId.split(/[-_]/g).filter(Boolean);
  const camel = parts
    .map((part, index) => {
      if (index === 0) return part.toLowerCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
  return `${camel || 'module'}Route`;
};

const normalizeBasePath = (value: string) => {
  if (!value) return '';
  let next = value.trim();
  if (!next.startsWith('/')) next = `/${next}`;
  next = next.replace(/\/+$/, '');
  next = next.replace(/\*+$/, '');
  if (next === '') return '/';
  return next;
};

const normalizePathForMatch = (value: string) =>
  value.replace(/\\/g, '/').replace(/^(\.\/)+/, '').replace(/^\/+/, '');

const extractBasePathFromRoutes = (
  entries: ZipEntryInfo[],
  moduleRootPrefix: string,
  routesRel?: string | null,
) => {
  if (!routesRel) return null;
  const targetName = moduleRootPrefix ? `${moduleRootPrefix}${routesRel}` : routesRel;
  const entry = entries.find((item) => normalizePathForMatch(item.entryName) === targetName);
  if (!entry) return null;
  const content = entry.getData().toString('utf8');
  const matches: string[] = [];
  const regex = /path\s*:\s*['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const value = match[1];
    if (!value || !value.startsWith('/')) continue;
    matches.push(value);
  }
  if (matches.length === 0) return null;
  const normalized = matches
    .map((value) => value.replace(/\/:\w+.*$/, '').replace(/\/\*+$/, '').trim())
    .map((value) => (value.length === 0 ? '/' : value));
  normalized.sort((a, b) => {
    const aDepth = a.split('/').filter(Boolean).length;
    const bDepth = b.split('/').filter(Boolean).length;
    if (aDepth !== bDepth) return aDepth - bDepth;
    return a.length - b.length;
  });
  return normalizeBasePath(normalized[0]);
};

const pickCandidateFile = (paths: string[], preferred: string[]) => {
  const matches = paths.filter((item) =>
    preferred.some((name) => item === name || item.endsWith(`/${name}`)),
  );
  if (matches.length === 0) return null;
  matches.sort((a, b) => {
    const aDepth = a.split('/').filter(Boolean).length;
    const bDepth = b.split('/').filter(Boolean).length;
    if (aDepth !== bDepth) return aDepth - bDepth;
    return a.length - b.length;
  });
  return matches[0];
};

const buildSuggestedManifest = (
  entries: ZipEntryInfo[],
  ctx: ValidationContext,
) => {
  const fileEntries = entries.filter((entry) => !entry.isDirectory);
  const normalizedFiles = fileEntries
    .map((entry) => normalizePathForMatch(entry.entryName))
    .filter((entry) => entry.length > 0 && !entry.startsWith('__MACOSX/'));

  const candidates = new Map<string, { root: string; id: string; count: number; priority: number }>();

  normalizedFiles.forEach((entry) => {
    const segments = entry.split('/').filter(Boolean);
    if (segments.length === 0) return;
    if (segments[0] === 'src' && segments[1] === 'modules' && segments[2]) {
      const moduleId = segments[2];
      const root = `src/modules/${moduleId}`;
      const current = candidates.get(root) ?? { root, id: moduleId, count: 0, priority: 2 };
      current.count += 1;
      candidates.set(root, current);
      return;
    }
    if (segments.length >= 2) {
      const root = segments[0];
      const current = candidates.get(root) ?? { root, id: root, count: 0, priority: 1 };
      current.count += 1;
      candidates.set(root, current);
    }
  });

  let best = [...candidates.values()].sort((a, b) => {
    if (a.count !== b.count) return b.count - a.count;
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.root.localeCompare(b.root);
  })[0];

  const fallbackId = ctx.originalFileName
    ? path.parse(ctx.originalFileName).name
    : 'new-module';

  if (!best) {
    const hasRootFiles = normalizedFiles.some((entry) => !entry.includes('/'));
    best = {
      root: hasRootFiles ? '' : fallbackId,
      id: fallbackId,
      count: normalizedFiles.length,
      priority: 0,
    };
  }

  const moduleId = best.id || fallbackId;
  const moduleRoot = best.root;
  const moduleRootPrefix = moduleRoot ? `${moduleRoot}/` : '';
  const relativePaths = normalizedFiles
    .filter((entry) => (moduleRootPrefix ? entry.startsWith(moduleRootPrefix) : true))
    .map((entry) => (moduleRootPrefix ? entry.slice(moduleRootPrefix.length) : entry))
    .filter(Boolean);

  const entryRel = pickCandidateFile(relativePaths, [
    'index.tsx',
    'index.ts',
    'main.tsx',
    'main.ts',
    'entry.tsx',
    'entry.ts',
  ]);

  const routesRel =
    pickCandidateFile(relativePaths, ['routes.tsx', 'routes.ts', 'route.tsx', 'route.ts']) ??
    relativePaths.find((item) => /routes?(\.|\/)/i.test(item) && /\.(ts|tsx)$/.test(item)) ??
    null;

  const basePathFromRoutes = extractBasePathFromRoutes(entries, moduleRootPrefix, routesRel);
  const basePath = normalizeBasePath(basePathFromRoutes || `/${moduleId}`);

  const srcPrefix = `src/modules/${moduleId}`;
  const entryPath = entryRel ? `${srcPrefix}/${entryRel}` : `${srcPrefix}/index.ts`;
  const routesPath = routesRel ? `${srcPrefix}/${routesRel}` : `${srcPrefix}/routes.tsx`;

  const name = toTitleLabel(moduleId) || moduleId;
  const menuLabel = name;

  const manifest: ModuleManifest = {
    id: moduleId,
    name,
    version: '0.1.0',
    basePath,
    entry: entryPath.replace(/\\/g, '/'),
    routes: routesPath.replace(/\\/g, '/'),
    routeExport: toRouteExport(moduleId),
    permissions: [],
    ui: {
      menuLabel,
      menuPath: basePath,
    },
  };

  const details = [
    moduleRoot ? `Root: ${moduleRoot}` : 'Root: (goc zip)',
    `Entry: ${manifest.entry}`,
    `Routes: ${manifest.routes}`,
    basePathFromRoutes ? `BasePath: ${basePath} (tu routes)` : `BasePath: ${basePath}`,
  ].join(' | ');

  return { manifest, details };
};

const applyManifestOverrides = (manifest: ModuleManifest, overrides?: Partial<ModuleManifest>) => {
  if (!overrides) return manifest;
  if (overrides.id && overrides.id !== manifest.id) {
    throw new ValidationError(
      'MODULE_ID_OVERRIDE',
      'module id cannot be overridden',
      [buildValidationResult('error', 'Khong duoc doi module id', `${overrides.id} != ${manifest.id}`)],
    );
  }

  const next: ModuleManifest = {
    ...manifest,
    ...overrides,
    ui: {
      ...manifest.ui,
      ...overrides.ui,
    },
  };

  if (overrides.permissions) {
    next.permissions = overrides.permissions;
  }

  return next;
};

const isValidModuleRoot = (rootPath: string) => {
  const normalized = normalizeZipPath(rootPath);
  if (!normalized) return true;
  if (normalized.split('/').length === 1) {
    return true;
  }
  return normalized.startsWith('src/modules/');
};

const getModuleIdFromRoot = (rootPath: string) => {
  const normalized = normalizeZipPath(rootPath);
  if (!normalized) {
    return '';
  }
  const parts = normalized.split('/').filter(Boolean);
  return parts[parts.length - 1];
};

const isStringRecord = (value: unknown): value is Record<string, string> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value).every((entry) => typeof entry === 'string');
};

const validateManifestSchema = (manifest: ModuleManifest) => {
  const errors: string[] = [];
  if (!manifest.id) errors.push('module.json missing "id"');
  if (!manifest.name) errors.push('module.json missing "name"');
  if (!manifest.version) errors.push('module.json missing "version"');
  if (!manifest.basePath) errors.push('module.json missing "basePath"');
  if (!manifest.entry) errors.push('module.json missing "entry"');
  if (!manifest.routes) errors.push('module.json missing "routes"');
  if (!manifest.permissions || !Array.isArray(manifest.permissions)) errors.push('module.json missing "permissions"');
  if (!manifest.ui?.menuLabel) errors.push('module.json missing "ui.menuLabel"');
  if (!manifest.ui?.menuPath) errors.push('module.json missing "ui.menuPath"');
  if (!manifest.routeExport) errors.push('module.json missing "routeExport"');
  if (manifest.dependencies) {
    if (Array.isArray(manifest.dependencies)) {
      if (manifest.dependencies.some(dep => typeof dep !== 'string')) {
        errors.push('module.json "dependencies" must be a string array');
      }
    } else if (!isStringRecord(manifest.dependencies)) {
      errors.push('module.json "dependencies" must be a string map');
    }
  }
  if (manifest.package?.dependencies) {
    if (!isStringRecord(manifest.package.dependencies)) {
      errors.push('module.json "package.dependencies" must be a string map');
    }
  }
  return errors;
};

const isValidReleaseType = (value?: string): value is ReleaseType => {
  if (!value) return false;
  return value === 'patch' || value === 'minor' || value === 'major';
};

const buildValidationResult = (
  type: 'success' | 'warning' | 'error',
  message: string,
  details?: string,
  extra?: Partial<ValidationResult>,
): ValidationResult => ({
  type,
  message,
  details,
  ...extra,
});

const loadProjectDependencies = () => {
  try {
    const pkgPath = path.join(getRepoRoot(), 'package.json');
    const content = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
      optionalDependencies?: Record<string, string>;
    };
    return new Set([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.optionalDependencies || {}),
    ]);
  } catch {
    return new Set<string>();
  }
};

const getPackageName = (specifier: string) => {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
  }
  return specifier.split('/')[0];
};

const shouldTreatAsExternal = (specifier: string) => {
  if (specifier.startsWith('.') || specifier.startsWith('/')) return false;
  if (specifier.startsWith('@/') || specifier.startsWith('src/')) return false;
  return true;
};

const collectExternalImports = (entries: ZipEntryInfo[], moduleRootPrefix: string) => {
  const external = new Set<string>();
  const importRegex = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g;
  const exportRegex = /export\s+[^'"]+\s+from\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(\s*['"]([^'"]+)['"]\s*\)/g;

  entries.forEach((entry) => {
    if (entry.isDirectory) return;
    const normalized = normalizeZipPath(entry.entryName);
    const relativePath = moduleRootPrefix && normalized.startsWith(moduleRootPrefix)
      ? normalized.slice(moduleRootPrefix.length)
      : normalized;
    if (!(relativePath.endsWith('.ts') || relativePath.endsWith('.tsx'))) {
      return;
    }

    const content = entry.getData().toString('utf8');
    const collect = (regex: RegExp) => {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(content)) !== null) {
        const spec = match[1];
        if (!spec || !shouldTreatAsExternal(spec)) continue;
        external.add(getPackageName(spec));
      }
    };
    collect(importRegex);
    collect(exportRegex);
    collect(requireRegex);
  });

  return external;
};

const collectCssImports = (
  entries: ZipEntryInfo[],
  moduleRootPrefix: string,
  moduleId: string,
) => {
  const cssImports = new Set<string>();
  const cssImportRegex = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+\.css)['"]/g;
  const requireRegex = /require\(\s*['"]([^'"]+\.css)['"]\s*\)/g;
  const moduleSegment = `modules/${moduleId}/`;

  const addImport = (importPath: string, filePath: string) => {
    const normalizedImport = importPath.replace(/\\/g, '/');
    if (normalizedImport.includes(moduleSegment)) {
      const index = normalizedImport.indexOf(moduleSegment);
      cssImports.add(normalizedImport.slice(index + moduleSegment.length));
      return;
    }

    if (normalizedImport.startsWith('.')) {
      const resolved = path.posix.resolve(path.posix.dirname(filePath), normalizedImport);
      cssImports.add(resolved.replace(/^\/+/, ''));
    }
  };

  entries.forEach((entry) => {
    if (entry.isDirectory) return;
    const normalized = normalizeZipPath(entry.entryName);
    const relativePath = moduleRootPrefix && normalized.startsWith(moduleRootPrefix)
      ? normalized.slice(moduleRootPrefix.length)
      : normalized;
    if (!(relativePath.endsWith('.ts') || relativePath.endsWith('.tsx'))) {
      return;
    }

    const content = entry.getData().toString('utf8');
    const collect = (regex: RegExp) => {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(content)) !== null) {
        const spec = match[1];
        if (!spec) continue;
        addImport(spec, relativePath);
      }
    };
    collect(cssImportRegex);
    collect(requireRegex);
  });

  return cssImports;
};

export function validateZipEntries(entries: ZipEntryInfo[], ctx: ValidationContext): ValidatedZipResult {
  const results: ValidationResult[] = [];
  const fileEntries = entries.filter(entry => !entry.isDirectory);

  if (fileEntries.length > ctx.maxFileCount) {
    throw new ValidationError(
      'FILE_COUNT_LIMIT',
      'Too many files in zip archive',
      [buildValidationResult('error', 'Vượt quá số lượng file tối đa', `Giới hạn: ${ctx.maxFileCount}`)],
    );
  }

  const traversalEntry = entries.find(entry => isPathTraversal(entry.entryName));
  if (traversalEntry) {
    throw new ValidationError(
      'PATH_TRAVERSAL',
      'Zip contains path traversal',
      [buildValidationResult('error', 'Phát hiện path traversal trong zip', traversalEntry.entryName)],
    );
  }

  const moduleJsonCandidates = entries.filter(entry => {
    const normalized = normalizeZipPath(entry.entryName);
    return normalized.endsWith('/module.json') || normalized === 'module.json';
  });

  if (moduleJsonCandidates.length === 0) {
    const suggestion = buildSuggestedManifest(entries, ctx);
    throw new ValidationError(
      'MODULE_JSON_MISSING',
      'Missing module.json',
      [
        buildValidationResult('error', 'Thieu module.json o root module folder'),
        buildValidationResult(
          'warning',
          'Goi y module.json mau',
          suggestion.details,
          { suggestedManifest: suggestion.manifest },
        ),
      ],
    );
  }

  let selectedManifest: ModuleManifest | null = null;
  let moduleRoot = '';
  let moduleId = '';

  for (const candidate of moduleJsonCandidates) {
    const candidatePath = normalizeZipPath(candidate.entryName);
    const rootPath = candidatePath === 'module.json'
      ? ''
      : candidatePath.replace(/\/module\.json$/, '');
    if (!isValidModuleRoot(rootPath)) {
      continue;
    }

    const manifest = applyManifestOverrides(parseModuleManifest(candidate.getData()), ctx.manifestOverrides);
    const inferredId = rootPath ? getModuleIdFromRoot(rootPath) : manifest.id;
    if (manifest.id !== inferredId) {
      continue;
    }

    selectedManifest = manifest;
    moduleRoot = rootPath;
    moduleId = inferredId;
    break;
  }

  if (!selectedManifest) {
    throw new ValidationError(
      'MODULE_ROOT_INVALID',
      'Invalid module root structure',
      [buildValidationResult('error', 'Khong tim thay module.json hop le', 'Root phai la <moduleId> hoac src/modules/<moduleId>')],
    );
  }

  if (ctx.originalFileName) {
    const baseName = path.parse(ctx.originalFileName).name;
    if (baseName !== moduleId) {
      throw new ValidationError(
        'ZIP_NAME_MISMATCH',
        'Zip name must match module id',
        [buildValidationResult('error', 'Tên file zip phải trùng với ID mô-đun', `${baseName} != ${moduleId}`)],
      );
    }
  }

  const schemaErrors = validateManifestSchema(selectedManifest);
  if (schemaErrors.length > 0) {
    const schemaMessage = `Invalid module.json: ${schemaErrors.join('; ')}`;
    throw new ValidationError(
      'MODULE_JSON_INVALID',
      schemaMessage,
      schemaErrors.map(err => buildValidationResult('error', err)),
    );
  }

  if (ctx.requireReleaseType) {
    const releaseType = selectedManifest.release?.type;
    if (!releaseType || !isValidReleaseType(releaseType)) {
      throw new ValidationError(
        'RELEASE_TYPE_MISSING',
        'module.json missing "release.type"',
        [buildValidationResult('error', 'module.json missing "release.type"')],
      );
    }
  }

  const moduleRootPrefix = moduleRoot ? `${normalizeZipPath(moduleRoot)}/` : '';
  const hasInvalidEntry = moduleRootPrefix
    ? entries.some(entry => {
        const normalized = normalizeZipPath(entry.entryName);
        if (normalized === moduleRoot || normalized.startsWith(moduleRootPrefix)) {
          return false;
        }
        return true;
      })
    : false;

  if (hasInvalidEntry) {
    throw new ValidationError(
      'OUTSIDE_MODULE_FOLDER',
      'Zip contains files outside module folder',
      [buildValidationResult('error', 'Zip chua file ngoai module folder')],
    );
  }

  for (const entry of fileEntries) {
    const normalized = normalizeZipPath(entry.entryName);
    const relativePath = moduleRootPrefix && normalized.startsWith(moduleRootPrefix)
      ? normalized.slice(moduleRootPrefix.length)
      : normalized;

    if (!hasAllowedExtension(relativePath, ctx.allowExtensions)) {
      throw new ValidationError(
        'EXTENSION_NOT_ALLOWED',
        'Disallowed file extension',
        [buildValidationResult('error', 'File khong dung dinh dang cho phep', relativePath)],
      );
    }

    for (const banned of ctx.bannedPaths) {
      if (relativePath.toLowerCase() === banned.toLowerCase() || relativePath.toLowerCase().startsWith(`${banned.toLowerCase()}/`)) {
        throw new ValidationError(
          'BANNED_PATH',
          'Zip contains banned path',
          [buildValidationResult('error', 'File/thu muc bi cam', relativePath)],
        );
      }
    }
  }

  const existing = ctx.existingModules.find(mod => mod.id === moduleId);
  if (existing && !semver.valid(selectedManifest.version)) {
    throw new ValidationError(
      'SEMVER_INVALID',
      'Invalid version',
      [buildValidationResult('error', 'Version khong hop le', selectedManifest.version)],
    );
  }

  if (existing && (ctx.requireNewerVersion ?? true) && !semver.gt(selectedManifest.version, existing.version)) {
    throw new ValidationError(
      'SEMVER_NOT_GREATER',
      'Version must be greater than existing version',
      [buildValidationResult('error', 'Version moi phai lon hon version hien tai', `${selectedManifest.version} <= ${existing.version}`)],
    );
  }

  if (ctx.existingModules.some(mod => mod.basePath === selectedManifest.basePath && mod.id !== moduleId)) {
    throw new ValidationError(
      'BASE_PATH_DUPLICATE',
      'basePath already exists',
      [buildValidationResult('error', 'basePath bi trung voi module khac', selectedManifest.basePath)],
    );
  }

  const externalImports = collectExternalImports(entries, moduleRootPrefix);
  if (externalImports.size > 0) {
    const declaredDeps = Array.isArray(selectedManifest.dependencies)
      ? selectedManifest.dependencies
      : selectedManifest.dependencies && typeof selectedManifest.dependencies === 'object'
        ? Object.keys(selectedManifest.dependencies)
        : [];
    const declaredPackageDeps = selectedManifest.package?.dependencies
      ? Object.keys(selectedManifest.package.dependencies)
      : [];
    const declaredAll = new Set([...declaredDeps, ...declaredPackageDeps]);
    const missingInManifest = [...externalImports].filter(dep => !declaredAll.has(dep));
    if (missingInManifest.length > 0) {
      results.push(buildValidationResult(
        'warning',
        'module.json thiếu khai báo dependencies',
        missingInManifest.join(', '),
      ));
    }

    const projectDeps = loadProjectDependencies();
    const missingInProject = [...externalImports].filter(dep => !projectDeps.has(dep));
    if (missingInProject.length > 0) {
      const versionSpec = (dep: string) => selectedManifest.package?.dependencies?.[dep];
      const installList = missingInProject.map(dep => {
        const version = versionSpec(dep);
        return version ? `${dep}@${version}` : dep;
      });
      results.push(buildValidationResult(
        'warning',
        'Project chưa cài dependencies',
        `${missingInProject.join(', ')} | npm i ${installList.join(' ')}`,
      ));
    }
  }

  const cssFiles = fileEntries
    .map(entry => {
      const normalized = normalizeZipPath(entry.entryName);
      const relativePath = moduleRootPrefix && normalized.startsWith(moduleRootPrefix)
        ? normalized.slice(moduleRootPrefix.length)
        : normalized;
      return relativePath;
    })
    .filter(relativePath => relativePath.endsWith('.css') && !relativePath.endsWith('.module.css'));

  if (cssFiles.length > 0) {
    const cssImports = collectCssImports(entries, moduleRootPrefix, moduleId);
    const missingImports = cssFiles.filter(filePath => !cssImports.has(filePath));
    if (missingImports.length > 0) {
      results.push(buildValidationResult(
        'warning',
        'CSS global chua duoc import',
        missingImports.join(', '),
      ));
    }
  }

  results.push(buildValidationResult('success', 'Cau truc zip hop le'));
  results.push(buildValidationResult('success', 'module.json hop le'));

  return {
    moduleId,
    moduleRoot: normalizeZipPath(moduleRoot),
    manifest: selectedManifest,
    entries,
    results,
  };
}
