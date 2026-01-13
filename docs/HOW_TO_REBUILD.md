# 🔄 How to Force Rebuild After Code Changes

**Issue:** Browser shows old error even after code is fixed  
**Cause:** Vite is using cached compiled JavaScript  
**Solution:** Force rebuild and clear browser cache

## 🚀 Method 1: Hard Refresh (FASTEST)

### Windows/Linux
```
Ctrl + Shift + R
```

Or:
```
Ctrl + F5
```

### Mac
```
Cmd + Shift + R
```

**Repeat 2-3 times if error persists!**

---

## 🔄 Method 2: Clear Vite Cache

### Stop Dev Server
```bash
# Press Ctrl+C in terminal
```

### Clear Vite Cache
```bash
# Delete Vite cache
rm -rf node_modules/.vite

# Or on Windows
rmdir /s /q node_modules\.vite
```

### Restart Dev Server
```bash
npm run dev
```

### Hard Refresh Browser
```
Ctrl + Shift + R
```

---

## 🧹 Method 3: Full Clean (NUCLEAR OPTION)

### Stop Dev Server
```bash
Ctrl+C
```

### Clean Everything
```bash
# Remove all caches and build artifacts
rm -rf node_modules/.vite
rm -rf dist
rm -rf .turbo

# Or on Windows
rmdir /s /q node_modules\.vite
rmdir /s /q dist
rmdir /s /q .turbo
```

### Restart
```bash
npm run dev
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click on Reload button
3. Select "Empty Cache and Hard Reload"

---

## 🔍 Verify Changes Applied

### Check Source Code
1. Open DevTools (F12)
2. Go to Sources tab
3. Find file: `src/utils/api/mapPointsApi.ts`
4. Search for `mapSupabaseStatus` function
5. Verify it has type guards:

```typescript
function mapSupabaseStatus(status?: string | number | object) {
  if (!status) return 'pending';
  
  // Convert to string if it's not already
  const statusStr = typeof status === 'string' ? status : String(status);
  const statusLower = statusStr.toLowerCase();  // ✅ This should be safe now
  
  // ...
}
```

### Check Console
After refresh, you should see:
```
🔍 Fetching map points from Supabase REST API...
🔄 Transforming Supabase data, sample point: { ... }
```

**NO MORE:** `TypeError: e.toLowerCase is not a function`

---

## 🎯 Quick Troubleshooting

### Error Still Appears After Hard Refresh

**Try:**
1. Close browser completely
2. Reopen browser
3. Go to app URL
4. Hard refresh again (Ctrl+Shift+R)

### Dev Server Not Picking Up Changes

**Check:**
```bash
# Make sure dev server is running
npm run dev

# You should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

**If stuck:**
```bash
# Kill all node processes
pkill -f node  # Linux/Mac
taskkill /F /IM node.exe  # Windows

# Restart
npm run dev
```

### Browser Shows "File Not Found"

**Solution:**
```bash
# Make sure you're on the right URL
http://localhost:5173/

# Not:
http://localhost:5173/src/app/App.tsx  ❌
```

---

## ✅ Success Indicators

### Console Output (Success)
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
🔄 Transforming Supabase data, sample point: { ... }
✅ Successfully fetched N map points from Supabase
```

### No Errors
- ❌ No `TypeError: e.toLowerCase is not a function`
- ❌ No `401 Unauthorized`
- ❌ No CORS errors

### Map Loads
- ✅ Map displays
- ✅ Markers appear
- ✅ Data loads (either from Supabase or mock)

---

## 🐛 Still Having Issues?

### Check These Files Were Updated

1. **`/src/utils/api/mapPointsApi.ts`**
   - Line 213: `function mapSupabaseStatus(status?: string | number | object)`
   - Line 218: `const statusStr = typeof status === 'string' ? status : String(status);`

2. **`/src/utils/api/config.ts`**
   - Line 7: `export const projectId = "mwuhuixkybbwrnoqcibg";`
   - Line 10: `export const apiKey = 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P';`
   - Line 21: Both headers use `apiKey`

3. **`/src/config/features.ts`**
   - Line 21: `USE_SUPABASE_BACKEND: true`

### Verify in Browser DevTools

1. Open DevTools (F12)
2. Network tab
3. Refresh page
4. Look for request to `map_points`
5. Check:
   - Request Headers have `apikey` and `Authorization`
   - Response status is `200 OK` or error is logged in console

---

## 📚 Related Docs

- `/FIX_TOLOWERCASE_ERROR.md` - Details about the type error fix
- `/TEST_SUPABASE_CONNECTION.md` - How to test Supabase connection
- `/CURRENT_STATUS.md` - Current system configuration

---

## 🎯 TLDR

**Just do this:**
1. Press `Ctrl + Shift + R` (hard refresh) **3 times**
2. Check console for `🔄 Transforming Supabase data` log
3. Error should be gone!

If still broken:
```bash
# In terminal
Ctrl+C
rm -rf node_modules/.vite
npm run dev

# In browser
Ctrl + Shift + R (3 times)
```

**Last Resort:**
Close browser → Restart dev server → Reopen browser → Hard refresh

---

**Fixed:** January 9, 2026  
**Issue:** `TypeError: e.toLowerCase is not a function`  
**Solution:** Type guards + hard refresh  
**Status:** ✅ Code is fixed, just need to rebuild
