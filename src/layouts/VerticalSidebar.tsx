import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  Building2,
  TriangleAlert,
  ClipboardList,
  MapPin,
  FileBox,
  BarChart3,
  Boxes,
  Folder,
  HardDrive,
  KeyRound,
  Landmark,
  Layers,
  GitBranch,
  Bell,
  Menu,
  Settings,
  Shield,
  ShieldCheck,
  Sliders,
  UserCheck,
  Users,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  PanelTopClose,
  ListChecks,
  ClipboardCheck,
  KanbanSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/components/ui/utils';
import { useLayout } from '../contexts/LayoutContext';
import { useRuntimeMenu } from '@/shared/menu/useRuntimeMenu';
import { getMenuFallbackEnabled } from '@/shared/menu/menuCache';
import { type MenuNode } from '../utils/menuRegistry';
import mappaLogo from '../assets/79505e63e97894ec2d06837c57cf53a19680f611.png';
import { useIamIdentity } from '@/shared/iam/useIamIdentity';

// 🔥 NEW: Permission code mapping (from Insert.sql lines 39-46)
const PERMISSION_MAP: { [path: string]: string } = {
  '/overview': '', // No permission required (always visible)
  '/map': 'map.page.read',
  '/stores': 'STORES_VIEW',
  '/leads': 'LEAD_RISK',
  '/plans': 'PLAN_VIEW',
  '/tasks': 'TASKS_VIEW', // or FIELD_TASKS_VIEW
  '/evidence': 'EVIDENCE_VIEW',
  '/reports': '', // No permission required
  '/admin': 'ADMIN_VIEW',
};

