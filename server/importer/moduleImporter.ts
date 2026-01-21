import fs from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';
import semver from 'semver';
import type {
  ImportJob,
  MenuItem,
  ModuleManifest,
  ModuleRegistryEntry,
  ReleaseType,
  ValidationResult,
} from './types';
import { validateZipEntries, ValidationError } from './validators';
import {
  createImportJob,
  generateJobId,
  getBackupsDir,
  getModulesRoot,
  getTmpDir,
  getZipsDir,
  loadMenuRegistry,
  loadImportHistory,
  loadRegistry,
  saveImportHistory,
  saveMenuRegistry,
  saveRegistry,
  updateImportJob,
} from './storage';

const ALLOW_EXTENSIONS = ['.ts', '.tsx', '.css', '.json', '.md', '.png', '.jpg', '.jpeg', '.svg', '.webp'];
const BANNED_PATHS = [
  'package.json',
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
  'src/App.tsx',
  'src/main.tsx',
  'src/routes',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.node.json',
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  'docker',
  'docker-compose.yml',
  'nginx.conf',
];

const MAX_FILES = 300;
const MAX_ZIP_BYTES = 5 * 1024 * 1024;
const MAX_ARTIFACT_VERSIONS = 5;

const ensureDir = async (dir: string) => {
  await fs.mkdir(dir, { recursive: true });
};

const removeDir = async (dir: string) => {
  await fs.rm(dir, { recursive: true, force: true });
};

const copyDir = async (src: string, dest: string) => {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

const removeFile = async (filePath?: string) => {
  if (!filePath) return;
  await fs.rm(filePath, { force: true }).catch(() => undefined);
};

const storeZipArchive = async (moduleId: string, sourcePath: string, originalName: string) => {
  const safeName = path.basename(originalName);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const targetDir = path.join(getZipsDir(), moduleId, 'zips', timestamp);
  await ensureDir(targetDir);
  const targetPath = path.join(targetDir, safeName);

  try {
    await fs.rename(sourcePath, targetPath);
  } catch (error: any) {
    await fs.copyFile(sourcePath, targetPath);
    await removeFile(sourcePath);
  }

  const stat = await fs.stat(targetPath);
  return {
    storedZipPath: targetPath,
    storedZipName: safeName,
    storedZipSize: stat.size,
  };
};

const pruneModuleArtifacts = async (moduleId: string, keep = MAX_ARTIFACT_VERSIONS) => {
  const history = await loadImportHistory();
  const moduleJobs = history
    .filter(job => job.moduleId === moduleId && (job.backupPath || job.storedZipPath))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const keepIds = new Set(moduleJobs.slice(0, keep).map(job => job.id));
  const removedIds = new Set(moduleJobs.filter(job => !keepIds.has(job.id)).map(job => job.id));
  if (removedIds.size === 0) return;

  for (const job of moduleJobs) {
    if (!removedIds.has(job.id)) continue;
    if (job.backupPath) {
      await fs.rm(job.backupPath, { recursive: true, force: true }).catch(() => undefined);
    }
    if (job.storedZipPath) {
      await removeFile(job.storedZipPath);
    }
  }

  const nextHistory = history.map(job => {
    if (!removedIds.has(job.id)) return job;
    return {
      ...job,
      backupPath: undefined,
      storedZipPath: undefined,
      storedZipName: undefined,
      storedZipSize: undefined,
    };
  });

  await saveImportHistory(nextHistory);
};

const extractZipToTemp = async (
  zip: AdmZip,
  moduleRoot: string,
  moduleId: string,
) => {
  const tmpRoot = getTmpDir();
  const tempDir = await fs.mkdtemp(path.join(tmpRoot, `${moduleId}-`));
  const moduleTempPath = path.join(tempDir, moduleId);
  await ensureDir(moduleTempPath);

  const normalizedRoot = moduleRoot.replace(/\\/g, '/').replace(/^\/+/, '');
  const moduleRootPrefix = normalizedRoot ? `${normalizedRoot}/` : '';
  const entries = zip.getEntries();

  for (const entry of entries) {
    const entryName = entry.entryName.replace(/\\/g, '/').replace(/^\/+/, '');
    if (moduleRootPrefix && !entryName.startsWith(moduleRootPrefix)) {
      continue;
    }
    const relative = moduleRootPrefix ? entryName.slice(moduleRootPrefix.length) : entryName;
    if (!relative || entry.isDirectory) {
      continue;
    }
    const outputPath = path.join(moduleTempPath, relative);
    if (!outputPath.startsWith(moduleTempPath)) {
      throw new Error('Path traversal detected during extraction');
    }
    await ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, entry.getData());
  }

  return { tempDir, moduleTempPath };
};

