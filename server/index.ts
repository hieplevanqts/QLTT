import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
  addMenuItem,
  deleteMenuItem,
  ensureSystemAdminDirs,
  getModulesRoot,
  getUploadsDir,
  loadImportHistory,
  loadMenuRegistry,
  loadRegistry,
  updateMenuItem,
} from './importer/storage';
import { deleteStoredZip, importModuleZip, inspectModuleUpdate, rollbackModule, rollbackModuleFromZip, updateModuleZip } from './importer/moduleImporter';
import type { MenuItem, ModuleManifest, ReleaseType } from './importer/types';

const PORT = Number(process.env.SYSTEM_ADMIN_PORT || 7788);
const app = express();

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'System Admin API',
      version: '0.1.0',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [],
});

swaggerSpec.paths = {
  '/system-admin/modules': {
    get: { summary: 'List installed modules', responses: { 200: { description: 'OK' } } },
  },
  '/system-admin/modules/{id}': {
    get: {
      summary: 'Get module detail',
      parameters: [{ name: 'id', in: 'path', required: true }],
      responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
    },
  },
  '/system-admin/modules/{id}/rollback': {
    post: {
      summary: 'Rollback module from history',
      parameters: [{ name: 'id', in: 'path', required: true }],
      responses: { 200: { description: 'OK' } },
    },
  },
  '/system-admin/modules/{id}/rollback/upload': {
    post: {
      summary: 'Rollback module from uploaded zip',
      parameters: [{ name: 'id', in: 'path', required: true }],
      requestBody: { required: true },
      responses: { 200: { description: 'OK' } },
    },
  },
  '/system-admin/modules/import': {
    post: {
      summary: 'Import module zip',
      requestBody: { required: true },
      responses: { 200: { description: 'Job created' } },
    },
  },
  '/system-admin/modules/{id}/update/inspect': {
    post: {
      summary: 'Inspect module update zip',
      parameters: [{ name: 'id', in: 'path', required: true }],
      requestBody: { required: true },
      responses: { 200: { description: 'OK' } },
    },
  },
  '/system-admin/modules/{id}/update': {
    post: {
      summary: 'Apply module update',
      parameters: [{ name: 'id', in: 'path', required: true }],
      requestBody: { required: true },
      responses: { 200: { description: 'Job created' } },
    },
  },
  '/system-admin/modules/import-jobs': {
    get: { summary: 'List import jobs', responses: { 200: { description: 'OK' } } },
  },
  '/system-admin/modules/import-jobs/{jobId}': {
    get: {
      summary: 'Get import job detail',
      parameters: [{ name: 'jobId', in: 'path', required: true }],
      responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
    },
  },
  '/system-admin/modules/import-jobs/{jobId}/zip': {
    delete: {
      summary: 'Delete stored zip for a job',
      parameters: [{ name: 'jobId', in: 'path', required: true }],
      responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
    },
  },
  '/system-admin/menus': {
    get: { summary: 'List menus', responses: { 200: { description: 'OK' } } },
    post: { summary: 'Create menu', responses: { 200: { description: 'OK' } } },
  },
  '/system-admin/menus/{id}': {
    put: {
      summary: 'Update menu',
      parameters: [{ name: 'id', in: 'path', required: true }],
      responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
    },
    delete: {
      summary: 'Delete menu',
      parameters: [{ name: 'id', in: 'path', required: true }],
      responses: { 200: { description: 'OK' } },
    },
  },
};

app.use('/system-admin/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const upload = multer({
  dest: path.join(getUploadsDir()),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const listFiles = async (dir: string, prefix = ''): Promise<string[]> => {
  const results: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      results.push(...await listFiles(entryPath, relative));
    } else if (entry.isFile()) {
      results.push(relative.replace(/\\/g, '/'));
    }
  }
  return results;
};

const listFileHashes = async (dir: string, prefix = ''): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      const nested = await listFileHashes(entryPath, relative);
      Object.assign(results, nested);
    } else if (entry.isFile()) {
      const buffer = await fs.readFile(entryPath);
      const hash = crypto.createHash('sha1').update(buffer).digest('hex');
      results[relative.replace(/\\/g, '/')] = hash;
    }
  }
  return results;
};

const diffFileMaps = (current: Record<string, string>, previous: Record<string, string>) => {
  const added: string[] = [];
  const modified: string[] = [];
  const removed: string[] = [];

  Object.entries(current).forEach(([file, hash]) => {
    if (!previous[file]) {
      added.push(file);
    } else if (previous[file] !== hash) {
      modified.push(file);
    }
  });

  Object.keys(previous).forEach((file) => {
    if (!current[file]) {
      removed.push(file);
    }
  });

  return { added, modified, removed };
};

