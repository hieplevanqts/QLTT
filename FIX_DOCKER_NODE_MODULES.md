# Hướng dẫn sửa lỗi node_modules trong Docker

## Vấn đề
Volume `node_modules:/app/node_modules` trong `docker-compose.yml` đang mount một named volume có thể rỗng, ghi đè packages đã được cài trong Dockerfile.

## Giải pháp

### Cách 1: Xóa volume cũ và rebuild (KHUYẾN NGHỊ)

```bash
# Dừng và xóa containers, volumes
docker-compose down -v

# Xóa volume node_modules cụ thể (nếu cần)
docker volume rm vhv-qltt_node_modules

# Rebuild image với --no-cache
docker-compose build --no-cache app-dev

# Chạy lại container
docker-compose up app-dev
```

### Cách 2: Cài packages trực tiếp trong container

```bash
# Vào container
docker exec -it mappa-portal-dev sh

# Xóa node_modules (nếu có)
rm -rf /app/node_modules

# Cài lại packages
npm install

# Hoặc nếu dùng yarn/pnpm
# yarn install
# pnpm install
```

### Cách 3: Tạm thời comment volume mount

Sửa `docker-compose.yml`, comment dòng 14:
```yaml
volumes:
  - .:/app
  # - node_modules:/app/node_modules  # Comment dòng này tạm thời
```

Sau đó rebuild:
```bash
docker-compose down
docker-compose build --no-cache app-dev
docker-compose up app-dev
```

**Lưu ý:** Cách 3 sẽ làm chậm hơn vì node_modules sẽ được mount từ host.

## Kiểm tra packages đã được cài

```bash
docker exec -it mappa-portal-dev ls -la /app/node_modules | grep -E "jspdf|docx"
```

Nếu thấy thư mục `jspdf` và `docx` thì packages đã được cài đúng.
