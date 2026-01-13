# 🚀 Hướng dẫn tạo Admin Tables trong Supabase

## ❌ Vấn đề hiện tại

Ứng dụng đang gặp lỗi 404 khi truy cập các bảng:
- `users` 
- `roles`
- `modules`
- `permissions`
- `user_roles`

**Lỗi:** `Could not find the table 'public.users' in the schema cache`

## ✅ Giải pháp

Tạo các bảng cần thiết trong Supabase bằng cách chạy SQL script.

## 📋 Các bước thực hiện

### Bước 1: Mở Supabase SQL Editor

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn: `hngntdaipgxhlxnenlzm`
3. Vào **SQL Editor** ở menu bên trái
4. Click **New Query**

### Bước 2: Chạy SQL Script

1. Mở file `docs/supabase-admin-tables.sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor trong Supabase
4. Click **Run** (hoặc nhấn Ctrl+Enter)

### Bước 3: Kiểm tra kết quả

Sau khi chạy script, bạn sẽ thấy:
- ✅ 5 bảng được tạo: `users`, `roles`, `user_roles`, `modules`, `permissions`
- ✅ Các indexes được tạo
- ✅ RLS (Row Level Security) được enable
- ✅ Policies được tạo (cho phép đọc/ghi tạm thời cho development)

**Kiểm tra:**
- Vào **Database → Tables** trong Supabase Dashboard
- Bạn sẽ thấy 5 bảng mới được tạo
- Vào từng bảng để xem cấu trúc

### Bước 4: Verify trong App

1. Refresh ứng dụng (F5)
2. Lỗi 404 sẽ biến mất
3. Các tab trong Admin page sẽ hoạt động:
   - Quản lý người dùng
   - Vai trò
   - Ma trận quyền

## 📊 Cấu trúc bảng

### `users`
- `id` (UUID)
- `email` (TEXT, UNIQUE)
- `username` (TEXT)
- `full_name` (TEXT)
- `phone` (TEXT)
- `avatar_url` (TEXT)
- `status` (INTEGER: 1 = active, 0 = inactive)
- `created_at`, `updated_at`, `last_login`

### `roles`
- `id` (UUID)
- `code` (TEXT, UNIQUE)
- `name` (TEXT)
- `description` (TEXT)
- `created_at`, `updated_at`

### `user_roles` (Junction table)
- `id` (UUID)
- `user_id` (UUID → users.id)
- `role_id` (UUID → roles.id)
- `created_at`

### `modules`
- `id` (UUID)
- `code` (TEXT, UNIQUE)
- `name` (TEXT)
- `icon`, `path`, `description` (TEXT)
- `order_index` (INTEGER)
- `status` (INTEGER: 1 = active, 0 = inactive)
- `created_at`, `updated_at`

### `permissions`
- `id` (UUID)
- `module_id` (UUID → modules.id)
- `code` (TEXT)
- `name` (TEXT)
- `description` (TEXT)
- `permission_type` (TEXT: 'view', 'create', 'edit', 'delete')
- `status` (INTEGER)
- `is_default` (BOOLEAN)
- `created_at`, `updated_at`

## 🔒 Security Notes

⚠️ **Lưu ý quan trọng:**

1. **RLS Policies hiện tại cho phép tất cả operations** (để development dễ dàng)
2. **Trong production**, bạn nên:
   - Restrict policies dựa trên authentication
   - Chỉ cho phép authenticated users mới có quyền đọc/ghi
   - Tạo policies cụ thể cho từng role

3. **Ví dụ policy cho production:**
   ```sql
   -- Chỉ cho phép authenticated users đọc
   CREATE POLICY "Users can read own data" ON public.users
     FOR SELECT USING (auth.uid() = id);
   
   -- Chỉ admin mới có quyền insert/update/delete
   CREATE POLICY "Only admins can modify users" ON public.users
     FOR ALL USING (
       EXISTS (
         SELECT 1 FROM public.user_roles ur
         JOIN public.roles r ON r.id = ur.role_id
         WHERE ur.user_id = auth.uid() AND r.code = 'ADMIN'
       )
     );
   ```

## 🧪 Sample Data

Script đã bao gồm sample data:
- 4 roles cơ bản: ADMIN, MANAGER, OFFICER, CITIZEN
- 5 modules cơ bản: DASHBOARD, MAP, USERS, ROLES, REPORTS

Nếu không muốn sample data, xóa các câu lệnh `INSERT` trong script.

## 🐛 Troubleshooting

### Lỗi: "relation already exists"
- Các bảng đã được tạo trước đó
- Bạn có thể:
  - Drop các bảng cũ và chạy lại script
  - Hoặc chỉ chạy phần INSERT sample data

### Lỗi: "permission denied"
- Kiểm tra bạn có quyền tạo tables trong database
- Đảm bảo bạn đang chạy script với service role hoặc có quyền admin

### Vẫn gặp lỗi 404 sau khi tạo bảng
- Refresh lại Supabase cache (có thể mất vài giây)
- Kiểm tra RLS policies đã được tạo
- Verify trong Dashboard → Database → Tables

## 📚 Files liên quan

- `docs/supabase-admin-tables.sql` - SQL script để tạo bảng
- `src/pages/UserListTabNew.tsx` - Component sử dụng bảng users
- `src/pages/RolesManagementTab.tsx` - Component sử dụng bảng roles
- `src/pages/PermissionsMatrixTabNew.tsx` - Component sử dụng bảng modules/permissions

---

**Sau khi hoàn thành, ứng dụng sẽ hoạt động bình thường!** ✅
