# 🎯 Merchant ID Flow - Quick Reference Card

## 🔴 **CRITICAL CONCEPT**
```
Numeric ID (1, 2, 3, ...)     ← Used in URL & frontend
        ↓
    fetchStoreById(123)
        ↓
API returns merchant record with:
    id = "14dd8b16-..." (UUID)  ← Store in Store.merchantId
        ↓
updateMerchant(UUID, data)     ← Send UUID to API
        ↓
WHERE p_merchant_id = UUID     ← Database matches on UUID
```

---

## 📍 Each Step's Role

| Step | Receives | Uses | Logs | Sends |
|------|----------|------|------|-------|
| **List** | store.id (123) | - | numeric_id | numeric_id in URL |
| **Detail** | id from URL | id=eq.123 | numeric + UUID | - |
| **Load API** | numeric_id | SELECT from API | merchant_id_uuid | merchant.id |
| **Form** | merchantId prop | - | both IDs | - |
| **Edit** | form data | - | both IDs | numeric_id in URL |
| **Submit** | merchantId | p_merchant_id | merchant_id_uuid | UUID to API |
| **API** | UUID | WHERE p_merchant_id=? | p_merchant_id | updated record |
| **Database** | UUID | WHERE id=UUID | - | ✅ record updated |

---

## 🔍 What Each Log Shows

```typescript
// ✅ CORRECT Pattern
✅ [function] { numeric_id: 123, merchant_id: "14dd8b16-..." }

// ❌ WRONG Pattern
❌ [function] { id: 123 }              // Missing UUID!
❌ [function] { merchant_id: 123 }     // UUID should be string!
❌ [function] { p_merchant_id: 123 }   // Should be UUID!
```

---

## 🛑 Common Issues & Quick Fixes

### Issue: "Update not working"
**Check**: `merchant_id` in logs is UUID? (has dashes)
**Fix**: Verify `fetchStoreById` has `merchantId: merchant.id`

### Issue: "Updating wrong record"
**Check**: Different numeric_ids in log?
**Fix**: Ensure numeric_id from URL matches API query

### Issue: "API returns 400"
**Check**: `p_merchant_id` is UUID?
**Fix**: Ensure `merchantId` passed to `updateMerchant`

### Issue: "Console shows ⚠️ No merchantId"
**Check**: `fetchStoreById` returning full object?
**Fix**: Add `merchantId: merchant.id` to return

---

## 📱 Mobile Debugging

**Open Console on mobile:**
- Android Chrome: `chrome://inspect`
- iOS Safari: Settings → Advanced → Web Inspector

**Filter logs:**
- Type in console: `filter: "merchant_id"`
- Shows only UUID/ID related logs

---

## ✅ Test Checklist - 1 Minute

```
[ ] Navigate from list → see numeric_id log
[ ] Load store → see merchant_id UUID log
[ ] Edit store → form has merchantId property
[ ] Submit → see UUID in API payload log
[ ] Response → see ✅ success with UUID
[ ] Database → data actually changed
```

---

## 💡 Pro Tips

### Tip 1: Find UUID in logs
```javascript
// In console, paste:
copy(document.body.innerText.match(/[0-9a-f-]{36}/g)?.[0])
// Gives you first UUID found
```

### Tip 2: Verify database update
```sql
-- In Supabase SQL Editor:
SELECT business_name, updated_at 
FROM merchants 
WHERE id = '14dd8b16-df2f-47c7-82b2-c251aa109737'
LIMIT 1;
```

### Tip 3: Quick log verification
```javascript
// In DevTools console:
console.log(
  '%c🔍 MERCHANT FLOW CHECK', 
  'color: blue; font-size: 14px; font-weight: bold'
);
// Shows blue header for easy finding
```

---

## 🎯 Success = Following This Pattern

```
START: Numeric ID in URL
  ↓
  ✓ Log shows numeric_id ✓
  ↓
FETCH: Query by numeric ID
  ↓
  ✓ Log shows merchant_id_uuid ✓
  ✓ UUID has dashes and 36 chars ✓
  ↓
STORE: Save merchantId
  ↓
  ✓ originalStore.merchantId exists ✓
  ✓ Is not undefined/null ✓
  ↓
SUBMIT: Pass UUID to API
  ↓
  ✓ p_merchant_id = UUID ✓
  ✓ Has dashes and 36 chars ✓
  ↓
UPDATE: WHERE p_merchant_id = UUID
  ↓
  ✓ Only that 1 record changes ✓
  ✓ updated_at = current time ✓
  ↓
END: ✅ SUCCESS!
```

---

## 📞 Emergency Debug

If something breaks:

1. **Open DevTools** → F12
2. **Go to Console**
3. **Reload page** (Ctrl+Shift+R for hard refresh)
4. **Look for RED logs** (❌ errors)
5. **Search for merchant_id** (to verify UUID format)
6. **Copy UUID** from log
7. **Run SQL query** to verify record exists:
```sql
SELECT id, business_name FROM merchants 
WHERE id = 'PASTE-UUID-HERE' LIMIT 1;
```

---

## 📋 All Files With Changes

1. `src/utils/api/storesApi.ts`
   - Line 290+: Added merchantId mapping
   - Line 280+: Added fetch logging
   - Line 427+: Enhanced updateMerchant logging

2. `src/pages/FullEditRegistryPage.tsx`
   - Line 135: Added load logging
   - Line 450: Added submit logging  
   - Line 480: Added API call logging

---

## ⏱️ Time Investment

- **Fix implementation**: ✅ 10 min
- **Testing**: 5 min
- **Total**: 15 min to complete

---

## 📚 Related Docs

- `MERCHANT_FLOW_CHECKLIST.md` - Detailed troubleshooting
- `API_TESTING_GUIDE.md` - Step-by-step testing
- `MERCHANT_FLOW_IMPLEMENTATION.md` - Technical details

---

## 🎓 Learning Path

1. **Understand**: Read this card
2. **Verify**: Run 1-minute test checklist
3. **Debug**: Use console logs to trace flow
4. **Master**: Can explain why UUID needed without looking

✅ **NOW YOU'RE AN EXPERT** 🚀
