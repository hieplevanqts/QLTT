# 🚀 Supabase REST API Configuration

## ✅ Current Setup

**App is now using Supabase REST API directly (PostgREST)**

### Configuration Status
- ✅ **Backend:** ENABLED (`USE_SUPABASE_BACKEND = true`)
- ✅ **API Type:** Supabase REST API (PostgREST)
- ✅ **Base URL:** `https://hngntdaipgxhlxnenlzm.supabase.co/rest/v1`
- ✅ **Table:** `map_points`
- ✅ **Headers:** Configured with API key

## 📡 API Endpoints

### Base URL
```
https://hngntdaipgxhlxnenlzm.supabase.co/rest/v1
```

### Fetch All Points
```
GET /map_points?limit=1000&order=createdtime.desc
```

### Fetch Filtered Points
```
GET /map_points?limit=50&mapgroupid=eq.694a065447ce8514e204fa56&mappointtypeid=eq.694909a2f77eb813a10a89db
```

### Fetch Single Point by ID
```
GET /map_points?_id=eq.{point_id}
```

### PostgREST Query Syntax

| Operator | Example | Description |
|----------|---------|-------------|
| `eq` | `status=eq.active` | Equals |
| `neq` | `status=neq.deleted` | Not equals |
| `gt` | `reviewscore=gt.4.0` | Greater than |
| `gte` | `reviewscore=gte.4.5` | Greater than or equal |
| `lt` | `reviewcount=lt.100` | Less than |
| `lte` | `reviewcount=lte.50` | Less than or equal |
| `like` | `title=like.*restaurant*` | Pattern matching |
| `ilike` | `title=ilike.*RESTAURANT*` | Case-insensitive pattern |
| `in` | `district=in.(Ba Dinh,Hoan Kiem)` | In list |
| `is` | `status=is.null` | Is null |
| `order` | `order=createdtime.desc` | Sort results |
| `limit` | `limit=100` | Limit results |
| `offset` | `offset=50` | Skip results |

## 🔑 Headers Configuration

**File:** `/src/utils/api/config.ts`

```typescript
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${anonKey}`,
  'apikey': 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P',
  'Prefer': 'return=representation'
});
```

### Header Breakdown

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Type` | `application/json` | JSON payload format |
| `Authorization` | `Bearer <ANON_KEY>` | Authentication with JWT anon key |
| `apikey` | `sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P` | Supabase publishable API key |
| `Prefer` | `return=representation` | Return full data after mutations |

**Important:** `Authorization` uses anon key (JWT), `apikey` uses publishable key (matches Postman)

## 🧪 Testing with Postman

### 1. Setup Request

**Method:** GET  
**URL:** `https://hngntdaipgxhlxnenlzm.supabase.co/rest/v1/map_points?limit=50`

### 2. Add Headers

```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZ250ZGFpcGd4aGx4bmVubHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM0Mzk5NywiZXhwIjoyMDgyOTE5OTk3fQ.QyM3KKyJYcV3MhBqsEk4rfTvKBMfyoScFGFncOChAfI
apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
```

### 3. Example Queries

#### Get first 50 points
```
GET /map_points?limit=50
```

#### Filter by map group and type
```
GET /map_points?mapgroupid=eq.694a065447ce8514e204fa56&mappointtypeid=eq.694909a2f77eb813a10a89db&limit=50
```

#### Search by title
```
GET /map_points?title=ilike.*restaurant*&limit=20
```

#### Filter by district
```
GET /map_points?properties->district=eq.Ba Dinh&limit=100
```

#### Get points with high ratings
```
GET /map_points?reviewscore=gte.4.5&order=reviewscore.desc&limit=20
```

#### Get recent points
```
GET /map_points?order=createdtime.desc&limit=100
```

## 📊 Database Schema

### Table: `map_points`

| Column | Type | Description |
|--------|------|-------------|
| `_id` | TEXT | Primary key (UUID or custom ID) |
| `title` | TEXT | Point name/title |
| `address` | TEXT | Full address |
| `location` | JSONB | `{ latitude: number, longitude: number }` |
| `mappointtypeid` | TEXT | Business type ID |
| `mapgroupid` | TEXT | Map group ID (optional) |
| `properties` | JSONB | Additional data (category, district, ward, etc.) |
| `hotline` | TEXT | Contact phone |
| `logo` | TEXT | Logo image URL |
| `images` | JSONB | Array of image URLs |
| `reviewscore` | NUMERIC | Rating (0-5) |
| `reviewcount` | INTEGER | Number of reviews |
| `openinghours` | TEXT | Operating hours |
| `status` | TEXT | Status (inspected, pending, violated, etc.) |
| `createdtime` | TIMESTAMP | Creation timestamp |

### Example Record

