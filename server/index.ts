import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import crypto from 'node:crypto';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  addMenuItem,
  deleteMenuItem,
  ensureSystemAdminDirs,
  getModulesRoot,
  getRepoRoot,
  getUploadsDir,
  loadImportHistory,
  loadMenuRegistry,
  loadRegistry,
  updateMenuItem,
} from './importer/storage';
import { deleteStoredZip, importModuleZip, inspectModuleUpdate, rollbackModule, rollbackModuleFromZip, updateModuleZip } from './importer/moduleImporter';
import type { MenuItem, ModuleManifest, ReleaseType } from './importer/types';

const loadEnvFile = () => {
  try {
    const envPath = path.join(getRepoRoot(), '.env');
    if (!existsSync(envPath)) return;
    const content = readFileSync(envPath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex <= 0) continue;
      const key = line.slice(0, eqIndex).trim();
      if (!key || process.env[key]) continue;
      let value = line.slice(eqIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load .env file for server:', (error as Error).message);
  }
};

loadEnvFile();

const SUPABASE_URL = 'https://mwuhuixkybbwrnoqcibg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dWh1aXhreWJid3Jub3FjaWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNTc5MiwiZXhwIjoyMDgzMTgxNzkyfQ.181FfeKfCfZt_v21wHiOgFlzm7g-pNb-JLLjPJtixzo';

// const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
// const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseAdmin: SupabaseClient | null = null;

const getSupabaseAdmin = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin operations.'
    );
  }
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseAdmin;
};

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
    //servers: [{ url: `http://localhost:${PORT}` }],
    servers: [{ url: process.env.PUBLIC_URL }],
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
  '/system-admin/admin/users': {
    post: {
      summary: 'Create auth user and public user profile',
      requestBody: { required: true },
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

const toSnakeCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

const normalizePrefix = (value?: string) => {
  if (!value) return '';
  return toSnakeCase(value.replace(/^\/+/, ''));
};

const pluralize = (value: string) => (value.endsWith('s') ? value : `${value}s`);

const extractArrayBlock = (content: string, startIndex: number) => {
  let depth = 0;
  for (let i = startIndex; i < content.length; i += 1) {
    const char = content[i];
    if (char === '[') {
      depth += 1;
    } else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        return content.slice(startIndex, i + 1);
      }
    }
  }
  return '';
};

const extractArrayExports = (content: string) => {
  const exports: { name: string; fields: string[] }[] = [];
  const exportRegex = /export const ([A-Za-z0-9_]+)[^=]*=\s*\[/g;
  let match: RegExpExecArray | null;
  while ((match = exportRegex.exec(content)) !== null) {
    const name = match[1];
    const startIndex = match.index + match[0].lastIndexOf('[');
    const block = extractArrayBlock(content, startIndex);
    const fieldSet = new Set<string>();
    const fieldRegex = /\b([A-Za-z_][A-Za-z0-9_]*)\s*:/g;
    let fieldMatch: RegExpExecArray | null;
    while ((fieldMatch = fieldRegex.exec(block)) !== null) {
      fieldSet.add(fieldMatch[1]);
    }
    exports.push({ name, fields: [...fieldSet] });
  }
  return exports;
};

const parseSchemaTables = (content: string) => {
  const tables = new Set<string>();
  const regex = /CREATE TABLE public\.("?)([A-Za-z0-9_]+)\1/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    tables.add(match[2]);
  }
  return tables;
};

const findLatestSchemaSnapshot = async () => {
  const repoRoot = getRepoRoot();
  const backupsDir = path.join(repoRoot, 'backups');
  const candidates: { filePath: string; mtime: number }[] = [];

  const collectSchemaFiles = async (dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await collectSchemaFiles(entryPath);
      } else if (entry.isFile() && entry.name.endsWith('.schema.sql')) {
        const stat = await fs.stat(entryPath);
        candidates.push({ filePath: entryPath, mtime: stat.mtimeMs });
      }
    }
  };

  try {
    await collectSchemaFiles(backupsDir);
  } catch {
    // ignore missing backups dir
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.mtime - a.mtime);
    return candidates[0].filePath;
  }

  const docsSchema = path.join(repoRoot, 'docs', 'database-schema.sql');
  try {
    await fs.stat(docsSchema);
    return docsSchema;
  } catch {
    return null;
  }
};

