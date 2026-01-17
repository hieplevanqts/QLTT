# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Chỉ copy những file liên quan đến NPM
COPY package.json package-lock.json ./

# Cài đặt dependencies (npm ci nhanh và chuẩn hơn npm install cho CI/CD)
RUN npm ci

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# --- Production stage ---
FROM nginx:alpine

# ⚠️ LƯU Ý QUAN TRỌNG:
# Kiểm tra xem dự án của bạn build ra thư mục tên là 'dist' hay 'build'?
# - Vite/Vue thường ra 'dist'
# - React (CRA) thường ra 'build'
# Sửa đường dẫn dưới đây cho đúng:
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (nếu có)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]