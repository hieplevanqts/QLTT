/**
 * Export mock data to JSON format
 * Run this in browser console to get JSON data
 */

import { restaurants } from '../data/restaurantData';

export function exportToJSON() {
  const json = JSON.stringify(restaurants, null, 2);
  
  // Create download link
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mappa-mock-data.json';
  link.click();
  URL.revokeObjectURL(url);
  
  return json;
}

export function exportToConsole() {
  
  
  
  return restaurants;
}

// Auto export when imported in App
if (typeof window !== 'undefined') {
  (window as any).exportMockData = exportToJSON;
  (window as any).exportMockDataToConsole = exportToConsole;
}
