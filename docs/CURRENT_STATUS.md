# ⚡ MAPPA Portal - Current Status

**Last Updated:** January 9, 2026

## 🔑 Current Configuration

### Supabase REST API (ACTIVE)
- **Project ID:** `mwuhuixkybbwrnoqcibg`
- **API Key:** `sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P` (publishable key)
- **Base URL:** `https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1`
- **Table:** `map_points`
- **Mode:** Direct REST API (PostgREST)
- **Fallback:** Mock data if unavailable

### Headers (Both use same publishable key!)
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P',
  'apikey': 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P'
}
```

### Feature Toggles (`/src/config/features.ts`)
| Feature | Status | Notes |
|---------|--------|-------|
| `USE_SUPABASE_BACKEND` | ✅ `true` | Enabled - Supabase REST API |
| `ENABLE_ANALYTICS` | ⚪ `false` | Future feature |
| `ENABLE_REALTIME` | ⚪ `false` | Future feature |
| `DEBUG_MODE` | ✅ `true` | Console logging active |

## 📊 Current Behavior

### When Supabase REST API is Available:
1. 🔍 Health check: `HEAD /map_points?limit=1` (5 second timeout)
2. ✅ If OK: Fetch data from Supabase REST API
3. 📡 Response: `GET /map_points?limit=1000&order=createdtime.desc`
4. 🔄 Transform data to app format
5. ✅ Display on map

**Console Output (Success):**
```
🔍 Fetching map points from Supabase REST API...
✅ Successfully fetched 847 map points from Supabase
```

### When Supabase REST API is Unavailable:
1. ⚠️ Health check fails or times out
2. 🔄 Automatic fallback to mock data (1000 points)
3. 📦 App continues working seamlessly
4. 💡 Console warning

**Console Output (Fallback):**
```
🔍 Fetching map points from Supabase REST API...
⚠️ Supabase REST API health check failed - will use mock data
⚠️ Supabase unavailable, using mock data
✅ Loaded 1000 data points from mock (fallback)
```

## 🗂️ Data Structure

### Mock Data (`/src/data/mockStores.ts`)
- **Total Points:** 1,000
- **Business Types:** 47 (Restaurant, Cafe, Hospital, School, etc.)
- **Districts:** 12 (Ba Dinh, Hoan Kiem, Dong Da, etc.)
- **Wards:** 120+ across Hanoi
- **Status Categories:**
  - 🟢 Inspected (70%)
  - 🟡 Pending (15%)
  - 🔴 Violated (10%)
  - 🔵 Hotspot (5% - 200 points with citizen reports)

### Database Schema (when available)
```sql
Table: map_points
- _id: TEXT PRIMARY KEY
- title: TEXT NOT NULL
- address: TEXT
- location: JSONB (latitude, longitude)
- mappointtypeid: TEXT
- properties: JSONB (category, district, ward, citizenReports)
- hotline: TEXT
- logo: TEXT
- images: JSONB
- reviewscore: NUMERIC
- reviewcount: INTEGER
- openinghours: TEXT
- status: TEXT
- createdtime: TIMESTAMP
```

## 🎨 Design System

### Typography
- **Font Family:** Inter (weights: 400, 500, 600, 700)
- **Sizes:** CSS variables from `/src/styles/theme.css`
  - `--text-xs`: 12px
  - `--text-sm`: 14px
  - `--text-base`: 16px
  - `--text-lg`: 20px
  - `--text-xl`: 24px
  - `--text-2xl`: 30px
  - `--text-page-title`: 22px

### Colors
- **Primary (MAPPA Blue):** `--primary` → `#005cb6` (rgba(0, 92, 182, 1))
- **Background:** `--background` → `#F9FAFB`
- **Card:** `--card` → `#FFFFFF`
- **Border:** `--border` → `#D0D5DD`
- **Destructive:** `--destructive` → `#D92D20`

### Spacing & Layout
- **Radius:** `--radius` → 8px
- **Card Radius:** `--radius-card` → 16px
- All UI components use CSS variables for customization

## 📡 API Endpoints

### REST API Base URL (Current)
```
https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1
```

