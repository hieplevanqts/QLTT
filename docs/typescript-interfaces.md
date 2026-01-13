# MAPPA Portal - TypeScript Interfaces

## 📘 Type Definitions

Complete TypeScript interfaces based on mock data structure.

---

## 🏢 Restaurant Interface

```typescript
export interface Restaurant {
  // Identification
  id: string;
  
  // Basic Information
  name: string;
  address: string;
  
  // Geographic Location
  lat: number;
  lng: number;
  
  // Business Classification
  type: string;  // Loại hình kinh doanh
  businessType: string;  // Alias for type (backward compatibility)
  
  // Status Category
  category: 'certified' | 'hotspot' | 'scheduled' | 'inspected';
  
  // Administrative Divisions
  province: string;
  district: string;
  ward: string;
  
  // Optional Fields
  citizenReports?: CitizenReport[];  // Only for 'hotspot' category
  nearbyPopulation?: number;  // Population within 500m radius
}
```

---

## 📝 CitizenReport Interface

```typescript
export interface CitizenReport {
  // Identification
  id: string;
  
  // Reporter Information
  reporterName: string;
  reportDate: string;  // ISO 8601 format (e.g., "2024-01-15")
  
  // Report Content
  content: string;
  violationType: string;
  
  // Media Attachments
  images: string[];  // Array of image URLs
  videos?: string[];  // Optional video URLs
}
```

---

## 🎯 Category Type

```typescript
export type Category = 'certified' | 'hotspot' | 'scheduled' | 'inspected';
```

**Values:**
- `certified` - Chứng nhận ATTP (đạt chuẩn)
- `hotspot` - Điểm nóng (vi phạm)
- `scheduled` - Kế hoạch kiểm tra
- `inspected` - Đã kiểm tra

---

## 🏪 Business Types

```typescript
export type BusinessType = 
  // Ăn uống
  | 'Nhà hàng'
  | 'Quán cà phê'
  | 'Quán ăn nhanh'
  | 'Quán phở'
  | 'Quán bún'
  | 'Buffet'
  | 'Quán lẩu'
  | 'Bánh mì'
  
  // Y tế
  | 'Bệnh viện'
  | 'Phòng khám'
  | 'Nhà thuốc'
  | 'Phòng xét nghiệm'
  
  // Giáo dục
  | 'Trường học'
  | 'Trung tâm đào tạo'
  | 'Thư viện'
  | 'Nhà trẻ'
  
  // Thương mại
  | 'Siêu thị'
  | 'Cửa hàng tiện lợi'
  | 'Shop thời trang'
  | 'Cửa hàng điện tử'
  | 'Chợ'
  
  // Dịch vụ cá nhân
  | 'Salon tóc'
  | 'Spa & Massage'
  | 'Giặt ủi'
  | 'Thẩm mỹ viện'
  
  // Giải trí
  | 'Rạp phim'
  | 'Karaoke'
  | 'Phòng gym'
  | 'Billiards'
  | 'Game center'
  
  // Tài chính
  | 'Ngân hàng'
  | 'ATM'
  | 'Cửa hàng vàng'
  | 'Bảo hiểm'
  
  // Và nhiều loại khác...
  | string;  // Allow other types
```

---

## 🗺️ Location Interfaces

```typescript
export interface Province {
  name: string;
}

export interface District {
  name: string;
  province: string;
  boundary?: [number, number][];  // Polygon coordinates
}

export interface Ward {
  name: string;
  district: string;
  boundary?: [number, number][];  // Polygon coordinates
}
```

---

## 🔍 Filter Interfaces

```typescript
export interface CategoryFilter {
  certified: boolean;
  hotspot: boolean;
  scheduled: boolean;
  inspected: boolean;
}

export interface BusinessTypeFilter {
  [key: string]: boolean;  // Dynamic keys based on business types
}

export interface LocationFilter {
  province?: string;
  district?: string;
  ward?: string;
}
```

---

## 📊 API Response Interfaces

### Seed Response
```typescript
export interface SeedResponse {
  success: boolean;
  count: number;
  message: string;
}
```

### Fetch Response
```typescript
export interface FetchRestaurantsResponse {
  success: boolean;
  count: number;
  data: Restaurant[];
}

export interface FetchRestaurantResponse {
  success: boolean;
  data: Restaurant;
}
```

### Error Response
```typescript
export interface ErrorResponse {
  error: string;
  details?: string;
}
```

---

## 📈 Statistics Interfaces

```typescript
export interface LocationStats {
  totalBusinesses: number;
  certified: number;
  hotspot: number;
  scheduled: number;
  inspected: number;
  population: number;
}

export interface CategoryData {
  key: keyof CategoryFilter;
  label: string;
  color: string;
  count: number;
}
```

---

## 🎨 UI State Interfaces

