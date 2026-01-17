import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Building2,
  TriangleAlert,
  ClipboardList,
  MapPin,
  FileBox,
  BarChart3,
  Settings,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  PanelTopClose,
  ListChecks,
  ClipboardCheck,
  KanbanSquare,
} from 'lucide-react';
import { Button } from '../app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../app/components/ui/dropdown-menu';
import { cn } from '../app/components/ui/utils';
import { useLayout } from '../contexts/LayoutContext';
import { useAuth } from '../contexts/AuthContext'; // 🔥 NEW: Import useAuth for permissions
import mappaLogo from '../assets/79505e63e97894ec2d06837c57cf53a19680f611.png';

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
  { path: '/map', label: 'Bản đồ điều hành', icon: Map, permissionCode: 'MAP_VIEW' },
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
  { path: '/reports', label: 'Báo cáo, thống kê', icon: BarChart3, permissionCode: '' },
  { path: '/admin', label: 'Quản trị', icon: Settings, permissionCode: 'ADMIN_VIEW' },
];

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
  const { user } = useAuth(); // 🔥 NEW: Get user with permissions

  // 🔥 NEW: Get user permission codes
  const userPermissionCodes = user?.permissions || [];
  
  // 🔥 NEW: Helper function to check if user has permission for a menu item
  const hasPermission = (permissionCode: string | undefined): boolean => {
    if (!permissionCode || permissionCode === '') return true; // No permission required = always visible
    return userPermissionCodes.includes(permissionCode);
  };

  // 🔥 NEW: Filter menu modules based on user permissions
  const visibleModules = mappaModules.filter(module => hasPermission(module.permissionCode));

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
              className={cn('w-full gap-2 cursor-pointer', collapsed ? 'px-0' : '')}
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
        {visibleModules.map((module) => { // 🔥 FIX: Use filtered modules instead of all modules
          const Icon = module.icon;
          
          // Special logic for active state
          let isActive = false;
          
          if (module.path === '/plans') {
            // "Kế hoạch tác nghiệp" menu cha KHÔNG active khi ở submenu
            isActive = false;
          } else if (module.path === '/tasks') {
            // "Phiên kiểm tra" KHÔNG active khi ở /plans/inspection-session
            isActive = location.pathname === '/tasks' && location.pathname !== '/plans/inspection-session';
          } else if ((module as any).hasSubmenu && (module as any).submenu) {
            // Lead-risk submenu
            isActive = location.pathname.startsWith('/lead-risk') || location.pathname === '/leads';
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
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                        <div className="font-medium">Danh sách kế hoạch</div>
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
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <ListChecks className="h-4 w-4 shrink-0" />
                        <span>Danh sách kế hoạch</span>
                      </div>
                    </Link>
                    
                    <Link to="/plans/inspection-rounds">
                      <div
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                          location.pathname === '/plans/inspection-rounds' || location.pathname.startsWith('/plans/inspection-rounds/')
                            ? 'text-primary bg-primary/5 font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
                      {module.label}
                    </div>
                    {(module as any).submenu.map((item: any) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            'cursor-pointer',
                            location.pathname === item.path && 'bg-primary/10 text-primary'
                          )}
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
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
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                    {(module as any).submenu.map((item: any) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'block px-3 py-2 rounded-lg text-sm transition-colors',
                          location.pathname === item.path
                            ? 'text-primary bg-primary/10 font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
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
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm">{module.label}</span>}
              </div>
            </Link>
          );
        })}
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