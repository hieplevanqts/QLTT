1) **Phụ lục A — Mapping route → permission code mẫu** cho từng module đang có (reports/registry/evidence/system-admin…).  
---

## PHỤ LỤC A — Mapping route → permission code (mẫu chuẩn)

> Mục tiêu: thống nhất cách suy luận permission PAGE từ route/path để QA/DEV không đặt sai code.  
> Quy tắc chung:  
> - `permission_code = {moduleKey}.{resource}.read`  
> - `resource = page` (landing) hoặc `page.<routeKey>`  
> - `routeKey` lấy từ path sau khi bỏ prefix module (và mapping alias theo `modules.meta.areas` nếu có).

### A1) Module root (cấp 1) — landing
| Module key | Landing route | PAGE permission code | Resource |
|---|---|---|---|
| `system-admin` | `/system-admin` | `system-admin.page.read` | `page` |
| `overview` | `/overview` | `overview.page.read` | `page` |
| `reports` | `/reports` | `reports.page.read` | `page` |
| `registry` | `/registry` | `registry.page.read` | `page` |
| `evidence` | `/evidence` | `evidence.page.read` | `page` |
| `tasks` | `/tasks` | `tasks.page.read` | `page` |
| `plans` | `/plans` | `plans.page.read` | `page` |
| `leads-risk` | `/leads` (nếu canonical) | `leads-risk.page.read` | `page` |
| `map` | `/map` | `map.page.read` | `page` |
| `map-data` | `/map-data` | `map-data.page.read` | `page` |
| `tv-wallboard` | `/tv-wallboard` | `tv-wallboard.page.read` | `page` |

> Ghi chú: landing chỉ tạo khi module có route root thật. Nếu chưa có page thật, không tạo menu trỏ vào route (hoặc tạo placeholder).

---

### A2) `system-admin` — sub-areas theo `modules.meta.areas`
> Với system-admin, route thường có prefix `/system-admin/<area>/...` và resource dùng prefix đã chuẩn hoá:
- `/system-admin/iam/...` → resource prefix `iam`
- `/system-admin/master-data/...` hoặc `/system-admin/masterdata/...` → `masterdata`
- `/system-admin/system-config/...` → `system_config` (nếu chốt underscore)

#### A2.1 IAM
| Route | routeKey | PAGE permission code | Resource |
|---|---|---|---|
| `/system-admin/iam/users` | `iam.users` | `system-admin.page.iam.users.read` | `page.iam.users` |
| `/system-admin/iam/roles` | `iam.roles` | `system-admin.page.iam.roles.read` | `page.iam.roles` |
| `/system-admin/iam/permissions` | `iam.permissions` | `system-admin.page.iam.permissions.read` | `page.iam.permissions` |
| `/system-admin/iam/modules` | `iam.modules` | `system-admin.page.iam.modules.read` | `page.iam.modules` |
| `/system-admin/iam/menus` | `iam.menus` | `system-admin.page.iam.menus.read` | `page.iam.menus` |

> Nếu route của anh đang là `/system-admin/iam/role-permissions/...` thì đặt routeKey `iam.role_permissions` hoặc `iam.role-permissions` tùy policy (khuyến nghị underscore trong resource nếu có dấu `-`).

#### A2.2 Master Data
| Route | routeKey | PAGE permission code | Resource |
|---|---|---|---|
| `/system-admin/master-data/common-catalogs` | `masterdata.common_catalogs` | `system-admin.page.masterdata.common_catalogs.read` | `page.masterdata.common_catalogs` |
| `/system-admin/master-data/departments` | `masterdata.departments` | `system-admin.page.masterdata.departments.read` | `page.masterdata.departments` |
| `/system-admin/master-data/org-units` | `masterdata.org_units` | `system-admin.page.masterdata.org_units.read` | `page.masterdata.org_units` |

> Mapping alias: `master-data` → `masterdata` là bắt buộc nếu URL dùng dấu `-`.

#### A2.3 System Config
| Route | routeKey | PAGE permission code | Resource |
|---|---|---|---|
| `/system-admin/system-config/security` | `system_config.security` | `system-admin.page.system_config.security.read` | `page.system_config.security` |
| `/system-admin/system-config/backup` | `system_config.backup` | `system-admin.page.system_config.backup.read` | `page.system_config.backup` |

---

### A3) FEATURE permissions (mẫu)
> FEATURE không gắn với menu trực tiếp. Gán theo role_permissions.

| Nghiệp vụ | FEATURE permission code mẫu |
|---|---|
| Tạo catalog | `system-admin.masterdata.catalog.create` |
| Sửa catalog | `system-admin.masterdata.catalog.update` |
| Xoá catalog | `system-admin.masterdata.catalog.delete` |
| Sửa user IAM | `system-admin.iam.user.update` |
| Gán quyền cho role | `system-admin.role_permissions.assign` *(khuyến nghị action ASSIGN)* |
| Export dữ liệu reports | `reports.report.export` *(tuỳ resource chuẩn của reports)* |

---

### A4) Lưu ý chuẩn hoá routeKey từ path
- Không thay `-` thành `_` một cách mù.  
- Với system-admin nên dùng mapping `meta.areas.route_prefixes` + `resource_prefix`.  
- Với module root khác, routeKey thường là phần path sau `/{moduleKey}`.

---

## PHỤ LỤC B — Test cases chi tiết (Given / When / Then)

> QA chạy test theo từng màn. Mỗi test nên chụp lại ảnh + log nếu fail.

