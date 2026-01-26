# Professional Token Storage

Hệ thống lưu trữ token chuyên nghiệp với nhiều chiến lược bảo mật.

## Các Chiến Lược Lưu Trữ

### 1. **HttpOnly Cookies** (An toàn nhất - Khuyến nghị)
```typescript
const storage = createTokenStorage({
  strategy: StorageStrategy.HTTP_ONLY_COOKIE,
});
```

**Ưu điểm:**
- ✅ Không thể truy cập từ JavaScript (bảo vệ khỏi XSS)
- ✅ Tự động gửi kèm mọi request
- ✅ Có thể set flags: Secure, SameSite, HttpOnly

**Nhược điểm:**
- ⚠️ Cần backend hỗ trợ set cookie
- ⚠️ Phức tạp hơn trong setup

**Cách sử dụng:**
Backend cần set cookie khi login:
```javascript
// Backend (Node.js/Express example)
res.cookie('access_token', token, {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
});
```

### 2. **Encrypted LocalStorage** (Cân bằng tốt)
```typescript
const storage = createTokenStorage({
  strategy: StorageStrategy.ENCRYPTED_LOCAL_STORAGE,
  encrypt: true,
});
```

**Ưu điểm:**
- ✅ Token được mã hóa trước khi lưu
- ✅ Dễ sử dụng, không cần backend thay đổi
- ✅ Persist qua sessions

**Nhược điểm:**
- ⚠️ Vẫn có thể bị XSS nếu code bị compromise
- ⚠️ Encryption key ở client-side

### 3. **SessionStorage** (Tạm thời)
```typescript
const storage = createTokenStorage({
  strategy: StorageStrategy.SESSION_STORAGE,
});
```

**Ưu điểm:**
- ✅ Tự động xóa khi đóng tab
- ✅ An toàn hơn localStorage (không persist)

**Nhược điểm:**
- ⚠️ Mất token khi đóng tab
- ⚠️ Không phù hợp cho "Remember me"

### 4. **IndexedDB** (Lưu trữ lớn)
```typescript
const storage = createTokenStorage({
  strategy: StorageStrategy.INDEXED_DB,
  encrypt: true,
});
```

**Ưu điểm:**
- ✅ Lưu trữ lớn hơn localStorage
- ✅ Có thể encrypt
- ✅ Async operations

**Nhược điểm:**
- ⚠️ Phức tạp hơn
- ⚠️ Cần handle async

### 5. **Memory Storage** (An toàn nhất nhưng không persist)
```typescript
const storage = createTokenStorage({
  strategy: StorageStrategy.MEMORY,
});
```

**Ưu điểm:**
- ✅ An toàn nhất (chỉ trong RAM)
- ✅ Tự động xóa khi refresh

**Nhược điểm:**
- ⚠️ Mất token khi refresh trang
- ⚠️ Không phù hợp cho production

## Cấu Hình Mặc Định

File `tokenStorage.ts` đã có instance mặc định:

```typescript
export const tokenStorage = new TokenStorage({
  strategy: StorageStrategy.ENCRYPTED_LOCAL_STORAGE,
  encrypt: true,
  keyPrefix: 'mappa_auth_',
});
```

## Thay Đổi Chiến Lược

### Option 1: Sử dụng instance mặc định (đã được cấu hình)
```typescript
import { tokenStorage } from '@/utils/storage/tokenStorage';

await tokenStorage.setToken(token, expiresIn);
const token = await tokenStorage.getToken();
```

### Option 2: Tạo instance tùy chỉnh
```typescript
import { createTokenStorage, StorageStrategy } from '@/utils/storage/tokenStorage';

const customStorage = createTokenStorage({
  strategy: StorageStrategy.SESSION_STORAGE,
  encrypt: false,
  keyPrefix: 'my_app_',
});
```

## Best Practices

### 1. **Production: HttpOnly Cookies**
```typescript
// Backend sets cookie, frontend chỉ cần gọi API
// Token tự động được gửi kèm request
```

### 2. **Development: Encrypted LocalStorage**
```typescript
const storage = createTokenStorage({
  strategy: StorageStrategy.ENCRYPTED_LOCAL_STORAGE,
  encrypt: true,
});
```

### 3. **High Security: Memory + Refresh Token**
```typescript
// Access token trong memory
const accessTokenStorage = createTokenStorage({
  strategy: StorageStrategy.MEMORY,
});

// Refresh token trong httpOnly cookie (backend set)
```

## Migration từ localStorage

Code hiện tại đã được migrate:
- `storeToken()` → `tokenStorage.setToken()`
- `getStoredToken()` → `tokenStorage.getToken()`
- `isTokenExpired()` → `tokenStorage.isTokenExpired()`
- `logout()` → `tokenStorage.clear()`

Tất cả đều async và sử dụng storage strategy đã cấu hình.

## Security Notes

1. **Encryption Key**: Hiện tại dùng hardcoded key. Trong production, nên:
   - Dùng environment variable
   - Hoặc dùng Web Crypto API với key derivation
   - Hoặc để backend encrypt

2. **Token Rotation**: Nên implement token rotation:
   - Access token ngắn hạn (15 phút)
   - Refresh token dài hạn (7 ngày)
   - Auto-refresh trước khi expire

3. **CSRF Protection**: Nếu dùng cookies, cần:
   - CSRF tokens
   - SameSite cookies
   - Origin validation

