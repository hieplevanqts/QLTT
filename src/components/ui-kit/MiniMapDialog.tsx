import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import styles from './MiniMapDialog.module.css';

interface MiniMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  address: string;
  latitude: number;
  longitude: number;
}

export function MiniMapDialog({
  open,
  onOpenChange,
  storeName,
  address,
  latitude,
  longitude,
}: MiniMapDialogProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!open || !mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      // Check if Leaflet is available
      if (typeof window !== 'undefined' && (window as any).L) {
        const L = (window as any).L;
        
        // Create map
        const map = L.map(mapRef.current).setView([latitude, longitude], 16);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add marker
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(`<strong>${storeName}</strong><br/>${address}`).openPopup();

        mapInstanceRef.current = map;
      }
    } else {
      // Update view if coordinates changed
      mapInstanceRef.current.setView([latitude, longitude], 16);
      
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof (window as any).L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      
      // Add new marker
      const L = (window as any).L;
      const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
      marker.bindPopup(`<strong>${storeName}</strong><br/>${address}`).openPopup();
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [open, latitude, longitude, storeName, address]);

  // Load Leaflet CSS and JS dynamically
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <div className={styles.headerContent}>
            <div>
              <DialogTitle className={styles.title}>{storeName}</DialogTitle>
              <DialogDescription className={styles.description}>
                {address}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className={styles.closeButton}
            >
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className={styles.mapContainer}>
          <div ref={mapRef} className={styles.map} />
        </div>

        <div className={styles.footer}>
          <div className={styles.coordinates}>
            <span className={styles.coordLabel}>Tọa độ:</span>
            <span className={styles.coordValue}>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${latitude},${longitude}`,
                '_blank'
              );
            }}
          >
            Mở trên Google Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
