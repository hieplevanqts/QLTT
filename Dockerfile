# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_PROJECT_ID
ARG VITE_SUPABASE_PUBLIC_ANON_KEY
ARG PUBLIC_URL

ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ARG VITE_SYSTEM_ADMIN_API
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_GEOCODER_PROVIDER
ARG VITE_NOMINATIM_EMAIL

# 2. Gán ARG vào ENV để Vite có thể đọc được lúc build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID
ENV VITE_SUPABASE_PUBLIC_ANON_KEY=$VITE_SUPABASE_PUBLIC_ANON_KEY
ENV PUBLIC_URL=$PUBLIC_URL

ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV VITE_SYSTEM_ADMIN_API=$VITE_SYSTEM_ADMIN_API
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GEOCODER_PROVIDER=$VITE_GEOCODER_PROVIDER
ENV VITE_NOMINATIM_EMAIL=$VITE_NOMINATIM_EMAIL
# Chỉ copy những file liên quan đến NPM
COPY package.json ./

# 👉 THÊM DÒNG NÀY
RUN npm config set registry https://registry.npmmirror.com

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