const loadSchemaTableSet = async () => {
  const schemaPath = await findLatestSchemaSnapshot();
  if (!schemaPath) return { tables: null, source: null };
  const content = await fs.readFile(schemaPath, 'utf8');
  return { tables: parseSchemaTables(content), source: schemaPath };
};

const inferModuleDataTables = async (moduleId: string, basePath?: string) => {
  const moduleDir = path.join(getModulesRoot(), moduleId);
  const dataDir = path.join(moduleDir, 'data');
  const inferred = new Map<string, { sources: Set<string>; fields: Set<string> }>();

  try {
    const entries = await listFiles(dataDir);
    for (const file of entries) {
      const filePath = path.join(dataDir, file);
      if (file.endsWith('.json')) {
        const content = await fs.readFile(filePath, 'utf8');
        const payload = JSON.parse(content) as unknown;
        if (Array.isArray(payload)) {
          const fields = payload.length > 0 && typeof payload[0] === 'object' && payload[0]
            ? Object.keys(payload[0] as Record<string, unknown>)
            : [];
          const baseName = toSnakeCase(path.parse(file).name);
          if (!inferred.has(baseName)) {
            inferred.set(baseName, { sources: new Set(), fields: new Set() });
          }
          const entry = inferred.get(baseName)!;
          entry.sources.add(file);
          fields.forEach((field) => entry.fields.add(field));
        }
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = await fs.readFile(filePath, 'utf8');
        const exports = extractArrayExports(content);
        exports.forEach((item) => {
          const rawName = item.name.replace(/^MOCK_/, '');
          const suffix = toSnakeCase(rawName);
          if (!suffix) return;
          if (!inferred.has(suffix)) {
            inferred.set(suffix, { sources: new Set(), fields: new Set() });
          }
          const entry = inferred.get(suffix)!;
          entry.sources.add(`${file}#${item.name}`);
          item.fields.forEach((field) => entry.fields.add(field));
        });
      }
    }
  } catch {
    return [];
  }

  const prefix = normalizePrefix(basePath || moduleId);
  const tables = [...inferred.entries()].map(([suffix, meta]) => {
    const tableName = prefix && !suffix.startsWith(`${prefix}_`)
      ? `${prefix}_${suffix}`
      : suffix;
    return {
      table: tableName,
      source: [...meta.sources],
      fields: [...meta.fields],
    };
  });

  return tables;
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

    const schemaSnapshot = await loadSchemaTableSet();
    const inferredTables = await inferModuleDataTables(module.id, module.basePath);
    const inferredTableNames = new Set(inferredTables.map((table) => table.table));

    const tableRelations = inferredTables.map((table) => {
      const relations = table.fields
        .filter(field => /_?id$/i.test(field))
        .map((field) => {
          const base = field.replace(/_?id$/i, '');
          if (!base) {
            return null;
          }
          const targetSuffix = pluralize(toSnakeCase(base));
          const prefix = normalizePrefix(module.basePath || module.id);
          const targetTable = prefix && !targetSuffix.startsWith(`${prefix}_`)
            ? `${prefix}_${targetSuffix}`
            : targetSuffix;
          const existsInSchema = schemaSnapshot.tables ? schemaSnapshot.tables.has(targetTable) : null;
          const status = existsInSchema === null
            ? 'unknown'
            : existsInSchema
              ? 'exists'
              : 'missing';
          return {
            column: field,
            targetTable,
            status,
            existsInMock: inferredTableNames.has(targetTable),
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      const dbStatus = schemaSnapshot.tables
        ? schemaSnapshot.tables.has(table.table)
          ? 'exists'
          : 'missing'
        : 'unknown';

      return {
        ...table,
        dbStatus,
        relations,
      };
    });

    const menus = await loadMenuRegistry();
    const linkedMenus = menus.filter((menu) =>
      menu.moduleId === module.id || (module.basePath && menu.path?.startsWith(module.basePath))
    );

    const schemaSource = schemaSnapshot.source
      ? path.relative(getRepoRoot(), schemaSnapshot.source).replace(/\\/g, '/')
      : undefined;

    res.json({
      ...module,
      files,
      fileChanges,
      cssAudit,
      missingCssImports,
      fileHealth,
      dataModel: {
        prefix: normalizePrefix(module.basePath || module.id),
        schemaSource,
        tables: tableRelations,
      },
      linkedMenus,
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

app.post('/system-admin/admin/users', async (req, res) => {
  try {
    const email = (req.body?.email as string | undefined)?.trim();
    const username = (req.body?.username as string | undefined)?.trim();
    const fullName = (req.body?.full_name as string | undefined)?.trim();
    const phone = (req.body?.phone as string | undefined)?.trim();
    const statusRaw = req.body?.status;
    const departmentIdRaw = (req.body?.department_id as string | undefined)?.trim();
    const defaultPassword = (req.body?.default_password as string | undefined)?.trim();
    const password = (req.body?.password as string | undefined)?.trim() || defaultPassword;
    const note = (req.body?.note as string | undefined)?.trim();

    if (!email || !password) {
      res.status(400).json({
        code: 'INVALID_PAYLOAD',
        message: 'email and password/default_password are required.',
      });
      return;
    }
    if (!username) {
      res.status(400).json({ code: 'INVALID_PAYLOAD', message: 'username is required.' });
      return;
    }

    const adminClient = getSupabaseAdmin();

    const authResult = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        full_name: fullName ?? username,
      },
    });

    if (authResult.error || !authResult.data.user?.id) {
      const message = authResult.error?.message || 'Failed to create auth user.';
      res.status(400).json({ code: 'AUTH_CREATE_FAILED', message });
      return;
    }

    const authUserId = authResult.data.user.id;
    const nowIso = new Date().toISOString();
    const metadata: Record<string, unknown> = {};
    if (defaultPassword) metadata.defaultPassword = defaultPassword;
    if (note) metadata.note = note;

    const payload: Record<string, unknown> = {
      _id: authUserId,
      username,
      full_name: fullName ?? username,
      email,
      phone: phone || null,
      status: typeof statusRaw === 'number' ? statusRaw : 1,
      departmentId: departmentIdRaw || null,
      created_at: nowIso,
      updated_at: nowIso,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
    if (departmentIdRaw) {
      payload.department_id = departmentIdRaw;
    }

    let insertResult = await adminClient.from('users').insert([payload]).select('*').single();

    if (insertResult.error && departmentIdRaw && insertResult.error.message.includes('department_id')) {
      // Retry without department_id if the column does not exist yet.
      const retryPayload = { ...payload };
      delete retryPayload.department_id;
      insertResult = await adminClient.from('users').insert([retryPayload]).select('*').single();
    }

    if (insertResult.error) {
      // Best-effort cleanup to avoid orphan auth user when profile insert fails.
      try {
        await adminClient.auth.admin.deleteUser(authUserId);
      } catch {
        // ignore cleanup failure
      }
      res.status(400).json({ code: 'PROFILE_CREATE_FAILED', message: insertResult.error.message });
      return;
    }

    res.json(insertResult.data);
  } catch (error: any) {
    res.status(500).json({ code: 'ADMIN_USER_CREATE_FAILED', message: error.message });
  }
});

app.put('/system-admin/admin/users/:id', async (req, res) => {
  try {
    const userId = (req.params.id || '').trim();
    if (!userId) {
      res.status(400).json({ code: 'INVALID_PAYLOAD', message: 'user id is required.' });
      return;
    }

    const email = (req.body?.email as string | undefined)?.trim();
    const username = (req.body?.username as string | undefined)?.trim();
    const fullName = (req.body?.full_name as string | undefined)?.trim();
    const phone = (req.body?.phone as string | undefined)?.trim();
    const statusRaw = req.body?.status;
    const departmentIdRaw = (req.body?.department_id as string | undefined)?.trim();
    const defaultPassword = (req.body?.default_password as string | undefined)?.trim();
    const note = (req.body?.note as string | undefined)?.trim();

    const adminClient = getSupabaseAdmin();

    const authUpdates: Record<string, unknown> = {};
    const userMetadata: Record<string, unknown> = {};
    if (email) {
      authUpdates.email = email;
      authUpdates.email_confirm = true;
    }
    if (username) userMetadata.username = username;
    if (fullName) userMetadata.full_name = fullName;
    if (Object.keys(userMetadata).length > 0) {
      authUpdates.user_metadata = userMetadata;
    }

    if (Object.keys(authUpdates).length > 0) {
      const authResult = await adminClient.auth.admin.updateUserById(userId, authUpdates);
      if (authResult.error) {
        res.status(400).json({ code: 'AUTH_UPDATE_FAILED', message: authResult.error.message });
        return;
      }
    }

    let mergedMetadata: Record<string, unknown> | undefined;
    if (defaultPassword || note) {
      const metaResult = await adminClient
        .from('users')
        .select('metadata')
        .eq('_id', userId)
        .maybeSingle();
      const baseMeta =
        metaResult.data && typeof metaResult.data.metadata === 'object' && metaResult.data.metadata
          ? metaResult.data.metadata
          : {};
      mergedMetadata = { ...baseMeta };
      if (defaultPassword) mergedMetadata.defaultPassword = defaultPassword;
      if (note) mergedMetadata.note = note;
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (email != null) updatePayload.email = email || null;
    if (username != null) updatePayload.username = username || null;
    if (fullName != null) updatePayload.full_name = fullName || null;
    if (phone != null) updatePayload.phone = phone || null;
    if (statusRaw != null) updatePayload.status = typeof statusRaw === 'number' ? statusRaw : Number(statusRaw);
    if (Object.prototype.hasOwnProperty.call(req.body ?? {}, 'department_id')) {
      updatePayload.department_id = departmentIdRaw || null;
      updatePayload.departmentId = departmentIdRaw || null;
    }
    if (note != null) updatePayload.note = note || null;
    if (mergedMetadata) updatePayload.metadata = mergedMetadata;

    let updateResult = await adminClient
      .from('users')
      .update(updatePayload)
      .eq('_id', userId)
      .select('*')
      .maybeSingle();

    if (updateResult.error) {
      const message = updateResult.error.message || '';
      const retryPayload = { ...updatePayload };
      let shouldRetry = false;
      if (message.includes('department_id')) {
        delete retryPayload.department_id;
        shouldRetry = true;
      }
      if (message.includes('departmentId')) {
        delete retryPayload.departmentId;
        shouldRetry = true;
      }
      if (message.includes('metadata')) {
        delete retryPayload.metadata;
        shouldRetry = true;
      }

      if (shouldRetry) {
        updateResult = await adminClient
          .from('users')
          .update(retryPayload)
          .eq('_id', userId)
          .select('*')
          .maybeSingle();
      }
    }

    if (updateResult.error) {
      res.status(400).json({ code: 'PROFILE_UPDATE_FAILED', message: updateResult.error.message });
      return;
    }

    if (!updateResult.data) {
      res.status(404).json({ code: 'USER_NOT_FOUND', message: 'User not found.' });
      return;
    }

    res.json(updateResult.data);
  } catch (error: any) {
    res.status(500).json({ code: 'ADMIN_USER_UPDATE_FAILED', message: error.message });
  }
});

ensureSystemAdminDirs().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`System Admin server listening on http://localhost:${PORT}`);
  });
});
