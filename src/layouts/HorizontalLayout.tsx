import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopUtilityBar from './TopUtilityBar';
import HorizontalNavBar from './HorizontalNavBar';
import PageHeader from './PageHeader';

export default function HorizontalLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Utility Bar */}
      <TopUtilityBar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      {/* Horizontal Navigation */}
      <HorizontalNavBar mobileMenuOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