```typescript
export interface MapPageState {
  // Data
  restaurants: Restaurant[];
  isLoadingData: boolean;
  dataError: string | null;
  
  // Filters
  filters: CategoryFilter;
  businessTypeFilters: BusinessTypeFilter;
  searchQuery: string;
  selectedRestaurant: Restaurant | null;
  
  // Location Selection
  selectedProvince: string;
  selectedDistrict: string;
  selectedWard: string;
  
  // Modals
  isDetailModalOpen: boolean;
  detailModalPoint: Restaurant | null;
  isReviewModalOpen: boolean;
  reviewModalPoint: Restaurant | null;
  isFullscreenMapOpen: boolean;
  
  // UI Toggles
  isFilterPanelOpen: boolean;
  isStatsCardVisible: boolean;
  isLegendVisible: boolean;
}
```

---

## 🗂️ Component Props Interfaces

### MapPage Props
```typescript
// MapPage is the root, no props needed
```

### LeafletMap Props
```typescript
export interface LeafletMapProps {
  filters: CategoryFilter;
  businessTypeFilters: BusinessTypeFilter;
  searchQuery: string;
  selectedRestaurant: Restaurant | null;
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  onPointClick: (point: Restaurant) => void;
  onFullscreenClick: () => void;
}
```

### MapFilterPanel Props
```typescript
export interface MapFilterPanelProps {
  isOpen: boolean;
  filters: CategoryFilter;
  businessTypeFilters: BusinessTypeFilter;
  restaurants: Restaurant[];
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  onFilterChange: (key: keyof CategoryFilter) => void;
  onBusinessTypeFilterChange: (type: string) => void;
  onProvinceChange?: (province: string) => void;
  onDistrictChange?: (district: string) => void;
  onWardChange?: (ward: string) => void;
  filteredCount: number;
  onClose: () => void;
}
```

### LocationStatsCard Props
```typescript
export interface LocationStatsCardProps {
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  filteredRestaurants: Restaurant[];
  businessTypeFilters: BusinessTypeFilter;
  onClose: () => void;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}
```

### PointDetailModal Props
```typescript
export interface PointDetailModalProps {
  point: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}
```

### ReviewModal Props
```typescript
export interface ReviewModalProps {
  point: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}
```

---

## 📦 Example Usage

### Creating a Restaurant
```typescript
const restaurant: Restaurant = {
  id: '1',
  name: 'Nhà hàng Phở Hà Nội',
  address: '123 Hoàn Kiếm, Hà Nội',
  lat: 21.0285,
  lng: 105.8542,
  type: 'Nhà hàng',
  businessType: 'Nhà hàng',
  category: 'certified',
  province: 'Hà Nội',
  district: 'Hoàn Kiếm',
  ward: 'Phường Hàng Bạc',
  nearbyPopulation: 15420
};
```

### Creating a Hotspot with Reports
```typescript
const hotspot: Restaurant = {
  id: '200',
  name: 'Quán ăn Vi Phạm',
  address: '456 Ba Đình, Hà Nội',
  lat: 21.0356,
  lng: 105.8192,
  type: 'Quán ăn nhanh',
  businessType: 'Quán ăn nhanh',
  category: 'hotspot',
  province: 'Hà Nội',
  district: 'Ba Đình',
  ward: 'Phường Điện Biên',
  nearbyPopulation: 12000,
  citizenReports: [
    {
      id: 'report_1',
      reporterName: 'Nguyễn Văn A',
      reportDate: '2024-01-15',
      content: 'Phát hiện vi phạm vệ sinh thực phẩm',
      violationType: 'Vệ sinh kém',
      images: ['https://example.com/image1.jpg'],
      videos: []
    }
  ]
};
```

### Filtering Restaurants
```typescript
const filteredRestaurants = restaurants.filter((restaurant) => {
  // Category filter
  if (!filters[restaurant.category]) return false;
  
  // Business type filter
  const hasBusinessTypeFilter = Object.values(businessTypeFilters).some(v => v);
  if (hasBusinessTypeFilter && !businessTypeFilters[restaurant.businessType]) {
    return false;
  }
  
  // Location filter
  if (selectedProvince && restaurant.province !== selectedProvince) return false;
  if (selectedDistrict && restaurant.district !== selectedDistrict) return false;
  if (selectedWard && restaurant.ward !== selectedWard) return false;
  
  return true;
});
```

---

## ✅ Type Safety Benefits

Using these TypeScript interfaces provides:

1. **Compile-time checking** - Catch errors before runtime
2. **IntelliSense support** - Auto-completion in IDE
3. **Documentation** - Types serve as inline documentation
4. **Refactoring safety** - Rename fields across entire codebase
5. **API contract** - Clear contract between frontend and backend

---

## 📚 Related Files

- **Interface Definitions**: `/src/data/restaurantData.ts`
- **Location Types**: `/src/data/vietnamLocations.ts`
- **API Client**: `/src/utils/api/restaurantApi.ts`
- **Database Schema**: `/docs/database-schema.sql`
- **KV Store Structure**: `/docs/kv-store-structure.md`
