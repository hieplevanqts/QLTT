export type RouteRegistryEntry = {
  path: string;
  label: string;
  moduleKey?: string;
};

// Minimal, curated route registry for menu builder suggestions.
// This is intentionally explicit (no dynamic import magic) to keep Vite stable.
export const ROUTE_REGISTRY: RouteRegistryEntry[] = [
  { path: "/overview", label: "Tổng quan", moduleKey: "overview" },
  { path: "/map", label: "Bản đồ điều hành", moduleKey: "map" },
  { path: "/stores", label: "Cơ sở quản lý", moduleKey: "stores" },
  { path: "/lead-risk", label: "Nguồn tin", moduleKey: "leads" },
  { path: "/lead-risk/inbox", label: "Nguồn tin hằng ngày", moduleKey: "leads" },
  { path: "/lead-risk/dashboard", label: "Tổng quan rủi ro", moduleKey: "leads" },
  { path: "/lead-risk/hotspots", label: "Phân tích điểm nóng", moduleKey: "leads" },
  { path: "/lead-risk/quality-metrics", label: "Phân tích chất lượng", moduleKey: "leads" },
  { path: "/lead-risk/workload-dashboard", label: "Quản lý công việc", moduleKey: "leads" },
  { path: "/lead-risk/sla-dashboard", label: "Giám sát SLA", moduleKey: "leads" },
  { path: "/plans", label: "Kế hoạch tác nghiệp", moduleKey: "plans" },
  { path: "/plans/list", label: "Danh sách kế hoạch", moduleKey: "plans" },
  { path: "/plans/inspection-rounds", label: "Đợt kiểm tra", moduleKey: "plans" },
  { path: "/plans/inspection-session", label: "Phiên làm việc", moduleKey: "plans" },
  { path: "/tasks", label: "Nhiệm vụ hiện trường", moduleKey: "tasks" },
  { path: "/evidence", label: "Kho chứng cứ", moduleKey: "evidence" },
  { path: "/reports", label: "Báo cáo", moduleKey: "reports" },
  { path: "/dashboard", label: "Dashboard", moduleKey: "reports" },
  { path: "/kpi", label: "KPI QLTT", moduleKey: "kpi-qltt" },
  { path: "/todolist", label: "Nhật ký công việc", moduleKey: "i-todolist" },

  // System Admin
  { path: "/system-admin", label: "Dashboard Quản trị", moduleKey: "system-admin.dashboard" },
  { path: "/system-admin/master-data/org-units", label: "Đơn vị tổ chức", moduleKey: "system-admin.master-data" },
  { path: "/system-admin/master-data/departments", label: "Phòng ban", moduleKey: "system-admin.master-data" },
  { path: "/system-admin/master-data/admin-areas", label: "Danh mục hành chính", moduleKey: "system-admin.master-data" },
  { path: "/system-admin/master-data/common-catalogs", label: "Danh mục dùng chung", moduleKey: "system-admin.master-data" },
  { path: "/system-admin/master-data/dms-catalogs", label: "Danh mục nghiệp vụ QLTT", moduleKey: "system-admin.master-data" },
  { path: "/system-admin/master-data/system-catalogs", label: "Danh mục kỹ thuật", moduleKey: "system-admin.master-data" },
  { path: "/system-admin/iam/users", label: "Người dùng", moduleKey: "system-admin.iam" },
  { path: "/system-admin/iam/roles", label: "Vai trò", moduleKey: "system-admin.iam" },
  { path: "/system-admin/iam/permissions", label: "Danh mục quyền", moduleKey: "system-admin.iam" },
  { path: "/system-admin/iam/role-permissions", label: "Phân quyền", moduleKey: "system-admin.iam" },
  { path: "/system-admin/iam/modules", label: "Phân hệ", moduleKey: "system-admin.iam" },
  { path: "/system-admin/iam/menus", label: "Menu", moduleKey: "system-admin.iam" },
  { path: "/system-admin/system-config/parameters", label: "Thông số hệ thống", moduleKey: "system-admin.system-config" },
  { path: "/system-admin/system-config/organization-info", label: "Thông tin tổ chức", moduleKey: "system-admin.system-config" },
  { path: "/system-admin/system-config/operations", label: "Cài đặt vận hành", moduleKey: "system-admin.system-config" },
  { path: "/system-admin/system-config/notifications", label: "Mẫu thông báo", moduleKey: "system-admin.system-config" },
  { path: "/system-admin/system-config/security", label: "Cài đặt bảo mật", moduleKey: "system-admin.system-config" },
  { path: "/system-admin/system-config/database/logs", label: "Database Logs", moduleKey: "system-admin.system-config" },
  { path: "/system-admin/system-config/database/backups", label: "Database Backups", moduleKey: "system-admin.system-config" },

  // Legacy admin routes
  { path: "/system/modules", label: "Quản trị Module (cũ)", moduleKey: "system-admin" },
  { path: "/system/menus", label: "Quản trị Menu (cũ)", moduleKey: "system-admin" },
  { path: "/system/users", label: "Người dùng (cũ)", moduleKey: "system-admin" },
  { path: "/system/roles", label: "Vai trò (cũ)", moduleKey: "system-admin" },
  { path: "/system/settings", label: "Cấu hình hệ thống (cũ)", moduleKey: "system-admin" },
];

export const filterRouteRegistry = (params: { moduleKey?: string; search?: string } = {}) => {
  const search = params.search?.trim().toLowerCase();
  return ROUTE_REGISTRY.filter((route) => {
    if (params.moduleKey && route.moduleKey && route.moduleKey !== params.moduleKey) {
      return false;
    }
    if (search) {
      const hay = `${route.label} ${route.path}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });
};