const toModuleRelative = (moduleId: string, fullPath: string) => {
  const normalized = fullPath.replace(/\\/g, '/');
  const prefix = `src/modules/${moduleId}/`;
  return normalized.startsWith(prefix) ? normalized.slice(prefix.length) : normalized;
};

const collectMissingCssImports = async (moduleDir: string, files: string[]) => {
  const missing = new Set<string>();
  const cssImports = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+\.css)['"]/g;
  const tsFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
  const fileSet = new Set(files);

  for (const file of tsFiles) {
    const filePath = path.join(moduleDir, file);
    const content = await fs.readFile(filePath, 'utf8');
    let match: RegExpExecArray | null;
    while ((match = cssImports.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath.startsWith('.')) {
        continue;
      }
      const resolved = path.normalize(path.join(path.dirname(file), importPath)).replace(/\\/g, '/');
      if (!fileSet.has(resolved)) {
        missing.add(resolved);
      }
    }
  }

  return Array.from(missing);
};

app.get('/system-admin/modules', async (_req, res) => {
  try {
    const registry = await loadRegistry();
    res.json(registry);
  } catch (error: any) {
    res.status(500).json({ code: 'REGISTRY_READ_FAILED', message: error.message });
  }
});

app.post('/system-admin/modules/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ code: 'FILE_REQUIRED', message: 'File is required' });
    return;
  }

  try {
    const rawOverrides = req.body?.manifestOverrides;
    let manifestOverrides: Partial<ModuleManifest> | undefined;
    if (rawOverrides) {
      try {
        manifestOverrides = JSON.parse(rawOverrides) as Partial<ModuleManifest>;
      } catch (error: any) {
        res.status(400).json({ code: 'OVERRIDES_INVALID', message: 'manifestOverrides is invalid JSON' });
        return;
      }
    }

    const job = await importModuleZip(
      req.file.path,
      req.file.originalname,
      req.file.size,
      'system-admin',
      manifestOverrides,
    );
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ code: 'IMPORT_FAILED', message: error.message });
  }
});

app.post('/system-admin/modules/:id/update/inspect', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ code: 'FILE_REQUIRED', message: 'File is required' });
    return;
  }

  try {
    const analysis = await inspectModuleUpdate(req.file.path, req.file.originalname, req.params.id);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ code: 'UPDATE_INSPECT_FAILED', message: error.message });
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path).catch(() => undefined);
    }
  }
});

app.post('/system-admin/modules/:id/update', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ code: 'FILE_REQUIRED', message: 'File is required' });
    return;
  }

  const updateType = req.body?.updateType as ReleaseType | undefined;
  if (!updateType || !['patch', 'minor', 'major'].includes(updateType)) {
    res.status(400).json({ code: 'UPDATE_TYPE_REQUIRED', message: 'updateType is required' });
    return;
  }

  let selectedMenuIds: string[] | undefined;
  if (req.body?.selectedMenuIds) {
    try {
      selectedMenuIds = JSON.parse(req.body.selectedMenuIds);
    } catch (error: any) {
      res.status(400).json({ code: 'MENU_IDS_INVALID', message: 'selectedMenuIds is invalid JSON' });
      return;
    }
  }

  try {
    const job = await updateModuleZip(req.file.path, req.file.originalname, req.file.size, {
      moduleId: req.params.id,
      updateType,
      selectedMenuIds,
      updatedBy: req.body?.updatedBy,
      updatedByName: req.body?.updatedByName,
    });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ code: 'UPDATE_FAILED', message: error.message });
  }
});

app.get('/system-admin/modules/import-jobs', async (_req, res) => {
  try {
    const history = await loadImportHistory();
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ code: 'IMPORT_HISTORY_FAILED', message: error.message });
  }
});

