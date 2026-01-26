/**
 * MODULE REGISTRY MOCK
 * Mock data cho danh sách module manifests trong hệ thống MAPPA
 * Được sử dụng bởi Module Registry Page để hiển thị và quản lý modules
 */

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  basePath: string;
  entry: string;
  routes: string;
  permissions: string[];
  ui: {
    menuLabel: string;
    menuPath: string;
  };
  routeExport: string;
  release: {
    type: 'major' | 'minor' | 'patch';
    notes: string;
    breaking: string[];
  };
  compat: {
    minAppVersion: string;
    maxAppVersion: string;
  };
  // Runtime status (for UI only)
  enabled?: boolean;
  installedAt?: string;
}

/**
 * Danh sách tất cả module manifests
 * Bao gồm module gốc (system-admin) và các sub-modules
 */
export const MODULE_REGISTRY: ModuleManifest[] = [
  // Module gốc: System Admin
  {
    id: 'system-admin',
    name: 'Quản trị hệ thống',
    version: '0.2.0',
    basePath: '/system-admin',
    entry: 'src/modules/system-admin/index.ts',
    routes: 'src/modules/system-admin/routes.tsx',
    permissions: ['system_admin:read', 'system_admin:write'],
    ui: {
      menuLabel: 'Quản trị',
      menuPath: '/system/modules'
    },
    routeExport: 'systemModulesRoute',
    release: {
      type: 'minor',
      notes:
        'Bổ sung Module Registry + chuẩn hoá manifest module.json cho tất cả sub-modules (master-data, iam, system-config)',
      breaking: []
    },
    compat: {
      minAppVersion: '0.1.0',
      maxAppVersion: '0.9.0'
    },
    enabled: true,
    installedAt: '2025-01-15T08:00:00Z'
  },

  // Sub-module 1: Master Data (Dữ liệu nền)
  {
    id: 'system-admin-master-data',
    name: 'Dữ liệu nền',
    version: '0.2.0',
    basePath: '/system-admin/master-data',
    entry: 'src/modules/system-admin/sa-master-data/index.ts',
    routes: 'src/modules/system-admin/sa-master-data/routes.tsx',
    permissions: [
      'master_data:read',
      'master_data:write',
      'sa.masterdata.orgunit:read',
      'sa.masterdata.orgunit:write',
      'sa.masterdata.department:read',
      'sa.masterdata.department:write',
      'sa.masterdata.jurisdiction:read',
      'sa.masterdata.jurisdiction:write',
      'sa.masterdata.catalog:read',
      'sa.masterdata.catalog:write'
    ],
    ui: {
      menuLabel: 'Dữ liệu nền',
      menuPath: '/system-admin/master-data'
    },
    routeExport: 'saMasterDataRoutes',
    release: {
      type: 'minor',
      notes:
        'Module quản lý dữ liệu nền: Đơn vị tổ chức, Phòng ban, Địa bàn, Danh mục hệ thống với đầy đủ CRUD và TreeTable cho catalogs',
      breaking: []
    },
    compat: {
      minAppVersion: '0.1.0',
      maxAppVersion: '0.9.0'
    },
    enabled: true,
    installedAt: '2025-01-15T08:00:00Z'
  },

  // Sub-module 2: IAM (Identity & Access Management)
  {
    id: 'system-admin-iam',
    name: 'Quản lý danh tính & truy cập (IAM)',
    version: '0.2.0',
    basePath: '/system-admin/iam',
    entry: 'src/modules/system-admin/sa-iam/index.ts',
    routes: 'src/modules/system-admin/sa-iam/routes.tsx',
    permissions: [
      'iam:read',
      'iam:write',
      'sa.iam.user:read',
      'sa.iam.user:write',
      'sa.iam.role:read',
      'sa.iam.role:write',
      'sa.iam.permission:read',
      'sa.iam.permission:write',
      'sa.iam.assignment:read',
      'sa.iam.assignment:assign',
      'sa.iam.assignment:revoke',
      'sa.iam.module:read',
      'sa.iam.menu:read'
    ],
    ui: {
      menuLabel: 'Quản lý danh tính',
      menuPath: '/system-admin/iam'
    },
    routeExport: 'saIamRoutes',
    release: {
      type: 'minor',
      notes:
        'Module IAM: Người dùng, Vai trò, Quyền hạn, Phân quyền, Phân hệ, Menu với đầy đủ CRUD và assignment logic',
      breaking: []
    },
    compat: {
      minAppVersion: '0.1.0',
      maxAppVersion: '0.9.0'
    },
    enabled: true,
    installedAt: '2025-01-15T08:00:00Z'
  },

  // Sub-module 3: System Config (Cấu hình hệ thống)
  {
    id: 'system-admin-config',
    name: 'Cấu hình hệ thống',
    version: '0.2.0',
    basePath: '/system-admin/system-config',
    entry: 'src/modules/system-admin/sa-system-config/index.ts',
    routes: 'src/modules/system-admin/sa-system-config/routes.tsx',
    permissions: [
      'system_config:read',
      'system_config:write',
      'sa.sysconfig.param:read',
      'sa.sysconfig.param:update',
      'sa.sysconfig.orginfo:read',
      'sa.sysconfig.orginfo:update',
      'sa.sysconfig.ops:read',
      'sa.sysconfig.ops:update',
      'sa.sysconfig.notify:read',
      'sa.sysconfig.notify:create',
      'sa.sysconfig.notify:update',
      'sa.sysconfig.security:read',
      'sa.sysconfig.security:update',
      'sa.sysconfig.db.log:read',
      'sa.sysconfig.db.log:export',
      'sa.sysconfig.db.backup:read',
      'sa.sysconfig.db.backup:create',
      'sa.sysconfig.db.backup:restore'
    ],
    ui: {
      menuLabel: 'Cấu hình hệ thống',
      menuPath: '/system-admin/system-config'
    },
    routeExport: 'saSystemConfigRoutes',
    release: {
      type: 'minor',
      notes:
        'Module cấu hình: Thông số, Thông tin tổ chức, Vận hành, Mẫu thông báo, Bảo mật, Database logs & backups',
      breaking: []
    },
    compat: {
      minAppVersion: '0.1.0',
      maxAppVersion: '0.9.0'
    },
    enabled: true,
    installedAt: '2025-01-15T08:00:00Z'
  }
];

/**
 * Helper: Lấy module manifest theo ID
 */
export function getModuleById(id: string): ModuleManifest | undefined {
  return MODULE_REGISTRY.find((m) => m.id === id);
}

/**
 * Helper: Lấy tất cả enabled modules
 */
export function getEnabledModules(): ModuleManifest[] {
  return MODULE_REGISTRY.filter((m) => m.enabled);
}

/**
 * Helper: Tạo menu items từ module manifests (mock preview)
 */
export function generateMenuItemsFromModules(
  modules: ModuleManifest[]
): Array<{ label: string; path: string; moduleId: string }> {
  return modules
    .filter((m) => m.enabled)
    .map((m) => ({
      label: m.ui.menuLabel,
      path: m.ui.menuPath,
      moduleId: m.id
    }));
}
