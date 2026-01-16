import React, { useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Maximize2 } from 'lucide-react';
import styles from './LeafletMap.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { districtBoundaries } from '../../../data/districtBoundaries';
import { getWardByName, wardBoundariesData, WardBoundary } from '../../../data/wardBoundaries';
import { generateWardColorMap } from '../../../utils/colorUtils';
import { teamsData, Team } from '../../../data/officerTeamData';

type CategoryFilter = {
  certified: boolean;
  hotspot: boolean;
  scheduled: boolean;
  inspected: boolean;
};

interface LeafletMapProps {
  filters: CategoryFilter;
  businessTypeFilters?: { [key: string]: boolean };
  searchQuery: string;
  selectedRestaurant?: Restaurant | null;
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  restaurants?: Restaurant[]; // Add restaurants prop
  showWardBoundaries?: boolean; // 🔥 NEW: Show ward boundaries instead of points
  showMerchants?: boolean; // 🔥 NEW: Show merchants layer
  selectedTeamId?: string; // 🔥 NEW: Selected team ID for officers layer
  onPointClick?: (point: Restaurant) => void;
  onWardClick?: (wardName: string, district: string) => void; // 🔥 NEW: Ward click handler
  onFullscreenClick?: () => void;
}

// SVG icons cho từng loại hình kinh doanh
const businessIcons: { [key: string]: string } = {
  // Ăn uống
  'Nhà hàng': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
  'Quán cà phê': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>',
  'Quán ăn nhanh': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/></svg>',
  'Quán phở': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/></svg>',
  'Quán bún': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/></svg>',
  'Buffet': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></svg>',
  'Quán lẩu': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/></svg>',
  'Bánh mì': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z"/><path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.32l.87 2.87L4 11.01Z"/><path d="m6.6 13.4 3.4 3.4"/><path d="m10.6 13.4-3.4 3.4"/></svg>',
  
  // Y tế
  'Bệnh viện': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/></svg>',
  'Phòng khám': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>',
  'Nhà thuốc': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
  'Phòng xét nghiệm': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17v5"/><path d="M17 17v5"/><path d="M17 7 7 17"/><path d="M5 17h14"/></svg>',
  
  // Giáo dục
  'Trường học': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  'Trung tâm đào tạo': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>',
  'Thư viện': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  'Nhà trẻ': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v2"/></svg>',
  
  // Thương mại
  'Siêu thị': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  'Cửa hàng tiện lợi': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><path d="M9 22V12h6v10"/></svg>',
  'Shop thời trang': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  'Cửa hàng điện tử': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
  'Chợ': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>',
  
  // Dịch vụ cá nhân
  'Salon tóc': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/></svg>',
  'Spa & Massage': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>',
  'Giặt ủi': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h3"/><path d="M17 6h.01"/><rect width="18" height="20" x="3" y="2" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5"/></svg>',
  'Thẩm mỹ viện': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  
  // Giải trí
  'Rạp phim': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>',
  'Karaoke': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>',
  'Phòng gym': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg>',
  'Billiards': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>',
  'Game center': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>',
  
  // Tài chính
  'Ngân hàng': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',
  'ATM': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
  'Cửa hàng vàng': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  'Bảo hiểm': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>',
  
  // Công nghệ
  'Cửa hàng điện thoại': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
  'Sửa chữa máy tính': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="4" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
  'Cửa hàng máy ảnh': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
  
  // Giao thông
  'Trạm xăng': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h12"/><path d="M4 9h10"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>',
  'Garage sửa xe': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4"/><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7"/><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2"/><path d="m2 2 20 20"/><path d="M12 12v-2"/></svg>',
  'Rửa xe': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>',
  
  // Khác
  'Khách sạn': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/><path d="M10 22v-6.5m4 0V22"/></svg>',
  'Văn phòng cho thuê': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
  'Kho bãi': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  'Bưu điện': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  'In ấn': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>',
};

// Get icon SVG by business type
function getBusinessIcon(type: string): string {
  return businessIcons[type] || businessIcons['Nhà hàng'];
}

// Wrap icon SVG with dynamic sizing
function getBusinessIconWithSize(type: string, size: number): string {
  const iconSvg = getBusinessIcon(type);
  // Remove fixed width/height attributes and wrap in a container with the dynamic size
  const svgWithoutSize = iconSvg.replace(/width="\d+"/, `width="${size}"`).replace(/height="\d+"/, `height="${size}"`);
  return svgWithoutSize;
}

