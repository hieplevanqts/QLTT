# Tích Hợp API Stores từ Supabase

## Tổng Quan

Phần list data cho stores trong `StoresListPage.tsx` đã được cập nhật để sử dụng API Supabase thay vì mock data.

## Thay Đổi Chính

### 1. Tạo `storesApi.ts` 

**Vị trí:** `src/utils/api/storesApi.ts`

API service mới cấp các hàm chính:

- **`fetchStores(limit, offset, filters)`** - Fetch danh sách stores từ merchants table
  - Limit: số records tối đa (mặc định 100)
  - Offset: pagination offset
  - Filters: lọc theo status, district, businessType, riskLevel, v.v.
  - Returns: `Store[]` mapped từ merchant data

- **`fetchStoresStats(filters)`** - Lấy thống kê stores
  - Trả về counts: total, active, pending, suspended, closed, rejected

- **`fetchStoreById(storeId)`** - Lấy một store cụ thể

### 2. Cập Nhật `StoresListPage.tsx`

**Import API:**
```tsx
import { fetchStores, fetchStoresStats } from '../utils/api/storesApi';
```

**Thay Thế Mock Data bằng API:**

Trước:
```tsx
const [stores, setStores] = useState<Store[]>(() => {
  // Load from localStorage or use mockStores
});
```

Sau:
```tsx
const [stores, setStores] = useState<Store[]>([]);
const [isLoadingStores, setIsLoadingStores] = useState(true);
const [storeError, setStoreError] = useState<string | null>(null);

useEffect(() => {
  const loadStores = async () => {
    try {
      const data = await fetchStores(100, 0);
      setStores(data);
    } catch (error) {
      // Fallback to localStorage or mockStores
    }
  };
  loadStores();
}, []);
```

### 3. Thêm Loading State

UI hiển thị loading indicator khi đang fetch dữ liệu:

```tsx
{isLoadingStores ? (
  <Card>
    <CardContent>Loading...</CardContent>
  </Card>
) : storeError ? (
  <Card>
    <CardContent>Error: {storeError}</CardContent>
  </Card>
) : (
  // Table with data
)}
```

## Mapping Dữ Liệu

API merchants table → Store interface:

| Merchants Field | Store Field | Ghi Chú |
|---|---|---|
| `business_name` | `name` | Tên cơ sở |
| `owner_name` | `ownerName` | Chủ cơ sở |
| `owner_phone` | `ownerPhone` | SĐT chủ hộ |
| `tax_code` | `taxCode` | Mã số thuế |
| `address` | `address` | Địa chỉ |
| `district` | `jurisdiction` | Địa bàn (Phường/Xã) |
| `province` | `province` | Tỉnh/Thành phố |
| `ward` | `ward` | Phường/Xã |
| `business_type` | `businessType` | Loại hình kinh doanh |
| `status` | `status` | Trạng thái (active, pending, suspended, rejected, closed) |
| `risk_level` | `riskLevel` | Mức độ rủi ro (1=high, 2=medium, 3=low, null=none) |
| `latitude` / `longitude` | `latitude` / `longitude` | GPS coordinates |
| `complaint_count` | - | Số lượng than phiền |

## API Headers (từ config.ts)

```typescript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
  'apikey': apiKey,
  'Prefer': 'return=representation'
}
```

API key được load từ environment variables:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLIC_ANON_KEY`

## Fallback Strategy

Nếu API fetch thất bại:
1. Thử load từ localStorage
2. Nếu không có, sử dụng mockStores

Điều này đảm bảo ứng dụng vẫn hoạt động nếu API không available.

## Filters & Search

API hỗ trợ các filters:

```typescript
fetchStores(100, 0, {
  status: 'active',
  district: 'Phường 1',
  businessType: 'electronics',
  riskLevel: 'high'
})
```

## Performance

- **Pagination:** Fetch 100 records mỗi lần (có thể customize)
- **Caching:** Dữ liệu cached trong localStorage
- **Loading State:** UI feedback cho user khi đang fetch

## Troubleshooting

### Lỗi "Failed to fetch stores"
- Kiểm tra API URL: `https://{projectId}.supabase.co/rest/v1/merchants`
- Kiểm tra API key trong environment variables
- Kiểm tra CORS headers (đã được cấu hình)

### Dữ liệu trống
- Kiểm tra merchants table có data không
- Mở browser DevTools → Network tab để xem API response

### GPS Coordinates lỗi
- Kiểm tra latitude/longitude là valid numbers
- Invalid coordinates sẽ bị bỏ qua khi mapping

## Tương Lai

Có thể thêm:
- Real-time subscription từ Supabase
- Server-side sorting/filtering để tối ưu performance
- Infinite scroll thay vì pagination
- Cache strategy tối ưu hơn
