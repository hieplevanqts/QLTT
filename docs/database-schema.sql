-- =====================================================
-- MAPPA PORTAL - DATABASE SCHEMA (REFERENCE ONLY)
-- =====================================================
-- ⚠️ WARNING: This schema CANNOT be executed in Figma Make environment
-- This is for documentation purposes only.
-- The actual implementation uses Supabase KV Store (kv_store_e4fdfce9)
-- =====================================================

-- =====================================================
-- TABLE: businesses (Hộ kinh doanh / Cơ sở)
-- =====================================================
CREATE TABLE IF NOT EXISTS businesses (
  -- Primary Key
  id TEXT PRIMARY KEY,
  
  -- Basic Information
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  
  -- Geographic Location
  lat DECIMAL(10, 8) NOT NULL,  -- Latitude (e.g., 21.0285)
  lng DECIMAL(11, 8) NOT NULL,  -- Longitude (e.g., 105.8542)
  
  -- Business Classification
  type TEXT NOT NULL,  -- Loại hình kinh doanh (e.g., "Nhà hàng", "Quán cà phê")
  business_type TEXT NOT NULL,  -- Alias for type (for backward compatibility)
  
  -- Status/Category
  category TEXT NOT NULL CHECK (category IN ('certified', 'hotspot', 'scheduled', 'inspected')),
  -- certified: Chứng nhận ATTP
  -- hotspot: Điểm nóng (vi phạm)
  -- scheduled: Kế hoạch kiểm tra
  -- inspected: Đã kiểm tra
  
  -- Administrative Divisions
  province TEXT NOT NULL,  -- Tỉnh/Thành phố (e.g., "Hà Nội")
  district TEXT NOT NULL,  -- Quận/Huyện (e.g., "Ba Đình", "Hoàn Kiếm")
  ward TEXT NOT NULL,      -- Phường/Xã (e.g., "Phường Điện Biên", "Phường Hàng Bạc")
  
  -- Population Impact
  nearby_population INTEGER,  -- Số dân sinh sống trong bán kính 500m
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: citizen_reports (Phản ánh của người dân)
-- =====================================================
CREATE TABLE IF NOT EXISTS citizen_reports (
  -- Primary Key
  id TEXT PRIMARY KEY,
  
  -- Foreign Key to Business
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Reporter Information
  reporter_name TEXT NOT NULL,
  report_date TEXT NOT NULL,  -- ISO 8601 format string (e.g., "2024-01-15")
  
  -- Report Content
  content TEXT NOT NULL,
  violation_type TEXT NOT NULL,  -- Loại vi phạm
  
  -- Media Attachments
  images TEXT[],  -- Array of image URLs
  videos TEXT[],  -- Array of video URLs (optional)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Geographic queries
CREATE INDEX idx_businesses_location ON businesses(lat, lng);

-- Category filtering
CREATE INDEX idx_businesses_category ON businesses(category);

-- Business type filtering
CREATE INDEX idx_businesses_type ON businesses(type);
CREATE INDEX idx_businesses_business_type ON businesses(business_type);

-- Administrative division filtering
CREATE INDEX idx_businesses_province ON businesses(province);
CREATE INDEX idx_businesses_district ON businesses(district);
CREATE INDEX idx_businesses_ward ON businesses(ward);

-- Composite index for common filter combination
CREATE INDEX idx_businesses_location_filter ON businesses(province, district, ward, category);

-- Foreign key index
CREATE INDEX idx_citizen_reports_business_id ON citizen_reports(business_id);

-- =====================================================
-- SAMPLE DATA STRUCTURE
-- =====================================================

-- Example Business Record:
/*
INSERT INTO businesses (
  id, name, address, lat, lng, type, business_type, category,
  province, district, ward, nearby_population
) VALUES (
  '1',
  'Nhà hàng Phở Hà Nội',
  '123 Hoàn Kiếm, Hà Nội',
  21.0285,
  105.8542,
  'Nhà hàng',
  'Nhà hàng',
  'certified',
  'Hà Nội',
  'Hoàn Kiếm',
  'Phường Hàng Bạc',
  15420
);
*/

-- Example Citizen Report Record:
/*
INSERT INTO citizen_reports (
  id, business_id, reporter_name, report_date, content, violation_type, images
) VALUES (
  'report_1',
  '1',
  'Nguyễn Văn A',
  '2024-01-15',
  'Phát hiện vi phạm vệ sinh thực phẩm',
  'Vệ sinh kém',
  ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
);
*/

-- =====================================================
-- BUSINESS TYPES REFERENCE
-- =====================================================
-- Ăn uống (20%): Nhà hàng, Quán cà phê, Quán ăn nhanh, Quán phở, Quán bún, Buffet, Quán lẩu, Bánh mì
-- Y tế (10%): Bệnh viện, Phòng khám, Nhà thuốc, Phòng xét nghiệm
-- Giáo dục (8%): Trường học, Trung tâm đào tạo, Thư viện, Nhà trẻ
-- Thương mại (15%): Siêu thị, Cửa hàng tiện lợi, Shop thời trang, Cửa hàng điện tử, Chợ
-- Dịch vụ cá nhân (12%): Salon tóc, Spa & Massage, Giặt ủi, Thẩm mỹ viện
-- Giải trí (10%): Rạp phim, Karaoke, Phòng gym, Billiards, Game center
-- Tài chính (8%): Ngân hàng, ATM, Cửa hàng vàng, Bảo hiểm
-- Khác (17%): Khách sạn, Căn hộ dịch vụ, Cửa hàng sách, Cơ sở sản xuất, v.v.

-- =====================================================
-- CATEGORY REFERENCE
-- =====================================================
-- certified: Chứng nhận ATTP - Đạt chuẩn an toàn thực phẩm
-- hotspot: Điểm nóng - Vi phạm, có phản ánh từ người dân
-- scheduled: Kế hoạch kiểm tra - Sắp được kiểm tra
-- inspected: Đã kiểm tra - Đã thực hiện kiểm tra

-- =====================================================
-- ADMINISTRATIVE DIVISIONS (Hà Nội)
-- =====================================================
-- Districts (12): Ba Đình, Hoàn Kiếm, Đống Đa, Hai Bà Trưng, Cầu Giấy, Thanh Xuân, 
--                 Tây Hồ, Long Biên, Hoàng Mai, Nam Từ Liêm, Bắc Từ Liêm, Hà Đông
-- Wards (120+): Varies by district

-- =====================================================
-- NOTES FOR IMPLEMENTATION IN FIGMA MAKE
-- =====================================================
-- Since we cannot create custom tables, we use KV Store with the following structure:
-- 
-- Key: restaurant:{id}
-- Value: JSON string containing the entire business object
-- 
-- Example:
-- Key: restaurant:1
-- Value: {
--   "id": "1",
--   "name": "Nhà hàng Phở Hà Nội",
--   "address": "123 Hoàn Kiếm, Hà Nội",
--   "lat": 21.0285,
--   "lng": 105.8542,
--   "type": "Nhà hàng",
--   "businessType": "Nhà hàng",
--   "category": "certified",
--   "province": "Hà Nội",
--   "district": "Hoàn Kiếm",
--   "ward": "Phường Hàng Bạc",
--   "nearbyPopulation": 15420,
--   "citizenReports": [...]
-- }
--
-- This approach provides:
-- ✅ Flexibility - No rigid schema, easy to add fields
-- ✅ Simplicity - No need for JOINs
-- ✅ Speed - Direct key-value access
-- ✅ JSON Support - Store complex nested data
-- =====================================================
