import React, { useEffect, useRef } from 'react';
import styles from './MiniMapEmbed.module.css';

interface MiniMapEmbedProps {
  storeName: string;
  address: string;
  latitude: number;
  longitude: number;
  height?: string;
}

export function MiniMapEmbed({
  storeName,
  address,
  latitude,
  longitude,
  height = '400px',
}: MiniMapEmbedProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Wait for Leaflet to be available
    const initMap = () => {
      if (typeof window !== 'undefined' && (window as any).L && mapRef.current) {
        const L = (window as any).L;

        // Clear existing map if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Create map
        const map = L.map(mapRef.current).setView([latitude, longitude], 16);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add marker with custom icon
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(`<strong>${storeName}</strong><br/>${address}`).openPopup();

        mapInstanceRef.current = map;

        // Fix map rendering issue
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    };

    // Check if Leaflet is already loaded
    if ((window as any).L) {
      initMap();
    } else {
      // Wait for Leaflet to load
      const checkLeaflet = setInterval(() => {
        if ((window as any).L) {
          clearInterval(checkLeaflet);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkLeaflet);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, storeName, address]);

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
    <div className={styles.container}>
      <div ref={mapRef} className={styles.map} style={{ height }} />
      <div className={styles.footer}>
        <span className={styles.coordinates}>
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Mở trên Google Maps
        </a>
      </div>
    </div>
  );
}
