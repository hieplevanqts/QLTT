import React, { useEffect, useState, useRef } from 'react';
import { X, SlidersHorizontal, BarChart3 } from 'lucide-react';
import styles from './FullscreenMapModal.module.css';
import LeafletMap from './LeafletMap';
import { OfficerFilterPanel } from './OfficerFilterPanel';
import { OfficerStatsOverlay } from './OfficerStatsOverlay';

interface FullscreenOfficerMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId?: string;
  onTeamChange?: (teamId: string) => void;
  onWardClick?: (wardName: string, district: string) => void;
}

export function FullscreenOfficerMapModal({
  isOpen,
  onClose,
  selectedTeamId,
  onTeamChange,
  onWardClick
}: FullscreenOfficerMapModalProps) {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isStatsOverlayVisible, setIsStatsOverlayVisible] = useState(true);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterToggleBtnRef = useRef<HTMLButtonElement>(null);
  const statsOverlayRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle click outside filter panel - only close when clicking on map, not on other boxes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isFilterPanelOpen) return;

      const target = event.target as Node;
      
      // Don't close if clicking inside filter panel or its toggle button
      if (
        filterPanelRef.current?.contains(target) ||
        filterToggleBtnRef.current?.contains(target)
      ) {
        return;
      }

      // Don't close if clicking on other UI boxes
      if (
        statsOverlayRef.current?.contains(target)
      ) {
        return;
      }

      // Don't close if clicking on markers/points (they have data-marker attribute)
      const targetElement = event.target as HTMLElement;
      if (
        targetElement.closest('[class*="marker"]') ||
        targetElement.closest('[class*="point"]') ||
        targetElement.closest('.leaflet-marker-icon') ||
        targetElement.closest('.leaflet-popup')
      ) {
        return;
      }

      // Only close if clicking on map container or overlay
      if (
        mapContainerRef.current?.contains(target) ||
        (event.target as HTMLElement).classList.contains(styles.overlay) ||
        (event.target as HTMLElement).classList.contains(styles.mapWrapper)
      ) {
        setIsFilterPanelOpen(false);
      }
    };

    if (isFilterPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterPanelOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Close Button - Floating */}
        <button 
          className={styles.closeBtn} 
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        {/* Map Container */}
        <div className={styles.mapWrapper} ref={mapContainerRef}>
          {/* Officer Stats Overlay */}
          <div ref={statsOverlayRef}>
            <OfficerStatsOverlay
              selectedTeamId={selectedTeamId}
              isVisible={isStatsOverlayVisible}
              onClose={() => setIsStatsOverlayVisible(false)}
            />
          </div>

          <LeafletMap
            filters={{ certified: false, hotspot: false, scheduled: false, inspected: false }}
            businessTypeFilters={{}}
            searchQuery=""
            restaurants={[]}
            showWardBoundaries={true}
            showMerchants={false}
            selectedTeamId={selectedTeamId}
            onWardClick={onWardClick}
          />

          {/* OfficerFilterPanel - positioned inside mapWrapper */}
          <OfficerFilterPanel
            isOpen={isFilterPanelOpen}
            selectedTeamId={selectedTeamId}
            onClose={() => setIsFilterPanelOpen(false)}
            onTeamChange={(teamId) => {
              if (onTeamChange) {
                onTeamChange(teamId);
              }
            }}
            ref={filterPanelRef}
          />
        </div>

        {/* Toggle Buttons - positioned fixed on screen */}
        <div className={styles.filterPanelWrapper}>
          {/* Stats Toggle Button */}
          <button
            className={styles.statsToggleBtn}
            onClick={() => setIsStatsOverlayVisible(!isStatsOverlayVisible)}
            aria-label="Mở/Đóng thống kê cán bộ"
            title="Thống kê cán bộ quản lý"
          >
            <BarChart3 size={20} strokeWidth={2.5} />
          </button>

          {/* Filter Toggle Button */}
          <button
            className={styles.filterToggleBtn}
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            aria-label="Mở/Đóng bộ lọc cán bộ"
            ref={filterToggleBtnRef}
          >
            <SlidersHorizontal size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
