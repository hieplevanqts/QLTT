import React, { createContext, useContext, useState, useEffect } from 'react';

type LayoutMode = 'horizontal' | 'vertical';

interface LayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLayoutMode: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const LAYOUT_STORAGE_KEY = 'mappa-layout-mode';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return (saved === 'horizontal' || saved === 'vertical') ? saved : 'horizontal';
  });

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem(LAYOUT_STORAGE_KEY, mode);
  };

  const toggleLayoutMode = () => {
    const newMode = layoutMode === 'horizontal' ? 'vertical' : 'horizontal';
    setLayoutMode(newMode);
  };

  return (
    <LayoutContext.Provider value={{ layoutMode, setLayoutMode, toggleLayoutMode }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
