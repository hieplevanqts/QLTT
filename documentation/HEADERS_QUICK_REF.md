# 🔑 Supabase Headers - Quick Reference

## ✅ Correct Configuration (Current)

```typescript
// /src/utils/api/config.ts

export const projectId = "mwuhuixkybbwrnoqcibg";
export const apiKey = 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,  // Same publishable key!
  'apikey': apiKey,                     // Same publishable key!
  'Prefer': 'return=representation'
});
```

## 📋 Headers Breakdown

| Header | Value | Type |
|--------|-------|------|
| **Authorization** | `Bearer sb_publishable_...` | Publishable key |
| **apikey** | `sb_publishable_...` | Publishable key (SAME!) |
| **Content-Type** | `application/json` | Standard |
| **Prefer** | `return=representation` | Optional |

**CRITICAL:** Both `Authorization` and `apikey` use the **SAME publishable key**!

## 🎯 Key Mapping

| Config Variable | Headers Used In | Value |
|-----------------|-----------------|-------|
| `apiKey` | `Authorization` AND `apikey` | `sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P` |

**No JWT tokens! Only publishable key for both headers!**

## 🧪 Postman Headers (Copy-Paste)

```
Content-Type: application/json
Authorization: Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
```

## 🔍 Verify in Browser

Open DevTools → Network → Select request → Headers tab:

```yaml
Request Headers:
  Authorization: Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
  apikey: sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P
  Content-Type: application/json
  Prefer: return=representation
```

## 🚨 Common Errors

### Error: "No API key found"
**Cause:** Missing `apikey` header  
**Fix:** Add `'apikey': apiKey` to headers

### Error: 401 Unauthorized
**Cause:** Wrong or expired token  
**Fix:** Verify `anonKey` is valid and not expired

### Error: CORS preflight
**Cause:** Incorrect headers or endpoint  
**Fix:** Check base URL is `/rest/v1` not `/functions/v1`

## ✅ Testing Checklist

- [ ] `Authorization` header present
- [ ] `apikey` header present  
- [ ] Both headers use same publishable key ✅
- [ ] `Content-Type` is `application/json`
- [ ] Base URL is `https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1` ✅
- [ ] Endpoint starts with `/map_points`

## 📁 Where to Find

| What | Where |
|------|-------|
| Header config | `/src/utils/api/config.ts` |
| Usage | `/src/utils/api/mapPointsApi.ts` |
| Enable/disable | `/src/config/features.ts` |
| Full guide | `/SUPABASE_REST_API.md` |
| Troubleshooting | `/SUPABASE_API_KEY_FIX.md` |

## 🎯 Quick Commands

```bash
# Verify headers are sent (check browser console)
# Look for:
📋 Request headers: { 
  hasContentType: true, 
  hasAuthorization: true, 
  hasApiKey: true 
}

# Success message:
✅ Successfully fetched N map points from Supabase

# Fallback message (if Supabase unavailable):
⚠️ Supabase unavailable, using mock data
```

---

**Last Updated:** January 9, 2026  
**Status:** ✅ Working  
**Mode:** Supabase REST API with fallback