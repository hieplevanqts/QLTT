import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TvDataProvider } from '@/contexts/TvDataContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { TvSettings } from '@/types/tv.types';
import TvHeaderBar from '@/app/components/tv/TvHeaderBar';
import TvFiltersBar from '@/app/components/tv/TvFiltersBar';
import LiveMapPanel from '@/app/components/tv/LiveMapPanel';
import KpiGrid6 from '@/app/components/tv/KpiGrid6';
import TopTabsTable from '@/app/components/tv/TopTabsTable';
import CitizenReportsGallery from '@/app/components/tv/CitizenReportsGallery';
import AlertTicker from '@/app/components/tv/AlertTicker';
import EmergencyAlertBanner from '@/app/components/tv/EmergencyAlertBanner';

const DEFAULT_TV_SETTINGS: TvSettings = {
  autoPlayScenes: true,
  sceneIntervalSeconds: 25,
  showAlertTicker: true,
  showEmergencyBanner: true,
  showCitizenGallery: true,
};

function TvWallboardContent() {
  const navigate = useNavigate();
  const [settings, setSettings] = useLocalStorage<TvSettings>('tv-settings', DEFAULT_TV_SETTINGS);
  const [currentScene, setCurrentScene] = useState(1);

  const totalScenes = 5;
  const sceneInterval = Math.max(5, settings.sceneIntervalSeconds) * 1000;

  useEffect(() => {
    if (!settings.autoPlayScenes) return;

    const timer = setInterval(() => {
      setCurrentScene(prev => prev >= totalScenes ? 1 : prev + 1);
    }, sceneInterval);

    return () => clearInterval(timer);
  }, [settings.autoPlayScenes, settings.sceneIntervalSeconds, totalScenes]);

  const handleSceneChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentScene(prev => prev <= 1 ? totalScenes : prev - 1);
    } else {
      setCurrentScene(prev => prev >= totalScenes ? 1 : prev + 1);
    }
  };

  const handleSettingsChange = (updates: Partial<TvSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleExitTV = () => {
    navigate(-1);
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      // Silently fail - fullscreen may not be supported in iframe/preview environments
      // Don't log to console to avoid error messages in sandboxed environments
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ aspectRatio: '16/9' }}>
      <div className="max-w-[1920px] mx-auto h-screen flex flex-col relative">
        <TvHeaderBar 
          onExitTV={handleExitTV}
          onFullscreen={handleFullscreen}
          settings={settings}
          onSettingsChange={handleSettingsChange}
          currentScene={currentScene}
          totalScenes={totalScenes}
          onSceneChange={handleSceneChange}
        />

        <TvFiltersBar />

        <div className="flex-1 flex gap-3 p-4 overflow-hidden relative">
          <div className="w-[65%] flex flex-col gap-3">
            <LiveMapPanel scene={currentScene} />
          </div>

          <div className="w-[35%] flex flex-col overflow-y-auto" style={{ gap: '10px' }}>
            <KpiGrid6 scene={currentScene} />
            <TopTabsTable scene={currentScene} />
            {settings.showCitizenGallery && (
              <CitizenReportsGallery scene={currentScene} />
            )}
          </div>
        </div>

        {settings.showAlertTicker && <AlertTicker scene={currentScene} />}
        {settings.showEmergencyBanner && <EmergencyAlertBanner />}
      </div>
    </div>
  );
}

export default function TvWallboardPage() {
  return (
    <TvDataProvider>
      <TvWallboardContent />
    </TvDataProvider>
  );
}
