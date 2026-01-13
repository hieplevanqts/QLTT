/**
 * Export mock data to JSON format
 * Run this in browser console to get JSON data
 */

import { restaurants } from '../data/restaurantData';

export function exportToJSON() {
  const json = JSON.stringify(restaurants, null, 2);
  console.log('Total points:', restaurants.length);
  console.log('JSON data:', json);
  
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
  console.log('=== MAPPA MOCK DATA ===');
  console.log(`Total points: ${restaurants.length}`);
  console.log('\nCategories breakdown:');
  console.log('- Certified:', restaurants.filter(r => r.category === 'certified').length);
  console.log('- Hotspot:', restaurants.filter(r => r.category === 'hotspot').length);
  console.log('- Scheduled:', restaurants.filter(r => r.category === 'scheduled').length);
  console.log('- Inspected:', restaurants.filter(r => r.category === 'inspected').length);
  
  console.log('\nBusiness types:', [...new Set(restaurants.map(r => r.type))].length);
  console.log('Districts:', [...new Set(restaurants.map(r => r.district))].length);
  console.log('Wards:', [...new Set(restaurants.map(r => r.ward))].length);
  
  console.log('\n=== FULL JSON DATA ===');
  console.log(JSON.stringify(restaurants, null, 2));
  
  return restaurants;
}

// Auto export when imported in App
if (typeof window !== 'undefined') {
  (window as any).exportMockData = exportToJSON;
  (window as any).exportMockDataToConsole = exportToConsole;
  console.log('📦 Mock data export functions available:');
  console.log('- exportMockData() - Download JSON file');
  console.log('- exportMockDataToConsole() - Log to console');
}
