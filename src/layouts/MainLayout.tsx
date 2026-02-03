import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import TopUtilityBar from './TopUtilityBar';
import HorizontalNavBar from './HorizontalNavBar';
import VerticalSidebar from './VerticalSidebar';
import { cn } from '@/components/ui/utils';
import AppFooter from '@/components/layout/AppFooter';

// Inline page loader for route transitions
function InlinePageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: 'transparent',
    }}>
      <div style={{
        textAlign: 'center',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px',
        }} />
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
        }}>
          Đang tải...
        </p>
      </div>
    </div>
  );
}

export default function MainLayout() {
  const { layoutMode } = useLayout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {layoutMode === 'horizontal' ? (
        // Horizontal Layout
        <div className="min-h-screen flex flex-col">
          <TopUtilityBar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <HorizontalNavBar
            mobileMenuOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
          <main className="flex-1">
            <Suspense fallback={<InlinePageLoader />}>
              <Outlet />
            </Suspense>
          </main>
          <AppFooter />
        </div>
      ) : (
        // Vertical Layout
        <>
          <VerticalSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div
            className={cn(
              'transition-all duration-300 min-h-screen flex flex-col',
              sidebarCollapsed ? 'ml-16' : 'ml-64'
            )}
          >
            <TopUtilityBar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
            <main className="flex-1">
              <Suspense fallback={<InlinePageLoader />}>
                <Outlet />
              </Suspense>
            </main>
            <AppFooter />
          </div>
        </>
      )}
    </div>
  );
}
