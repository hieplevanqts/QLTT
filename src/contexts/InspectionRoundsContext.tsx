import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockInspectionRounds, type InspectionRound } from '../app/data/inspection-rounds-mock-data';

interface InspectionRoundsContextType {
  rounds: InspectionRound[];
  addRound: (round: InspectionRound) => void;
  updateRound: (id: string, round: Partial<InspectionRound>) => void;
  deleteRound: (id: string) => void;
  getRoundById: (id: string) => InspectionRound | undefined;
}

const InspectionRoundsContext = createContext<InspectionRoundsContextType | undefined>(undefined);

const STORAGE_KEY = 'mappa_inspection_rounds';
const STORAGE_VERSION = 'v2'; // Increment this when data structure changes
const VERSION_KEY = 'mappa_inspection_rounds_version';

export function InspectionRoundsProvider({ children }: { children: ReactNode }) {
  const [rounds, setRounds] = useState<InspectionRound[]>(() => {
    // Check version and clear if outdated
    try {
      const storedVersion = localStorage.getItem(VERSION_KEY);
      if (storedVersion !== STORAGE_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
        return mockInspectionRounds;
      }
    } catch (error) {
      console.error('Error checking version:', error);
    }

    // Load from localStorage first, fallback to mock data
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Validate data structure - check if it has old type values
        const hasOldType = parsedData.some((round: any) => 
          round.type === 'scheduled' || 
          round.type === 'unannounced' || 
          round.type === 'complaint'
        );
        if (hasOldType) {
          localStorage.removeItem(STORAGE_KEY);
          return mockInspectionRounds;
        }
        return parsedData;
      }
    } catch (error) {
      console.error('Error loading inspection rounds from localStorage:', error);
    }
    return mockInspectionRounds;
  });

  // Save to localStorage whenever rounds change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
    } catch (error) {
      console.error('Error saving inspection rounds to localStorage:', error);
    }
  }, [rounds]);

  const addRound = (round: InspectionRound) => {
    setRounds(prev => [round, ...prev]);
  };

  const updateRound = (id: string, updatedData: Partial<InspectionRound>) => {
    setRounds(prev => prev.map(round => 
      round.id === id ? { ...round, ...updatedData } : round
    ));
  };

  const deleteRound = (id: string) => {
    setRounds(prev => prev.filter(round => round.id !== id));
  };

  const getRoundById = (id: string) => {
    return rounds.find(round => round.id === id);
  };

  return (
    <InspectionRoundsContext.Provider value={{ rounds, addRound, updateRound, deleteRound, getRoundById }}>
      {children}
    </InspectionRoundsContext.Provider>
  );
}

export function useInspectionRounds() {
  const context = useContext(InspectionRoundsContext);
  if (!context) {
    throw new Error('useInspectionRounds must be used within InspectionRoundsProvider');
  }
  return context;
}