# Hướng dẫn Setup Dữ liệu Department Areas

## Tổng quan

Để hiển thị các departments trên bản đồ, hệ thống cần dữ liệu từ bảng `department_areas` với cấu trúc như sau:

## Cấu trúc Database

### Bảng `department_areas`
- `department_id` (UUID): ID của department (division hoặc team)
- `areas` (JSONB): Mảng các areas mà department quản lý

### Cấu trúc `areas` (JSONB)
Mỗi area trong mảng `areas` có cấu trúc:
```json
{
  "province_id": "UUID của tỉnh/thành phố",
  "ward_id": "UUID của phường/xã",
  "wards_with_coordinates": {
    "center_lat": 21.0285,
    "center_lng": 105.8542,
    "bounds": [[21.0, 105.8], [21.1, 105.9]],
    "area": 1234.56,
    "officer": "Tên cán bộ phụ trách"
  }
}
```

## API Endpoint

```
GET /department_areas?select=areas(province_id,ward_id,wards_with_coordinates(center_lat,center_lng,bounds,area,officer))&department_id=eq.{department_id}
```

## Cách Thêm Dữ liệu

### 1. Thêm dữ liệu cho Division (Cục/Chi cục)

```sql
INSERT INTO department_areas (department_id, areas)
VALUES (
  '0c081448-e64b-4d8e-a332-b79f743823c7', -- division_id
  '[
    {
      "province_id": "82c5014d-0a8b-46db-9d0d-c049888abbaf",
      "ward_id": "ward-uuid-1",
      "wards_with_coordinates": {
        "center_lat": 21.0285,
        "center_lng": 105.8542,
        "bounds": [[21.0, 105.8], [21.1, 105.9]],
        "area": 1234.56,
        "officer": "Nguyễn Văn A"
      }
    },
    {
      "province_id": "82c5014d-0a8b-46db-9d0d-c049888abbaf",
      "ward_id": "ward-uuid-2",
      "wards_with_coordinates": {
        "center_lat": 21.0300,
        "center_lng": 105.8600,
        "bounds": [[21.02, 105.85], [21.04, 105.87]],
        "area": 2345.67,
        "officer": "Trần Thị B"
      }
    }
  ]'::jsonb
);
```

### 2. Thêm dữ liệu cho Team (Đội)

```sql
INSERT INTO department_areas (department_id, areas)
VALUES (
  '61490e1a-64a6-4413-8a39-b7b8d99b7759', -- team_id
  '[
    {
      "province_id": "82c5014d-0a8b-46db-9d0d-c049888abbaf",
      "ward_id": "ward-uuid-3",
      "wards_with_coordinates": {
        "center_lat": 21.0250,
        "center_lng": 105.8500,
        "bounds": [[21.02, 105.84], [21.03, 105.86]],
        "area": 987.65,
        "officer": "Lê Văn C"
      }
    }
  ]'::jsonb
);
```

## Lấy Tọa độ từ Bảng `ward_coordinates`

Nếu bạn đã có dữ liệu trong bảng `ward_coordinates`, có thể sử dụng query sau để tạo dữ liệu:

```sql
-- Tạo dữ liệu department_areas từ ward_coordinates
WITH department_wards AS (
  SELECT DISTINCT
    d._id as department_id,
    w.ward_id,
    w.province_id,
    wc.center_lat,
    wc.center_lng,
    wc.bounds,
    wc.area,
    wc.officer
  FROM departments d
  JOIN wards w ON w.district_id IN (
    SELECT _id FROM districts WHERE province_id = (
      SELECT province_id FROM departments WHERE _id = d._id
    )
  )
  LEFT JOIN ward_coordinates wc ON wc.ward_id = w._id
  WHERE d._id = '0c081448-e64b-4d8e-a332-b79f743823c7' -- division_id
)
INSERT INTO department_areas (department_id, areas)
SELECT 
  department_id,
  jsonb_agg(
    jsonb_build_object(
      'province_id', province_id,
      'ward_id', ward_id,
      'wards_with_coordinates', jsonb_build_object(
        'center_lat', center_lat,
        'center_lng', center_lng,
        'bounds', bounds,
        'area', area,
        'officer', officer
      )
    )
  ) as areas
FROM department_wards
WHERE center_lat IS NOT NULL AND center_lng IS NOT NULL
GROUP BY department_id;
```

## Kiểm tra Dữ liệu

### Kiểm tra xem department có dữ liệu chưa:

```sql
SELECT 
  d._id,
  d.name,
  da.areas
FROM departments d
LEFT JOIN department_areas da ON da.department_id = d._id
WHERE d._id = '0c081448-e64b-4d8e-a332-b79f743823c7';
```

### Đếm số areas của một department:

```sql
SELECT 
  department_id,
  jsonb_array_length(areas) as area_count
FROM department_areas
WHERE department_id = '0c081448-e64b-4d8e-a332-b79f743823c7';
```

## Lưu ý

1. **Tọa độ bắt buộc**: `center_lat` và `center_lng` phải có giá trị để hiển thị trên bản đồ
2. **Bounds**: Nếu có `bounds`, hệ thống sẽ sử dụng để zoom chính xác hơn
3. **Officer**: Tên cán bộ phụ trách sẽ hiển thị trong tooltip
4. **Area**: Diện tích (m²) của địa bàn phụ trách

## Xử lý Thiếu Dữ liệu

Nếu API trả về `null` hoặc không có dữ liệu, hệ thống sẽ:
1. Hiển thị thông báo trong console
2. Không hiển thị markers trên bản đồ
3. Fallback về dữ liệu mock (nếu có) hoặc ẩn layer

## Cập nhật Dữ liệu

Để cập nhật dữ liệu cho một department:

```sql
UPDATE department_areas
SET areas = '[...]'::jsonb
WHERE department_id = '0c081448-e64b-4d8e-a332-b79f743823c7';
```
