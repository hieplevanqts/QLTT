# QA-ITRO-SYSTEM.md
> MAPPA_CMS — Tài liệu QA/BA/DEV: Quản trị hệ thống (IAM) & Quy trình cấu hình Module → Permission → Menu → Role  
> Phiên bản UI/FE: AntD 6.2.2, TailwindCSS 4.1.12, lucide-react 0.487.0  
> Nguyên tắc: dữ liệu sạch, naming chuẩn, thao tác ít bước, audit được.

---

## 1) Mục tiêu tài liệu
Tài liệu này mô tả cách vận hành và kiểm thử các chức năng **Quản trị hệ thống** trong MAPPA_CMS, bao gồm:

- Chuẩn dữ liệu IAM: Modules, Permissions, Menus, Role permissions.
- Quy tắc đặt tên (naming) bắt buộc.
- Workflow chuẩn để DEV/QA/BA phối hợp: **Khai báo module → sinh quyền → khai báo menu → gán quyền menu → gán quyền role → preview theo vai trò**.
- Checklist QA + test cases quan trọng.
- Troubleshooting (lỗi thường gặp: thiếu category, gợi ý route sai, menu không load, matrix trống…).

---

## 2) Phạm vi màn hình (System Admin / IAM)
Các màn quan trọng:

1. **Quản lý Phân hệ (Modules)**: `/system-admin/iam/modules`
2. **Quản lý Danh mục quyền (Permissions)**: `/system-admin/iam/permissions`
3. **Quản lý Menu**: `/system-admin/iam/menus`
4. **Phân quyền theo vai trò (Role Permissions)**: `/system-admin/iam/role-permissions/:roleId`
5. **Preview menu theo vai trò** (nằm trong màn Menu, tab “Xem menu theo vai trò”)

---

## 3) Khái niệm & quy tắc lõi (bắt buộc)

### 3.1 Modules là gì?
- **Module** là “phân hệ cấp 1” (top-level domain) dùng để:
  - grouping menu
  - prefix permissions
  - thống kê quyền theo phân hệ
- **Không tạo module con kiểu `system-admin.master-data`** trong bảng modules.
  - Sub-area (IAM/Master Data/System Config…) thể hiện bằng:
    - menu cha (parent_id)
    - `permissions.resource` prefix (iam.*, masterdata.*, system_config.*)

### 3.2 Permission có 2 loại: PAGE vs FEATURE
- `PAGE`: quyền truy cập màn hình/menu/route
- `FEATURE`: quyền thao tác tính năng (CRUD/EXPORT/ASSIGN/APPROVE…)

**Menu chỉ gán PAGE permission**. FEATURE không gán vào menu.

### 3.3 Naming rule (chuẩn hoá bắt buộc)
#### Modules
- `modules.key`: **kebab-case**, không dấu chấm  
  Regex: `^[a-z0-9]+(-[a-z0-9]+)*$`  
  Ví dụ: `system-admin`, `reports`, `registry`, `tv-wallboard`

- `modules.code`: nên = `modules.key` (tránh SYSTEM_ADMIN…)

#### Permissions
- PAGE:
  - `resource`: `page` hoặc `page.xxx.yyy`
  - `action = READ`, `permission_type = READ`
  - `code`: `{moduleKey}.{resource}.read`
  - Ví dụ:  
    - `system-admin.page.read` (landing)  
    - `system-admin.page.iam.users.read`

- FEATURE:
  - `resource`: `<area>.<entity>` (ví dụ `iam.user`, `masterdata.catalog`)
  - `action = permission_type` (uppercase)
  - `code`: `{moduleKey}.{resource}.{actionLower}`
  - Ví dụ:
    - `system-admin.iam.user.update`
    - `system-admin.masterdata.catalog.create`

#### Menus
- `menus.code`: **dựa theo path** (khuyến nghị), unique toàn hệ.
- `menus.module_id`: bắt buộc cho V1 để gợi ý/auto-gán quyền theo route.
- `menu_permissions`: map theo UUID (`menu_id`, `permission_id`) — không dùng code string.

### 3.4 Danh mục action (`permission_actions`)
- Là danh mục verb toàn hệ: READ/CREATE/UPDATE/DELETE/RESTORE/EXPORT/ASSIGN/APPROVE/IMPORT…
- UI matrix phải render cột dựa trên danh mục này (không fix cứng 5 cột).

---

## 4) Cấu trúc DB & giải thích từng bảng/cột

### 4.1 `public.modules`
DDL chính (rút gọn):
- `_id` (uuid, PK)
- `code` (varchar, unique) — **khuyến nghị = key**
- `key` (text, unique index) — định danh module dùng để prefix permissions
- `name` (varchar) — tên hiển thị
- `group` (IAM/DMS/OPS/SYSTEM) — nhóm module
- `sort_order` (int) — thứ tự hiển thị
- `status` (0/1) — hoạt động/ngưng
- `meta` (jsonb) — cấu hình mở rộng (source, areas mapping)
- `deleted_at` — soft delete