app.get('/system-admin/modules/import-jobs/:jobId', async (req, res) => {
  try {
    const history = await loadImportHistory();
    const job = history.find(item => item.id === req.params.jobId);
    if (!job) {
      res.status(404).json({ code: 'JOB_NOT_FOUND', message: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ code: 'JOB_DETAIL_FAILED', message: error.message });
  }
});

app.get('/system-admin/modules/:id', async (req, res) => {
  try {
    const registry = await loadRegistry();
    const module = registry.find(item => item.id === req.params.id);
    if (!module) {
      res.status(404).json({ code: 'MODULE_NOT_FOUND', message: 'Module not found' });
      return;
    }
    const moduleDir = path.join(getModulesRoot(), module.id);
    const files = await listFiles(moduleDir);

    let fileChanges: {
      baseVersion?: string;
      baseJobId?: string;
      baseAt?: string;
      added: string[];
      modified: string[];
      removed: string[];
    } | undefined;

    const cssFiles = files.filter(file => file.endsWith('.css'));
    const missingCssImports = await collectMissingCssImports(moduleDir, files);

    const history = await loadImportHistory();
    const latestBackup = history
      .filter(job => job.moduleId === module.id && job.backupPath)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

    if (latestBackup?.backupPath) {
      const currentHashes = await listFileHashes(moduleDir);
      const previousHashes = await listFileHashes(latestBackup.backupPath);
      const diff = diffFileMaps(currentHashes, previousHashes);
      fileChanges = {
        baseVersion: latestBackup.backupVersion ?? latestBackup.previousVersion ?? latestBackup.version,
        baseJobId: latestBackup.id,
        baseAt: latestBackup.createdAt,
        ...diff,
      };
    }

    const addedSet = new Set(fileChanges?.added ?? []);
    const modifiedSet = new Set(fileChanges?.modified ?? []);
    const cssAudit = cssFiles.map(file => ({
      path: file,
      status: addedSet.has(file) ? 'added' : modifiedSet.has(file) ? 'modified' : 'unchanged',
    }));

    const entryRel = toModuleRelative(module.id, module.entry);
    const routesRel = toModuleRelative(module.id, module.routes);
    const fileHealth = {
      entryExists: files.includes(entryRel),
      routesExists: files.includes(routesRel),
    };

    res.json({
      ...module,
      files,
      fileChanges,
      cssAudit,
      missingCssImports,
      fileHealth,
    });
  } catch (error: any) {
    res.status(500).json({ code: 'MODULE_DETAIL_FAILED', message: error.message });
  }
});

app.post('/system-admin/modules/:id/rollback', async (req, res) => {
  try {
    const job = await rollbackModule(req.params.id, {
      jobId: req.body?.jobId,
      requestedBy: req.body?.requestedBy,
      requestedByName: req.body?.requestedByName,
    });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ code: 'ROLLBACK_FAILED', message: error.message });
  }
});

app.post('/system-admin/modules/:id/rollback/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ code: 'FILE_REQUIRED', message: 'File is required' });
    return;
  }

  try {
    const job = await rollbackModuleFromZip(req.file.path, req.file.originalname, req.file.size, {
      moduleId: req.params.id,
      requestedBy: req.body?.requestedBy,
      requestedByName: req.body?.requestedByName,
    });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ code: 'ROLLBACK_FAILED', message: error.message });
  }
});

app.delete('/system-admin/modules/import-jobs/:jobId/zip', async (req, res) => {
  try {
    const job = await deleteStoredZip(req.params.jobId);
    if (!job) {
      res.status(404).json({ code: 'JOB_NOT_FOUND', message: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ code: 'ZIP_DELETE_FAILED', message: error.message });
  }
});

app.get('/system-admin/menus', async (_req, res) => {
  try {
    const menus = await loadMenuRegistry();
    res.json(menus);
  } catch (error: any) {
    res.status(500).json({ code: 'MENU_LIST_FAILED', message: error.message });
  }
});

app.post('/system-admin/menus', async (req, res) => {
  try {
    const payload = req.body as MenuItem;
    if (!payload?.id || !payload?.label) {
      res.status(400).json({ code: 'MENU_INVALID', message: 'id and label are required' });
      return;
    }
    const created = await addMenuItem(payload);
    res.json(created);
  } catch (error: any) {
    res.status(500).json({ code: 'MENU_CREATE_FAILED', message: error.message });
  }
});

app.put('/system-admin/menus/:id', async (req, res) => {
  try {
    const updated = await updateMenuItem(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ code: 'MENU_NOT_FOUND', message: 'Menu not found' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ code: 'MENU_UPDATE_FAILED', message: error.message });
  }
});

app.delete('/system-admin/menus/:id', async (req, res) => {
  try {
    await deleteMenuItem(req.params.id);
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ code: 'MENU_DELETE_FAILED', message: error.message });
  }
});

ensureSystemAdminDirs().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`System Admin server listening on http://localhost:${PORT}`);
  });
});