// MAPPA Main Modules
const mappaModules = [
  { path: '/overview', label: 'Tổng quan', icon: LayoutDashboard, permissionCode: '' },
  { path: '/map', label: 'Bản đồ điều hành', icon: MapIcon, permissionCode: 'MAP_VIEW' },
  { path: '/registry/stores', label: 'Cơ sở quản lý', icon: Building2, permissionCode: 'STORES_VIEW' },
  {
    path: '/leads',
    label: 'Nguồn tin',
    icon: TriangleAlert,
    permissionCode: 'LEAD_RISK',
    hasSubmenu: true,
    submenu: [
      { path: '/lead-risk/inbox', label: 'Xử lý nguồn tin hằng ngày' },
      { path: '/lead-risk/dashboard', label: 'Tổng quan rủi ro' },
      { path: '/lead-risk/hotspots', label: 'Phân tích điểm nóng' },
      { path: '/lead-risk/quality-metrics', label: 'Phân tích chất lượng' },
      { path: '/lead-risk/workload-dashboard', label: 'Quản lý công việc' },
      { path: '/lead-risk/sla-dashboard', label: 'Giám sát SLA' },
    ],
  },
  { path: '/plans', label: 'Kế hoạch tác nghiệp', icon: ClipboardList, permissionCode: 'PLAN_VIEW', hasSubmenu: true },
  { path: '/tasks', label: 'Nhiệm vụ hiện trường', icon: MapPin, permissionCode: 'TASKS_VIEW' },
  { path: '/evidence', label: 'Kho chứng cứ', icon: FileBox, permissionCode: 'EVIDENCE_VIEW' },
  {
    path: '/reports',
    label: 'Báo cáo & Thống kê',
    icon: BarChart3,
    permissionCode: '',
    hasSubmenu: true,
    submenu: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/reports', label: 'Báo cáo' },
    ],
  },
  {
    path: '/admin',
    label: 'Quản trị',
    icon: Settings,
    permissionCode: 'ADMIN_VIEW',
    hasSubmenu: true,
    submenu: [
      { type: 'item', path: '/system-admin', label: 'Dashboard Quản trị', icon: LayoutDashboard },
      { type: 'separator' },
      { type: 'item', path: '/system-admin/master-data/org-units', label: 'Đơn vị tổ chức', icon: Building2 },
      { type: 'item', path: '/system-admin/master-data/departments', label: 'Phòng ban', icon: Users },
      { type: 'item', path: '/system-admin/master-data/admin-areas', label: 'Danh mục hành chính', icon: MapPin },
      { type: 'item', path: '/system-admin/master-data/common-catalogs', label: 'Danh mục dùng chung', icon: Folder },
      { type: 'item', path: '/system-admin/master-data/dms-catalogs', label: 'Danh mục nghiệp vụ QLTT', icon: Layers },
      { type: 'item', path: '/system-admin/master-data/system-catalogs', label: 'Danh mục kỹ thuật', icon: GitBranch },
      { type: 'separator' },
      { type: 'item', path: '/system-admin/iam/users', label: 'Người dùng', icon: Users },
      { type: 'item', path: '/system-admin/iam/roles', label: 'Vai trò', icon: Shield },
      { type: 'item', path: '/system-admin/iam/permissions', label: 'Danh mục quyền', icon: KeyRound },
      { type: 'item', path: '/system-admin/iam/role-permissions', label: 'Phân quyền', icon: UserCheck },
      { type: 'item', path: '/system-admin/iam/modules', label: 'Phân hệ', icon: Boxes },
      { type: 'item', path: '/system-admin/iam/menus', label: 'Menu', icon: Menu },
      { type: 'separator' },
      { type: 'item', path: '/system-admin/system-config/parameters', label: 'Thông số hệ thống', icon: Sliders },
      { type: 'item', path: '/system-admin/system-config/organization-info', label: 'Thông tin tổ chức', icon: Landmark },
      { type: 'item', path: '/system-admin/system-config/operations', label: 'Cài đặt vận hành', icon: Settings },
      { type: 'item', path: '/system-admin/system-config/notifications', label: 'Mẫu thông báo', icon: Bell },
      { type: 'item', path: '/system-admin/system-config/security', label: 'Cài đặt bảo mật', icon: ShieldCheck },
      { type: 'item', path: '/system-admin/system-config/database/logs', label: 'Database Logs', icon: FileBox },
      { type: 'item', path: '/system-admin/system-config/database/backups', label: 'Database Backups', icon: HardDrive },
      { type: 'separator' },
      { type: 'item', path: '/system/modules', label: 'Quản trị Module' },
      { type: 'item', path: '/system/menus', label: 'Quản trị Menu' },
      { type: 'item', path: '/system/users', label: 'Người dùng (cũ)' },
      { type: 'item', path: '/system/roles', label: 'Vai trò (cũ)' },
      { type: 'item', path: '/system/settings', label: 'Cấu hình hệ thống' },
    ],
  },
];

const menuIconMap = {
  LayoutDashboard,
  Map: MapIcon,
  Building2,
  TriangleAlert,
  ClipboardList,
  MapPin,
  FileBox,
  BarChart3,
  Boxes,
  Folder,
  HardDrive,
  KeyRound,
  Landmark,
  Layers,
  GitBranch,
  Menu,
  Settings,
  Shield,
  ShieldCheck,
  Sliders,
  UserCheck,
  Users,
  Bell,
} as const;

const resolveMenuIcon = (icon?: string | null) => {
  if (!icon) return LayoutDashboard;
  return (menuIconMap as Record<string, any>)[icon] || LayoutDashboard;
};

type SubmenuItem =
  | { type?: 'item'; path: string; label: string; icon?: any }
  | { type: 'separator' }
  | { type: 'label'; label: string };

const ADMIN_HIDDEN_PATHS = new Set([
  '/system-admin/master-data',
  '/system-admin/iam',
  '/system-admin/system-config',
]);

const ADMIN_GROUP_ORDER = [
  'dashboard',
  'master-data',
  'iam',
  'system-config',
  'tools',
];

const sortByOrderThenLabel = (left: MenuNode, right: MenuNode) => {
  const order = (left.order ?? 0) - (right.order ?? 0);
  if (order !== 0) return order;
  return left.label.localeCompare(right.label);
};

