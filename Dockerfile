# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG PUBLIC_URL
# 2. Gán ARG vào ENV để Vite có thể đọc được lúc build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV PUBLIC_URL=$PUBLIC_URL

ARG VITE_SYSTEM_ADMIN_API
ENV VITE_SYSTEM_ADMIN_API=$VITE_SYSTEM_ADMIN_API

# Chỉ copy những file liên quan đến NPM
COPY package.json ./
RUN npm install

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

# Remove default nginx config if exists to avoid conflicts
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