const buildTimelineEntry = (status: ImportJob['status'], message: string) => ({
  timestamp: new Date().toISOString(),
  status,
  message,
});

const buildJob = (params: Pick<ImportJob, 'fileName' | 'fileSize' | 'createdBy'>): ImportJob => ({
  id: generateJobId(),
  status: 'pending',
  createdAt: new Date().toISOString(),
  fileName: params.fileName,
  fileSize: params.fileSize,
  createdBy: params.createdBy,
  timeline: [buildTimelineEntry('pending', 'Tao job import')],
});

const buildUpdateJob = (params: Pick<ImportJob, 'fileName' | 'fileSize' | 'createdBy' | 'updatedBy' | 'updatedByName'>): ImportJob => ({
  id: generateJobId(),
  status: 'pending',
  createdAt: new Date().toISOString(),
  fileName: params.fileName,
  fileSize: params.fileSize,
  createdBy: params.createdBy,
  updatedBy: params.updatedBy,
  updatedByName: params.updatedByName,
  operation: 'update',
  timeline: [buildTimelineEntry('pending', 'Tao job cap nhat')],
});

const buildRollbackJob = (params: Pick<ImportJob, 'fileName' | 'fileSize' | 'createdBy' | 'updatedBy' | 'updatedByName'>): ImportJob => ({
  id: generateJobId(),
  status: 'pending',
  createdAt: new Date().toISOString(),
  fileName: params.fileName,
  fileSize: params.fileSize,
  createdBy: params.createdBy,
  updatedBy: params.updatedBy,
  updatedByName: params.updatedByName,
  operation: 'rollback',
  timeline: [buildTimelineEntry('pending', 'Tao job rollback')],
});

const buildValidationResult = (type: ValidationResult['type'], message: string, details?: string): ValidationResult => ({
  type,
  message,
  details,
});

const analyzeMenuUpdates = async (
  menus: MenuItem[] | undefined,
  moduleId: string,
) => {
  const results: ValidationResult[] = [];
  const newMenus: MenuItem[] = [];
  const conflicts: string[] = [];

  if (!menus || menus.length === 0) {
    return { newMenus, conflicts, results };
  }

  const existingMenus = await loadMenuRegistry();
  const seenIds = new Set<string>();
  const seenPaths = new Set<string>();

  menus.forEach((menu) => {
    const id = menu.id?.trim();
    const label = menu.label?.trim();
    const path = menu.path?.trim();

    if (!id || !label || !path) {
      results.push(buildValidationResult('error', 'Menu item missing id/label/path', `${id ?? ''} ${label ?? ''} ${path ?? ''}`.trim()));
      return;
    }

    if (seenIds.has(id)) {
      results.push(buildValidationResult('error', 'Duplicate menu id in module.json', id));
      return;
    }

    if (path && seenPaths.has(path)) {
      results.push(buildValidationResult('error', 'Duplicate menu path in module.json', path));
      return;
    }

    seenIds.add(id);
    if (path) seenPaths.add(path);

    const conflict = existingMenus.find(existing => existing.id === id || existing.path === path);
    if (conflict) {
      conflicts.push(id);
      results.push(buildValidationResult('warning', 'Menu item already exists in registry', `${id} (${path})`));
      return;
    }

    newMenus.push({
      ...menu,
      id,
      label,
      path,
      moduleId: menu.moduleId ?? moduleId,
      isEnabled: menu.isEnabled ?? true,
    });
  });

  return { newMenus, conflicts, results };
};

