# Debug Trang Trắng Sau Khi Deploy

## Các bước kiểm tra:

### 1. Kiểm tra Browser Console
Mở DevTools (F12) → Console tab và xem có lỗi gì:
- Lỗi 404: Assets không được tải
- Lỗi JavaScript: Có thể do import error hoặc runtime error
- CORS errors: Vấn đề với API calls

### 2. Kiểm tra Network Tab
Mở DevTools (F12) → Network tab → Refresh trang:
- `index.html` phải trả về 200
- `assets/*.js` và `assets/*.css` phải trả về 200
- Nếu có lỗi 404 → Nginx config có vấn đề

### 3. Kiểm tra Nginx Logs
Trong Docker container:
```bash
docker exec -it <container-name> tail -f /var/log/nginx/access.log
docker exec -it <container-name> tail -f /var/log/nginx/error.log
```

### 4. Kiểm tra Build Output
Đảm bảo `dist` folder có:
- `index.html`
- `assets/` folder với các file `.js` và `.css`

### 5. Kiểm tra File Paths trong index.html
Mở `dist/index.html` và đảm bảo paths là relative:
```html
<script src="./assets/index-xxx.js"></script>
<link href="./assets/index-xxx.css">
```

## Các vấn đề thường gặp:

### Vấn đề 1: Assets không được load
**Giải pháp:** Đảm bảo `base: '/'` trong `vite.config.ts` và nginx config đúng

### Vấn đề 2: JavaScript Error
**Giải pháp:** Kiểm tra console để xem lỗi cụ thể, có thể do:
- Import path sai
- Module không tồn tại
- Runtime error trong code

### Vấn đề 3: Route không được serve
**Giải pháp:** Đảm bảo nginx có `try_files $uri $uri/ /index.html;` trong location `/`

## Nginx Config đã được cập nhật:
- Static assets được serve trước (regex location)
- SPA routing fallback về `/index.html` (location /)
- Index.html không cache
- Đúng thứ tự location blocks
