# 📊 Merchant Flow Checklist - Danh sách kiểm tra hoàn chỉnh

## 🎯 Mục tiêu
Xây dựng luồng từ **Danh sách → Chi tiết → Chỉnh sửa → API** với logging chi tiết, tránh update sai record.

---

## 📋 Luồng Hiện tại - Vấn đề Phát Hiện

### 1️⃣ **StoresListPage.tsx** - Click để xem chi tiết
```
✅ ĐÚNG: navigate(`/registry/stores/${store.id}`)
❌ ISSUE: store.id là numeric (1, 2, 3, ...), nhưng API dùng UUID (merchant.id)
```

**Log cần in:**
```typescript
console.log('🔗 Navigating to store detail:', {
  store_id: store.id,
  merchant_id: store.merchantId,
  store_name: store.name,
  timestamp: new Date().toISOString()
});
navigate(`/registry/stores/${store.id}`);
```

---

### 2️⃣ **StoreDetailPage.tsx** - Lấy chi tiết từ URL ID
```
Current flow:
URL: /registry/stores/123
useParams: const { id } = useParams() → id = "123" (string)
Load: stores.find(s => s.id === Number(id)) → Lấy từ localStorage/mockStores
❌ ISSUE: Không fetch từ API, nên missing merchantId!
```

**Cần sửa:**
- Fetch từ API sử dụng `/registry/stores/{id}` (numeric ID)
- Hoặc đổi routing sang `/registry/stores/{merchantId}` (UUID)
- **Recommendation**: Giữ numeric ID trên URL, nhưng khi load chi tiết phải map sang merchantId

**Mã cần thêm:**
```typescript
useEffect(() => {
  const loadStoreDetail = async () => {
    const numericId = Number(id);
    console.log('📥 Loading store from ID:', {
      url_id: id,
      numeric_id: numericId,
      timestamp: new Date().toISOString()
    });
    
    const store = await fetchStoreById(numericId);
    if (store) {
      console.log('✅ Loaded store detail:', {
        id: store.id,
        merchant_id: store.merchantId,
        name: store.name,
        timestamp: new Date().toISOString()
      });
      setStore(store);
    }
  };
  loadStoreDetail();
}, [id]);
```

---

### 3️⃣ **fetchStoreById()** - API lấy chi tiết
```
Current: MISSING merchantId mapping
url = `/merchants?id=eq.${storeId}`

❌ ISSUE #1: Query bằng field `id` nhưng không rõ là UUID hay numeric
❌ ISSUE #2: Không map merchant.id → Store.merchantId
```

**Cần sửa:**
```typescript
export async function fetchStoreById(storeId: string | number): Promise<Store | null> {
  try {
    // Query by numeric ID or UUID
    const url = `${SUPABASE_REST_URL}/merchants?id=eq.${storeId}&select=*&limit=1`;
    
    console.log('🔍 Fetching store from API:', { url, storeId });

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch store: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      console.warn('⚠️ Store not found in API:', { storeId });
      return null;
    }

    const merchant = data[0];
    
    console.log('✅ API returned merchant:', {
      merchant_id: merchant.id,           // UUID
      business_name: merchant.business_name,
      timestamp: new Date().toISOString()
    });

    // THÊM: Map merchant.id (UUID) → merchantId
    return {
      id: numericId,
      merchantId: merchant.id,  // 🔴 THÊM DÒng này
      name: merchant.business_name || '',
      // ... other fields
    };
  } catch (error) {
    console.error('❌ Error fetching store by ID:', error);
    return null;
  }
}
```

---

### 4️⃣ **Edit Button (StoreDetailPage)** - Vào trang chỉnh sửa
```
Current: navigate(`/registry/full-edit/${id}`)
✅ ĐÚNG: Truyền numeric ID
```

**Log:**
```typescript
const handleEdit = () => {
  console.log('✏️ Editing store:', {
    id: store.id,
    merchant_id: store.merchantId,
    name: store.name,
    timestamp: new Date().toISOString()
  });
  navigate(`/registry/full-edit/${store.id}`);
};
```

---

### 5️⃣ **FullEditRegistryPage.tsx** - Load & chỉnh sửa
```
Current flow:
1. URL: /registry/full-edit/123
2. fetchStoreById(123) → lấy store từ API
3. Map store data → form
4. Submit → updateMerchant(merchantId, payload)

❌ ISSUE: Log không rõ merchantId được truyền đi là gì
```

**Cần sửa:**
```typescript
const handleSubmitWithReason = async (reason: string) => {
  console.log('🚀 Submitting store edit:', {
    store_id: originalStore?.id,
    merchant_id: originalStore?.merchantId,  // 🔴 LOG này quan trọng
    store_name: originalStore?.name,
    changed_fields: changes.length,
    has_sensitive: hasSensitiveChanges,
    timestamp: new Date().toISOString()
  });

  if (originalStore?.merchantId) {
    const updatePayload = {
      p_merchant_id: originalStore.merchantId,  // 🔴 Check lại là UUID không
      p_business_name: formData.name,
      // ... other fields
    };

    console.log('📤 API update payload:', updatePayload);
    
    const result = await updateMerchant(
      originalStore.merchantId,
      updatePayload
    );
    
    console.log('✅ API update response:', result);
  }
};
```

---

### 6️⃣ **updateMerchant()** - API cập nhật
```
Current: Already correct, có WHERE p_merchant_id = ?
✅ ĐÚNG: RPC call với p_merchant_id

Check:
- p_merchant_id là UUID không?
- API có WHERE clause không?
```

