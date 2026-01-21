import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nanoid } from 'nanoid';
import type { ImportJob, MenuItem, ModuleManifest, ModuleRegistryEntry } from './types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SYSTEM_ADMIN_DIR = '.system_admin';
const REGISTRY_FILE = 'registry.json';
const HISTORY_FILE = 'import_history.json';
const MENU_FILE = 'menu_registry.json';
const BACKUPS_DIR = 'backups';
const UPLOADS_DIR = 'uploads';
const TMP_DIR = 'tmp';

export const getRepoRoot = () => path.resolve(__dirname, '..', '..');

export const getSystemAdminDir = () => path.join(getRepoRoot(), SYSTEM_ADMIN_DIR);
export const getRegistryPath = () => path.join(getSystemAdminDir(), REGISTRY_FILE);
export const getHistoryPath = () => path.join(getSystemAdminDir(), HISTORY_FILE);
export const getMenuRegistryPath = () => path.join(getSystemAdminDir(), MENU_FILE);
export const getBackupsDir = () => path.join(getSystemAdminDir(), BACKUPS_DIR);
export const getUploadsDir = () => path.join(getSystemAdminDir(), UPLOADS_DIR);
export const getTmpDir = () => path.join(getSystemAdminDir(), TMP_DIR);
export const getModulesRoot = () => path.join(getRepoRoot(), 'src', 'modules');
export const getInstalledModulesPath = () => path.join(getRepoRoot(), 'src', 'imports', 'installedModules.ts');

const DEFAULT_MENUS: MenuItem[] = [
  { id: 'menu_overview', label: 'Tong quan', path: '/overview', icon: 'LayoutDashboard', order: 10, isEnabled: true },
  { id: 'menu_map', label: 'Ban do dieu hanh', path: '/map', icon: 'Map', order: 20, permissionsAny: ['MAP_VIEW'], isEnabled: true },
  { id: 'menu_stores', label: 'Co so quan ly', path: '/stores', icon: 'Building2', order: 30, permissionsAny: ['STORES_VIEW'], isEnabled: true },
  { id: 'menu_leads', label: 'Nguon tin', path: '/leads', icon: 'TriangleAlert', order: 40, permissionsAny: ['LEAD_RISK'], isEnabled: true },
  { id: 'menu_leads_inbox', label: 'Xu ly nguon tin hang ngay', path: '/lead-risk/inbox', parentId: 'menu_leads', order: 10, permissionsAny: ['LEAD_RISK'], isEnabled: true },
  { id: 'menu_leads_dashboard', label: 'Tong quan rui ro', path: '/lead-risk/dashboard', parentId: 'menu_leads', order: 20, permissionsAny: ['LEAD_RISK'], isEnabled: true },
  { id: 'menu_leads_hotspots', label: 'Phan tich diem nong', path: '/lead-risk/hotspots', parentId: 'menu_leads', order: 30, permissionsAny: ['LEAD_RISK'], isEnabled: true },
  { id: 'menu_leads_quality', label: 'Phan tich chat luong', path: '/lead-risk/quality-metrics', parentId: 'menu_leads', order: 40, permissionsAny: ['LEAD_RISK'], isEnabled: true },
  { id: 'menu_leads_workload', label: 'Quan ly cong viec', path: '/lead-risk/workload-dashboard', parentId: 'menu_leads', order: 50, permissionsAny: ['LEAD_RISK'], isEnabled: true },
  { id: 'menu_leads_sla', label: 'Giam sat SLA', path: '/lead-risk/sla-dashboard', parentId: 'menu_leads', order: 60, permissionsAny: ['LEAD_RISK'], isEnabled: true },
  { id: 'menu_plans', label: 'Ke hoach tac nghiep', path: '/plans', icon: 'ClipboardList', order: 50, permissionsAny: ['PLAN_VIEW'], isEnabled: true },
  { id: 'menu_plans_list', label: 'Danh sach ke hoach', path: '/plans/list', parentId: 'menu_plans', order: 10, permissionsAny: ['PLAN_VIEW'], isEnabled: true },
  { id: 'menu_plans_rounds', label: 'Dot kiem tra', path: '/plans/inspection-rounds', parentId: 'menu_plans', order: 20, permissionsAny: ['PLAN_VIEW'], isEnabled: true },
  { id: 'menu_plans_session', label: 'Phien lam viec', path: '/plans/inspection-session', parentId: 'menu_plans', order: 30, permissionsAny: ['PLAN_VIEW'], isEnabled: true },
  { id: 'menu_tasks', label: 'Nhiem vu hien truong', path: '/tasks', icon: 'MapPin', order: 60, permissionsAny: ['TASKS_VIEW'], isEnabled: true },
  { id: 'menu_evidence', label: 'Kho chung cu', path: '/evidence', icon: 'FileBox', order: 70, permissionsAny: ['EVIDENCE_VIEW'], isEnabled: true },
  { id: 'menu_reports', label: 'Bao cao & Thong ke', path: '/reports', icon: 'BarChart3', order: 80, isEnabled: true },
  { id: 'menu_reports_dashboard', label: 'Dashboard', path: '/dashboard', parentId: 'menu_reports', order: 10, isEnabled: true },
  { id: 'menu_reports_reports', label: 'Bao cao', path: '/reports', parentId: 'menu_reports', order: 20, isEnabled: true },
  { id: 'menu_admin', label: 'Quan tri', path: '/admin', icon: 'Settings', order: 90, permissionsAny: ['ADMIN_VIEW'], isEnabled: true },
  { id: 'menu_admin_modules', label: 'Quan tri Module', path: '/system/modules', parentId: 'menu_admin', order: 10, permissionsAny: ['ADMIN_VIEW'], isEnabled: true },
  { id: 'menu_admin_menus', label: 'Quan tri Menu', path: '/system/menus', parentId: 'menu_admin', order: 20, permissionsAny: ['ADMIN_VIEW'], isEnabled: true },
  { id: 'menu_admin_users', label: 'Nguoi dung', path: '/system/users', parentId: 'menu_admin', order: 30, permissionsAny: ['ADMIN_VIEW'], isEnabled: true },
  { id: 'menu_admin_roles', label: 'Vai tro', path: '/system/roles', parentId: 'menu_admin', order: 40, permissionsAny: ['ADMIN_VIEW'], isEnabled: true },
  { id: 'menu_admin_settings', label: 'Cau hinh', path: '/system/settings', parentId: 'menu_admin', order: 50, permissionsAny: ['ADMIN_VIEW'], isEnabled: true },
];

