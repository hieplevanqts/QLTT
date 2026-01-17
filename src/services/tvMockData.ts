import { getRandomCoordsInBounds } from '@/constants/locationBounds';
import { VIETNAM_PROVINCES, type Province, type Ward } from '@/data/qltt-structure';

export interface Location {
  id: string;
  province: string;
  district: string;
  ward: string;
  lat: number;
  lng: number;
}

export interface Hotspot {
  id: string;
  title: string;
  created_at: string;
  dia_ban: Location;
  chuyen_de: string;
  lat: number;
  lng: number;
  severity: 'P1' | 'P2' | 'P3';
  risk_score: number;
}

export interface Lead {
  id: string;
  title: string;
  created_at: string;
  dia_ban: Location;
  chuyen_de: string;
  lat: number;
  lng: number;
  status: 'Mới' | 'Đã xác minh' | 'Đang xử lý';
  risk_score: number;
}

export interface Task {
  id: string;
  title: string;
  created_at: string;
  due_date: string;
  dia_ban: Location;
  chuyen_de: string;
  lat: number;
  lng: number;
  priority: 'P1' | 'P2' | 'P3';
  status: 'Mới' | 'Đang xử lý' | 'Hoàn thành' | 'Quá hạn';
  is_overdue: boolean;
}

export interface Evidence {
  id: string;
  title: string;
  created_at: string;
  dia_ban: Location;
  chuyen_de: string;
  lat: number;
  lng: number;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  image_url: string;
  type: 'image' | 'video';
}

const PROVINCES = VIETNAM_PROVINCES;

const DISTRICTS: Record<string, string[]> = {
  'TP.HCM': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 10', 'Phú Nhuận', 'Tân Bình', 'Bình Thạnh', 'Gò Vấp', 'Thủ Đức', 'Bình Tân'],
  'Hà Nội': ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy', 'Thanh Xuân', 'Tây Hồ', 'Long Biên', 'Hoàng Mai', 'Nam Từ Liêm'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'],
  'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt'],
  'Hải Phòng': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Đồ Sơn'],
  'Bình Dương': ['Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Tân Uyên', 'Bến Cát'],
  'Đồng Nai': ['Biên Hòa', 'Long Khánh', 'Nhơn Trạch', 'Vĩnh Cửu'],
  'Long An': ['Tân An', 'Kiến Tường', 'Đức Hòa', 'Bến Lức'],
  'Bà Rịa-Vũng Tàu': ['Vũng Tàu', 'Bà Rịa', 'Phú Mỹ', 'Long Điền'],
  'Khánh Hòa': ['Nha Trang', 'Cam Ranh', 'Ninh Hòa', 'Vạn Ninh'],
};

const WARDS: Record<string, string[]> = {
  'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Cầu Ông Lãnh', 'Phường Nguyễn Cư Trinh', 'Phường Tân Định', 'Phường Đa Kao', 'Phường Cô Giang', 'Phường Cầu Kho'],
  'Quận 3': ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10'],
  'Quận 5': ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10'],
  'Phú Nhuận': ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 15', 'Phường 17'],
};

const TOPICS = [
  'Hàng giả – Hàng nhái',
  'Gian lận thương mại',
  'An toàn thực phẩm',
  'Vi phạm về giá',
  'Kinh doanh trái phép',
  'Buôn lậu – Vận chuyển trái phép',
  'Thương mại điện tử & Mạng xã hội',
  'Quảng cáo sai phạm',
  'Thuốc – Mỹ phẩm – Thiết bị y tế',
  'Hàng hóa không rõ nguồn gốc',
  'Vi phạm trong dịp cao điểm',
  'Nghi vấn / Dấu hiệu bất thường',
];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1648494239866-58fc47467534?w=1080',
  'https://images.unsplash.com/photo-1730503807844-6b01c05f9c0f?w=1080',
  'https://images.unsplash.com/photo-1739204618173-3e89def7140f?w=1080',
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1080',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1080',
  'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1080',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1080',
  'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1080',
];

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'TP.HCM': { lat: 10.8231, lng: 106.6297 },
  'Hà Nội': { lat: 21.0285, lng: 105.8542 },
  'Đà Nẵng': { lat: 16.0544, lng: 108.2022 },
  'Cần Thơ': { lat: 10.0452, lng: 105.7469 },
  'Hải Phòng': { lat: 20.8449, lng: 106.6881 },
};

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

// Removed old getRandomCoords function - now using getRandomCoordsInBounds from constants

