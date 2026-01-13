# MAPPA Portal - KV Store Data Structure

## 🗄️ Current Implementation

Figma Make environment chỉ cho phép sử dụng **Supabase KV Store** (bảng `kv_store_e4fdfce9`), không thể tạo custom tables.

---

## 📊 Data Structure

### Key Format
```
restaurant:{id}
```

### Value Format (JSON String)
```json
{
  "id": "1",
  "name": "Nhà hàng Phở Hà Nội",
  "address": "123 Hoàn Kiếm, Hà Nội",
  "lat": 21.0285,
  "lng": 105.8542,
  "type": "Nhà hàng",
  "businessType": "Nhà hàng",
  "category": "certified",
  "province": "Hà Nội",
  "district": "Hoàn Kiếm",
  "ward": "Phường Hàng Bạc",
  "nearbyPopulation": 15420,
  "citizenReports": [
    {
      "id": "report_1",
      "reporterName": "Nguyễn Văn A",
      "reportDate": "2024-01-15",
      "content": "Phát hiện vi phạm vệ sinh thực phẩm",
      "images": ["url1.jpg", "url2.jpg"],
      "videos": [],
      "violationType": "Vệ sinh kém"
    }
  ]
}
```

---

## 🏗️ Field Definitions

### Business Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | ✅ | Unique identifier | "1", "2", "1000" |
| `name` | string | ✅ | Tên cơ sở | "Nhà hàng Phở Hà Nội" |
| `address` | string | ✅ | Địa chỉ đầy đủ | "123 Hoàn Kiếm, Hà Nội" |
| `lat` | number | ✅ | Vĩ độ (Latitude) | 21.0285 |
| `lng` | number | ✅ | Kinh độ (Longitude) | 105.8542 |
| `type` | string | ✅ | Loại hình kinh doanh | "Nhà hàng", "Quán cà phê" |
| `businessType` | string | ✅ | Alias của type | "Nhà hàng" |
| `category` | string | ✅ | Phân loại trạng thái | "certified", "hotspot", "scheduled", "inspected" |
| `province` | string | ✅ | Tỉnh/Thành phố | "Hà Nội" |
| `district` | string | ✅ | Quận/Huyện | "Hoàn Kiếm", "Ba Đình" |
| `ward` | string | ✅ | Phường/Xã | "Phường Hàng Bạc" |
| `nearbyPopulation` | number | ❌ | Số dân xung quanh (500m) | 15420 |
| `citizenReports` | array | ❌ | Phản ánh của người dân | [...] (chỉ có khi category = "hotspot") |

### Citizen Report Fields (Nested Object)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | ✅ | Unique identifier | "report_1" |
| `reporterName` | string | ✅ | Tên người phản ánh | "Nguyễn Văn A" |
| `reportDate` | string | ✅ | Ngày phản ánh | "2024-01-15" |
| `content` | string | ✅ | Nội dung phản ánh | "Phát hiện vi phạm..." |
| `images` | string[] | ✅ | Danh sách ảnh | ["url1.jpg", "url2.jpg"] |
| `videos` | string[] | ❌ | Danh sách video | ["video1.mp4"] |
| `violationType` | string | ✅ | Loại vi phạm | "Vệ sinh kém" |

---

## 🎯 Category Values

| Value | Vietnamese | Màu | Icon | Description |
|-------|-----------|-----|------|-------------|
| `certified` | Chứng nhận ATTP | 🟢 #22c55e | ShieldCheck | Đạt chuẩn an toàn thực phẩm |
| `hotspot` | Điểm nóng | 🔴 #ef4444 | Flame | Vi phạm, có phản ánh từ dân |
| `scheduled` | Kế hoạch KT | 🟡 #f59e0b | Calendar | Sắp được kiểm tra |
| `inspected` | Đã kiểm tra | 🔵 #3b82f6 | ShieldCheck | Đã thực hiện kiểm tra |

---

## 🏪 Business Types (47 types)

### Ăn uống (20%)
- Nhà hàng, Quán cà phê, Quán ăn nhanh, Quán phở, Quán bún, Buffet, Quán lẩu, Bánh mì

### Y tế (10%)
- Bệnh viện, Phòng khám, Nhà thuốc, Phòng xét nghiệm

