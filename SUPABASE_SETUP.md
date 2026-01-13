# 🚀 Hướng dẫn Setup Supabase Backend

## 📌 Trạng thái hiện tại

✅ **App đang chạy ở chế độ MOCK DATA**
- Không có CORS errors
- Không cần deploy Supabase function
- Tất cả data được load từ `/src/data/mockStores.ts`
- 1000 điểm dữ liệu với 47 business types

## 🔄 Khi nào cần bật Supabase?

Bật Supabase khi bạn muốn:
- ✅ Lưu trữ data thật vào database
- ✅ Đồng bộ data giữa nhiều users
- ✅ CRUD operations persist qua sessions
- ✅ Analytics và reporting từ database

## 📋 Các bước Setup Supabase

### **Bước 1: Deploy Edge Function**

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link to project
supabase link --project-ref hngntdaipgxhlxnenlzm

# 4. Deploy function
supabase functions deploy server

# 5. Verify deployment
curl https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/health
```

### **Bước 2: Tạo Database Tables**

Vào **Supabase Dashboard** → **SQL Editor**:

```sql
-- Table để lưu map points
CREATE TABLE IF NOT EXISTS map_points (
  _id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  address TEXT,
  location JSONB,
  mappointtypeid TEXT,
  properties JSONB,
  hotline TEXT,
  logo TEXT,
  images JSONB,
  reviewscore NUMERIC,
  reviewcount INTEGER,
  openinghours TEXT,
  status TEXT,
  createdtime TIMESTAMP DEFAULT NOW()
);

-- Indexes cho performance
CREATE INDEX idx_map_points_type ON map_points(mappointtypeid);
CREATE INDEX idx_map_points_created ON map_points(createdtime DESC);
CREATE INDEX idx_map_points_status ON map_points(status);

-- Enable Row Level Security
ALTER TABLE map_points ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
CREATE POLICY "Enable read access for all users" ON map_points
  FOR SELECT USING (true);

-- Policy: Allow service role full access
CREATE POLICY "Enable full access for service role" ON map_points
  FOR ALL USING (auth.role() = 'service_role');
```

### **Bước 3: Seed Data (Optional)**

Có 2 cách:

**Cách 1: Sử dụng DataSeeder component trong app**
1. Navigate to `/admin` page
2. Click "Data Seeder" button
3. Click "Seed 1000 Points to Supabase"

**Cách 2: Import SQL trực tiếp**

```sql
-- Sample insert
INSERT INTO map_points (_id, title, address, location, mappointtypeid, properties, status) 
VALUES (
  'sample-001',
  'Nhà hàng Phở Việt',
  '123 Phố Huế, Hai Bà Trưng, Hà Nội',
  '{"latitude": 21.0285, "longitude": 105.8542}'::jsonb,
  'Restaurant',
  '{"category": "inspected", "district": "Hai Ba Trung", "ward": "Pho Hue", "citizenReports": []}'::jsonb,
  'active'
);
```

### **Bước 4: Enable Supabase trong Code**

Mở `/src/config/features.ts` và thay đổi:

```typescript
export const FEATURES = {
  /**
   * Set to `true` to enable Supabase backend
   * Set to `false` to use local mock data
   */
  USE_SUPABASE_BACKEND: true, // ✅ Change from false to true
  // ... other features
} as const;
```

Hoặc mở `/src/utils/api/mapPointsApi.ts` và `/src/utils/api/restaurantApi.ts`:

```typescript
// Thay đổi từ false → true
const USE_SUPABASE = true; // ✅ Enable Supabase backend
```

**Recommended:** Sử dụng `/src/config/features.ts` để toggle centralized!

### **Bước 5: Verify**

```bash
# Test health endpoint
curl https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/health

# Test map points endpoint
curl https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/map-points \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

## 🔐 Security Notes

⚠️ **QUAN TRỌNG:**

1. **API Keys được sử dụng**
   - `apikey`: `sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P` (publishable key)
   - `Authorization`: Service role JWT token
   - ⚠️ Service role key có full database access - KHÔNG NÊN expose trong production frontend
   - Nên thay bằng `anon` key cho frontend

2. **Lấy Anon Key từ Supabase Dashboard**
   ```
   Dashboard → Settings → API → Project API keys → anon/public
   ```

3. **Update credentials trong `/src/utils/api/config.ts`**
   ```typescript
   export const publicAnonKey = "YOUR_ANON_KEY_HERE";
   export const apiKey = "YOUR_PUBLISHABLE_KEY_HERE";
   ```

4. **Headers được gửi với mỗi request:**
   ```typescript
   {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer <JWT_TOKEN>',
     'apikey': 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P'
   }
   ```

## 📊 Console Logs

Khi `USE_SUPABASE = false`:
```
📦 Using mock data (Supabase disabled)
```

Khi `USE_SUPABASE = true` và server OK:
```
🔍 Fetching map points from Postgres...
✅ Successfully fetched 1000 map points from database
```

Khi `USE_SUPABASE = true` nhưng server unavailable:
```
⚠️ Server health check failed - will use mock data
⚠️ Server unavailable, using mock data
```

## 🎯 Current Configuration

- **Project ID**: `hngntdaipgxhlxnenlzm`
- **API Endpoint**: `https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9`
- **Mode**: Mock Data (USE_SUPABASE = false)
- **Mock Data**: 1000 points from `/src/data/mockStores.ts`

## 🛠️ Troubleshooting

### CORS Errors
- ✅ **Fixed**: Supabase calls are disabled by default
- Set `USE_SUPABASE = false` to avoid CORS errors
- Only enable after function is deployed

### "Table does not exist"
- Create `map_points` table using SQL in Step 2
- Verify table exists: Dashboard → Database → Tables

### No data returned
- Check if data was seeded (Step 3)
- Verify RLS policies allow read access
- Check service role key is correct

### Function not found
- Deploy function using: `supabase functions deploy server`
- Verify function exists: Dashboard → Edge Functions

## 📚 Related Files

- `/src/config/features.ts` - Centralized feature toggles
- `/src/utils/api/mapPointsApi.ts` - Map points API with toggle
- `/src/utils/api/restaurantApi.ts` - Restaurant API with toggle
- `/src/utils/api/config.ts` - Supabase credentials
- `/src/data/mockStores.ts` - Mock data (1000 points)
- `/supabase/functions/server/index.tsx` - Edge Function code
- `/supabase/functions/server/kv_store.tsx` - KV Store utilities

---

**Liên hệ hỗ trợ:** Check Supabase documentation hoặc Dashboard logs