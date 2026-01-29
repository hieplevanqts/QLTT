import { Restaurant } from '../../../../data/restaurantData';

/**
 * Get color by category
 */
export function getCategoryColor(category: Restaurant['category']): string {
  switch (category) {
    case 'certified': return '#22c55e'; // green
    case 'hotspot': return '#ef4444'; // red
    case 'scheduled': return '#eab308'; // yellow
    case 'inspected': return '#005cb6'; // blue
    default: return '#005cb6';
  }
}

/**
 * Get category label (Vietnamese)
 */
export function getCategoryLabel(category: Restaurant['category']): string {
  switch (category) {
    case 'certified': return 'Chứng nhận ATTP';
    case 'hotspot': return 'Điểm nóng';
    case 'scheduled': return 'Kế hoạch kiểm tra';
    case 'inspected': return 'Đã kiểm tra';
    default: return category;
  }
}

