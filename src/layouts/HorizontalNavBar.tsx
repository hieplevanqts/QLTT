import React from 'react';
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
  DropdownMenuTrigger,
} from '../app/components/ui/dropdown-menu';
import { cn } from '../app/components/ui/utils';
import { useLayout } from '../contexts/LayoutContext';

interface HorizontalNavBarProps {
  mobileMenuOpen: boolean;
  onClose: () => void;
}

// MAPPA Main Modules
const mappaModules = [
  { path: '/overview', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/map', label: 'Bản đồ điều hành', icon: Map },
  { path: '/stores', label: 'Cơ sở quản lý', icon: Building2 },
  {
    path: '/leads',
    label: 'Nguồn tin',
    icon: TriangleAlert,
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
  { path: '/plans', label: 'Kế hoạch tác nghiệp', icon: ClipboardList, hasSubmenu: true },
  { path: '/tasks', label: 'Nhiệm vụ hiện trường', icon: MapPin },
  { path: '/evidence', label: 'Kho chứng cứ', icon: FileBox },
  { path: '/reports', label: 'Báo cáo, thống kê', icon: BarChart3 },
  { path: '/admin', label: 'Quản trị', icon: Settings },
];

export default function HorizontalNavBar({ mobileMenuOpen, onClose }: HorizontalNavBarProps) {
  const location = useLocation();
  const { setLayoutMode } = useLayout();
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = React.useState<string | null>(null);

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
        {mappaModules.map((module) => {
          const Icon = module.icon;
          
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
            // Lead-risk submenu
            isActive = location.pathname.startsWith('/lead-risk') || location.pathname === '/leads';
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
          
          // If module has submenu (for lead-risk), render dropdown
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
                <DropdownMenuContent align="start" className="w-56">
                  {(module as any).submenu.map((item: any) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link 
                        to={item.path}
                        className={cn(
                          "cursor-pointer",
                          location.pathname === item.path && "bg-primary/10 text-primary"
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
              {mappaModules.map((module) => {
                const Icon = module.icon;
                
                // Special logic for active state
                let isModuleActive = false;
                
                if (module.path === '/plans') {
                  // "Kế hoạch tác nghiệp" menu cha KHÔNG active khi ở submenu
                  isModuleActive = false;
                } else if (module.path === '/tasks') {
                  // "Phiên kiểm tra" KHÔNG active khi ở /plans/inspection-session
                  isModuleActive = location.pathname === '/tasks' && location.pathname !== '/plans/inspection-session';
                } else if ((module as any).hasSubmenu && (module as any).submenu) {
                  // Lead-risk submenu
                  isModuleActive = location.pathname.startsWith('/lead-risk') || location.pathname === '/leads';
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
                            <span>Danh sách kế hoạch</span>
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
                
                // If module has submenu (for lead-risk)
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
                          {(module as any).submenu.map((item: any) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={onClose}
                              className={cn(
                                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer',
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