// Get color by category
function getCategoryColor(category: Restaurant['category']): string {
  switch (category) {
    case 'certified': return '#22c55e'; // green
    case 'hotspot': return '#ef4444'; // red
    case 'scheduled': return '#eab308'; // yellow
    case 'inspected': return '#005cb6'; // blue
    default: return '#005cb6';
  }
}

function getCategoryLabel(category: Restaurant['category']) {
  switch (category) {
    case 'certified': return 'Chứng nhận ATTP';
    case 'hotspot': return 'Điểm nóng';
    case 'scheduled': return 'Kế hoạch kiểm tra';
    case 'inspected': return 'Đã kiểm tra';
    default: return category;
  }
}

export function LeafletMap({ filters, businessTypeFilters, searchQuery, selectedRestaurant, selectedProvince, selectedDistrict, selectedWard, restaurants = [], showWardBoundaries = false, showMerchants = false, selectedTeamId, onPointClick, onWardClick, onFullscreenClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectedMarkerRef = useRef<any>(null);
  const boundaryLayerRef = useRef<any>(null); // Track boundary layer
  const boundaryHighlightRef = useRef<any>(null); // Track highlight boundary
  const wardBoundariesLayerRef = useRef<any[]>([]); // 🔥 Track ward boundaries polygons
  const previousSearchQueryRef = useRef<string>('');
  const previousDistrictRef = useRef<string>(''); // Track previous district
  const previousWardRef = useRef<string>(''); // Track previous ward
  const currentZoomRef = useRef<number>(12);
  const userInteractedRef = useRef<boolean>(false); // Track if user manually zoomed/panned
  const previousSelectedRestaurantIdRef = useRef<string | null>(null); // Track selected restaurant changes
  const updateMarkersRef = useRef<(() => void) | null>(null); // 🔥 NEW: Ref to hold updateMarkers function
  const previousShowMerchantsRef = useRef<boolean>(false); // Track previous showMerchants state

  // Calculate marker size - fixed, no scaling
  const getMarkerSize = (zoom: number) => {
    const baseSize = 15; // Compact fixed size
    return baseSize; // No scaling with zoom
  };

  // Get icon size for current zoom
  const getIconSize = (zoom: number) => {
    const markerSize = getMarkerSize(zoom);
    // Icon should be ~55% of marker size for better proportions
    return Math.round(markerSize * 0.55);
  };

  // 🔥 NEW LOGIC: LeafletMap receives PRE-FILTERED restaurants from MapPage
  // MapPage handles ALL filtering (status, business type, location, search)
  // LeafletMap just renders the markers for whatever restaurants it receives
  const filteredRestaurants = useMemo(() => {
    console.log('🗺️ LeafletMap: Received', restaurants?.length || 0, 'pre-filtered restaurants from MapPage');
    
    if (!restaurants || restaurants.length === 0) {
      console.warn('⚠️ LeafletMap: No restaurants to display');
      return [];
    }
    
    // Just return what we received - filtering is done in MapPage
    console.log('✅ LeafletMap: Rendering', restaurants.length, 'restaurants on map');
    return restaurants;
  }, [restaurants]);

  // Function to update markers
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;

    const L = leafletRef.current;
    const currentZoom = currentZoomRef.current;
    const markerSize = getMarkerSize(currentZoom);
    const iconSize = getIconSize(currentZoom);

    // Remove old markers
    console.log('🗑️  [UPDATE] Removing', markersRef.current.length, 'old markers');
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    selectedMarkerRef.current = null;
    console.log('✅ [UPDATE] Old markers removed');

    // 🔥 NEW: If showWardBoundaries is true, render team markers instead of polygons
    if (showWardBoundaries) {
      console.log('👮 LeafletMap: Rendering team markers for officers...');
      
      // Remove old ward boundaries (polygons)
      wardBoundariesLayerRef.current.forEach(polygon => polygon.remove());
      wardBoundariesLayerRef.current = [];
      
      // Filter teams if selectedTeamId is provided
      const teamsToRender = selectedTeamId 
        ? teamsData.filter(t => t.id === selectedTeamId)
        : teamsData;
      
      // Calculate center position for each team based on their managed wards
      teamsToRender.forEach((team) => {
        // Find center coordinates for all wards managed by this team
        const teamWardCenters: [number, number][] = [];
        
        team.managedWards.forEach((ward) => {
          // Find ward boundary data to get center coordinates
          const wardBoundary = wardBoundariesData.find(
            w => w.name === ward.name && w.district === ward.district
          );
          
          if (wardBoundary && wardBoundary.center) {
            teamWardCenters.push(wardBoundary.center);
          } else {
            // Fallback: try to find district center from districtBoundaries
            // This is a fallback if ward boundary data is not available
            const districtData = districtBoundaries[ward.district];
            if (districtData && districtData.center) {
              teamWardCenters.push(districtData.center);
            }
          }
        });
        
        if (teamWardCenters.length === 0) return;
        
        // Calculate average center position for the team
        const avgLat = teamWardCenters.reduce((sum, [lat]) => sum + lat, 0) / teamWardCenters.length;
        const avgLng = teamWardCenters.reduce((sum, [, lng]) => sum + lng, 0) / teamWardCenters.length;
        const teamCenter: [number, number] = [avgLat, avgLng];
        
        // Create team icon (SVG - person/group icon)
        const teamIconSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005cb6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        `;
        
        // Create custom icon for team
        const teamIcon = L.divIcon({
          html: `
            <div style="
              background: white;
              border-radius: 50%;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.25);
              border: 2px solid #005cb6;
            ">
              ${teamIconSvg}
            </div>
          `,
          className: 'team-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        
        // Create marker for team
        const teamMarker = L.marker(teamCenter, { icon: teamIcon });
        
        // Create tooltip content with team information
        const teamLeader = team.officers.find(o => o.isTeamLeader) || team.officers[0];
        const tooltipContent = `
          <div style="
            font-family: 'Inter', sans-serif;
            max-width: 300px;
            padding: 8px;
          ">
            <div style="
              font-weight: 600;
              font-size: 14px;
              color: #005cb6;
              margin-bottom: 8px;
              border-bottom: 2px solid #005cb6;
              padding-bottom: 4px;
            ">
              ${team.name}
            </div>
            <div style="font-size: 12px; margin-bottom: 6px;">
              <strong>Đội trưởng:</strong> ${teamLeader.fullName}
            </div>
            <div style="font-size: 12px; margin-bottom: 6px;">
              <strong>Số cán bộ:</strong> ${team.officers.length}
            </div>
            <div style="font-size: 12px; margin-bottom: 6px;">
              <strong>Địa bàn phụ trách:</strong> ${team.managedWards.length} phường/xã
            </div>
            <div style="font-size: 11px; color: #666; margin-top: 8px; max-height: 120px; overflow-y: auto;">
              <strong>Danh sách cán bộ:</strong><br/>
              ${team.officers.map(o => 
                `• ${o.fullName} ${o.isTeamLeader ? '(Đội trưởng)' : ''}`
              ).join('<br/>')}
            </div>
          </div>
        `;
        
        // Add tooltip on hover
        teamMarker.bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'top',
          className: 'team-tooltip',
          offset: [0, -10],
        });
        
        // Add click handler
        teamMarker.on('click', () => {
          if (onWardClick && team.managedWards.length > 0) {
            const firstWard = team.managedWards[0];
            onWardClick(firstWard.name, firstWard.district);
          }
        });
        
        teamMarker.addTo(mapInstanceRef.current);
        markersRef.current.push(teamMarker);
      });
      
      console.log('✅ Rendered', markersRef.current.length, 'team markers');
      return; // Exit early - don't render restaurant markers
    }

    console.log('🗺️ LeafletMap: Updating markers...');
    console.log('📊 Total restaurants to render:', filteredRestaurants.length);
    
    // Check for valid coordinates
    const validRestaurants = filteredRestaurants.filter(r => {
      const isValid = r.lat !== 0 && r.lng !== 0 && !isNaN(r.lat) && !isNaN(r.lng);
      if (!isValid) {
        console.warn('⚠️ Invalid restaurant coordinates:', { id: r.id, name: r.name, lat: r.lat, lng: r.lng });
      }
      return isValid;
    });
    
    console.log('✅ Valid restaurants with coordinates:', validRestaurants.length);
    
    if (validRestaurants.length > 0) {
      console.log('📍 First valid restaurant:', { 
        id: validRestaurants[0].id, 
        name: validRestaurants[0].name,
        lat: validRestaurants[0].lat,
        lng: validRestaurants[0].lng,
        type: validRestaurants[0].type,
        category: validRestaurants[0].category,
        status: validRestaurants[0].status
      });
    }

    // Add new markers
    let markersAdded = 0;
    filteredRestaurants.forEach((restaurant, index) => {
      // Skip invalid coordinates
      if (restaurant.lat === 0 || restaurant.lng === 0 || isNaN(restaurant.lat) || isNaN(restaurant.lng)) {
        return;
      }
      
      if (index === 0) {
        console.log('🎯 Creating first marker at:', [restaurant.lat, restaurant.lng]);
        console.log('🎨 First marker category:', restaurant.category);
        console.log('🎨 First marker status (DB):', restaurant.status);
      }
      const iconSvg = getBusinessIcon(restaurant.type);
      const color = getCategoryColor(restaurant.category);
      
      if (index === 0) {
        console.log('🎨 First marker color from getCategoryColor():', color);
      }
      
      // Check if restaurant has citizen reports
      const hasCitizenReports = restaurant.citizenReports && restaurant.citizenReports.length > 0;
      const reportCount = hasCitizenReports ? restaurant.citizenReports.length : 0;
      
      // Create darker shade for subtle border effect
      const darkerColor = color === '#22c55e' ? '#16a34a' : 
                         color === '#ef4444' ? '#dc2626' : 
                         color === '#eab308' ? '#ca8a04' : 
                         color === '#005cb6' ? '#004a94' : color;
      
      // Calculate proportional values
      const highlightHeight = Math.round(markerSize * 0.3);
      const highlightTop = Math.round(markerSize * 0.08);
      
      // Add pulse ring and alert icon for markers with citizen reports
      const alertElements = hasCitizenReports ? '<div class="alert-pulse-ring"></div>' : '';
      
      const iconHtml = `
       <div class="marker-wrapper" style="
          width: ${markerSize}px;
          height: ${markerSize}px;
          background: linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.15),
            0 4px 16px rgba(0, 0, 0, 0.1),
            inset 0 -1px 2px rgba(0, 0, 0, 0.1);
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        ">
          ${alertElements}
          <div style="
            position: absolute;
            top: ${highlightTop}px;
            left: ${highlightTop}px;
            right: ${highlightTop}px;
            height: ${highlightHeight}px;
            background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%);
            border-radius: 50% 50% 0 0;
            pointer-events: none;
          "></div>
          <div style="
            transform: rotate(45deg);
            position: relative;
            z-index: 1;
          ">
            ${getBusinessIconWithSize(restaurant.type, iconSize)}
          </div>
        </div>
      `;
      
      const customIcon = L.divIcon({
        html: iconHtml,
        className: hasCitizenReports ? 'custom-marker-icon has-citizen-reports' : 'custom-marker-icon',
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize],
        popupAnchor: [0, -markerSize]
      });

      const marker = L.marker([restaurant.lat, restaurant.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="leaflet-popup-custom" style="font-family: 'Inter', sans-serif; min-width: 260px;">
            <!-- Category Badge -->
            <div style="
              position: relative;
              margin: -12px -12px 0 -12px;
              padding: 12px 16px;
              background: linear-gradient(135deg, ${color} 0%, ${color}ee 100%);
              color: white;
              border-radius: 8px 8px 0 0;
            ">
              <div style="
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                opacity: 0.9;
                margin-bottom: 4px;
              ">${getCategoryLabel(restaurant.category)}</div>
              <div style="
                font-size: 15px;
                font-weight: 700;
                line-height: 1.3;
                color: white;
              ">${restaurant.name}</div>
            </div>
            
            <!-- Content -->
            <div style="padding: 16px 0 12px 0;">
              <!-- ID Badge -->
              <div style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: #f3f4f6;
                border-radius: 6px;
                margin-bottom: 14px;
              ">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span style="
                  font-size: 11px;
                  font-weight: 600;
                  color: #374151;
                  letter-spacing: 0.3px;
                ">${restaurant.id}</span>
              </div>
              
              <!-- Info Items -->
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; gap: 10px;">
                  <div style="
                    width: 28px;
                    height: 28px;
                    flex-shrink: 0;
                    background: #eff6ff;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005cb6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                      <path d="M7 2v20"/>
                      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                    </svg>
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="
                      font-size: 10px;
                      font-weight: 600;
                      color: #6b7280;
                      text-transform: uppercase;
                      letter-spacing: 0.4px;
                      margin-bottom: 3px;
                    ">Loại hình</div>
                    <div style="
                      font-size: 13px;
                      font-weight: 500;
                      color: #111827;
                      line-height: 1.3;
                    ">${restaurant.type}</div>
                  </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                  <div style="
                    width: 28px;
                    height: 28px;
                    flex-shrink: 0;
                    background: #fef3f2;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="
                      font-size: 10px;
                      font-weight: 600;
                      color: #6b7280;
                      text-transform: uppercase;
                      letter-spacing: 0.4px;
                      margin-bottom: 3px;
                    ">Địa chỉ</div>
                    <div style="
                      font-size: 13px;
                      font-weight: 400;
                      color: #374151;
                      line-height: 1.4;
                    ">${restaurant.address}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action Button -->
            <div style="
              padding: 12px 0 0 0;
              border-top: 1px solid #e5e7eb;
            ">
              <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
              ">
                <button 
                  onclick="window.openPointReview('${restaurant.id}')"
                  style="
                    padding: 10px 14px;
                    background: white;
                    color: ${color};
                    border: 1px solid ${color};
                    border-radius: 8px;
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                  "
                  onmouseover="this.style.background='${color}'; this.style.color='white'"
                  onmouseout="this.style.background='white'; this.style.color='${color}'"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Đánh giá
                </button>
                
                <button 
                  onclick="window.openPointDetail('${restaurant.id}')"
                  style="
                    padding: 10px 14px;
                    background: ${color};
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                  "
                  onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'"
                  onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        `, {
          maxWidth: 320,
          className: 'custom-leaflet-popup'
        });

      markersRef.current.push(marker);
      
      // Store reference if this is the selected restaurant
      if (selectedRestaurant && restaurant.id === selectedRestaurant.id) {
        selectedMarkerRef.current = marker;
      }
      
      markersAdded++;
    });
    
    console.log('✅ [UPDATE] Successfully added', markersAdded, 'markers to map');
    console.log('📊 [UPDATE] Total markers in markersRef:', markersRef.current.length);
  }, [filteredRestaurants, selectedRestaurant, onPointClick, showWardBoundaries]);

  // 🔥 Store updateMarkers in ref for map init to use
  useEffect(() => {
    updateMarkersRef.current = updateMarkers;
  }, [updateMarkers]);

  // Handle auto-zoom (separate from marker rendering)
  const handleAutoZoom = useCallback(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    if (userInteractedRef.current) return; // Don't auto-zoom if user has manually interacted
    
    const L = leafletRef.current;
    
    // Check if search query changed
    const searchQueryChanged = previousSearchQueryRef.current !== searchQuery;
    
    // Check if selected restaurant changed
    const selectedRestaurantId = selectedRestaurant?.id || null;
    const selectedRestaurantChanged = previousSelectedRestaurantIdRef.current !== selectedRestaurantId;
    
    // Handle selected restaurant (from autocomplete)
    if (selectedRestaurantChanged && selectedRestaurant && selectedMarkerRef.current) {
      // Zoom to selected restaurant
      mapInstanceRef.current.setView(
        [selectedRestaurant.lat, selectedRestaurant.lng],
        16,
        { animate: true, duration: 0.6 }
      );
      
      // Open popup after a short delay
      setTimeout(() => {
        if (selectedMarkerRef.current) {
          selectedMarkerRef.current.openPopup();
        }
      }, 700);
      
      previousSelectedRestaurantIdRef.current = selectedRestaurantId;
      // Reset user interaction flag when programmatic zoom happens
      userInteractedRef.current = false;
      return;
    }
    
    // Handle search query change
    if (searchQueryChanged) {
      if (searchQuery.trim() && filteredRestaurants.length > 0) {
        if (filteredRestaurants.length === 1) {
          // Zoom to single marker
          mapInstanceRef.current.setView(
            [filteredRestaurants[0].lat, filteredRestaurants[0].lng], 
            15,
            { animate: true, duration: 0.5 }
          );
        } else {
          // Fit bounds for multiple markers
          const bounds = L.latLngBounds(
            filteredRestaurants.map(r => [r.lat, r.lng] as [number, number])
          );
          mapInstanceRef.current.fitBounds(bounds, { 
            padding: [50, 50],
            animate: true,
            duration: 0.5
          });
        }
      } else if (previousSearchQueryRef.current && !searchQuery.trim()) {
        // User cleared the search - reset to default view
        mapInstanceRef.current.setView(
          [21.0285, 105.8542], 
          12,
          { animate: true, duration: 0.5 }
        );
      }
      
      previousSearchQueryRef.current = searchQuery;
      // Reset user interaction flag when search changes
      userInteractedRef.current = false;
    }
  }, [searchQuery, selectedRestaurant, filteredRestaurants]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    // Check if map container already has _leaflet_id (already initialized)
    if ((mapRef.current as any)._leaflet_id) {
      console.warn('Map container already initialized, skipping...');
      return;
    }

    // Dynamic import leaflet CSS first
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Dynamic import leaflet
    import('leaflet').then((L) => {
      // Double-check after async import
      if (mapInstanceRef.current) return;
      if ((mapRef.current as any)?._leaflet_id) return;
      
      // 🔥 CRITICAL: Check if mapRef still exists after async import
      if (!mapRef.current) {
        console.warn('⚠️ Map container not found after async import, aborting...');
        return;
      }

      // Store Leaflet reference
      leafletRef.current = L;

      // Fix icon issue with Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create map instance
      const map = L.map(mapRef.current!).setView([21.0285, 105.8542], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      
      // Listen to user interactions (manual zoom/pan)
      map.on('zoomstart', (e: any) => {
        // Check if zoom was triggered by user (not programmatic)
        if (!e.sourceTarget._animatingZoom) {
          userInteractedRef.current = true;
        }
      });
      
      map.on('movestart', (e: any) => {
        // Check if move was triggered by user (not programmatic)
        if (!e.sourceTarget._animatingZoom) {
          userInteractedRef.current = true;
        }
      });
      
      map.on('dragstart', () => {
        // User is dragging the map
        userInteractedRef.current = true;
      });
      
      // Listen to zoom events to rescale markers
      map.on('zoomend', () => {
        const newZoom = map.getZoom();
        console.log('🔍 [ZOOM] zoomend event - newZoom:', newZoom, 'currentZoom:', currentZoomRef.current);
        if (newZoom !== currentZoomRef.current) {
          currentZoomRef.current = newZoom;
          console.log('🔄 [ZOOM] Zoom level changed, updating markers...');
          // 🔥 Use ref to avoid dependency issues
          if (updateMarkersRef.current) {
            console.log('✅ [ZOOM] Calling updateMarkersRef.current()');
            updateMarkersRef.current();
          } else {
            console.warn('⚠️ [ZOOM] updateMarkersRef.current is null!');
          }
        } else {
          console.log('⏸️  [ZOOM] Zoom level unchanged, skipping marker update');
        }
      });
      
      // Wait for map to be fully loaded, then add markers
      map.whenReady(() => {
        // Small delay to ensure everything is ready
        setTimeout(() => {
          // 🔥 Use ref to avoid dependency issues
          if (updateMarkersRef.current) {
            updateMarkersRef.current();
          }
        }, 200);
      });
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      leafletRef.current = null;
      // Remove _leaflet_id from DOM element to allow re-initialization
      if (mapRef.current) {
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, []); // 🔥 CRITICAL: Empty array - map should ONLY init once, never recreate!

  // Update markers when filters/search/selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    updateMarkers();
  }, [updateMarkers]);

  // Handle auto-zoom when filters/search/selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    handleAutoZoom();
  }, [handleAutoZoom]);

  // 🔥 NEW: Zoom to selected team when selectedTeamId changes (for officers layer)
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current || !showWardBoundaries) return;
    if (!selectedTeamId) return;
    
    const L = leafletRef.current;
    const selectedTeam = teamsData.find(t => t.id === selectedTeamId);
    if (!selectedTeam) return;
    
    const teamWardCenters: [number, number][] = [];
    
    selectedTeam.managedWards.forEach((ward) => {
      const wardBoundary = wardBoundariesData.find(
        w => w.name === ward.name && w.district === ward.district
      );
      
      if (wardBoundary && wardBoundary.center) {
        teamWardCenters.push(wardBoundary.center);
      } else {
        const districtData = districtBoundaries[ward.district];
        if (districtData && districtData.center) {
          teamWardCenters.push(districtData.center);
        }
      }
    });
    
    if (teamWardCenters.length > 0) {
      const avgLat = teamWardCenters.reduce((sum, [lat]) => sum + lat, 0) / teamWardCenters.length;
      const avgLng = teamWardCenters.reduce((sum, [, lng]) => sum + lng, 0) / teamWardCenters.length;
      const teamCenter: [number, number] = [avgLat, avgLng];
      
      // Zoom to team center
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(teamCenter, 14, {
            animate: true,
            duration: 0.8
          });
        }
      }, 300); // Delay to ensure markers are rendered first
    }
  }, [selectedTeamId, showWardBoundaries]);

  // Handle district boundary highlighting and zoom
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    
    const L = leafletRef.current;
    
    console.log('🗺️ Boundary Effect Triggered!');
    console.log('🗺️ Selected Province:', selectedProvince);
    console.log('🗺️ Selected District:', selectedDistrict);
    console.log('🗺️ Selected Ward:', selectedWard);
    
    // 🔥 FIX: Reset user interaction flag when location selection changes
    // This ensures auto-zoom works even after user has manually interacted with map
    userInteractedRef.current = false;
    
    // Remove old boundary layer if exists
    if (boundaryHighlightRef.current) {
      mapInstanceRef.current.removeLayer(boundaryHighlightRef.current);
      boundaryHighlightRef.current = null;
    }
    
    // Priority: Ward > District > Province
    // CASE 1: Ward is selected - show ward boundary
    if (selectedWard && selectedWard.trim()) {
      const wardBoundary = getWardByName(selectedWard);
      
      console.log('🗺️ [WARD] Processing ward:', selectedWard);
      console.log('🗺️ [WARD] Ward Boundary Found:', wardBoundary);
      
      if (wardBoundary) {
        // Create polygon as non-interactive filled region (vùng tô màu, không bắt chuột)
        const polygon = L.polygon(wardBoundary.polygon, {
          color: '#dc2626', // Border color (will be transparent)
          weight: 0, // 🎨 No border
          opacity: 0, // 🎨 Border fully transparent
          fillColor: '#dc2626', // Red fill for ward
          fillOpacity: 0.30, // 🎨 Moderate opacity for clean look
          smoothFactor: 1.0,
          interactive: false, // 🔥 Disable all mouse events - polygon won't capture pointer
        }).addTo(mapInstanceRef.current);
        
        // 🔥 REMOVED: tooltip - polygon is now non-interactive
        
        boundaryHighlightRef.current = polygon;
        
        // Zoom to ward boundary only if ward changed
        const wardChanged = previousWardRef.current !== selectedWard;
        if (wardChanged && !userInteractedRef.current) {
          console.log('🗺️ [WARD] Zooming to ward bounds:', wardBoundary.bounds);
          const bounds = L.latLngBounds(wardBoundary.bounds);
          mapInstanceRef.current.fitBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 0.8,
            maxZoom: 16 // Closer zoom for ward level
          });
          
          previousWardRef.current = selectedWard;
          previousDistrictRef.current = selectedDistrict || '';
          
          console.log('🗺️ [WARD] Zoom completed!');
        }
        return; // Don't process district if ward is selected
      } else {
        console.warn('⚠️ [WARD] Ward boundary not found for:', selectedWard);
        console.log('📍 [WARD] Falling back to district boundary...');
        console.log('📍 [WARD] Selected district for fallback:', selectedDistrict);
        console.log('📍 [WARD] District boundary exists:', !!districtBoundaries[selectedDistrict]);
        
        // 🔥 FALLBACK: If ward has no boundary data, show district boundary instead
        // (Only 31/168 wards have polygon data currently)
        // Will continue to CASE 2 below to handle district boundary + zoom
      }
    }
    
    // CASE 2: District is selected - show district boundary
    // Also handles ward selections that don't have boundary data (fallback)
    if (selectedDistrict && districtBoundaries[selectedDistrict]) {
      const boundary = districtBoundaries[selectedDistrict];
      
      const logPrefix = selectedWard ? '[WARD FALLBACK]' : '[DISTRICT]';
      console.log(`🗺️ ${logPrefix} Processing district:`, selectedDistrict);
      if (selectedWard) {
        console.log(`🗺️ ${logPrefix} Ward without boundary:`, selectedWard);
      }
      console.log(`🗺️ ${logPrefix} District Boundary Found:`, boundary);
      
      // Create polygon as filled region without border (vùng tô màu)
      const polygon = L.polygon(boundary.polygon, {
        color: '#005cb6', // Border color (will be transparent)
        weight: 0, // 🎨 No border
        opacity: 0, // 🎨 Border fully transparent
        fillColor: '#005cb6', // MAPPA primary fill color
        fillOpacity: 0.30, // 🎨 Moderate opacity for clean look
        smoothFactor: 1.0,
        interactive: false, // 🔥 Disable all mouse events - polygon won't capture pointer
      }).addTo(mapInstanceRef.current);
      
      // 🔥 REMOVED: tooltip - polygon is now non-interactive
      
      boundaryHighlightRef.current = polygon;
      console.log(`✅ ${logPrefix} Polygon created and added to map!`);
      
      // 🔥 UPDATED: Zoom logic for both district-only selection AND ward fallback
      const districtChanged = previousDistrictRef.current !== selectedDistrict;
      const wardChanged = previousWardRef.current !== selectedWard;
      
      console.log('🔍 [ZOOM DEBUG] districtChanged:', districtChanged, `(prev: "${previousDistrictRef.current}" → curr: "${selectedDistrict}")`);
      console.log('🔍 [ZOOM DEBUG] wardChanged:', wardChanged, `(prev: "${previousWardRef.current}" → curr: "${selectedWard}")`);
      console.log('🔍 [ZOOM DEBUG] userInteractedRef.current:', userInteractedRef.current);
      
      // Check if we should zoom
      if (!userInteractedRef.current) {
        if (selectedWard) {
          // Ward fallback case - zoom if ward OR district changed
          const shouldZoom = wardChanged || districtChanged;
          console.log('🔍 [ZOOM DEBUG] Ward fallback - shouldZoom:', shouldZoom);
          if (shouldZoom) {
            console.log('🗺️ [WARD FALLBACK] Zooming to district bounds (for ward without boundary):', boundary.bounds);
            const bounds = L.latLngBounds(boundary.bounds);
            mapInstanceRef.current.fitBounds(bounds, {
              padding: [50, 50],
              animate: true,
              duration: 0.8
            });
            console.log('✅ [WARD FALLBACK] Zoom completed!');
          }
        } else {
          // District-only case - zoom only if district changed
          const shouldZoom = districtChanged;
          console.log('🔍 [ZOOM DEBUG] District only - shouldZoom:', shouldZoom);
          if (shouldZoom) {
            console.log('🗺️ [DISTRICT] Zooming to district bounds:', boundary.bounds);
            const bounds = L.latLngBounds(boundary.bounds);
            mapInstanceRef.current.fitBounds(bounds, {
              padding: [50, 50],
              animate: true,
              duration: 0.8
            });
            console.log('✅ [DISTRICT] Zoom completed!');
          }
        }
      } else {
        console.log('⏸️  [ZOOM DEBUG] Skipping auto-zoom - user has manually interacted with map');
      }
      
      // Update previous refs AFTER zoom decision
      previousDistrictRef.current = selectedDistrict;
      previousWardRef.current = selectedWard || '';
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  // 🔥 NEW: Handle zoom to Hà Nội when merchants layer is activated
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    
    // Check if showMerchants changed from false to true
    if (showMerchants && !previousShowMerchantsRef.current) {
      console.log('📍 Merchants layer activated - zooming to Hà Nội');
      
      // Hà Nội coordinates: 21.0285, 105.8542
      // Zoom level 13 for a good view of Hà Nội
      mapInstanceRef.current.setView(
        [21.0285, 105.8542], 
        13,
        { animate: true, duration: 0.8 }
      );
      
      // Reset user interaction flag to allow auto-zoom
      userInteractedRef.current = false;
    }
    
    // Update previous state
    previousShowMerchantsRef.current = showMerchants;
  }, [showMerchants]);

  return (
    <>
      <div ref={mapRef} className={styles.map} />
      {onFullscreenClick && (
        <button 
          onClick={onFullscreenClick}
          className={styles.fullscreenButton}
          aria-label="Fullscreen"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      )}
    </>
  );
}

// 🔥 PERFORMANCE OPTIMIZATION: Wrap with React.memo
// Map sẽ CHỈ re-render khi props thực sự thay đổi
// Khi filter thay đổi -> restaurants array thay đổi -> updateMarkers() chạy
// Map instance KHÔNG bị recreate, chỉ markers được update
export default memo(LeafletMap);