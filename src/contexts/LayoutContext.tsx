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
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return 'horizontal';
    }
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
      return (saved === 'horizontal' || saved === 'vertical') ? saved : 'horizontal';
    } catch {
      return 'horizontal';
    }
  });

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LAYOUT_STORAGE_KEY, mode);
      } catch {
        // Ignore localStorage errors
      }
    }
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