const detectUpdateType = (
  previous: ModuleRegistryEntry,
  next: ModuleManifest,
  newMenus: MenuItem[],
): ReleaseType => {
  if (previous.basePath !== next.basePath) return 'major';
  if (previous.routes !== next.routes) return 'major';
  if (previous.routeExport !== next.routeExport) return 'major';
  if (previous.entry !== next.entry) return 'major';

  const prevPerms = new Set(previous.permissions || []);
  const nextPerms = new Set(next.permissions || []);
  const removedPerms = [...prevPerms].filter((perm) => !nextPerms.has(perm));
  if (removedPerms.length > 0) return 'major';

  const addedPerms = [...nextPerms].filter((perm) => !prevPerms.has(perm));
  if (addedPerms.length > 0) return 'minor';

  if (newMenus.length > 0) return 'minor';

  return 'patch';
};

const validateZip = (
  zip: AdmZip,
  registry: ModuleRegistryEntry[],
  originalFileName?: string,
  manifestOverrides?: Partial<ModuleManifest>,
  requireReleaseType?: boolean,
  requireNewerVersion?: boolean,
) => {
  const entries = zip.getEntries().map(entry => ({
    entryName: entry.entryName,
    isDirectory: entry.isDirectory,
    size: entry.header.size,
    getData: () => entry.getData(),
  }));

  return validateZipEntries(entries, {
    existingModules: registry,
    maxZipBytes: MAX_ZIP_BYTES,
    maxFileCount: MAX_FILES,
    allowExtensions: ALLOW_EXTENSIONS,
    bannedPaths: BANNED_PATHS,
    originalFileName,
    manifestOverrides,
    requireReleaseType,
    requireNewerVersion,
  });
};