### Giáo dục (8%)
- Trường học, Trung tâm đào tạo, Thư viện, Nhà trẻ

### Thương mại (15%)
- Siêu thị, Cửa hàng tiện lợi, Shop thời trang, Cửa hàng điện tử, Chợ

### Dịch vụ cá nhân (12%)
- Salon tóc, Spa & Massage, Giặt ủi, Thẩm mỹ viện

### Giải trí (10%)
- Rạp phim, Karaoke, Phòng gym, Billiards, Game center

### Tài chính (8%)
- Ngân hàng, ATM, Cửa hàng vàng, Bảo hiểm

### Khác (17%)
- Khách sạn, Căn hộ dịch vụ, Cửa hàng sách, Cơ sở sản xuất, v.v.

---

## 🗺️ Geographic Coverage

### Province
- **Hà Nội** (1000 businesses)

### Districts (12)
- Ba Đình, Hoàn Kiếm, Đống Đa, Hai Bà Trưng
- Cầu Giấy, Thanh Xuân, Tây Hồ, Long Biên
- Hoàng Mai, Nam Từ Liêm, Bắc Từ Liêm, Hà Đông

### Wards (120+)
- Varies by district (see `/src/data/vietnamLocations.ts`)

---

## 📈 Data Statistics

| Metric | Value |
|--------|-------|
| Total Businesses | 1000 |
| Business Types | 47 |
| Districts | 12 |
| Wards | 120+ |
| Hotspots with Reports | 200 |
| Reports per Hotspot | 1-3 |

---

## 🔑 KV Store Keys

### Main Data Keys
```
restaurant:1
restaurant:2
...
restaurant:1000
```

### Metadata Key
```
restaurant:metadata
```

**Value:**
```json
{
  "count": 1000,
  "lastUpdated": "2026-01-09T12:00:00.000Z"
}
```

---

## 🔄 API Operations

### Seed Data (POST)
```typescript
POST /make-server-e4fdfce9/seed-restaurants
Body: { restaurants: Restaurant[] }
Response: { success: true, count: 1000, message: "..." }
```

### Fetch All (GET)
```typescript
GET /make-server-e4fdfce9/restaurants
Response: { success: true, count: 1000, data: Restaurant[] }
```

### Fetch by ID (GET)
```typescript
GET /make-server-e4fdfce9/restaurants/:id
Response: { success: true, data: Restaurant }
```

### Delete All (DELETE)
```typescript
DELETE /make-server-e4fdfce9/restaurants
Response: { success: true, count: 1000, message: "..." }
```

---

## ✅ Advantages of KV Store Approach

| Advantage | Description |
|-----------|-------------|
| 🚀 **No Setup Required** | No migrations, no DDL, works immediately |
| 🔄 **Flexible Schema** | Easy to add/modify fields without migrations |
| ⚡ **Fast Access** | Direct key-value lookup, no JOINs |
| 📦 **Nested Data** | Store complex objects (citizenReports) without separate table |
| 🛠️ **Easy Debugging** | JSON is human-readable, easy to inspect |
| 🔒 **Prototyping Perfect** | Ideal for rapid development and testing |

---

## 🚧 Limitations

| Limitation | Workaround |
|------------|------------|
| No SQL queries | Filter in application layer (already implemented) |
| No foreign keys | Embed related data (citizenReports inside business) |
| No indexes | Load all data at once (1000 records is manageable) |
| No transactions | Single-key operations are atomic |

---

## 💡 Best Practices

1. **Key Naming**: Use consistent prefix format (`restaurant:{id}`)
2. **JSON Validation**: Always validate before storing
3. **Error Handling**: Wrap all KV operations in try-catch
4. **Caching**: Consider caching in frontend after first fetch
5. **Metadata**: Store counts/timestamps for consistency checks

---

## 🔮 Future Considerations

If you need to migrate to a real PostgreSQL table in the future:
1. Reference `/docs/database-schema.sql` for table structure
2. Export data from KV store
3. Transform JSON to relational format
4. Import into PostgreSQL
5. Update API endpoints to use SQL queries

For now, **KV Store is sufficient and recommended** for the MAPPA Portal prototype! ✨