const toSubmenuItem = (node: MenuNode): SubmenuItem => {
  if (!node.path) {
    return { type: 'label', label: node.label };
  }
  return {
    path: node.path,
    label: node.label,
    ...(node.icon ? { icon: resolveMenuIcon(node.icon) } : {}),
  };
};

const buildAdminSubmenu = (children: MenuNode[]): SubmenuItem[] => {
  const groups = new Map<string, MenuNode[]>();
  const filtered = children.filter((child) => child.path && !ADMIN_HIDDEN_PATHS.has(child.path));

  filtered.forEach((child) => {
    const path = child.path ?? '';
    let key = 'tools';
    if (path === '/system-admin') key = 'dashboard';
    else if (path.startsWith('/system-admin/master-data')) key = 'master-data';
    else if (path.startsWith('/system-admin/iam')) key = 'iam';
    else if (path.startsWith('/system-admin/system-config')) key = 'system-config';
    else if (path.startsWith('/system/modules') || path.startsWith('/system/menus')) key = 'tools';
    const bucket = groups.get(key) ?? [];
    bucket.push(child);
    groups.set(key, bucket);
  });

  const orderedKeys = ADMIN_GROUP_ORDER.filter((key) => (groups.get(key) ?? []).length > 0);
  const items: SubmenuItem[] = [];

  orderedKeys.forEach((key, index) => {
    const groupItems = groups.get(key) ?? [];
    groupItems.sort(sortByOrderThenLabel).forEach((child) => items.push(toSubmenuItem(child)));
    if (index < orderedKeys.length - 1) {
      items.push({ type: 'separator' });
    }
  });

  return items;
};

const menuTreeToModules = (nodes: MenuNode[]) => {
  return nodes.map((node) => {
    const submenuItems =
      node.children.length > 0
        ? (node.path === '/admin' || node.label === 'Quản trị'
          ? buildAdminSubmenu(node.children)
          : node.children.map((child) => toSubmenuItem(child)))
        : [];
    return {
      path: node.path || '',
      label: node.label,
      icon: node.path === '/admin' ? Settings : resolveMenuIcon(node.icon),
      permissionCode: '',
      hasSubmenu: submenuItems.length > 0,
      submenu: submenuItems,
    };
  });
};

