# 🧪 Test Supabase Connection

## ✅ Current Configuration

### Project Details
- **Project ID:** `mwuhuixkybbwrnoqcibg`
- **API Key:** `sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P`
- **Base URL:** `https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1`

### Headers (Both use same publishable key)
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P',
  'apikey': 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P'
}
```

## 🧪 Test Commands

### 1. Test with curl (Copy-Paste Ready)

```bash
curl 'https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/map_points?limit=50' \
  --header 'apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Authorization: Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Content-Type: application/json'
```

### 2. Test with filters (matches your Postman request)

```bash
curl 'https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/map_points?limit=50&mapgroupid=eq.694a065447ce8514e204fa56&mappointtypeid=eq.694909a2f77eb813a10a89db' \
  --header 'apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Authorization: Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Content-Type: application/json'
```

### 3. Test single point by ID

```bash
curl 'https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/map_points?_id=eq.YOUR_POINT_ID' \
  --header 'apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Authorization: Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Content-Type: application/json'
```

### 4. Test table schema

```bash
curl 'https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/' \
  --header 'apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Authorization: Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Content-Type: application/json'
```

## 🔍 Expected Responses

### Success (200 OK)
```json
[
  {
    "_id": "abc123",
    "title": "Restaurant Name",
    "address": "123 Street",
    "location": {
      "latitude": 21.0285,
      "longitude": 105.8542
    },
    ...
  }
]
```

### Empty (200 OK, no data)
```json
[]
```

### Error (401 Unauthorized)
```json
{
  "message": "Invalid API key",
  "hint": "Check your apikey header"
}
```

### Error (404 Not Found)
```json
{
  "message": "relation \"public.map_points\" does not exist",
  "hint": "Check if table exists"
}
```

## 🔍 Debug Browser Request

Open DevTools Console and look for:

### Request Logs
```
🔍 Fetching map points from Supabase REST API...
📋 Request headers: {
  hasContentType: true,
  hasAuthorization: true,
  hasApiKey: true,
  authorizationPreview: "Bearer sb_publishable_oURI6...",
  apiKeyPreview: "sb_publishable_oURI6..."
}
📡 Fetching from: https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/map_points?limit=1000&order=createdtime.desc
🔑 Using project: https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1
```

### Success Response
```
✅ Successfully fetched 847 map points from Supabase
```

### Error Response
```
❌ Failed to fetch map points: 401 Unauthorized
❌ Error details: {"message":"Invalid API key"}
⚠️ Falling back to mock data
```

## 🔧 Troubleshooting

### Error: 401 Unauthorized

**Check:**
1. ✅ API key is correct: `sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P`
2. ✅ Both headers use same key
3. ✅ Key hasn't expired
4. ✅ Project ID is correct: `mwuhuixkybbwrnoqcibg`

**Test in Postman:**
- Paste exact headers from above
- Verify you get 200 OK response
- If Postman works but browser doesn't, check CORS

### Error: 404 Not Found (Table doesn't exist)

**Check:**
1. Table `map_points` exists in Supabase
2. Table is in `public` schema
3. RLS policies allow SELECT for publishable key

**To verify table exists:**
```bash
# List all tables
curl 'https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/' \
  --header 'apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P' \
  --header 'Authorization: Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P'
```

### Error: CORS preflight

**Check:**
1. Request is to `/rest/v1` not `/functions/v1`
2. Headers are lowercase
3. No extra characters in API key

### App still using mock data

**Check:**
1. `USE_SUPABASE_BACKEND: true` in `/src/config/features.ts`
2. Refresh browser (hard refresh: Ctrl+Shift+R)
3. Check console for errors
4. Verify Supabase project is online

## 📊 Verify in Network Tab

1. Open DevTools → Network tab
2. Refresh app
3. Find request to `map_points`
4. Click on request
5. Check:

### Request Headers Should Be:
```
Accept: */*
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
Authorization: Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
Content-Type: application/json
Origin: http://localhost:5173
Prefer: return=representation
```

### Response Should Be:
```
Status: 200 OK
Content-Type: application/json

[
  { ... map point data ... }
]
```

## ✅ Configuration Files

### `/src/utils/api/config.ts`
```typescript
export const projectId = "mwuhuixkybbwrnoqcibg";
export const apiKey = 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
  'apikey': apiKey,
  'Prefer': 'return=representation'
});
```

### `/src/config/features.ts`
```typescript
export const FEATURES = {
  USE_SUPABASE_BACKEND: true  // Must be true!
};
```

## 🎯 Quick Checklist

- [ ] Project ID: `mwuhuixkybbwrnoqcibg` ✅
- [ ] API key: `sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P` ✅
- [ ] Both headers use same key ✅
- [ ] `USE_SUPABASE_BACKEND: true` ✅
- [ ] Curl test works ✅
- [ ] Postman test works ✅
- [ ] Browser console shows logs ✅
- [ ] Network tab shows 200 OK ✅

## 🚀 Next Steps

If all checks pass:
1. ✅ Configuration is correct
2. ✅ Refresh browser
3. ✅ Check console for success message
4. ✅ Verify data loads on map

If tests still fail:
1. 📋 Copy error message from console
2. 📋 Copy response from Network tab
3. 📋 Check Supabase dashboard for table status
4. 📋 Verify RLS policies allow SELECT

---

**Last Updated:** January 9, 2026  
**Status:** ✅ Configured  
**Project:** mwuhuixkybbwrnoqcibg