### REST API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| HEAD | `/map_points?limit=1` | Health check |
| GET | `/map_points?limit=1000&order=createdtime.desc` | Fetch all points |
| GET | `/map_points?_id=eq.{id}` | Fetch single point |
| GET | `/map_points?mapgroupid=eq.{groupId}&mappointtypeid=eq.{typeId}` | Filtered query |

**See `/SUPABASE_REST_API.md` for complete PostgREST query syntax**

## 🔧 How to Configure

### Toggle Supabase Backend
**File:** `/src/config/features.ts`
```typescript
export const FEATURES = {
  USE_SUPABASE_BACKEND: true, // Change to false to use only mock data
  // ...
};
```

### Update API Keys
**File:** `/src/utils/api/config.ts`
```typescript
export const publicAnonKey = "YOUR_ANON_KEY";
export const apiKey = "YOUR_PUBLISHABLE_KEY";
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `/FIX_CATEGORY_MISMATCH.md` | **NEW** - Fix for category value mismatch (pending/violated → valid categories) |
| `/FOUND_FILTER_ISSUE.md` | **NEW** - Diagnosis of filter mismatch issue |
| `/FIX_FIELD_MAPPING.md` | Fix for missing field mapping (type, province, district) |
| `/CHECK_FIELD_MAPPING.md` | Guide to check field mapping between backend and code |
| `/DEBUG_NO_MARKERS.md` | Debug guide for no markers displayed issue |
| `/TEST_SUPABASE_CONNECTION.md` | Test & verify Supabase connection |
| `/HEADERS_QUICK_REF.md` | Quick header reference |
| `/FIX_TOLOWERCASE_ERROR.md` | Fix for TypeError in data transformation |
| `/FIX_401_SUMMARY.md` | Fix for 401 Unauthorized error |
| `/HOW_TO_REBUILD.md` | How to force rebuild after code changes |
| `/VERIFY_FIX.md` | Verification checklist for fixes |
| `/SUPABASE_API_KEY_FIX.md` | Fix for "No API key found" error |
| `/SUPABASE_REST_API.md` | Complete REST API guide with PostgREST syntax |
| `/SUPABASE_SETUP.md` | Complete Supabase deployment guide |
| `/API_CONFIGURATION.md` | API keys, headers, endpoints reference |
| `/CORS_FIX_SUMMARY.md` | CORS error resolution history |
| `/README_BACKEND.md` | Backend quick reference |
| `/TROUBLESHOOTING_CORS.md` | CORS troubleshooting guide |
| `/CURRENT_STATUS.md` | This file - system overview |

## 🚀 Next Steps

### To Deploy Supabase (if server is down):
1. Install Supabase CLI: `npm install -g supabase`
2. Link project: `supabase link --project-ref hngntdaipgxhlxnenlzm`
3. Deploy function: `supabase functions deploy server`
4. Create database tables (SQL in `/SUPABASE_SETUP.md`)
5. Seed data via Admin panel or SQL

### To Disable Supabase (if needed):
1. Open `/src/config/features.ts`
2. Set `USE_SUPABASE_BACKEND: false`
3. App will use mock data only

## ✅ Production Readiness

- ✅ **Graceful fallback** - App works with or without backend
- ✅ **No breaking errors** - CORS failures handled gracefully
- ✅ **Complete mock data** - 1000 realistic data points
- ✅ **Design system compliant** - All CSS variables in theme.css
- ✅ **Type-safe** - Full TypeScript coverage
- ✅ **Documentation** - Complete setup guides
- ✅ **Feature toggles** - Easy on/off configuration

## 🎯 Current Mode

**🚀 SUPABASE REST API MODE:** Backend enabled with fallback to mock data

**Expected Console Output (if Supabase available):**
```
🔍 Fetching map points from Supabase REST API...
✅ Successfully fetched 847 map points from Supabase
```

**Expected Console Output (if Supabase unavailable):**
```
🔍 Fetching map points from Supabase REST API...
⚠️ Supabase REST API health check failed - will use mock data
⚠️ Supabase unavailable, using mock data
✅ Loaded 1000 data points from mock (fallback)
```

---

**Project:** MAPPA Portal UI Shell  
**Framework:** React + TypeScript + Tailwind CSS v4  
**Design:** Vuexy horizontal layout  
**Target:** Government information management system  
**Location:** Hanoi, Vietnam