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
  { path: '/stores', label: 'Cơ sở & Địa bàn', icon: Building2 },
  { path: '/leads', label: 'Nguồn tin / Risk', icon: TriangleAlert },
  { path: '/plans', label: 'Kế hoạch tác nghiệp', icon: ClipboardList },
  { path: '/tasks', label: 'Nhiệm vụ hiện trường', icon: MapPin },
  { path: '/evidence', label: 'Kho chứng cứ', icon: FileBox },
  { path: '/reports', label: 'Báo cáo & KPI', icon: BarChart3 },
  { path: '/admin', label: 'Quản trị', icon: Settings },
];

export default function HorizontalNavBar({ mobileMenuOpen, onClose }: HorizontalNavBarProps) {
  const location = useLocation();
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
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex h-14 bg-card border-b border-border items-center px-6 gap-1">
        {/* Main MAPPA Modules */}
        {mappaModules.map((module) => {
          const Icon = module.icon;
          const isActive = location.pathname === module.path;
          
          return (
            <Link key={module.path} to={module.path}>
              <Button 
                variant="ghost" 
                className={cn(
                  "gap-2 h-9 text-sm font-medium",
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
            onClick={() => setLayoutMode('vertical')}
            title="Chuyển sang menu dọc"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>

          {/* Tạo nhanh - Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 h-9">
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
                const isActive = location.pathname === module.path;
                return (
                  <Link
                    key={module.path}
                    to={module.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1',
                      isActive
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
                    <a href="/stores/create" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left">
                      Thêm cơ sở
                    </a>
                  )}
                  
                  {userPermissions.canImportFacilityData && (
                    <a href="/stores/import" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left">
                      Nhập dữ liệu cơ sở
                    </a>
                  )}
                  
                  {userPermissions.canCreateRisk && (
                    <a href="/leads/create-risk" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left">
                      Tạo rủi ro
                    </a>
                  )}
                  
                  {userPermissions.canCreateFeedback && (
                    <a href="/leads/create-feedback" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left">
                      Tạo phản ánh
                    </a>
                  )}
                  
                  {userPermissions.canCreateInspectionPlan && (
                    <a href="/plans/create" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left">
                      Tạo kế hoạch kiểm tra
                    </a>
                  )}
                  
                  {userPermissions.canCreateInspectionRound && (
                    <a href="/plans/create-round" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left">
                      Tạo đợt kiểm tra
                    </a>
                  )}
                  
                  {userPermissions.canCreateInspectionSession && (
                    <a href="/tasks/create" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left">
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