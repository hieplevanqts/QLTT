import fs from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';
import type { ImportJob, ModuleManifest, ModuleRegistryEntry, ValidationResult } from './types';
import { validateZipEntries, ValidationError } from './validators';
import {
  createImportJob,
  generateJobId,
  getBackupsDir,
  getModulesRoot,
  getTmpDir,
  loadImportHistory,
  loadRegistry,
  saveImportHistory,
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

const validateZip = (
  zip: AdmZip,
  registry: ModuleRegistryEntry[],
  originalFileName?: string,
  manifestOverrides?: Partial<ModuleManifest>,
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
    const existing = registry.find(mod => mod.id === manifest.id);
    if (existing) {
      backupPath = path.join(getBackupsDir(), manifest.id, Date.now().toString());
      await ensureDir(backupPath);
      await copyDir(targetDir, backupPath);
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
    const completedJob = await updateImportJob(job.id, {
      status: 'completed',
      backupPath,
      timeline: completedTimeline,
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
    });

    await fs.unlink(filePath).catch(() => undefined);
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
    await fs.unlink(filePath).catch(() => undefined);
    return failedJob || job;
  }
};

const loadManifestFromDir = async (dir: string) => {
  const manifestPath = path.join(dir, 'module.json');
  const content = await fs.readFile(manifestPath, 'utf8');
  return JSON.parse(content) as ModuleRegistryEntry;
};

export const rollbackModule = async (moduleId: string, requestedBy?: string) => {
  const registry = await loadRegistry();
  const history = await loadImportHistory();
  const backups = history
    .filter(job => job.moduleId === moduleId && job.backupPath)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (backups.length === 0) {
    throw new Error('Khong co ban backup de rollback');
  }

  const backupPath = backups[0].backupPath as string;
  const targetDir = path.join(getModulesRoot(), moduleId);
  await removeDir(targetDir);
  await copyDir(backupPath, targetDir);

  const manifest = await loadManifestFromDir(targetDir);
  const nextRegistry = registry.filter(mod => mod.id !== moduleId);
  nextRegistry.push({
    ...manifest,
    installedAt: new Date().toISOString(),
    installedBy: requestedBy,
    status: 'active',
    routeExport: manifest.routeExport,
  });
  await saveRegistry(nextRegistry);

  const rollbackJob: ImportJob = {
    id: generateJobId(),
    moduleId,
    moduleName: manifest.name,
    version: manifest.version,
    status: 'rolled_back',
    createdAt: new Date().toISOString(),
    createdBy: requestedBy,
    fileName: path.basename(backupPath),
    fileSize: 0,
    timeline: [
      buildTimelineEntry('rolled_back', 'Rollback thanh cong'),
    ],
    backupPath,
  };

  history.unshift(rollbackJob);
  await saveImportHistory(history);
  return rollbackJob;
};
