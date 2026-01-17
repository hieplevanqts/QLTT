import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect, useCallback } from 'react';
import {
  getMockData,
  filterByLocation,
  filterByTopic,
  filterByTimeRange,
  Hotspot,
  Lead,
  Task,
  Evidence,
} from '@/services/tvMockData';

// TV Data Context - v1.2 - Fixed infinite loops and Leaflet issues
// 5 địa bàn trọng điểm để auto-rotation
export const PRIORITY_LOCATIONS = [
  { code: 'HN', name: 'Hà Nội' },
  { code: 'NA', name: 'Nghệ An' },
  { code: 'DN', name: 'Đà Nẵng' },
  { code: 'HP', name: 'Hải Phòng' },
  { code: 'HCM', name: 'TP. Hồ Chí Minh' },
] as const;

export interface TvFilters {
  province?: string;
  district?: string;
  ward?: string;
  topic?: string;
  timeRangeDays: number;
}

export interface LayerToggles {
  hotspots: boolean;
  leads: boolean;
  tasks: boolean;
  evidences: boolean;
}

interface TvDataContextType {
  filters: TvFilters;
  setFilters: (filters: TvFilters) => void;
  layers: LayerToggles;
  setLayers: (layers: LayerToggles) => void;
  filteredHotspots: Hotspot[];
  filteredLeads: Lead[];
  filteredTasks: Task[];
  filteredEvidences: Evidence[];
  allData: {
    hotspots: Hotspot[];
    leads: Lead[];
    tasks: Task[];
    evidences: Evidence[];
  };
  // Auto-rotation
  autoRotationEnabled: boolean;
  setAutoRotationEnabled: (enabled: boolean) => void;
  currentLocationIndex: number;
  timeUntilNextRotation: number;
  goToNextLocation: () => void;
  goToPreviousLocation: () => void;
  selectLocation: (index: number) => void;
}

const TvDataContext = createContext<TvDataContextType | null>(null);

export function TvDataProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<TvFilters>({
    timeRangeDays: 7,
  });

  const [layers, setLayers] = useState<LayerToggles>({
    hotspots: true,
    leads: true,
    tasks: true,
    evidences: false,
  });

  const allData = useMemo(() => getMockData(), []);

  const filteredHotspots = useMemo(() => {
    let data = allData.hotspots;
    data = filterByLocation(data, filters.province, filters.district, filters.ward);
    data = filterByTopic(data, filters.topic);
    data = filterByTimeRange(data, filters.timeRangeDays);
    return data;
  }, [allData.hotspots, filters]);

  const filteredLeads = useMemo(() => {
    let data = allData.leads;
    data = filterByLocation(data, filters.province, filters.district, filters.ward);
    data = filterByTopic(data, filters.topic);
    data = filterByTimeRange(data, filters.timeRangeDays);
    return data;
  }, [allData.leads, filters]);

  const filteredTasks = useMemo(() => {
    let data = allData.tasks;
    data = filterByLocation(data, filters.province, filters.district, filters.ward);
    data = filterByTopic(data, filters.topic);
    data = filterByTimeRange(data, filters.timeRangeDays);
    return data;
  }, [allData.tasks, filters]);

  const filteredEvidences = useMemo(() => {
    let data = allData.evidences;
    data = filterByLocation(data, filters.province, filters.district, filters.ward);
    data = filterByTopic(data, filters.topic);
    data = filterByTimeRange(data, filters.timeRangeDays);
    return data;
  }, [allData.evidences, filters]);

  // Auto-rotation
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(false);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [timeUntilNextRotation, setTimeUntilNextRotation] = useState(20); // 20 seconds

  // Sync filters with current location when auto-rotation changes index
  useEffect(() => {
    if (autoRotationEnabled) {
      const location = PRIORITY_LOCATIONS[currentLocationIndex];
      setFilters(prev => ({
        ...prev,
        province: location.name,
        district: undefined,
        ward: undefined,
      }));
      setTimeUntilNextRotation(20); // Reset timer when changing location
    }
  }, [currentLocationIndex, autoRotationEnabled]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoRotationEnabled) {
      interval = setInterval(() => {
        setTimeUntilNextRotation((prev) => {
          if (prev <= 1) {
            // Time's up, move to next location
            setCurrentLocationIndex((prevIndex) => (prevIndex + 1) % PRIORITY_LOCATIONS.length);
            return 20; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRotationEnabled]);

  const goToNextLocation = useCallback(() => {
    setCurrentLocationIndex((prev) => (prev + 1) % PRIORITY_LOCATIONS.length);
  }, []);

  const goToPreviousLocation = useCallback(() => {
    setCurrentLocationIndex((prev) => (prev - 1 + PRIORITY_LOCATIONS.length) % PRIORITY_LOCATIONS.length);
  }, []);

  const selectLocation = useCallback((index: number) => {
    setCurrentLocationIndex(index);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      layers,
      setLayers,
      filteredHotspots,
      filteredLeads,
      filteredTasks,
      filteredEvidences,
      allData,
      // Auto-rotation
      autoRotationEnabled,
      setAutoRotationEnabled,
      currentLocationIndex,
      timeUntilNextRotation,
      goToNextLocation,
      goToPreviousLocation,
      selectLocation,
    }),
    [filters, layers, filteredHotspots, filteredLeads, filteredTasks, filteredEvidences, allData, autoRotationEnabled, currentLocationIndex, timeUntilNextRotation, goToNextLocation, goToPreviousLocation, selectLocation]
  );

  return (
    <TvDataContext.Provider value={value}>
      {children}
    </TvDataContext.Provider>
  );
}

export function useTvData() {
  const context = useContext(TvDataContext);
  if (!context) {
    // Return safe defaults when context not available
    // This prevents crashes during component initialization
    return {
      filters: { timeRangeDays: 7 },
      setFilters: () => {},
      layers: {
        hotspots: true,
        leads: true,
        tasks: true,
        evidences: false,
      },
      setLayers: () => {},
      filteredHotspots: [],
      filteredLeads: [],
      filteredTasks: [],
      filteredEvidences: [],
      allData: {
        hotspots: [],
        leads: [],
        tasks: [],
        evidences: [],
      },
      // Auto-rotation defaults
      autoRotationEnabled: false,
      setAutoRotationEnabled: () => {},
      currentLocationIndex: 0,
      timeUntilNextRotation: 20,
      goToNextLocation: () => {},
      goToPreviousLocation: () => {},
      selectLocation: () => {},
    };
  }
  return context;
}