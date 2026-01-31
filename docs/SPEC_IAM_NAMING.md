# SPEC_IAM_NAMING — MAPPA_CMS (React + Ant Design + Supabase)

## 0) Mục tiêu
Chuẩn hoá Naming + Data Model cho IAM (Roles/Permissions) và Menu (Tree/Menu Permissions) để:
- Dữ liệu không “bẩn/đa nghĩa”
- UI quản trị lọc/gán quyền rõ ràng
- Menu động hiển thị đúng theo role
- Tránh gãy legacy (`permission_type`)
- Tránh N+1 khi load menu/permissions

---

## 1) Canonical naming (đã chốt)
### 1.1 Module codes (DB + FE)
- Module quản trị: `system-admin`
- Module báo cáo: `reports`

### 1.2 PAGE permission (hiển thị menu)
Chuẩn bắt buộc:
- `module.page.read`

Mở rộng cho submenu/page con (khuyến nghị):
- `module.page.<pageKey>.read`

Ví dụ:
- `system-admin.page.read`
- `system-admin.page.roles.read`
- `reports.page.read`
- `reports.page.summary.read`

---

## 2) Permission model

### 2.1 Mục đích của `permissions.code`
`permission_id` là khóa join chính (role_permissions/menu_permissions).  
`code` dùng để:
- Seed/sync DEV-UAT-PROD
- Search/picker UI
- Audit/log/trace
- (optional) FE/BFF feature gate

**Không join RBAC bằng `code`** (join bằng `permission_id`).

### 2.2 Format chuẩn của permission code
**`code = <module>.<resourcePath>.<action>`**

- `module`: khớp `modules.code`
- `resourcePath`: danh từ (noun), tương đối (KHÔNG lặp module), cho phép nhiều segment bằng `.`
- `action`: lowercase (ví dụ `read/create/update/delete/export/import/restore/assign/...`)

**Rule kỹ thuật**
- `code` lowercase
- chỉ dùng `[a-z0-9._-]`
- không có `..`, không có dấu `.` thừa cuối chuỗi
- unique index trên `permissions.code`

Regex validate gợi ý:
- `^[a-z0-9]+(\.[a-z0-9_-]+){2,}$`

### 2.3 PAGE vs FEATURE
#### PAGE (hiển thị menu/trang)
- `resourcePath` bắt đầu bằng `page`
- action cố định: `read`
- Dùng để quyết định có hiển thị menu item (route/page) không

Ví dụ:
- `system-admin.page.read`
- `reports.page.summary.read`

#### FEATURE (tính năng trong trang)
- `resourcePath` KHÔNG bắt đầu bằng `page`
- action phản ánh đúng nghiệp vụ (không ép về read)

Ví dụ:
- `reports.report.export`
- `system-admin.user.reset_password.update`

### 2.4 Cột dữ liệu permissions (DB)
Bảng `public.permissions` tối thiểu cần:
- `id/_id` (PK)
- `code` (unique)
- `name`
- `module_id` (FK -> modules)
- `module` (text, nên khớp modules.code)
- `resource` (resourcePath)
- `action` (khuyến nghị UPPERCASE trong DB: READ/CREATE/UPDATE/DELETE/EXPORT/RESTORE...)
- `category` (PAGE|FEATURE)  ⟵ chuẩn hoá UI/menu
- `status` (active/inactive)
- `permission_type` (legacy — KHÔNG XÓA, KHÔNG ép chuẩn ngay)
- `meta` jsonb (optional)

---

## 3) Role model
### 3.1 roles
- `roles._id`, `roles.code`, `roles.name`, `roles.status`

### 3.2 role_permissions
- `role_permissions.role_id`
- `role_permissions.permission_id`

---

## 4) Menu model

### 4.1 Schema chuẩn (đã dùng)
```sql
create table public.menus (
  _id uuid not null default gen_random_uuid(),
  code text not null,
  name text not null,
  path text not null,
  icon text null,
  order_index integer not null default 0,
  parent_id uuid null,
  module_id uuid null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menus_pkey primary key (_id),
  constraint menus_module_id_fkey foreign key (module_id) references modules (_id) on delete set null,
  constraint menus_parent_id_fkey foreign key (parent_id) references menus (_id) on delete cascade
);

create unique index if not exists menus_code_uq on public.menus(code);
create index if not exists menus_parent_idx on public.menus(parent_id);
create index if not exists menus_path_idx on public.menus(path);
create index if not exists menus_order_idx on public.menus(order_index);

create trigger trg_menus_updated_at
before update on menus for each row execute function set_updated_at();