### B1) Modules (Quản lý Phân hệ)
**TC-MOD-01: Tạo module mới đúng chuẩn**
- Given: vào `/system-admin/iam/modules`
- When: bấm “Thêm phân hệ”, nhập `key=tv-wallboard`, `name=TV Wallboard`, `group=SYSTEM`, `meta.source=src/modules/tv`
- Then:
  - record tạo thành công
  - `key` kebab-case, không có dấu `.`
  - cột quyền hiển thị `PAGE/FEATURE/TOTAL` cập nhật đúng (ban đầu 0)

**TC-MOD-02: Chặn delete nguy hiểm**
- Given: module có `permission_count>0` hoặc `menu_count>0`
- When: click Delete
- Then: UI chặn delete, gợi ý disable hoặc xoá quyền/menu trước

**TC-MOD-03: Xem quyền bằng modal**
- Given: module có quyền
- When: click icon “Xem quyền”
- Then: mở modal overview, không điều hướng trang; nút “Quản lý quyền” điều hướng đúng

---

### B2) Permissions (Danh mục quyền)
**TC-PERM-01: Validate dữ liệu không null**
- Given: mở danh sách permissions
- When: lọc “Chưa chuẩn”
- Then: không có record `category null`, `module null`, `resource null`, `action != permission_type`

**TC-PERM-02: PAGE rule**
- Given: chọn tab PAGE
- Then:
  - tất cả action=READ
  - resource bắt đầu bằng `page` hoặc `page.xxx`
  - code đúng `{module}.{resource}.read`

**TC-PERM-03: FEATURE rule**
- Given: chọn tab FEATURE
- Then:
  - action nằm trong permission_actions
  - code đúng `{module}.{resource}.{actionLower}`

---

### B3) Menus (Quản lý Menu)
**TC-MENU-01: Thêm menu tạo thành công**
- Given: bấm “Thêm menu”
- When: nhập `name`, `path`, chọn `module_id`
- Then:
  - insert thành công (không 400)
  - tree refresh, node mới xuất hiện
  - `menus.code` auto-generate từ path theo rule (unique)

**TC-MENU-02: Context menu chuột phải**
- Given: click phải vào node bất kỳ
- When: chọn “Thêm menu con”
- Then: mở modal create với `parent_id` set đúng node đang chọn

**TC-MENU-03: Không spinner vô hạn**
- Given: click nhiều menu node liên tiếp
- Then: panel phải luôn load; nếu lỗi phải show Alert, không quay mãi

**TC-MENU-04: Auto gán phân hệ theo route (nếu module_id null)**
- Given: menu.module_id null
- When: bấm “Gán phân hệ theo route”
- Then: menu được update module_id, UI refresh

**TC-MENU-05: Auto gán quyền theo route**
- Given:
  - menu có module_id
  - permission PAGE code tương ứng route tồn tại
- When: bấm “Tự gán quyền theo route”
- Then:
  - tạo row trong `menu_permissions(menu_id, permission_id)`
  - badge tree đổi “Đã gán quyền”
  - tab Quyền hiển thị hiển thị quyền đã gán (0/1)

**TC-MENU-06: Permission chưa tồn tại**
- Given: menu có module_id nhưng permission code gợi ý chưa có
- When: bấm “Tự gán quyền theo route”
- Then: show modal confirm “Tạo permission và gán luôn?”
  - If confirm: insert permission + insert menu_permissions
  - If cancel: không đổi dữ liệu

---

### B4) Role Permissions (Phân quyền theo vai trò)
**TC-RP-01: Tab PAGE chỉ có READ**
- Given: mở `/system-admin/iam/role-permissions/:roleId`
- When: chọn tab PAGE
- Then: chỉ có cột READ và danh sách resources page.* đúng

**TC-RP-02: Tab FEATURE cột action động theo permission_actions**
- Given: permission_actions có EXPORT/ASSIGN
- When: mở tab FEATURE
- Then: cột “Xuất/Gán” xuất hiện, không fix cứng 5 cột

**TC-RP-03: Không write DB mỗi click**
- Given: tick checkbox
- Then: UI chỉ tăng “Thay đổi +/−”, không gọi API insert/delete ngay

**TC-RP-04: Save batch**
- Given: đã tick vài ô
- When: bấm “Lưu thay đổi”
- Then:
  - batch upsert/delete trong `role_permissions`
  - refresh matrix, diff về 0
  - không phát sinh trùng role_id,permission_id

**TC-RP-05: Tooltip + copy**
- Given: hover checkbox
- Then: tooltip hiển thị permission_code + permission_name; có copy code/resource

---

### B5) Xem menu theo vai trò (Preview)
**TC-PREV-01: Policy ẩn nếu chưa gán quyền**
- Given: role bất kỳ
- When: bật “Hiện lý do bị ẩn”
- Then:
  - menu chưa có menu_permissions => tag cam ⚠️, bị ẩn
  - menu thiếu PAGE => tag đỏ ❌
  - menu inactive => tag đỏ ❌

**TC-PREV-02: Tags màu đúng**
- ✅ Thấy: xanh
- ❌ Ẩn: đỏ
- ⚠️ Chưa gán quyền menu: cam
- path hiển thị nhỏ màu xám: `text-slate-500 text-xs`

**TC-PREV-03: List view sort**
- Given: chuyển sang List view
- Then:
  - sort theo Module
  - sort theo Result (Seen/Hidden)

---

## PHỤ LỤC C (tuỳ chọn) — Bộ query audit nhanh cho QA (copy/paste)

### C1) Menu nào chưa gán quyền (menu_permissions trống)?
```sql
select mn.code, mn.name, mn.path
from public.menus mn
left join public.menu_permissions mp on mp.menu_id = mn._id
where mn.is_active = true
group by mn._id
having count(mp._id) = 0
order by mn.path;
