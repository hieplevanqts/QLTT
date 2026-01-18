import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect, useCallback } from 'react';
import { FEATURES } from '@/config/features';
import type { LayerToggles, TvFilters } from '@/types/tv.types';
import {
  DEFAULT_TOPICS,
  getMockData,
  filterByLocation,
  filterByTopic,
  filterByTimeRange,
  Hotspot,
  Lead,
  Task,
  Evidence,
} from '@/services/tvMockData';
import { fetchTvData, fetchTvTopics } from '@/services/tvSupabase.service';

// TV Data Context - v1.2 - Fixed infinite loops and Leaflet issues
// 5 địa bàn trọng điểm để auto-rotation
export const PRIORITY_LOCATIONS = [
  { code: 'HN', name: 'Hà Nội' },
  { code: 'NA', name: 'Nghệ An' },
  { code: 'DN', name: 'Đà Nẵng' },
  { code: 'HP', name: 'Hải Phòng' },
  { code: 'HCM', name: 'TP. Hồ Chí Minh' },
] as const;

interface TvDataContextType {
  filters: TvFilters;
  setFilters: (filters: TvFilters) => void;
  layers: LayerToggles;
  setLayers: (layers: LayerToggles) => void;
  topics: string[];
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

  const [topics, setTopics] = useState<string[]>(DEFAULT_TOPICS);
  const [allData, setAllData] = useState(() => getMockData());

  useEffect(() => {
    if (!FEATURES.USE_TV_SUPABASE) {
      setAllData(getMockData());
      setTopics(DEFAULT_TOPICS);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const [tvData, tvTopics] = await Promise.all([
          fetchTvData(filters),
          fetchTvTopics(),
        ]);

        if (cancelled) return;

        if (tvData) {
          setAllData(tvData);
        }

        if (tvTopics.length > 0) {
          setTopics(tvTopics);
        } else {
          setTopics(DEFAULT_TOPICS);
        }
      } catch (error) {
        console.warn('[TvDataContext] Supabase fetch failed, using mock data.', error);
        if (!cancelled) {
          setAllData(getMockData());
          setTopics(DEFAULT_TOPICS);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [filters, FEATURES.USE_TV_SUPABASE]);

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
      topics,
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
    [filters, layers, topics, filteredHotspots, filteredLeads, filteredTasks, filteredEvidences, allData, autoRotationEnabled, currentLocationIndex, timeUntilNextRotation, goToNextLocation, goToPreviousLocation, selectLocation]
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
      topics: DEFAULT_TOPICS,
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