function generateLocation(provinceName: string): Location {
  // Find province in VIETNAM_PROVINCES to get accurate ward data
  const province = VIETNAM_PROVINCES.find(p => p.name === provinceName);
  
  if (province && province.wards.length > 0) {
    // Use actual ward data from VIETNAM_PROVINCES
    const ward = province.wards[Math.floor(Math.random() * province.wards.length)];
    const coords = getRandomCoordsInBounds(provinceName);

    return {
      id: `${provinceName}-${ward.code}`,
      province: provinceName,
      district: '', // District not used in our structure
      ward: ward.name,
      lat: coords.lat,
      lng: coords.lng,
    };
  }
  
  // Fallback for provinces not in VIETNAM_PROVINCES (legacy data)
  const districts = DISTRICTS[provinceName] || ['Quận 1'];
  const district = districts[Math.floor(Math.random() * districts.length)];
  const wards = WARDS[district] || ['Phường 1', 'Phường 2', 'Phường 3'];
  const ward = wards[Math.floor(Math.random() * wards.length)];
  
  const coords = getRandomCoordsInBounds(provinceName);

  return {
    id: `${provinceName}-${district}-${ward}`,
    province: provinceName,
    district,
    ward,
    lat: coords.lat,
    lng: coords.lng,
  };
}

// Helper to generate location for specific ward
function generateLocationForWard(province: Province, ward: Ward): Location {
  const coords = getRandomCoordsInBounds(province.name);
  
  return {
    id: `${province.name}-${ward.code}`,
    province: province.name,
    district: '',
    ward: ward.name,
    lat: coords.lat,
    lng: coords.lng,
  };
}

export function generateHotspots(): Hotspot[] {
  const hotspots: Hotspot[] = [];
  let id = 1;
  
  // PHASE 1: Ensure every ward has at least 2 hotspots (for complete coverage)
  PROVINCES.forEach(province => {
    province.wards.forEach(ward => {
      // Create 2 hotspots per ward
      for (let i = 0; i < 2; i++) {
        const location = generateLocationForWard(province, ward);
        const severity = Math.random() > 0.7 ? 'P1' : Math.random() > 0.5 ? 'P2' : 'P3';
        
        hotspots.push({
          id: `HS-${String(id++).padStart(4, '0')}`,
          title: `Điểm nóng ${location.ward}`,
          created_at: randomDate(90),
          dia_ban: location,
          chuyen_de: TOPICS[Math.floor(Math.random() * TOPICS.length)],
          lat: location.lat,
          lng: location.lng,
          severity,
          risk_score: severity === 'P1' ? 80 + Math.random() * 20 : severity === 'P2' ? 50 + Math.random() * 30 : 20 + Math.random() * 30,
        });
      }
    });
  });
  
  // PHASE 2: Add random hotspots for realistic distribution (300 more)
  for (let i = 0; i < 300; i++) {
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    const location = generateLocation(province.name);
    const severity = Math.random() > 0.7 ? 'P1' : Math.random() > 0.5 ? 'P2' : 'P3';
    
    hotspots.push({
      id: `HS-${String(id++).padStart(4, '0')}`,
      title: `Điểm nóng ${location.ward}`,
      created_at: randomDate(90),
      dia_ban: location,
      chuyen_de: TOPICS[Math.floor(Math.random() * TOPICS.length)],
      lat: location.lat,
      lng: location.lng,
      severity,
      risk_score: severity === 'P1' ? 80 + Math.random() * 20 : severity === 'P2' ? 50 + Math.random() * 30 : 20 + Math.random() * 30,
    });
  }
  
  return hotspots;
}

export function generateLeads(): Lead[] {
  const leads: Lead[] = [];
  const statuses: Lead['status'][] = ['Mới', 'Đã xác minh', 'Đang xử lý'];
  let id = 1;
  
  // PHASE 1: Ensure every ward has at least 3 leads (for complete coverage)
  PROVINCES.forEach(province => {
    province.wards.forEach(ward => {
      // Create 3 leads per ward
      for (let i = 0; i < 3; i++) {
        const location = generateLocationForWard(province, ward);
        
        leads.push({
          id: `LD-${String(id++).padStart(4, '0')}`,
          title: `Nguồn tin ${location.ward}`,
          created_at: randomDate(90),
          dia_ban: location,
          chuyen_de: TOPICS[Math.floor(Math.random() * TOPICS.length)],
          lat: location.lat,
          lng: location.lng,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          risk_score: Math.random() * 100,
        });
      }
    });
  });
  
  // PHASE 2: Add random leads for realistic distribution (500 more)
  for (let i = 0; i < 500; i++) {
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    const location = generateLocation(province.name);
    
    leads.push({
      id: `LD-${String(id++).padStart(4, '0')}`,
      title: `Nguồn tin ${location.ward}`,
      created_at: randomDate(90),
      dia_ban: location,
      chuyen_de: TOPICS[Math.floor(Math.random() * TOPICS.length)],
      lat: location.lat,
      lng: location.lng,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      risk_score: Math.random() * 100,
    });
  }
  
  return leads;
}

