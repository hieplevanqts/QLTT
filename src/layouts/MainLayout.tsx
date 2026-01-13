import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { SessionTimeoutDialog } from '../app/components/auth/SessionTimeoutDialog';
import TopUtilityBar from './TopUtilityBar';
import HorizontalNavBar from './HorizontalNavBar';
import VerticalSidebar from './VerticalSidebar';
import { cn } from '../app/components/ui/utils';

export default function MainLayout() {
  const { layoutMode } = useLayout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SessionTimeoutDialog />
      {layoutMode === 'horizontal' ? (
        // Horizontal Layout
        <>
          <TopUtilityBar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <HorizontalNavBar
            mobileMenuOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
          <main className="flex-1">
            <Outlet />
          </main>
        </>
      ) : (
        // Vertical Layout
        <>
          <VerticalSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div
            className={cn(
              'transition-all duration-300',
              sidebarCollapsed ? 'ml-16' : 'ml-64'
            )}
          >
            <TopUtilityBar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
        </>
      )}
    </div>
  );
}