**Verify in storesApi.ts:**
```typescript
export async function updateMerchant(
  merchantId: string,  // 🔴 MUST BE UUID
  data: { ... }
): Promise<any> {
  try {
    const url = `${SUPABASE_REST_URL}/rpc/update_merchant_full`;

    const payload = {
      p_merchant_id: merchantId,  // 🔴 Kiểm tra: Có phải UUID không?
      // ... other params
    };

    console.log('📝 UpdateMerchant called:', {
      p_merchant_id: merchantId,
      fields_updated: Object.keys(data).length,
      timestamp: new Date().toISOString()
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    console.log('✅ UpdateMerchant response:', {
      p_merchant_id: merchantId,
      response: result,
      timestamp: new Date().toISOString()
    });

    return result;
  } catch (error) {
    console.error('❌ UpdateMerchant error:', {
      p_merchant_id: merchantId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}
```

---

## 🔴 **CRITICAL ISSUE FOUND**

### Vấn đề #1: ID vs merchantId không rõ ràng
- **StoresListPage**: `store.id` (numeric)
- **API (merchants table)**: `merchant.id` (UUID) 
- **Routing**: Sử dụng numeric ID
- **UPDATE**: Cần UUID

**→ Solution**: LUÔN LOG cả `id` (numeric) và `merchantId` (UUID)

---

### Vấn đề #2: fetchStoreById không map merchantId
- `fetchStoreById` trả về `Store` object nhưng **missing `merchantId`**
- Dẫn đến FullEditRegistryPage không có merchantId → không update được

**→ Solution**: Thêm `merchantId: merchant.id` vào return object

---

### Vấn đề #3: StoreDetailPage dùng mock/localStorage
- StoreDetailPage load từ localStorage/mockStores thay vì API
- Khi mock không có merchantId, toàn luồng bị vỡ

**→ Solution**: FullEditRegistryPage.tsx dùng fetchStoreById nên OK, nhưng StoreDetailPage cũng nên fetch API

---

## ✅ **ĐIỀU CHỈNH CẦN LÀMS**

### Step 1: Sửa fetchStoreById - Thêm merchantId mapping
**File**: `src/utils/api/storesApi.ts`

```typescript
return {
  id: numericId,
  merchantId: merchant.id,  // 🔴 THÊM DÒNG NÀY
  name: merchant.business_name || '',
  // ...
};
```

### Step 2: Thêm logging chi tiết trong FullEditRegistryPage
**File**: `src/pages/FullEditRegistryPage.tsx`

```typescript
// Trong handleSubmitWithReason
console.log('🚀 [SUBMIT] Store edit initiated:', {
  numeric_id: originalStore?.id,
  merchant_id: originalStore?.merchantId,
  store_name: originalStore?.name,
});
```

### Step 3: Thêm logging chi tiết trong updateMerchant
**File**: `src/utils/api/storesApi.ts`

```typescript
console.log('📝 [UPDATE] Calling API:', {
  merchant_id: merchantId,
  endpoint: `/rpc/update_merchant_full`,
});
```

### Step 4: Cập nhật StoreDetailPage để fetch từ API
**File**: `src/pages/StoreDetailPage.tsx`

```typescript
// Load từ API thay vì localStorage/mockStores
if (!store || !store.merchantId) {
  store = await fetchStoreById(Number(id));
}
```

---

## 🧪 **Debug Checklist**

### Kiểm tra #1: Click từ danh sách
- [ ] Log hiển thị `store.id` và `store.merchantId`
- [ ] URL chính xác: `/registry/stores/123`
- [ ] Navigator không throw error

### Kiểm tra #2: Vào trang chi tiết
- [ ] Fetch API thành công
- [ ] Log hiển thị `merchant_id` từ API response
- [ ] Form load đầy đủ dữ liệu

### Kiểm tra #3: Vào trang chỉnh sửa
- [ ] `originalStore.merchantId` không undefined
- [ ] Form có merchantId lưu trữ

### Kiểm tra #4: Submit chỉnh sửa
- [ ] Log hiển thị `p_merchant_id` đúng (UUID)
- [ ] API response không error
- [ ] Database update đúng record

### Kiểm tra #5: Verify Database Update
```sql
SELECT id, business_name, updated_at 
FROM merchants 
WHERE id = '14dd8b16-df2f-47c7-82b2-c251aa109737'
ORDER BY updated_at DESC 
LIMIT 1;
```

---

## 📝 **Logging Template**

```typescript
// Template để copy-paste
console.log('🔗 [ACTION_NAME]', {
  numeric_id: store.id,
  merchant_id: store.merchantId,
  store_name: store.name,
  timestamp: new Date().toISOString(),
  // thêm field liên quan
});
```

---

## 🎯 **Expected Flow After Fix**

```
[Danh sách] 
  ↓ (navigate `/registry/stores/123` + log: merchant_id)
[Chi tiết] 
  ↓ (fetchStoreById → log: merchant_id từ API)
[Chỉnh sửa]
  ↓ (load form → log: originalStore.merchantId)
[Submit]
  ↓ (updateMerchant(UUID, payload) → log: p_merchant_id)
[Database]
  ✅ UPDATE merchants SET ... WHERE id = UUID
```

---

## 🔧 **Cách kiểm tra nhanh**

1. **Open DevTools**: F12
2. **Mở Console**: Tab "Console"
3. **Filter**: Type `merchant_id` để xem log
4. **Navigate**: Click store → Xem log
5. **Check**: Verify `merchant_id` hiển thị ở mỗi bước