export function generateTasks(): Task[] {
  const tasks: Task[] = [];
  const priorities: Task['priority'][] = ['P1', 'P2', 'P3'];
  const statuses: Task['status'][] = ['Mới', 'Đang xử lý', 'Hoàn thành', 'Quá hạn'];
  let id = 1;
  
  // PHASE 1: Ensure every ward has at least 2 tasks (for complete coverage)
  PROVINCES.forEach(province => {
    province.wards.forEach(ward => {
      // Create 2 tasks per ward
      for (let i = 0; i < 2; i++) {
        const location = generateLocationForWard(province, ward);
        const created = new Date(randomDate(90));
        const dueDate = new Date(created);
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) - 10);
        
        const isOverdue = Math.random() > 0.7;
        const status = isOverdue ? 'Quá hạn' : statuses[Math.floor(Math.random() * (statuses.length - 1))];
        
        tasks.push({
          id: `TK-${String(id++).padStart(4, '0')}`,
          title: `Nhiệm vụ ${location.ward}`,
          created_at: created.toISOString(),
          due_date: dueDate.toISOString(),
          dia_ban: location,
          chuyen_de: TOPICS[Math.floor(Math.random() * TOPICS.length)],
          lat: location.lat,
          lng: location.lng,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          status,
          is_overdue: isOverdue,
        });
      }
    });
  });
  
  // PHASE 2: Add random tasks for realistic distribution (400 more)
  for (let i = 0; i < 400; i++) {
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    const location = generateLocation(province.name);
    const created = new Date(randomDate(90));
    const dueDate = new Date(created);
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) - 10);
    
    const isOverdue = Math.random() > 0.7;
    const status = isOverdue ? 'Quá hạn' : statuses[Math.floor(Math.random() * (statuses.length - 1))];
    
    tasks.push({
      id: `TK-${String(id++).padStart(4, '0')}`,
      title: `Nhiệm vụ ${location.ward}`,
      created_at: created.toISOString(),
      due_date: dueDate.toISOString(),
      dia_ban: location,
      chuyen_de: TOPICS[Math.floor(Math.random() * TOPICS.length)],
      lat: location.lat,
      lng: location.lng,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      is_overdue: isOverdue,
    });
  }
  
  return tasks;
}

export function generateEvidences(): Evidence[] {
  const evidences: Evidence[] = [];
  const statuses: Evidence['status'][] = ['Chờ duyệt', 'Đã duyệt', 'Từ chối'];
  let id = 1;
  
  // PHASE 1: Ensure every ward has at least 1 evidence (for complete coverage)
  PROVINCES.forEach(province => {
    province.wards.forEach(ward => {
      // Create 1 evidence per ward
      const location = generateLocationForWard(province, ward);
      
      evidences.push({
        id: `EV-${String(id++).padStart(4, '0')}`,
        title: `Minh chứng ${location.ward}`,
        created_at: randomDate(90),
        dia_ban: location,
        chuyen_de: TOPICS[Math.floor(Math.random() * TOPICS.length)],
        lat: location.lat,
        lng: location.lng,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        image_url: SAMPLE_IMAGES[id % SAMPLE_IMAGES.length],
        type: Math.random() > 0.8 ? 'video' : 'image',
      });
    });
  });
  
  // PHASE 2: Add random evidences for realistic distribution (200 more)
  for (let i = 0; i < 200; i++) {
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    const location = generateLocation(province.name);
    
    evidences.push({
      id: `EV-${String(id++).padStart(4, '0')}`,
      title: `Minh chứng ${location.ward}`,
      created_at: randomDate(90),
      dia_ban: location,
      chuyen_de: TOPICS[Math.floor(Math.random() * TOPICS.length)],
      lat: location.lat,
      lng: location.lng,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      image_url: SAMPLE_IMAGES[i % SAMPLE_IMAGES.length],
      type: Math.random() > 0.8 ? 'video' : 'image',
    });
  }
  
  return evidences;
}

const MOCK_DATA = {
  hotspots: generateHotspots(),
  leads: generateLeads(),
  tasks: generateTasks(),
  evidences: generateEvidences(),
};

// Log data generation statistics
console.log('[TvMockData] Generated TV Wallboard Data:', {
  totalProvinces: PROVINCES.length,
  totalWards: PROVINCES.reduce((sum, p) => sum + p.wards.length, 0),
  hotspots: MOCK_DATA.hotspots.length,
  leads: MOCK_DATA.leads.length,
  tasks: MOCK_DATA.tasks.length,
  evidences: MOCK_DATA.evidences.length,
  sampleWards: PROVINCES[0].wards.slice(0, 3).map(w => w.name),
});

export function getMockData() {
  return MOCK_DATA;
}

export function filterByLocation(items: any[], province?: string, district?: string, ward?: string) {
  return items.filter(item => {
    // Ward filter - must match exactly if specified
    if (ward && item.dia_ban.ward !== ward) return false;
    
    // District filter - only apply if district exists in data and is specified in filter
    // Skip district filter if the data doesn't have district (empty string)
    if (district && item.dia_ban.district && item.dia_ban.district !== district) return false;
    
    // Province filter - must match if specified
    if (province && item.dia_ban.province !== province) return false;
    
    return true;
  });
}

export function filterByTopic(items: any[], topic?: string) {
  if (!topic || topic === 'all') return items;
  return items.filter(item => item.chuyen_de === topic);
}

export function filterByTimeRange(items: any[], days: number) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return items.filter(item => new Date(item.created_at) >= cutoff);
}