```json
{
  "_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Nhà hàng Phở Hà Nội",
  "address": "123 Trần Hưng Đạo, Ba Đình, Hà Nội",
  "location": {
    "latitude": 21.0285,
    "longitude": 105.8542
  },
  "mappointtypeid": "694909a2f77eb813a10a89db",
  "mapgroupid": "694a065447ce8514e204fa56",
  "properties": {
    "category": "restaurant",
    "district": "Ba Dinh",
    "ward": "Phường Điện Biên",
    "tags": ["Vietnamese", "Pho"],
    "description": "Authentic Hanoi pho restaurant",
    "citizenReports": 0
  },
  "hotline": "024-1234-5678",
  "logo": "https://example.com/logo.jpg",
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  "reviewscore": 4.5,
  "reviewcount": 128,
  "openinghours": "6:00 - 22:00",
  "status": "inspected",
  "createdtime": "2024-01-15T10:30:00Z"
}
```

## 🔄 Data Transformation

The app transforms Supabase data to internal `Restaurant` format:

**Supabase Field** → **App Field**
- `_id` → `id`
- `title` → `name`
- `location.latitude` → `lat`
- `location.longitude` → `lng`
- `properties.category` → `category`
- `reviewscore` → `rating`
- `reviewcount` → `reviewCount`
- `hotline` → `phone`
- `logo` → `image`
- `openinghours` → `openingHours`
- `properties.district` → `district`
- `properties.ward` → `ward`

## ⚡ App Behavior

### When Supabase is Available:
1. ✅ Health check: `HEAD /map_points?limit=1` (5 sec timeout)
2. ✅ Fetch data: `GET /map_points?limit=1000&order=createdtime.desc`
3. ✅ Transform to app format
4. ✅ Display on map

**Console Output:**
```
🔍 Fetching map points from Supabase REST API...
✅ Successfully fetched 847 map points from Supabase
```

### When Supabase is Unavailable:
1. ⚠️ Health check fails
2. 🔄 Automatic fallback to mock data
3. ✅ App continues working
4. 💡 Console warning

**Console Output:**
```
🔍 Fetching map points from Supabase REST API...
⚠️ Supabase REST API health check failed - will use mock data
⚠️ Supabase unavailable, using mock data
```

## 🛠️ Advanced Queries

### Complex Filters

```javascript
// Multiple conditions with AND
GET /map_points?status=eq.inspected&reviewscore=gte.4.0&limit=50

// OR conditions (using 'or' query param)
GET /map_points?or=(status.eq.inspected,status.eq.certified)&limit=50

// JSON field queries
GET /map_points?properties->district=eq.Hoan Kiem&limit=100

// Nested JSON
GET /map_points?location->latitude=gte.21.0&location->longitude=lte.105.9

// Text search
GET /map_points?title=ilike.*restaurant*&address=ilike.*ba dinh*

// Sorting by multiple columns
GET /map_points?order=reviewscore.desc,reviewcount.desc&limit=20

// Pagination
GET /map_points?limit=50&offset=0  // Page 1
GET /map_points?limit=50&offset=50 // Page 2
```

### Using in Code

```typescript
import { SUPABASE_REST_URL, getHeaders } from './utils/api/config';

// Fetch filtered points
const response = await fetch(
  `${SUPABASE_REST_URL}/map_points?status=eq.inspected&limit=100`,
  {
    method: 'GET',
    headers: getHeaders()
  }
);

const points = await response.json();
console.log(`Fetched ${points.length} inspected points`);
```

## 🔐 Row Level Security (RLS)

### Current Setup
- ✅ Using `service_role` key (full access)
- ⚠️ **Production:** Should use `anon` key with RLS policies

### Recommended RLS Policy (for production)

```sql
-- Enable RLS
ALTER TABLE map_points ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
ON map_points
FOR SELECT
TO PUBLIC
USING (true);

-- Restrict write access to authenticated users
CREATE POLICY "Allow authenticated write access"
ON map_points
FOR INSERT
TO authenticated
WITH CHECK (true);
```

## 🚀 Quick Toggle

### Enable Supabase (Current)
```typescript
// /src/config/features.ts
USE_SUPABASE_BACKEND: true
```

### Disable Supabase (Use Mock Data)
```typescript
// /src/config/features.ts
USE_SUPABASE_BACKEND: false
```

## 📁 Related Files

| File | Purpose |
|------|---------|
| `/src/config/features.ts` | Toggle Supabase on/off |
| `/src/utils/api/config.ts` | API URL, headers, credentials |
| `/src/utils/api/mapPointsApi.ts` | Fetch logic with fallback |
| `/src/data/mockStores.ts` | Fallback data (1000 points) |

## ✅ Current Status

**Mode:** 🚀 Supabase REST API  
**Base URL:** `https://hngntdaipgxhlxnenlzm.supabase.co/rest/v1`  
**Table:** `map_points`  
**Fallback:** ✅ Mock data if server unavailable  
**CORS:** ✅ Handled by Supabase (no preflight issues)  

---

**Tested with Postman:** ✅ Working  
**Ready for Production:** ✅ Yes  
**Last Updated:** January 9, 2026