const ensureDir = async (dir: string) => {
  await fs.mkdir(dir, { recursive: true });
};

const readJsonFile = async <T>(filePath: string, fallback: T): Promise<T> => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return fallback;
    }
    throw error;
  }
};

const writeJsonFile = async <T>(filePath: string, data: T) => {
  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmpPath, filePath);
};

export const ensureSystemAdminDirs = async () => {
  await ensureDir(getSystemAdminDir());
  await ensureDir(getBackupsDir());
  await ensureDir(getUploadsDir());
  await ensureDir(getTmpDir());
};

const guessRouteExport = (id: string) => {
  const parts = id.split(/[-_]/g).filter(Boolean);
  const camel = parts
    .map((part, index) => {
      if (index === 0) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
  return `${camel}Route`;
};

const loadLocalModuleManifest = async (moduleDir: string): Promise<ModuleManifest | null> => {
  const manifestPath = path.join(moduleDir, 'module.json');
  try {
    const content = await fs.readFile(manifestPath, 'utf8');
    return JSON.parse(content) as ModuleManifest;
  } catch (error: any) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
};

export const initializeRegistryFromModules = async (): Promise<ModuleRegistryEntry[]> => {
  const modulesRoot = getModulesRoot();
  let dirEntries: string[] = [];
  try {
    dirEntries = await fs.readdir(modulesRoot);
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const modules: ModuleRegistryEntry[] = [];
  for (const moduleFolder of dirEntries) {
    const moduleDir = path.join(modulesRoot, moduleFolder);
    const manifest = await loadLocalModuleManifest(moduleDir);
    if (!manifest) {
      continue;
    }

    const entry: ModuleRegistryEntry = {
      ...manifest,
      routeExport: manifest.routeExport || guessRouteExport(manifest.id),
      installedAt: new Date().toISOString(),
      status: 'active',
    };
    modules.push(entry);
  }

  return modules;
};

export const loadRegistry = async (): Promise<ModuleRegistryEntry[]> => {
  await ensureSystemAdminDirs();
  const registryPath = getRegistryPath();
  let registry = await readJsonFile<ModuleRegistryEntry[]>(registryPath, []);

  if (registry.length === 0) {
    registry = await initializeRegistryFromModules();
    await writeJsonFile(registryPath, registry);
  }

  await writeInstalledModules(registry);
  return registry;
};

export const saveRegistry = async (registry: ModuleRegistryEntry[]) => {
  await ensureSystemAdminDirs();
  await writeJsonFile(getRegistryPath(), registry);
  await writeInstalledModules(registry);
};

export const loadImportHistory = async (): Promise<ImportJob[]> => {
  await ensureSystemAdminDirs();
  return readJsonFile<ImportJob[]>(getHistoryPath(), []);
};

export const saveImportHistory = async (history: ImportJob[]) => {
  await ensureSystemAdminDirs();
  await writeJsonFile(getHistoryPath(), history);
};

export const createImportJob = async (job: ImportJob) => {
  const history = await loadImportHistory();
  history.unshift(job);
  await saveImportHistory(history);
};

export const updateImportJob = async (jobId: string, updates: Partial<ImportJob>) => {
  const history = await loadImportHistory();
  const idx = history.findIndex(job => job.id === jobId);
  if (idx === -1) return null;
  history[idx] = { ...history[idx], ...updates };
  await saveImportHistory(history);
  return history[idx];
};

export const loadMenuRegistry = async (): Promise<MenuItem[]> => {
  await ensureSystemAdminDirs();
  const menuPath = getMenuRegistryPath();
  let menus = await readJsonFile<MenuItem[]>(menuPath, []);
  if (menus.length === 0) {
    menus = DEFAULT_MENUS;
    await writeJsonFile(menuPath, menus);
  }
  return menus;
};

export const saveMenuRegistry = async (menus: MenuItem[]) => {
  await ensureSystemAdminDirs();
  await writeJsonFile(getMenuRegistryPath(), menus);
};

export const addMenuItem = async (item: MenuItem) => {
  const menus = await loadMenuRegistry();
  menus.push(item);
  await saveMenuRegistry(menus);
  return item;
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  const menus = await loadMenuRegistry();
  const index = menus.findIndex(menu => menu.id === id);
  if (index === -1) return null;
  menus[index] = { ...menus[index], ...updates, id };
  await saveMenuRegistry(menus);
  return menus[index];
};

export const deleteMenuItem = async (id: string) => {
  const menus = await loadMenuRegistry();
  const filtered = menus.filter(menu => menu.id !== id && menu.parentId !== id);
  await saveMenuRegistry(filtered);
};

export const generateJobId = () => nanoid(10);

export const writeInstalledModules = async (registry: ModuleRegistryEntry[]) => {
  const installedPath = getInstalledModulesPath();
  const modules = [...registry]
    .filter(mod => mod.routeExport && mod.routes)
    .sort((a, b) => a.id.localeCompare(b.id));

  const importLines = modules.map(mod => {
    return `import { ${mod.routeExport} } from '../modules/${mod.id}/routes';`;
  });
  const exportLines = modules.map(mod => `export { ${mod.routeExport} };`);
  const routeLines = modules.map(mod => mod.routeExport);

  const content = `/* AUTO-GENERATED FILE. DO NOT EDIT. */\n${importLines.join('\n')}\n\n${exportLines.join('\n')}\n\nexport const installedRoutes = [\n  ${routeLines.join(',\n  ')}\n];\n`;

  await ensureDir(path.dirname(installedPath));
  await fs.writeFile(installedPath, content, 'utf8');
};
