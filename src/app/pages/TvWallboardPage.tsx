import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TvDataProvider } from '@/contexts/TvDataContext';
import TvHeaderBar from '@/app/components/tv/TvHeaderBar';
import TvFiltersBar from '@/app/components/tv/TvFiltersBar';
import LiveMapPanel from '@/app/components/tv/LiveMapPanel';
import KpiGrid6 from '@/app/components/tv/KpiGrid6';
import TopTabsTable from '@/app/components/tv/TopTabsTable';
import CitizenReportsGallery from '@/app/components/tv/CitizenReportsGallery';
import AlertTicker from '@/app/components/tv/AlertTicker';
import EmergencyAlertBanner from '@/app/components/tv/EmergencyAlertBanner';

function TvWallboardContent() {
  const navigate = useNavigate();
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentScene, setCurrentScene] = useState(1);

  const totalScenes = 5;
  const sceneInterval = 25000;

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentScene(prev => prev >= totalScenes ? 1 : prev + 1);
    }, sceneInterval);

    return () => clearInterval(timer);
  }, [autoPlay, totalScenes]);

  const handleSceneChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentScene(prev => prev <= 1 ? totalScenes : prev - 1);
    } else {
      setCurrentScene(prev => prev >= totalScenes ? 1 : prev + 1);
    }
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
        />

        <TvFiltersBar
          autoPlay={autoPlay}
          onAutoPlayChange={setAutoPlay}
          currentScene={currentScene}
          totalScenes={totalScenes}
          onSceneChange={handleSceneChange}
        />

        <div className="flex-1 flex gap-3 p-4 overflow-hidden relative">
          <div className="w-[65%] flex flex-col gap-3">
            <LiveMapPanel scene={currentScene} />
          </div>

          <div className="w-[35%] flex flex-col overflow-y-auto" style={{ gap: '10px' }}>
            <KpiGrid6 scene={currentScene} />
            <TopTabsTable scene={currentScene} />
            <CitizenReportsGallery scene={currentScene} />
          </div>
        </div>

        <AlertTicker scene={currentScene} />
        <EmergencyAlertBanner />
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