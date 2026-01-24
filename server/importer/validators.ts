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

const buildValidationResult = (type: 'success' | 'warning' | 'error', message: string, details?: string): ValidationResult => ({
  type,
  message,
  details,
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
    throw new ValidationError(
      'MODULE_JSON_MISSING',
      'Missing module.json',
      [buildValidationResult('error', 'Thieu module.json o root module folder')],
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
