import React from 'react';
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
  X,
  Plus,
  PanelLeftClose,
  ListChecks,
  ClipboardCheck,
  KanbanSquare,
} from 'lucide-react';
import { Button } from '../app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../app/components/ui/dropdown-menu';
import { cn } from '../app/components/ui/utils';
import { useLayout } from '../contexts/LayoutContext';
import { useAuth } from '../contexts/AuthContext'; // 🔥 NEW: Import useAuth for permissions
import { useMenuRegistry } from '../hooks/useMenuRegistry';
import { buildMenuTree, filterMenuTree, type MenuNode } from '../utils/menuRegistry';

interface HorizontalNavBarProps {
  mobileMenuOpen: boolean;
  onClose: () => void;
}

// 🔥 NEW: Permission code mapping (from Insert.sql lines 39-46)
const PERMISSION_MAP: { [path: string]: string } = {
  '/overview': '', // No permission required (always visible)
  '/map': 'MAP_VIEW',
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
  { path: '/stores', label: 'Cơ sở quản lý', icon: Building2, permissionCode: 'STORES_VIEW' },
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
      { type: 'item', path: '/system-admin/master-data/catalogs?group=DMS', label: 'Danh mục nghiệp vụ QLTT', icon: Layers },
      { type: 'item', path: '/system-admin/master-data/catalogs?group=SYSTEM', label: 'Danh mục kỹ thuật', icon: GitBranch },
      { type: 'separator' },
      { type: 'item', path: '/system-admin/iam/users', label: 'Người dùng', icon: Users },
      { type: 'item', path: '/system-admin/iam/roles', label: 'Vai trò', icon: Shield },
      { type: 'item', path: '/system-admin/iam/permissions', label: 'Permissions', icon: KeyRound },
      { type: 'item', path: '/system-admin/iam/assignments', label: 'Phân quyền', icon: UserCheck },
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

export default function HorizontalNavBar({ mobileMenuOpen, onClose }: HorizontalNavBarProps) {
  const location = useLocation();
  const { setLayoutMode } = useLayout();
  const { user } = useAuth(); // 🔥 NEW: Get user with permissions
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = React.useState<string | null>(null);
  const { menus } = useMenuRegistry();

  // 🔥 NEW: Get user permission codes
  const userPermissionCodes = user?.permissions || [];
  
  // 🔥 NEW: Helper function to check if user has permission for a menu item
  const hasPermission = (permissionCode: string | undefined): boolean => {
    if (!permissionCode || permissionCode === '') return true; // No permission required = always visible
    return userPermissionCodes.includes(permissionCode);
  };
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

  const registryTree = React.useMemo(() => (menus ? buildMenuTree(menus) : []), [menus]);
  const filteredRegistryTree = React.useMemo(
    () => filterMenuTree(registryTree, userPermissionCodes, user?.roleCode),
    [registryTree, userPermissionCodes, user?.roleCode],
  );
  const registryModules = React.useMemo(() => menuTreeToModules(filteredRegistryTree), [filteredRegistryTree]);
  const visibleModules = registryModules.length > 0
    ? registryModules
    : mappaModules.filter(module => hasPermission(module.permissionCode));

  // Mock permissions - In real app, this would come from user context/auth
  const userPermissions = {
    canCreateFacility: true,
    canImportFacilityData: true,
    canCreateRisk: false,
    canCreateFeedback: true,
    canCreateInspectionPlan: true,
    canCreateInspectionRound: false,
    canCreateInspectionSession: true,
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex h-14 bg-card border-b border-border items-center px-6 gap-1">
        {/* Main MAPPA Modules */}
        {visibleModules.map((module) => { // 🔥 FIX: Use filtered modules instead of all modules
          const Icon = module.icon;
          const isAdminMenu = module.path === '/admin';
          
          // Special logic for active state
          let isActive = false;
          
          if (module.path === '/plans') {
            // "Kế hoạch tác nghiệp" menu cha KHÔNG active khi ở submenu
            // Chỉ active khi ở /plans (root) - không bao giờ vì ta không có route này
            isActive = false;
          } else if (module.path === '/tasks') {
            // "Phiên kiểm tra" KHÔNG active khi ở /plans/inspection-session
            isActive = location.pathname === '/tasks' && location.pathname !== '/plans/inspection-session';
          } else if ((module as any).hasSubmenu && (module as any).submenu) {
            if (module.path === '/leads') {
              isActive = location.pathname.startsWith('/lead-risk') || location.pathname === '/leads';
            } else if (module.path === '/admin') {
              isActive = location.pathname.startsWith('/system') || location.pathname.startsWith('/system-admin') || location.pathname === '/admin';
            } else {
              isActive = location.pathname === module.path || location.pathname.startsWith(module.path + '/');
            }
          } else {
            // Normal modules - active when path matches
            isActive = location.pathname === module.path || location.pathname.startsWith(module.path + '/');
          }
          
          // Special handling for "Kế hoạch tác nghiệp" with submenu
          if (module.path === '/plans') {
            return (
              <DropdownMenu key={module.path}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "gap-2 h-9 text-sm font-medium cursor-pointer",
                      isActive ? "text-primary bg-primary/10" : "text-foreground"
                    )}
                    style={{ cursor: 'pointer' }}
                  >
                    <Icon className="h-4 w-4" />
                    {module.label}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
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
          
          // If module has submenu, render dropdown
          if ((module as any).hasSubmenu && (module as any).submenu) {
            return (
              <DropdownMenu key={module.path}>
                <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "gap-2 h-9 text-sm font-medium cursor-pointer",
                  isActive ? "text-primary bg-primary/10" : "text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {module.label}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className={cn("w-64", isAdminMenu && "w-72 p-2")}>
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
                              ? "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
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
          
          // Regular menu item without submenu
          return (
            <Link key={module.path} to={module.path}>
              <Button 
                variant="ghost" 
                className={cn(
                  "gap-2 h-9 text-sm font-medium cursor-pointer",
                  isActive ? "text-primary bg-primary/10" : "text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {module.label}
              </Button>
            </Link>
          );
        })}

        {/* Layout Toggle & Quick Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Layout Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            onClick={() => setLayoutMode('vertical')}
            title="Chuyển sang menu dọc"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>

          {/* Tạo nhanh - Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 h-9 cursor-pointer">
                <Plus className="h-4 w-4" />
                Tạo nhanh
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {userPermissions.canCreateFacility && (
                <DropdownMenuItem asChild>
                  <a href="/stores/create" style={{ cursor: 'pointer' }}>
                    Thêm cơ sở
                  </a>
                </DropdownMenuItem>
              )}
              
              {userPermissions.canImportFacilityData && (
                <DropdownMenuItem asChild>
                  <a href="/stores/import" style={{ cursor: 'pointer' }}>
                    Nhập dữ liệu cơ sở
                  </a>
                </DropdownMenuItem>
              )}
              
              {userPermissions.canCreateRisk && (
                <DropdownMenuItem asChild>
                  <a href="/leads/create-risk" style={{ cursor: 'pointer' }}>
                    Tạo rủi ro
                  </a>
                </DropdownMenuItem>
              )}
              
              {userPermissions.canCreateFeedback && (
                <DropdownMenuItem asChild>
                  <a href="/leads/create-feedback" style={{ cursor: 'pointer' }}>
                    Tạo phản ánh
                  </a>
                </DropdownMenuItem>
              )}
              
              {userPermissions.canCreateInspectionPlan && (
                <DropdownMenuItem asChild>
                  <a href="/plans/create-new" style={{ cursor: 'pointer' }}>
                    Tạo kế hoạch kiểm tra
                  </a>
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
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-card shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-2 overflow-y-auto">
              {visibleModules.map((module) => { // 🔥 FIX: Use filtered modules instead of all modules
                const Icon = module.icon;
                const isAdminMenu = module.path === '/admin';
                
                // Special logic for active state
                let isModuleActive = false;
                
                if (module.path === '/plans') {
                  // "Kế hoạch tác nghiệp" menu cha KHÔNG active khi ở submenu
                  isModuleActive = false;
                } else if (module.path === '/tasks') {
                  // "Phiên kiểm tra" KHÔNG active khi ở /plans/inspection-session
                  isModuleActive = location.pathname === '/tasks' && location.pathname !== '/plans/inspection-session';
                } else if ((module as any).hasSubmenu && (module as any).submenu) {
                  if (module.path === '/leads') {
                    isModuleActive = location.pathname.startsWith('/lead-risk') || location.pathname === '/leads';
                  } else if (module.path === '/admin') {
                    isModuleActive = location.pathname.startsWith('/system') || location.pathname.startsWith('/system-admin') || location.pathname === '/admin';
                  } else {
                    isModuleActive = location.pathname === module.path || location.pathname.startsWith(module.path + '/');
                  }
                } else {
                  // Normal modules - active when path matches
                  isModuleActive = location.pathname === module.path || location.pathname.startsWith(module.path + '/');
                }
                
                // Special handling for "Kế hoạch tác nghiệp" with submenu
                if (module.path === '/plans') {
                  const isOpen = mobileSubmenuOpen === module.path;
                  
                  return (
                    <div key={module.path}>
                      <button
                        onClick={() => setMobileSubmenuOpen(isOpen ? null : module.path)}
                        className={cn(
                          'flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors mb-1 cursor-pointer',
                          isModuleActive
                            ? 'text-primary bg-muted'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{module.label}</span>
                        </div>
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180"
                          )} 
                        />
                      </button>
                      
                      {isOpen && (
                        <div className="ml-4 mb-2 space-y-1">
                          <Link
                            to="/plans/list"
                            onClick={onClose}
                            className={cn(
                              'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                              location.pathname === '/plans/list' || location.pathname.startsWith('/plans/KH-') || location.pathname.startsWith('/plans/create-new')
                                ? 'text-primary bg-primary/10 font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            )}
                          >
                            <ListChecks className="h-4 w-4" />
                            <span>Kế hoạch kiểm tra</span>
                          </Link>
                          
                          <Link
                            to="/plans/inspection-rounds"
                            onClick={onClose}
                            className={cn(
                              'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                              location.pathname === '/plans/inspection-rounds' || location.pathname.startsWith('/plans/inspection-rounds/')
                                ? 'text-primary bg-primary/10 font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            )}
                          >
                            <ClipboardCheck className="h-4 w-4" />
                            <span>Đợt kiểm tra</span>
                          </Link>
                          
                          <Link
                            to="/plans/inspection-session"
                            onClick={onClose}
                            className={cn(
                              'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                              location.pathname === '/plans/inspection-session'
                                ? 'text-primary bg-primary/10 font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            )}
                          >
                            <KanbanSquare className="h-4 w-4" />
                            <span>Phiên làm việc</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                
                // If module has submenu
                if ((module as any).hasSubmenu && (module as any).submenu) {
                  const isOpen = mobileSubmenuOpen === module.path;
                  
                  return (
                    <div key={module.path}>
                      <button
                        onClick={() => setMobileSubmenuOpen(isOpen ? null : module.path)}
                        className={cn(
                          'flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors mb-1 cursor-pointer',
                          isModuleActive
                            ? 'text-primary bg-muted'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{module.label}</span>
                        </div>
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180"
                          )} 
                        />
                      </button>
                      
                      {isOpen && (
                        <div className="ml-4 mb-2 space-y-1">
                          {(module as any).submenu.map((item: any, index: number) => {
                            if (item.type === 'separator') {
                              return <div key={`sep-${index}`} className={cn("my-2 h-px bg-border", isAdminMenu && "mx-2")} />;
                            }
                            if (item.type === 'label') {
                              return (
                                <div
                                  key={`label-${index}`}
                                  className="px-4 py-1 text-xs font-semibold uppercase text-muted-foreground"
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
                                onClick={onClose}
                                className={cn(
                                  isAdminMenu
                                    ? 'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer'
                                    : 'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                                  isItemActive
                                    ? (isAdminMenu ? 'bg-primary text-primary-foreground' : 'text-primary bg-primary/10 font-medium')
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                  <Link
                    key={module.path}
                    to={module.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 cursor-pointer',
                      isModuleActive
                        ? 'text-primary bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{module.label}</span>
                  </Link>
                );
              })}

              {/* Quick Actions in Mobile */}
              <div className="mt-6 px-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Tạo nhanh
                </div>
                <div className="space-y-1">
                  {userPermissions.canCreateFacility && (
                    <a href="/stores/create" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left cursor-pointer">
                      Thêm cơ sở
                    </a>
                  )}
                  
                  {userPermissions.canImportFacilityData && (
                    <a href="/stores/import" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left cursor-pointer">
                      Nhập dữ liệu cơ sở
                    </a>
                  )}
                  
                  {userPermissions.canCreateRisk && (
                    <a href="/leads/create-risk" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left cursor-pointer">
                      Tạo rủi ro
                    </a>
                  )}
                  
                  {userPermissions.canCreateFeedback && (
                    <a href="/leads/create-feedback" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left cursor-pointer">
                      Tạo phản ánh
                    </a>
                  )}
                  
                  {userPermissions.canCreateInspectionPlan && (
                    <a href="/plans/create-new" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left cursor-pointer">
                      Tạo kế hoạch kiểm tra
                    </a>
                  )}
                  
                  {userPermissions.canCreateInspectionRound && (
                    <a href="/plans/create-round" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left cursor-pointer">
                      Tạo đợt kiểm tra
                    </a>
                  )}
                  
                  {userPermissions.canCreateInspectionSession && (
                    <a href="/tasks/create" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left cursor-pointer">
                      Tạo phiên kiểm tra
                    </a>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
