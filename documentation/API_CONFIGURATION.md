# 🔑 API Configuration Reference

## Current Configuration

**File:** `/src/utils/api/config.ts`

```typescript
// Supabase credentials
export const projectId = "hngntdaipgxhlxnenlzm";
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
export const apiKey = "sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P";

// API base URL
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e4fdfce9`;

// Headers helper
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': apiKey
});
```

## 📋 Headers Sent with Every Request

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Type` | `application/json` | JSON payload format |
| `Authorization` | `Bearer <JWT_TOKEN>` | Authentication token |
| `apikey` | `sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P` | Publishable API key |

## 🔄 How to Update API Keys

### Option 1: Update in Config File (Recommended)

Edit `/src/utils/api/config.ts`:

```typescript
export const publicAnonKey = "YOUR_NEW_ANON_KEY";
export const apiKey = "YOUR_NEW_PUBLISHABLE_KEY";
```

### Option 2: Get Keys from Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/hngntdaipgxhlxnenlzm)
2. Navigate to: **Settings** → **API**
3. Copy keys:
   - **anon/public** → Use for `publicAnonKey`
   - **service_role** → Use for backend only (NOT frontend!)

## 🎯 Current API Endpoints

All endpoints use `getHeaders()` automatically:

### Health Check
```
GET /make-server-e4fdfce9/health
```

### Map Points
```
GET /make-server-e4fdfce9/map-points
GET /make-server-e4fdfce9/map-points/:id
```

### Restaurants (KV Store - Legacy)
```
GET    /make-server-e4fdfce9/restaurants
GET    /make-server-e4fdfce9/restaurants/:id
POST   /make-server-e4fdfce9/seed-restaurants
DELETE /make-server-e4fdfce9/restaurants
```

## 🔒 Security Best Practices

### ✅ DO:
- Use `anon` key for frontend applications
- Use `service_role` key ONLY in backend/server-side code
- Store sensitive keys in environment variables
- Rotate keys periodically

### ❌ DON'T:
- Expose `service_role` key in client-side code
- Commit API keys to public repositories
- Use production keys in development

## 🧪 Testing API Calls

### Using curl:

```bash
# Health check
curl https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/health \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P"

# Get map points
curl https://hngntdaipgxhlxnenlzm.supabase.co/functions/v1/make-server-e4fdfce9/map-points \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P" \
  -H "Content-Type: application/json"
```

### Using JavaScript:

```typescript
import { API_BASE_URL, getHeaders } from './utils/api/config';

const response = await fetch(`${API_BASE_URL}/map-points`, {
  method: 'GET',
  headers: getHeaders()
});

const data = await response.json();
console.log(data);
```

## 🔄 Feature Toggle

**File:** `/src/config/features.ts`

```typescript
export const FEATURES = {
  USE_SUPABASE_BACKEND: false, // ❌ DISABLED - Edge Function chưa deploy
  // ...
};
```

**Current State:** `false` ❌ (using mock data only - no network calls)

## 📊 What Happens When...

| Scenario | Behavior |
|----------|----------|
| `USE_SUPABASE_BACKEND = false` | ✅ No API calls, uses `/src/data/mockStores.ts` |
| `USE_SUPABASE_BACKEND = true` + Server OK | ✅ Fetches from Supabase with headers |
| `USE_SUPABASE_BACKEND = true` + Server Down | ⚠️ Falls back to mock data |
| `USE_SUPABASE_BACKEND = true` + CORS Error | ⚠️ Falls back to mock data |

## 🛠️ Troubleshooting

### Missing `apikey` header error
- Check `/src/utils/api/config.ts` has `apiKey` exported
- Verify `getHeaders()` includes `'apikey': apiKey`

### 401 Unauthorized
- Check JWT token in `publicAnonKey` is valid
- Verify token hasn't expired
- Ensure Supabase project ID is correct

### 403 Forbidden
- Check Row Level Security (RLS) policies in Supabase
- Verify API key has correct permissions

### Network/CORS errors
- Set `USE_SUPABASE_BACKEND = false` to bypass
- Ensure Edge Function is deployed
- Check CORS configuration in `/supabase/functions/server/index.tsx`

## 📁 Related Files

- `/src/utils/api/config.ts` - **Main config file**
- `/src/utils/api/mapPointsApi.ts` - Uses `getHeaders()`
- `/src/utils/api/restaurantApi.ts` - Uses `getHeaders()`
- `/src/config/features.ts` - Feature toggles
- `/supabase/functions/server/index.tsx` - Server-side CORS config

---

**Last Updated:** January 2026  
**Project ID:** hngntdaipgxhlxnenlzm  
**Mode:** 📦 Mock Data Only (Supabase disabled to prevent CORS errors)