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
import mappaLogo from '../assets/79505e63e97894ec2d06837c57cf53a19680f611.png';

// MAPPA Main Modules
const mappaModules = [
  { path: '/overview', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/map', label: 'Bản đồ điều hành', icon: Map },
  { path: '/stores', label: 'Cơ sở & Địa bàn', icon: Building2 },
  { path: '/leads', label: 'Nguồn tin / Risk', icon: TriangleAlert },
  { path: '/plans', label: 'Kế hoạch tác nghiệp', icon: ClipboardList },
  { path: '/tasks', label: 'Nhiệm vụ hiện trường', icon: MapPin },
  { path: '/evidence', label: 'Kho chứng cứ', icon: FileBox },
  { path: '/reports', label: 'Báo cáo & KPI', icon: BarChart3 },
  { path: '/admin', label: 'Quản trị', icon: Settings },
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
  const { setLayoutMode } = useLayout();

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
              className={cn('w-full gap-2', collapsed ? 'px-0' : '')}
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
                <a href="/plans/create" style={{ cursor: 'pointer' }}>
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

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {mappaModules.map((module) => {
          const Icon = module.icon;
          const isActive = location.pathname === module.path;

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
              className="flex-1"
              title="Menu dọc (đang chọn)"
            >
              <PanelTopClose className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex-1"
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
            className="w-full"
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