import React, { useState } from 'react';
import { Globe, Moon, Sun, Grid3x3, Bell, User, Menu, MessageSquare, LayoutGrid, LayoutList, Monitor, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from '@/components/header/GlobalSearch';
import { NotificationPanel } from '@/components/header/NotificationPanel';
import { FeedbackModal } from '@/components/header/FeedbackModal';
import { ScopeSelector } from '@/components/scope-selector/ScopeSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useLayout } from '../contexts/LayoutContext';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore';
import { usePermissions } from '@/modules/system-admin/_shared/usePermissions';
import { RootState } from '../store/rootReducer';
import { logout } from '../store/slices/authSlice';
import { logout as logoutApi } from '../utils/api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import mappaLogo from '../assets/79505e63e97894ec2d06837c57cf53a19680f611.png';

interface TopUtilityBarProps {
  onMobileMenuToggle: () => void;
}

export default function TopUtilityBar({ onMobileMenuToggle }: TopUtilityBarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Get user from Redux instead of AuthContext
  const { user } = useAppSelector((state: RootState) => state.auth);
  
  const { hasPermission } = usePermissions();
  const hasTvViewPermission = hasPermission('tv-wallboard.page.read');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const { layoutMode, toggleLayoutMode } = useLayout();

  const unreadNotificationCount = 3; // Mock data

  const handleLogoClick = () => {
    // Check if there's unsaved data (mock - in real app, this would check form state)
    const hasUnsavedData = false;
    
    if (hasUnsavedData) {
      if (window.confirm('Bạn có muốn rời trang không? Dữ liệu chưa lưu có thể bị mất.')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleLanguageChange = (lang: 'vi' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
    // TODO: Implement i18n language switching
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    // TODO: Implement theme switching
  };

  const handleLogout = async () => {
    try {
      // Clear token from storage using Redux logout API
      await logoutApi();
      
      // Dispatch Redux logout action to clear auth state
      dispatch(logout());
      
      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even on error, clear Redux state and redirect
      dispatch(logout());
      window.location.href = '/auth/login';
    }
  };

  return (
    <>
      <div className="h-16 bg-card border-b border-border flex items-center px-4 md:px-6 gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo - Mappa (only show in horizontal mode) */}
        {layoutMode === 'horizontal' && (
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 cursor-pointer"
            title="Về trang Tổng quan"
          >
            <img src={mappaLogo} alt="Mappa Logo" className="w-10 h-10 object-contain flex-shrink-0" />
            <div className="hidden lg:flex items-center gap-3 min-w-0">
              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground whitespace-nowrap">
                    Xin chào, {user?.name || 'Người dùng'}
                  </span>
                  {/* Online Status Indicator */}
                  <span 
                    className="relative flex h-3 w-3 flex-shrink-0"
                    title="Đang hoạt động"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {user?.roleDisplay || user?.name || 'Phần mềm Quản lý thị trường'}
                </span>
              </div>
              {/* Scope Selector - Active at Hà Nội by default */}
              <ScopeSelector />
            </div>
            <span className="hidden md:block lg:hidden font-semibold text-foreground whitespace-nowrap">MAPPA</span>
          </button>
        )}

        {/* Global Search - Centered */}
        <div className="hidden md:flex flex-1 max-w-[360px] mx-auto">
          <GlobalSearch />
        </div>

        {/* Right Side Icons */}
        <div className="ml-auto flex items-center gap-1">
          {/* Language Switch */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 h-9 cursor-pointer hover:!bg-transparent hover:!text-foreground"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  {language === 'vi' ? 'VI' : 'EN'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('vi')}>
                <span className="flex items-center gap-2">
                  Tiếng Việt {language === 'vi' && '✓'}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                <span className="flex items-center gap-2">
                  English {language === 'en' && '✓'}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* TV Mode - Only show if user has tv-wallboard.page.read permission */}
          {hasTvViewPermission && (
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-transparent"
              onClick={() => navigate('/tv')}
              title="Chế độ TV"
            >
              <Monitor className="h-5 w-5" style={{ color: '#005cb6' }} />
            </Button>
          )}

          {/* Feedback Button */}
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-transparent"
            onClick={() => {
              setShowFeedback(!showFeedback);
              setShowNotifications(false);
            }}
            title="Gửi phản hồi"
          >
            <MessageSquare className="h-5 w-5" style={{ color: '#005cb6' }} />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer hover:bg-transparent"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowFeedback(false);
            }}
            title="Thông báo"
          >
            <Bell className="h-5 w-5" style={{ color: '#005cb6' }} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            )}
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2 cursor-pointer hover:bg-transparent" size="sm">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary to-chart-2">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary to-chart-2 flex-shrink-0">
                    <User className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">
                        {user?.name || user?.email || 'Người dùng'}
                      </span>
                      {/* Online Status Indicator */}
                      <span 
                        className="relative flex h-2.5 w-2.5 flex-shrink-0"
                        title="Đang hoạt động"
                      >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                    </div>
                    <div className="text-xs font-normal text-muted-foreground mt-0.5 truncate">
                      {user?.email || 'Chức vụ'}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/account/profile" style={{ cursor: 'pointer' }}>
                  Hồ sơ cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account/change-password" style={{ cursor: 'pointer' }}>
                  Đổi mật khẩu
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}

      {/* Help Panel */}
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
    </>
  );
}
