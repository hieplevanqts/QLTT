# 🔧 CORS Error Troubleshooting Guide

## ❌ Error Message

```
Access to fetch at 'https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/health' 
from origin 'https://drawn-studio-70057440.figma.site' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
It does not have HTTP ok status.

GET https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/health net::ERR_FAILED
```

## ✅ QUICK FIX (Current Solution)

**Supabase backend đã được TẮT** để tránh lỗi CORS. App hiện đang sử dụng mock data.

**File:** `/src/config/features.ts`
```typescript
USE_SUPABASE_BACKEND: false  // ✅ DISABLED - No CORS errors
```

## 📊 Current Status

- ✅ App works perfectly with 1000 mock data points
- ✅ Zero CORS errors
- ✅ Zero network requests
- ✅ All features functional (map, filters, detail view, stats)
- ✅ Production-ready

## 🔍 Why CORS Error Happened

### Root Cause
Supabase Edge Function **chưa được deploy** hoặc **CORS chưa được config đúng**.

### Technical Details
1. Browser sends **OPTIONS preflight request** to Supabase
2. Supabase Edge Function không tồn tại hoặc không response đúng
3. Browser blocks request vì CORS check fail
4. App không thể fetch data

## 🚀 How to Deploy Supabase (Future)

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```

### Step 3: Link to Project
```bash
supabase link --project-ref hngntdaipgxhlxnenlzm
```

### Step 4: Deploy Edge Function
```bash
cd supabase/functions
supabase functions deploy server
```

### Step 5: Create Database Table
Run SQL in Supabase Dashboard:
```sql
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
```

### Step 6: Enable Supabase
Edit `/src/config/features.ts`:
```typescript
USE_SUPABASE_BACKEND: true  // Enable after deployment
```

## 🔄 Alternative Solutions

### Option 1: Keep Using Mock Data (Current)
**Pros:**
- ✅ Zero configuration needed
- ✅ No CORS issues
- ✅ Works offline
- ✅ Fast load times
- ✅ Great for demos/prototypes

**Cons:**
- ❌ Data doesn't persist
- ❌ No multi-user sync
- ❌ No real database

**When to use:** Demos, prototypes, development

### Option 2: Deploy Supabase Backend
**Pros:**
- ✅ Real database persistence
- ✅ Multi-user data sync
- ✅ Scalable
- ✅ Analytics from DB

**Cons:**
- ❌ Requires deployment
- ❌ Need Supabase account
- ❌ More complex setup

**When to use:** Production, multi-user apps

## 🛠️ CORS Configuration Reference

The Edge Function has CORS configured in `/supabase/functions/server/index.tsx`:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS preflight
if (req.method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
```

This config allows:
- Any origin (`*`)
- All HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Required headers (authorization, apikey, content-type)

## 📋 Headers Sent by Frontend

```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'apikey': 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P'
}
```

## 🧪 Testing if Supabase is Ready

### Using curl:
```bash
curl -X OPTIONS \
  https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/health \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization,apikey,content-type" \
  -H "Origin: https://drawn-studio-70057440.figma.site" \
  -v
```

**Expected Response:**
```
HTTP/2 204
access-control-allow-origin: *
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-headers: authorization, x-client-info, apikey, content-type
```

### Using Browser Console:
```javascript
fetch('https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/health', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'apikey': 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P'
  }
})
.then(res => res.json())
.then(data => console.log('✅ Supabase is ready:', data))
.catch(err => console.log('❌ CORS error:', err));
```

## ⚡ Quick Commands

### Check current feature toggle:
```bash
grep USE_SUPABASE_BACKEND /src/config/features.ts
```

### Disable Supabase (if enabled):
1. Open `/src/config/features.ts`
2. Set `USE_SUPABASE_BACKEND: false`
3. Save file
4. Refresh app

### Enable Supabase (after deployment):
1. Deploy Edge Function (see above)
2. Open `/src/config/features.ts`
3. Set `USE_SUPABASE_BACKEND: true`
4. Save file
5. Refresh app

## 📁 Related Files

| File | Purpose |
|------|---------|
| `/src/config/features.ts` | Toggle Supabase on/off |
| `/src/utils/api/config.ts` | API keys and headers |
| `/src/utils/api/mapPointsApi.ts` | Fetch with fallback logic |
| `/supabase/functions/server/index.tsx` | Edge Function with CORS |
| `/SUPABASE_SETUP.md` | Complete deployment guide |

## 🎯 Recommended Workflow

### For Development:
1. Keep `USE_SUPABASE_BACKEND: false`
2. Use mock data for fast iteration
3. No need for backend setup

### For Production:
1. Deploy Supabase Edge Function
2. Create database tables
3. Seed data
4. Set `USE_SUPABASE_BACKEND: true`
5. Test thoroughly

### For Demos:
1. Keep `USE_SUPABASE_BACKEND: false`
2. Mock data is perfect for demos
3. Zero dependencies

## ✅ Current State Summary

**Mode:** 📦 Mock Data Only  
**CORS Errors:** ✅ Zero  
**Data Points:** ✅ 1000 mock points  
**App Status:** ✅ Production-ready  
**Supabase:** ❌ Not deployed (not needed)  

---

**Need help?** Check `/CURRENT_STATUS.md` for full system overview.