**meta đề xuất**
```json
{
  "source": "src/modules/system-admin",
  "areas": {
    "iam": {
      "source": "src/modules/system-admin/sa-iam",
      "route_prefixes": ["/system-admin/iam"],
      "resource_prefix": "iam"
    },
    "masterdata": {
      "source": "src/modules/system-admin/sa-master-data",
      "route_prefixes": ["/system-admin/master-data", "/system-admin/masterdata"],
      "resource_prefix": "masterdata"
    }
  }
}

4.2 public.permissions

Cột chính:

_id (uuid)

module_id (uuid, FK modules)

code (varchar, unique) — khóa logic, dùng để check permission

name — tên hiển thị

category — PAGE / FEATURE (NOT NULL)

resource — ví dụ: page.iam.users, iam.user

action — ví dụ: READ/CREATE/UPDATE…

permission_type — phải đồng bộ với action (FK tới permission_actions.code)

status — 0/1

meta — JSON metadata (route, note, seed flag)

Rule đồng bộ bắt buộc

upper(action) == upper(permission_type)

4.3 public.permission_actions

code (PK): READ/CREATE/UPDATE/DELETE/RESTORE/EXPORT…

name: nhãn hiển thị tiếng Việt

created_at

4.4 public.menus

Cột chính:

_id (uuid, PK)

code (text, unique) — nên sinh từ path + moduleKey

name (text) — nhãn menu

path (text, NOT NULL) — route

parent_id (uuid, FK menus) — tạo cây

module_id (uuid, FK modules) — phân hệ của menu (V1 nên bắt buộc)

icon (text) — tên icon (lucide icon name)

order_index — thứ tự

is_active — bật/tắt

4.5 public.menu_permissions

_id (uuid)

menu_id (uuid, FK menus)

permission_id (uuid, FK permissions)

unique (menu_id, permission_id) đảm bảo không trùng

V1 policy

1 menu item thường map 1 PAGE permission tương ứng route.

4.6 public.roles, public.user_roles, public.role_permissions

roles: danh sách vai trò

user_roles: gán vai trò cho user

role_permissions: gán quyền cho role (nguồn quyết định user có permission code hay không)

5) Views phục vụ UI (khuyến nghị)
5.1 public.v_modules_stats

Mục đích:

list modules + thống kê permission/page/feature + menu_count

hỗ trợ màn Modules UI (tag “chưa khai báo quyền”, source, kebab rule)

Cột quan trọng:

permission_count, permission_page_count, permission_feature_count

menu_count

meta_source

key_is_kebab

5.2 public.v_role_permissions_matrix

Mục đích:

1 query dựng ma trận resource×action cho role (tránh N+1)

cột is_granted để tick checkbox

Cột quan trọng:

role_id, module_key, category

resource_group, resource_key

action, action_label, action_order

permission_id, permission_code, permission_name

is_granted

6) Quy trình cấu hình chuẩn (DEV/QA/BA)
6.1 Trách nhiệm DEV

DEV khi có module/page mới phải cung cấp tối thiểu:

module key (kebab-case)

danh sách routes/pages (path)

các entity + actions nếu muốn FEATURE chuẩn (hoặc QA sinh theo preset action)

DEV KHÔNG tự tạo module con kiểu system-admin.xxx trong bảng modules.

6.2 Trách nhiệm QA (tài khoản admindb / super-admin)

Thực hiện theo đúng thứ tự:

B1) Khai báo module (Modules)

tạo module key chuẩn

meta.source đúng folder

(nếu module chỉ là sub-area của system-admin) → không tạo module riêng; tạo menu cha và permission resource prefix

B2) Sinh quyền (Permissions)

seed landing <module>.page.read nếu module cần route root

seed page con theo route: <module>.page.<routeKey>.read

tạo FEATURE theo entity/action nếu module có CRUD/EXPORT/ASSIGN…

B3) Khai báo Menu (Menus)

tạo menu tree (parent-child)

mỗi menu có path và module_id

icon chọn từ lucide icon name

B4) Gán quyền menu (menu_permissions)

chỉ gán PAGE permission đúng route

V1: dùng nút “Tự gán quyền theo route” để:

derive permission code theo modules.meta.areas + path

nếu permission chưa tồn tại: tạo PAGE permission rồi gán

B5) Gán quyền cho role (role_permissions)

dùng ma trận (PAGE tab + FEATURE tab)

PAGE tab: chỉ READ

FEATURE tab: các action theo permission_actions

lưu batch (không write mỗi click)

B6) Preview menu theo vai trò

tab “Xem menu theo vai trò”

policy: menu chưa gán quyền => ẩn, tag cam ⚠️

7) Hướng dẫn sử dụng UI theo từng màn
7.1 Quản lý Modules

Xem nhanh thống kê quyền (PAGE/FEATURE/TOTAL)

“Xem quyền”: mở modal overview (không nhảy trang)

“Sinh quyền”: mở modal generate (V1: seed landing + pages theo route nếu có)

7.2 Quản lý Permissions

Tab PAGE: kiểm tra các permission vào màn hình có đủ chưa

Tab FEATURE: kiểm tra các hành động CRUD/EXPORT/ASSIGN…

Luôn đảm bảo:

category != null

action == permission_type

code đúng rule

7.3 Quản lý Menus

Left: cây menu + badge:

✅ đã gán quyền

⚠️ chưa gán quyền

Right tab “Thông tin”:

path, module_id, icon, code

Right tab “Quyền hiển thị” (V1 tối giản):

hiển thị quyền PAGE đang gán (0/1)

nút “Tự gán quyền theo route”

nút “Bỏ gán”

Context menu chuột phải (Tree):

Thêm menu con / Sửa / Xoá

7.4 Phân quyền theo vai trò (Role Permissions)

Tabs PAGE/FEATURE/ALL

Rows = resource_key; cols = actions (permission_actions)

Tooltip hiển thị permission_code + permission_name

Copy resource / copy code bằng icon

Lưu batch, hiển thị diff +/-

7.5 Xem menu theo vai trò (Preview)

dropdown role

KPI: thấy/ẩn/chưa gán

policy: chưa gán quyền => ẩn (tag cam)

list view sort theo Module và Result

8) Checklist QA (pass/fail)
8.1 Data quality

 modules.key kebab-case, không dấu chấm

 permissions.category không null

 action == permission_type

 PAGE permissions chỉ READ; resource bắt đầu page hoặc page.xxx

 menu_permissions chỉ map permissions.category='PAGE'

 menu.module_id không null (V1)

8.2 UI behavior

 click menu node không bị spinner vô tận

 “Tự gán quyền theo route” tạo menu_permissions thành công và badge đổi trạng thái

 “Xem menu theo vai trò” ẩn menu thiếu quyền + hiển thị tag đúng màu

 Role matrix hiển thị đủ cột theo permission_actions; PAGE tab chỉ 1 cột READ

 Save role-permissions batch thành công (không N+1, không write per click)

9) Troubleshooting (lỗi hay gặp)
9.1 “permission update failed: category null”

FE gửi payload update có category: null

Fix: build patch tối thiểu, không set null; validate trước submit.

9.2 “Gợi ý theo route” không tìm thấy permission

Nguyên nhân:

menu.module_id null

derive routeKey sai (master-data vs masterdata)

permission chưa seed
Fix:

bắt buộc module_id

dùng modules.meta.areas mapping

nếu không tồn tại: cho phép tạo PAGE permission rồi gán

9.3 Menu panel phải không load, quay mãi

Nguyên nhân hay gặp:

FE dùng upsert menus khi select/reorder với payload thiếu code/name/path → 400
Fix:

reorder dùng UPDATE (PATCH) theo _id, không upsert

key tree = menus._id (uuid)

try/catch/finally tắt loading

9.4 Role PAGE tab trống

module chưa có <module>.page.read hoặc page con tương ứng
Fix:

seed landing page read cho module

tab PAGE chỉ đọc category PAGE, action READ

10) SQL utilities (tham khảo nhanh)
10.1 Report module thiếu landing <module>.page.read
select m.key, m.name
from public.modules m
where m.deleted_at is null and m.status=1
  and not exists (
    select 1 from public.permissions p
    where p.module_id=m._id and lower(p.code)=lower(m.key||'.page.read')
  )
order by m.key;

10.2 Seed landing page read cho module thiếu
insert into public.permissions (
  module_id, code, name, description, permission_type,
  status, is_default, sort_order, meta, module, resource, action, category
)
select m._id, lower(m.key||'.page.read'), ('Xem '||m.name),
  'Landing (auto-seeded)', 'READ', 1, false, 0,
  jsonb_build_object('seed', true, 'kind', 'landing'),
  m.key, 'page', 'READ', 'PAGE'
from public.modules m
where m.deleted_at is null and m.status=1
  and not exists (
    select 1 from public.permissions p
    where p.module_id=m._id and lower(p.code)=lower(m.key||'.page.read')
  );

11) Kết luận

Hệ IAM của MAPPA_CMS vận hành theo nguyên tắc:

Module: cấp 1, sạch, kebab-case

Permission: PAGE/FEATURE rõ ràng, naming chuẩn, action đồng bộ permission_type

Menu: gắn module_id, gắn 1 PAGE permission theo route (auto)

Role: gán quyền qua matrix resource×action, save batch

Preview: ẩn menu thiếu quyền để QA phát hiện cấu hình thiếu