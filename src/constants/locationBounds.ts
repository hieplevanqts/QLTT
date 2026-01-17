// Tọa độ chuẩn cho các địa bàn chính Việt Nam

export interface LocationBounds {
  center: [number, number]; // [lat, lng]
  bounds?: [[number, number], [number, number]]; // [[minLat, minLng], [maxLat, maxLng]]
  zoom?: number;
}

export const LOCATION_BOUNDS: Record<string, LocationBounds> = {
  'Toàn quốc': {
    center: [16.0, 108.0],
    zoom: 5,
    bounds: [[8.0, 102.0], [23.5, 110.0]],
  },
  'Hà Nội': {
    center: [21.0278, 105.8342],
    bounds: [[20.90, 105.70], [21.15, 106.05]],
  },
  'TP.HCM': {
    center: [10.7769, 106.7009],
    bounds: [[10.65, 106.50], [10.90, 106.90]],
  },
  'Đà Nẵng': {
    center: [16.0544, 108.2022],
    bounds: [[15.95, 108.05], [16.15, 108.35]],
  },
  'Hải Phòng': {
    center: [20.8449, 106.6881],
    bounds: [[20.70, 106.45], [20.95, 106.85]],
  },
  'Cần Thơ': {
    center: [10.0452, 105.7469],
    bounds: [[9.90, 105.55], [10.20, 105.90]],
  },
  'Bình Dương': {
    center: [11.3254, 106.4770],
    bounds: [[11.00, 106.20], [11.55, 106.80]],
  },
  'Đồng Nai': {
    center: [10.9574, 106.8427],
    bounds: [[10.70, 106.60], [11.20, 107.10]],
  },
  'Long An': {
    center: [10.6956, 106.2431],
    bounds: [[10.40, 105.95], [10.95, 106.55]],
  },
  'Bà Rịa-Vũng Tàu': {
    center: [10.5417, 107.2429],
    bounds: [[10.20, 106.90], [10.85, 107.55]],
  },
  'Khánh Hòa': {
    center: [12.2388, 109.1967],
    bounds: [[11.75, 108.80], [12.70, 109.55]],
  },
};

// Helper function to get random coords within bounds
export function getRandomCoordsInBounds(province: string): { lat: number; lng: number } {
  const location = LOCATION_BOUNDS[province];
  
  if (!location || !location.bounds) {
    // Fallback to center with small jitter
    const center = location?.center || [16.0, 108.0];
    return {
      lat: center[0] + (Math.random() - 0.5) * 0.2,
      lng: center[1] + (Math.random() - 0.5) * 0.2,
    };
  }

  const [[minLat, minLng], [maxLat, maxLng]] = location.bounds;
  
  return {
    lat: minLat + Math.random() * (maxLat - minLat),
    lng: minLng + Math.random() * (maxLng - minLng),
  };
}

// Helper function to calculate bounds from data points
export function calculateBoundsFromPoints(points: Array<{ lat: number; lng: number }>): [[number, number], [number, number]] | null {
  if (points.length === 0) return null;

  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  points.forEach(point => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  });

  // Add padding
  const latPadding = (maxLat - minLat) * 0.1 || 0.1;
  const lngPadding = (maxLng - minLng) * 0.1 || 0.1;

  return [
    [minLat - latPadding, minLng - lngPadding],
    [maxLat + latPadding, maxLng + lngPadding],
  ];
}
