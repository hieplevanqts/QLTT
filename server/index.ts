import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
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
import { importModuleZip, rollbackModule } from './importer/moduleImporter';
import type { MenuItem, ModuleManifest } from './importer/types';

const PORT = Number(process.env.SYSTEM_ADMIN_PORT || 8889);
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
    post: { summary: 'Rollback module', responses: { 200: { description: 'OK' } } },
  },
  '/system-admin/modules/import': {
    post: {
      summary: 'Import module zip',
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

app.get('/system-admin/modules', async (_req, res) => {
  try {
    const registry = await loadRegistry();
    res.json(registry);
  } catch (error: any) {
    res.status(500).json({ code: 'REGISTRY_READ_FAILED', message: error.message });
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
    res.json({ ...module, files });
  } catch (error: any) {
    res.status(500).json({ code: 'MODULE_DETAIL_FAILED', message: error.message });
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

app.post('/system-admin/modules/:id/rollback', async (req, res) => {
  try {
    const job = await rollbackModule(req.params.id, 'system-admin');
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ code: 'ROLLBACK_FAILED', message: error.message });
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