export const importModuleZip = async (
  filePath: string,
  fileName: string,
  fileSize: number,
  createdBy?: string,
  manifestOverrides?: Partial<ModuleManifest>,
): Promise<ImportJob> => {
  const job = buildJob({ fileName, fileSize, createdBy });
  await createImportJob(job);

  if (fileSize > MAX_ZIP_BYTES) {
    const failedJob = await updateImportJob(job.id, {
      status: 'failed',
      errorMessage: 'File vuot qua gioi han kich thuoc',
      timeline: [...job.timeline, buildTimelineEntry('failed', 'File vuot qua kich thuoc cho phep')],
    });
    return failedJob || job;
  }

  const registry = await loadRegistry();
  const zip = new AdmZip(filePath);
  const updatedTimeline = [...job.timeline, buildTimelineEntry('validating', 'Dang validate goi module')];
  await updateImportJob(job.id, { status: 'validating', timeline: updatedTimeline });

  try {
    const validated = validateZip(zip, registry, fileName, manifestOverrides);
    const manifest = validated.manifest;
    const validationResults: ValidationResult[] = validated.results;

    const importingTimeline = [...updatedTimeline, buildTimelineEntry('importing', 'Dang import module')];
    await updateImportJob(job.id, {
      status: 'importing',
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
      validationResults,
      timeline: importingTimeline,
    });

    const { tempDir, moduleTempPath } = await extractZipToTemp(zip, validated.moduleRoot, validated.moduleId);
    const targetDir = path.join(getModulesRoot(), manifest.id);
    const manifestPath = path.join(moduleTempPath, 'module.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    let backupPath: string | undefined;
    let backupVersion: string | undefined;
    const existing = registry.find(mod => mod.id === manifest.id);
    if (existing) {
      backupPath = path.join(getBackupsDir(), manifest.id, Date.now().toString());
      await ensureDir(backupPath);
      await copyDir(targetDir, backupPath);
      backupVersion = existing.version;
    }

    await removeDir(targetDir);
    await copyDir(moduleTempPath, targetDir);
    await removeDir(tempDir);

    const nextRegistry: ModuleRegistryEntry[] = registry.filter(mod => mod.id !== manifest.id);
    nextRegistry.push({
      ...manifest,
      installedAt: new Date().toISOString(),
      installedBy: createdBy,
      status: 'active',
      routeExport: manifest.routeExport,
    });
    await saveRegistry(nextRegistry);

    const completedTimeline = [
      ...importingTimeline,
      buildTimelineEntry('completed', 'Import module thanh cong'),
    ];
    const storedZip = await storeZipArchive(manifest.id, filePath, fileName);
    const completedJob = await updateImportJob(job.id, {
      status: 'completed',
      backupPath,
      backupVersion,
      timeline: completedTimeline,
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
      storedZipPath: storedZip.storedZipPath,
      storedZipName: storedZip.storedZipName,
      storedZipSize: storedZip.storedZipSize,
    });
    await pruneModuleArtifacts(manifest.id);
    return completedJob || job;
  } catch (error: any) {
    const validationResults = error instanceof ValidationError ? error.results : undefined;
    const failedTimeline = [
      ...updatedTimeline,
      buildTimelineEntry('failed', 'Import module that bai'),
    ];
    const failedJob = await updateImportJob(job.id, {
      status: 'failed',
      errorMessage: error?.message || 'Import that bai',
      validationResults,
      timeline: failedTimeline,
    });
    await removeFile(filePath);
    return failedJob || job;
  }
};

export const inspectModuleUpdate = async (
  filePath: string,
  fileName: string,
  moduleId: string,
  manifestOverrides?: Partial<ModuleManifest>,
) => {
  const registry = await loadRegistry();
  const current = registry.find(mod => mod.id === moduleId);
  if (!current) {
    throw new Error('Module not found');
  }

  const zip = new AdmZip(filePath);
  const validated = validateZip(zip, registry, fileName, manifestOverrides, true);
  const manifest = validated.manifest;

  if (manifest.id !== moduleId) {
    throw new Error('Module ID mismatch');
  }

  const menuAnalysis = await analyzeMenuUpdates(manifest.ui?.menus, moduleId);
  const detectedType = detectUpdateType(current, manifest, menuAnalysis.newMenus);
  const results = [...validated.results, ...menuAnalysis.results];
  const releaseType = manifest.release?.type;

  return {
    manifest,
    detectedType,
    releaseType,
    newMenus: menuAnalysis.newMenus,
    menuConflicts: menuAnalysis.conflicts,
    validationResults: results,
  };
};

export const updateModuleZip = async (
  filePath: string,
  fileName: string,
  fileSize: number,
  params: {
    moduleId: string;
    updateType: ReleaseType;
    selectedMenuIds?: string[];
    updatedBy?: string;
    updatedByName?: string;
    manifestOverrides?: Partial<ModuleManifest>;
  },
): Promise<ImportJob> => {
  const job = buildUpdateJob({
    fileName,
    fileSize,
    createdBy: params.updatedBy,
    updatedBy: params.updatedBy,
    updatedByName: params.updatedByName,
  });
  await createImportJob(job);

  if (fileSize > MAX_ZIP_BYTES) {
    const failedJob = await updateImportJob(job.id, {
      status: 'failed',
      errorMessage: 'File vuot qua gioi han kich thuoc',
      timeline: [...job.timeline, buildTimelineEntry('failed', 'File vuot qua kich thuoc cho phep')],
    });
    return failedJob || job;
  }

  const registry = await loadRegistry();
  const current = registry.find(mod => mod.id === params.moduleId);
  if (!current) {
    const failedJob = await updateImportJob(job.id, {
      status: 'failed',
      errorMessage: 'Module not found',
      timeline: [...job.timeline, buildTimelineEntry('failed', 'Khong tim thay module')],
    });
    return failedJob || job;
  }

  const zip = new AdmZip(filePath);
  const updatedTimeline = [...job.timeline, buildTimelineEntry('validating', 'Dang validate goi cap nhat')];
  await updateImportJob(job.id, { status: 'validating', timeline: updatedTimeline });

  try {
    const validated = validateZip(zip, registry, fileName, params.manifestOverrides, true);
    const manifest = validated.manifest;

    if (manifest.id !== params.moduleId) {
      throw new Error('Module ID mismatch');
    }

    const releaseType = manifest.release?.type;
    if (!releaseType) {
      throw new Error('module.json missing "release.type"');
    }

    if (params.updateType !== releaseType) {
      throw new Error('Update type does not match release.type');
    }

    const menuAnalysis = await analyzeMenuUpdates(manifest.ui?.menus, params.moduleId);
    const detectedType = detectUpdateType(current, manifest, menuAnalysis.newMenus);
    const validationResults: ValidationResult[] = [...validated.results, ...menuAnalysis.results];

    if (validationResults.some(result => result.type === 'error')) {
      throw new ValidationError('UPDATE_VALIDATION_FAILED', 'Update validation failed', validationResults);
    }

    const importingTimeline = [...updatedTimeline, buildTimelineEntry('importing', 'Dang cap nhat module')];
    await updateImportJob(job.id, {
      status: 'importing',
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
      previousVersion: current.version,
      updateType: params.updateType,
      detectedType,
      releaseType,
      validationResults,
      timeline: importingTimeline,
    });

    const { tempDir, moduleTempPath } = await extractZipToTemp(zip, validated.moduleRoot, validated.moduleId);
    const targetDir = path.join(getModulesRoot(), manifest.id);
    const manifestPath = path.join(moduleTempPath, 'module.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    const backupPath = path.join(getBackupsDir(), manifest.id, Date.now().toString());
    await ensureDir(backupPath);
    await copyDir(targetDir, backupPath);

    await removeDir(targetDir);
    await copyDir(moduleTempPath, targetDir);
    await removeDir(tempDir);

    const now = new Date().toISOString();
    const nextRegistry: ModuleRegistryEntry[] = registry.filter(mod => mod.id !== manifest.id);
    nextRegistry.push({
      ...manifest,
      installedAt: current.installedAt,
      installedBy: current.installedBy,
      status: 'active',
      routeExport: manifest.routeExport,
      updatedAt: now,
      updatedBy: params.updatedBy,
      updatedByName: params.updatedByName,
      lastUpdateType: params.updateType,
      lastDetectedType: detectedType,
    });
    await saveRegistry(nextRegistry);

    if (menuAnalysis.newMenus.length > 0) {
      const selectedMenus = menuAnalysis.newMenus.filter(menu =>
        params.selectedMenuIds ? params.selectedMenuIds.includes(menu.id) : false,
      );
      if (selectedMenus.length > 0) {
        const existingMenus = await loadMenuRegistry();
        await saveMenuRegistry([...existingMenus, ...selectedMenus]);
      }
    }

    const completedTimeline = [
      ...importingTimeline,
      buildTimelineEntry('completed', 'Cap nhat module thanh cong'),
    ];
    const storedZip = await storeZipArchive(manifest.id, filePath, fileName);
    const completedJob = await updateImportJob(job.id, {
      status: 'completed',
      backupPath,
      backupVersion: current.version,
      timeline: completedTimeline,
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
      previousVersion: current.version,
      updateType: params.updateType,
      detectedType,
      releaseType,
      storedZipPath: storedZip.storedZipPath,
      storedZipName: storedZip.storedZipName,
      storedZipSize: storedZip.storedZipSize,
    });
    await pruneModuleArtifacts(manifest.id);
    return completedJob || job;
  } catch (error: any) {
    const validationResults = error instanceof ValidationError ? error.results : undefined;
    const failedTimeline = [
      ...updatedTimeline,
      buildTimelineEntry('failed', 'Cap nhat module that bai'),
    ];
    const failedJob = await updateImportJob(job.id, {
      status: 'failed',
      errorMessage: error?.message || 'Cap nhat that bai',
      validationResults,
      timeline: failedTimeline,
    });
    await removeFile(filePath);
    return failedJob || job;
  }
};

const loadManifestFromDir = async (dir: string) => {
  const manifestPath = path.join(dir, 'module.json');
  const content = await fs.readFile(manifestPath, 'utf8');
  return JSON.parse(content) as ModuleRegistryEntry;
};

export const deleteStoredZip = async (jobId: string) => {
  const history = await loadImportHistory();
  const index = history.findIndex(job => job.id === jobId);
  if (index === -1) return null;

  const job = history[index];
  if (job.storedZipPath) {
    await removeFile(job.storedZipPath);
  }

  const updatedJob = {
    ...job,
    storedZipPath: undefined,
    storedZipName: undefined,
    storedZipSize: undefined,
  };
  history[index] = updatedJob;
  await saveImportHistory(history);
  return updatedJob;
};

export const rollbackModule = async (
  moduleId: string,
  params?: { jobId?: string; requestedBy?: string; requestedByName?: string },
) => {
  const registry = await loadRegistry();
  const history = await loadImportHistory();
  const current = registry.find(mod => mod.id === moduleId);
  if (!current) {
    throw new Error('Module not found');
  }

  const backups = history
    .filter(job => job.moduleId === moduleId && job.backupPath)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const sourceJob = params?.jobId
    ? backups.find(job => job.id === params.jobId)
    : backups[0];

  if (!sourceJob?.backupPath) {
    throw new Error('Khong co ban backup de rollback');
  }

  const targetDir = path.join(getModulesRoot(), moduleId);
  const backupPath = path.join(getBackupsDir(), moduleId, Date.now().toString());
  await ensureDir(backupPath);
  await copyDir(targetDir, backupPath);

  await removeDir(targetDir);
  await copyDir(sourceJob.backupPath, targetDir);

  const manifest = await loadManifestFromDir(targetDir);
  const now = new Date().toISOString();
  const nextRegistry = registry.filter(mod => mod.id !== moduleId);
  nextRegistry.push({
    ...manifest,
    installedAt: current.installedAt ?? now,
    installedBy: current.installedBy,
    status: 'active',
    routeExport: manifest.routeExport,
    updatedAt: now,
    updatedBy: params?.requestedBy,
    updatedByName: params?.requestedByName,
  });
  await saveRegistry(nextRegistry);

  const rollbackJob: ImportJob = {
    id: generateJobId(),
    moduleId,
    moduleName: manifest.name,
    version: manifest.version,
    previousVersion: current.version,
    backupVersion: current.version,
    status: 'rolled_back',
    createdAt: now,
    createdBy: params?.requestedBy,
    updatedBy: params?.requestedBy,
    updatedByName: params?.requestedByName,
    operation: 'rollback',
    fileName: sourceJob.fileName ?? path.basename(sourceJob.backupPath),
    fileSize: 0,
    timeline: [
      buildTimelineEntry('rolled_back', 'Rollback thanh cong'),
    ],
    backupPath,
  };

  history.unshift(rollbackJob);
  await saveImportHistory(history);
  await pruneModuleArtifacts(moduleId);
  return rollbackJob;
};

export const rollbackModuleFromZip = async (
  filePath: string,
  fileName: string,
  fileSize: number,
  params: { moduleId: string; requestedBy?: string; requestedByName?: string },
) => {
  const job = buildRollbackJob({
    fileName,
    fileSize,
    createdBy: params.requestedBy,
    updatedBy: params.requestedBy,
    updatedByName: params.requestedByName,
  });
  await createImportJob(job);

  if (fileSize > MAX_ZIP_BYTES) {
    const failedJob = await updateImportJob(job.id, {
      status: 'failed',
      errorMessage: 'File vuot qua gioi han kich thuoc',
      timeline: [...job.timeline, buildTimelineEntry('failed', 'File vuot qua kich thuoc cho phep')],
    });
    return failedJob || job;
  }

  const registry = await loadRegistry();
  const current = registry.find(mod => mod.id === params.moduleId);
  if (!current) {
    const failedJob = await updateImportJob(job.id, {
      status: 'failed',
      errorMessage: 'Module not found',
      timeline: [...job.timeline, buildTimelineEntry('failed', 'Khong tim thay module')],
    });
    await removeFile(filePath);
    return failedJob || job;
  }

  const zip = new AdmZip(filePath);
  const updatedTimeline = [...job.timeline, buildTimelineEntry('validating', 'Dang validate goi rollback')];
  await updateImportJob(job.id, { status: 'validating', timeline: updatedTimeline });

  try {
    const validated = validateZip(zip, registry, fileName, undefined, false, false);
    const manifest = validated.manifest;

    if (manifest.id !== params.moduleId) {
      throw new Error('Module ID mismatch');
    }

    if (!semver.valid(manifest.version)) {
      throw new Error(`Version khong hop le: ${manifest.version}`);
    }

    if (!semver.lt(manifest.version, current.version)) {
      throw new Error(`Phien ban rollback phai nho hon ${current.version}`);
    }

    const importingTimeline = [...updatedTimeline, buildTimelineEntry('importing', 'Dang rollback module')];
    await updateImportJob(job.id, {
      status: 'importing',
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
      previousVersion: current.version,
      validationResults: validated.results,
      timeline: importingTimeline,
    });

    const { tempDir, moduleTempPath } = await extractZipToTemp(zip, validated.moduleRoot, validated.moduleId);
    const targetDir = path.join(getModulesRoot(), manifest.id);
    const manifestPath = path.join(moduleTempPath, 'module.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    const backupPath = path.join(getBackupsDir(), manifest.id, Date.now().toString());
    await ensureDir(backupPath);
    await copyDir(targetDir, backupPath);

    await removeDir(targetDir);
    await copyDir(moduleTempPath, targetDir);
    await removeDir(tempDir);

    const now = new Date().toISOString();
    const nextRegistry: ModuleRegistryEntry[] = registry.filter(mod => mod.id !== manifest.id);
    nextRegistry.push({
      ...manifest,
      installedAt: current.installedAt ?? now,
      installedBy: current.installedBy,
      status: 'active',
      routeExport: manifest.routeExport,
      updatedAt: now,
      updatedBy: params.requestedBy,
      updatedByName: params.requestedByName,
    });
    await saveRegistry(nextRegistry);

    const completedTimeline = [
      ...importingTimeline,
      buildTimelineEntry('rolled_back', 'Rollback thanh cong'),
    ];
    const storedZip = await storeZipArchive(manifest.id, filePath, fileName);
    const completedJob = await updateImportJob(job.id, {
      status: 'rolled_back',
      backupPath,
      backupVersion: current.version,
      timeline: completedTimeline,
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
      previousVersion: current.version,
      storedZipPath: storedZip.storedZipPath,
      storedZipName: storedZip.storedZipName,
      storedZipSize: storedZip.storedZipSize,
    });

    await pruneModuleArtifacts(manifest.id);
    return completedJob || job;
  } catch (error: any) {
    const validationResults = error instanceof ValidationError ? error.results : undefined;
    const failedTimeline = [
      ...updatedTimeline,
      buildTimelineEntry('failed', 'Rollback module that bai'),
    ];
    const failedJob = await updateImportJob(job.id, {
      status: 'failed',
      errorMessage: error?.message || 'Rollback that bai',
      validationResults,
      timeline: failedTimeline,
    });
    await removeFile(filePath);
    return failedJob || job;
  }
};