interface VerticalSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function VerticalSidebar({
  collapsed = false,
  onToggleCollapse,
}: VerticalSidebarProps) {
  const location = useLocation();
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [plansSubmenuOpen, setPlansSubmenuOpen] = useState(
    location.pathname.startsWith('/plans') || location.pathname.startsWith('/inspections')
  );
  const { setLayoutMode } = useLayout();
  const { tree, loading } = useRuntimeMenu();
  const { roleCodes, loading: identityLoading, isSuperAdmin } = useIamIdentity();
  const fallbackEnabled = getMenuFallbackEnabled();
  const isPathActive = React.useCallback(
    (path?: string | null) => {
      if (!path) return false;
      const [pathname, search] = path.split('?');
      const matchesPath = location.pathname === pathname || location.pathname.startsWith(pathname + '/');
      if (!matchesPath) return false;
      if (!search) return true;
      const currentParams = new URLSearchParams(location.search);
      const targetParams = new URLSearchParams(search);
      for (const [key, value] of targetParams.entries()) {
        if (currentParams.get(key) !== value) return false;
      }
      return true;
    },
    [location.pathname, location.search],
  );

  const runtimeModules = React.useMemo(() => menuTreeToModules(tree), [tree]);
  const visibleModules = React.useMemo(() => {
    if (runtimeModules.length > 0) return runtimeModules;
    return fallbackEnabled || isSuperAdmin ? mappaModules : [];
  }, [runtimeModules, fallbackEnabled, isSuperAdmin]);
  const showNoRoleBanner = !identityLoading && !isSuperAdmin && roleCodes.length === 0;
  const showEmptyState = !loading && visibleModules.length === 0 && !fallbackEnabled && !isSuperAdmin;

  // Mock permissions - In real app, this would come from user context/auth
  const userPermissions = {
    canCreateFacility: isSuperAdmin || true,
    canImportFacilityData: isSuperAdmin || true,
    canCreateRisk: isSuperAdmin || false,
    canCreateFeedback: isSuperAdmin || true,
    canCreateInspectionPlan: isSuperAdmin || true,
    canCreateInspectionRound: isSuperAdmin || false,
    canCreateInspectionSession: isSuperAdmin || true,
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 bg-card border-r border-border z-40 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img src={mappaLogo} alt="Mappa Logo" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-foreground">Mappa</span>
          </div>
        )}
        {collapsed && (
          <img src={mappaLogo} alt="Mappa Logo" className="w-8 h-8 object-contain mx-auto" />
        )}
      </div>

      {/* Quick Actions - Moved to Top */}
      <div className="p-2 border-b border-border">
        <DropdownMenu open={quickActionsOpen} onOpenChange={setQuickActionsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn('w-full gap-2 cursor-pointer !text-white', collapsed ? 'px-0' : '')}
              size={collapsed ? 'icon' : 'sm'}
            >
              <Plus className="h-4 w-4" />
              {!collapsed && (
                <>
                  Tạo nhanh
                  <ChevronDown className="h-3 w-3 ml-auto" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
            {userPermissions.canCreateFacility && (
              <DropdownMenuItem asChild>
                <Link to="/stores/create" style={{ cursor: 'pointer' }}>
                  Thêm cơ sở
                </Link>
              </DropdownMenuItem>
            )}

            {userPermissions.canImportFacilityData && (
              <DropdownMenuItem asChild>
                <Link to="/stores/import" style={{ cursor: 'pointer' }}>
                  Nhập dữ liệu cơ sở
                </Link>
              </DropdownMenuItem>
            )}

            {userPermissions.canCreateRisk && (
              <DropdownMenuItem asChild>
                <Link to="/leads/create-risk" style={{ cursor: 'pointer' }}>
                  Tạo rủi ro
                </Link>
              </DropdownMenuItem>
            )}

            {userPermissions.canCreateFeedback && (
              <DropdownMenuItem asChild>
                <Link to="/leads/create-feedback" style={{ cursor: 'pointer' }}>
                  Tạo phản ánh
                </Link>
              </DropdownMenuItem>
            )}

            {userPermissions.canCreateInspectionPlan && (
              <DropdownMenuItem asChild>
                <Link to="/plans/create-new" style={{ cursor: 'pointer' }}>
                  Tạo kế hoạch kiểm tra
                </Link>
              </DropdownMenuItem>
            )}

            {userPermissions.canCreateInspectionRound && (
              <DropdownMenuItem asChild>
                <a href="/plans/create-round" style={{ cursor: 'pointer' }}>
                  Tạo đợt kiểm tra
                </a>
              </DropdownMenuItem>
            )}

            {userPermissions.canCreateInspectionSession && (
              <DropdownMenuItem asChild>
                <a href="/tasks/create" style={{ cursor: 'pointer' }}>
                  Tạo phiên kiểm tra
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {showNoRoleBanner && (
          <div className="px-4 py-3 text-sm font-medium text-amber-700">
            Tài khoản chưa được gán vai trò
          </div>
        )}
        {showEmptyState ? (
          <div className="px-4 py-3 text-sm text-muted-foreground">
            Tài khoản chưa được gán vai trò hoặc chưa có quyền hiển thị menu.
          </div>
        ) : (
          visibleModules.map((module) => {
            const Icon = module.icon;
            const isAdminMenu = module.path === '/admin';

            // Special logic for active state
            let isActive = false;

            if (module.path === '/plans') {
              // "Kế hoạch tác nghiệp" menu cha KHÔNG active khi ở submenu
              isActive = false;
            } else if (module.path === '/tasks') {
              // "Phiên kiểm tra" KHÔNG active khi ở /plans/inspection-session
              isActive = location.pathname === '/tasks' && location.pathname !== '/plans/inspection-session';
            } else if ((module as any).hasSubmenu && (module as any).submenu) {
              // Submenu modules (lead-risk, reports, admin)
              if (module.path === '/reports') {
                isActive = location.pathname === '/dashboard' || location.pathname === '/reports';
              } else if (module.path === '/admin') {
                isActive = location.pathname.startsWith('/system') || location.pathname.startsWith('/system-admin') || location.pathname === '/admin';
              } else {
                isActive = location.pathname.startsWith('/lead-risk') || location.pathname === '/leads';
              }
            } else if (module.path === '/registry/stores') {
              // Registry - include full-edit paths
              isActive = location.pathname === module.path || location.pathname.startsWith(module.path + '/') || location.pathname.startsWith('/registry/full-edit');
            } else {
              // Normal modules - active when path matches
              isActive = location.pathname === module.path || location.pathname.startsWith(module.path + '/');
            }

            // Special handling for "Kế hoạch tác nghiệp" with submenu
            if (module.path === '/plans') {
              // When collapsed, show as dropdown menu
              if (collapsed) {
                return (
                  <DropdownMenu key={module.path}>
                    <DropdownMenuTrigger asChild>
                      <div
                        className={cn(
                          'flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors mb-1 cursor-pointer',
                          isActive
                            ? 'text-primary bg-primary/10 font-medium'
                            : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                        )}
                        style={{ cursor: 'pointer' }}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-64">
                      <DropdownMenuItem asChild>
                        <Link to="/plans/list" className="flex items-center gap-3 cursor-pointer">
                          <ListChecks className="h-4 w-4" />
                          <div className="font-medium">Kế hoạch kiểm tra</div>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/plans/inspection-rounds" className="flex items-center gap-3 cursor-pointer">
                          <ClipboardCheck className="h-4 w-4" />
                          <div className="font-medium">Đợt kiểm tra</div>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/plans/inspection-session" className="flex items-center gap-3 cursor-pointer">
                          <KanbanSquare className="h-4 w-4" />
                          <div className="font-medium">Phiên làm việc</div>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              // When expanded, show collapsible submenu
              return (
                <div key={module.path} className="mb-1">
                  {/* Parent menu item */}
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
                      isActive
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                    )}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPlansSubmenuOpen(!plansSubmenuOpen)}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm flex-1">{module.label}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        plansSubmenuOpen ? 'rotate-180' : ''
                      )}
                    />
                  </div>

                  {/* Submenu items */}
                  {plansSubmenuOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link to="/plans/list">
                        <div
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            location.pathname === '/plans/list' || location.pathname.startsWith('/plans/KH-') || location.pathname.startsWith('/plans/create-new')
                              ? 'text-primary bg-primary/5 font-medium'
                              : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                          )}
                        >
                          <ListChecks className="h-4 w-4 shrink-0" />
                          <span>Kế hoạch kiểm tra</span>
                        </div>
                      </Link>

                      <Link to="/plans/inspection-rounds">
                        <div
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            location.pathname === '/plans/inspection-rounds' || location.pathname.startsWith('/plans/inspection-rounds/')
                              ? 'text-primary bg-primary/5 font-medium'
                              : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                          )}
                        >
                          <ClipboardCheck className="h-4 w-4 shrink-0" />
                          <span>Đợt kiểm tra</span>
                        </div>
                      </Link>

                      <Link to="/plans/inspection-session">
                        <div
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            location.pathname === '/plans/inspection-session'
                              ? 'text-primary bg-primary/5 font-medium'
                              : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                          )}
                        >
                          <KanbanSquare className="h-4 w-4 shrink-0" />
                          <span>Phiên làm việc</span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            // If module has submenu (for lead-risk)
            if ((module as any).hasSubmenu && (module as any).submenu) {
              const isOpen = submenuOpen === module.path;

              // If collapsed, show as dropdown
              if (collapsed) {
                return (
                  <DropdownMenu key={module.path}>
                    <DropdownMenuTrigger asChild>
                      <div
                        className={cn(
                          'flex items-center justify-center p-3 rounded-lg transition-colors mb-1 cursor-pointer',
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className={cn("w-64", isAdminMenu && "w-72 p-2")}>
                      {!isAdminMenu && (
                        <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
                          {module.label}
                        </div>
                      )}
                      {(module as any).submenu.map((item: any, index: number) => {
                        if (item.type === 'separator') {
                          return <DropdownMenuSeparator key={`sep-${index}`} className={cn(isAdminMenu && "my-2")} />;
                        }
                        if (item.type === 'label') {
                          return (
                            <DropdownMenuLabel
                              key={`label-${index}`}
                              className="text-xs uppercase text-muted-foreground"
                            >
                              {item.label}
                            </DropdownMenuLabel>
                          );
                        }
                        if (!item.path) return null;
                        const ItemIcon = item.icon;
                        const isItemActive = isPathActive(item.path);
                        return (
                          <DropdownMenuItem key={item.path} asChild>
                            <Link
                              to={item.path}
                              className={cn(
                                isAdminMenu
                                  ? "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-primary/90 hover:text-white"
                                  : "cursor-pointer",
                                isItemActive &&
                                (isAdminMenu ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")
                              )}
                            >
                              {ItemIcon && <ItemIcon className="h-4 w-4" />}
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              // If expanded, show inline submenu
              return (
                <div key={module.path}>
                  <button
                    onClick={() => setSubmenuOpen(isOpen ? null : module.path)}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors mb-1',
                      isActive
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="text-sm">{module.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-8 mb-2 space-y-1">
                      {(module as any).submenu.map((item: any, index: number) => {
                        if (item.type === 'separator') {
                          return <div key={`sep-${index}`} className={cn("my-2 h-px bg-border", isAdminMenu && "mx-2")} />;
                        }
                        if (item.type === 'label') {
                          return (
                            <div
                              key={`label-${index}`}
                              className="px-3 py-1 text-xs font-semibold uppercase text-muted-foreground"
                            >
                              {item.label}
                            </div>
                          );
                        }
                        if (!item.path) return null;
                        const ItemIcon = item.icon;
                        const isItemActive = isPathActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              isAdminMenu
                                ? 'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors'
                                : 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                              isItemActive
                                ? (isAdminMenu ? 'bg-primary text-primary-foreground' : 'text-primary bg-primary/10 font-medium')
                                : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                            )}
                          >
                            {ItemIcon && <ItemIcon className="h-4 w-4" />}
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular menu item without submenu
            return (
              <Link key={module.path} to={module.path}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1',
                    isActive
                      ? 'text-primary bg-primary/10 font-medium'
                      : 'text-muted-foreground hover:text-white hover:bg-primary/90'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="text-sm">{module.label}</span>}
                </div>
              </Link>
            );
          })
        )}
      </nav>

      {/* Layout Mode Toggle */}
      <div className="p-2 border-t border-border">
        {!collapsed && (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="flex-1 cursor-pointer"
              title="Menu dọc (đang chọn)"
            >
              <PanelTopClose className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex-1 cursor-pointer"
              onClick={() => setLayoutMode('horizontal')}
              title="Chuyển sang menu ngang"
            >
              <PanelTopClose className="h-4 w-4" />
            </Button>
          </div>
        )}
        {collapsed && (
          <Button
            variant="outline"
            size="icon"
            className="w-full cursor-pointer"
            onClick={() => setLayoutMode('horizontal')}
            title="Chuyển sang menu ngang"
          >
            <PanelTopClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            className="w-full"
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Thu gọn</span>
              </>
            )}
          </Button>
        </div>
      )}
    </aside>
  );
}

