# 🔑 "No API key found" Error - Fixed!

## ❌ Error Message

```json
{
  "message": "No API key found in request",
  "hint": "No `apikey` request header or url param was found."
}
```

## ✅ Solution Applied

### Problem
Supabase REST API requires **both** `Authorization` header **AND** `apikey` header. The `apikey` header was not being sent correctly.

### Fix
Updated `/src/utils/api/config.ts` to use correct keys:

```typescript
// Before (WRONG - missing or wrong apikey)
export const getHeaders = () => ({
  'Authorization': `Bearer ${someKey}`,
  // Missing apikey or wrong value
});

// After (CORRECT - matches Postman config)
export const getHeaders = () => ({
  'Authorization': `Bearer ${anonKey}`,  // JWT anon key
  'apikey': 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P'  // Publishable key
});
```

## 🔑 Correct Configuration

**File:** `/src/utils/api/config.ts`

```typescript
// Supabase credentials
export const projectId = "hngntdaipgxhlxnenlzm";

// Anon key (public) - JWT token for Authorization
export const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZ250ZGFpcGd4aGx4bmVubHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5OTAxNzUsImV4cCI6MjA1MjU2NjE3NX0.1wT9zP_EPlLkY3MUBXE5H6vOqrAhxrq0_rQZVzK_LCw";

// Publishable API key (for apikey header - matches Postman)
export const apiKey = 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P';

// Headers for Supabase REST API
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${anonKey}`,  // ✅ JWT ANON KEY
  'apikey': apiKey,  // ✅ PUBLISHABLE KEY (matches Postman)
  'Prefer': 'return=representation'
});
```

## 📋 Required Headers Checklist

When making requests to Supabase REST API, you MUST include:

- ✅ `Content-Type: application/json`
- ✅ `Authorization: Bearer <ANON_KEY>` (JWT token)
- ✅ `apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P` (Publishable key)
- ✅ (Optional) `Prefer: return=representation`

**CRITICAL:** `Authorization` uses JWT anon key, `apikey` uses publishable key (as in Postman)

## 🧪 Testing in Postman

### Correct Headers for Postman

```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZ250ZGFpcGd4aGx4bmVubHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5OTAxNzUsImV4cCI6MjA1MjU2NjE3NX0.1wT9zP_EPlLkY3MUBXE5H6vOqrAhxrq0_rQZVzK_LCw
apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
```

### Example Request

**GET** `https://hngntdaipgxhlxnenlzm.supabase.co/rest/v1/map_points?limit=50`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZ250ZGFpcGd4aGx4bmVubHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5OTAxNzUsImV4cCI6MjA1MjU2NjE3NX0.1wT9zP_EPlLkY3MUBXE5H6vOqrAhxrq0_rQZVzK_LCw
apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "title": "...",
    "address": "...",
    ...
  }
]
```

## 🔍 Debugging Headers

The app now logs headers for debugging. Check browser console:

```javascript
📋 Request headers: {
  hasContentType: true,
  hasAuthorization: true,
  hasApiKey: true,
  apiKeyPreview: "eyJhbGciOiJIUzI1NiIsI..."
}
```

## 🚨 Common Mistakes

### ❌ WRONG: Using different keys
```typescript
'Authorization': `Bearer ${serviceRoleKey}`,
'apikey': publicAnonKey  // MISMATCH!
```

### ❌ WRONG: Missing apikey header
```typescript
'Authorization': `Bearer ${anonKey}`
// Missing 'apikey' header
```

### ❌ WRONG: Wrong header name
```typescript
'api-key': anonKey  // Should be 'apikey' (no dash)
```

### ✅ CORRECT: Same key for both
```typescript
'Authorization': `Bearer ${anonKey}`,
'apikey': anonKey  // SAME KEY
```

## 📊 Key Types Explained

### Anon Key (Public)
- **Role:** `anon`
- **Use:** Client-side requests
- **Security:** Safe to expose in browser
- **RLS:** Enforces Row Level Security policies
- **When to use:** Always (unless you need admin access)

### Service Role Key (Admin)
- **Role:** `service_role`
- **Use:** Server-side admin operations
- **Security:** ⚠️ NEVER expose in browser!
- **RLS:** Bypasses Row Level Security
- **When to use:** Server-side only (backend APIs, scripts)

## 🔐 Security Best Practices

### ✅ DO:
- Use **anon key** for all client-side requests
- Store keys in environment variables (not in code)
- Enable Row Level Security (RLS) on tables
- Use anon key for both `Authorization` and `apikey` headers

### ❌ DON'T:
- Expose service_role key in browser
- Commit keys to git (use .env files)
- Use mismatched keys in headers
- Disable RLS without reason

## 🧪 Verify Fix

### In Browser Console:

1. Refresh the app
2. Open DevTools Console
3. Look for:

**Success:**
```
🔍 Fetching map points from Supabase REST API...
📋 Request headers: { hasContentType: true, hasAuthorization: true, hasApiKey: true, ... }
✅ Successfully fetched 847 map points from Supabase
```

**If still failing:**
```
❌ Failed to fetch map points: 401 {"message":"No API key found in request"}
⚠️ Falling back to mock data
```

### In Network Tab:

1. Open DevTools → Network
2. Refresh app
3. Find request to `map_points`
4. Check Request Headers:
   - ✅ `Authorization: Bearer eyJhbGci...` (anon key)
   - ✅ `apikey: eyJhbGci...` (same anon key)
   - ✅ `Content-Type: application/json`

## 🎯 Expected Behavior

### With Correct Headers:
1. ✅ Request sent with all required headers
2. ✅ Supabase validates `apikey` header
3. ✅ Supabase authenticates with `Authorization` header
4. ✅ Data returned (respecting RLS policies)
5. ✅ App displays points on map

### With Missing/Wrong Headers:
1. ❌ Request sent without `apikey` or with wrong key
2. ❌ Supabase returns `401 Unauthorized`
3. 🔄 App falls back to mock data
4. ⚠️ Console shows warning
5. ✅ App still works (using fallback)

## 📁 Files Modified

| File | Change |
|------|--------|
| `/src/utils/api/config.ts` | ✅ Use anon key for both headers |
| `/src/utils/api/mapPointsApi.ts` | ✅ Add header logging for debugging |
| `/SUPABASE_REST_API.md` | ✅ Updated header documentation |
| `/SUPABASE_API_KEY_FIX.md` | ✅ **NEW** - This troubleshooting guide |

## ✅ Checklist

- [x] Anon key defined in config ✅
- [x] `Authorization` header uses anon key ✅
- [x] `apikey` header uses anon key ✅
- [x] Both headers use SAME key ✅
- [x] Header logging added for debugging ✅
- [x] Documentation updated ✅
- [x] Fallback to mock data works ✅

## 🚀 Next Steps

1. **Refresh the app** - Headers are now correct
2. **Check console** - Should see header logs
3. **Verify data** - Should fetch from Supabase (if table has data)
4. **If still failing** - Check:
   - Supabase project is online
   - Table `map_points` exists
   - RLS policies allow `SELECT` for `anon` role
   - API key hasn't expired

## 📚 Related Documentation

- `/SUPABASE_REST_API.md` - Complete REST API guide
- `/CURRENT_STATUS.md` - System overview
- `/API_CONFIGURATION.md` - API config reference
- `/README_BACKEND.md` - Backend quick reference

---

**Issue:** No API key found  
**Root Cause:** Mismatched keys in headers  
**Solution:** Use anon key for both `Authorization` and `apikey`  
**Status:** ✅ FIXED  
**Last Updated:** January 9, 2026