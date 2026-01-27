# Module Manifest System - Hướng dẫn

## Tổng quan

Hệ thống Module Manifest cho phép quản lý các module một cách có cấu trúc thông qua file `module.json` tại mỗi module. File này chứa metadata, cấu hình UI, permissions, và compatibility information.

## Cấu trúc Module

MAPPA Portal hiện có các module sau:

```
src/modules/
├── system-admin/                    # Module gốc
│   ├── module.json                  # ✅ Manifest chính
│   ├── routes.tsx                   # Export: systemModulesRoute
│   ├── sa-master-data/              # Sub-module 1
│   │   ├── module.json              # ✅ Manifest
│   │   └── routes.tsx               # Export: saMasterDataRoutes
│   ├── sa-iam/                      # Sub-module 2
│   │   ├── module.json              # ✅ Manifest
│   │   └── routes.tsx               # Export: saIamRoutes
│   └── sa-system-config/            # Sub-module 3
│       ├── module.json              # ✅ Manifest
│       └── routes.tsx               # Export: saSystemConfigRoutes
```

## Schema module.json

Mỗi file `module.json` phải tuân thủ schema sau:

```json
{
  "id": "string",                    // Unique module identifier
  "name": "string",                  // Display name (tiếng Việt)
  "version": "semver",               // Semantic version (e.g., "0.2.0")
  "basePath": "string",              // Base route path (e.g., "/system-admin")
  "entry": "string",                 // Entry point file path
  "routes": "string",                // Routes file path
  "permissions": ["string"],         // Array of permission keys
  "ui": {
    "menuLabel": "string",           // Menu label
    "menuPath": "string"             // Menu path
  },
  "routeExport": "string",           // Name of exported route in routes.tsx
  "release": {
    "type": "major|minor|patch",     // Release type
    "notes": "string",               // Release notes
    "breaking": ["string"]           // Breaking changes (optional)
  },
  "compat": {
    "minAppVersion": "semver",       // Minimum compatible app version
    "maxAppVersion": "semver"        // Maximum compatible app version
  }
}
```

## Ví dụ: Module system-admin

```json
{
  "id": "system-admin",
  "name": "Quản trị hệ thống",
  "version": "0.2.0",
  "basePath": "/system-admin",
  "entry": "src/modules/system-admin/index.ts",
  "routes": "src/modules/system-admin/routes.tsx",
  "permissions": [
    "system_admin:read",
    "system_admin:write"
  ],
  "ui": {
    "menuLabel": "Quản trị",
    "menuPath": "/system/modules"
  },
  "routeExport": "systemModulesRoute",
  "release": {
    "type": "minor",
    "notes": "Bổ sung Module Registry + chuẩn hoá manifest module.json",
    "breaking": []
  },
  "compat": {
    "minAppVersion": "0.1.0",
    "maxAppVersion": "0.9.0"
  }
}
```

## Quy tắc đặt tên

### Module ID
- Format: `kebab-case`
- Ví dụ: `system-admin`, `system-admin-master-data`, `system-admin-iam`

### Permissions
- Format: `resource:action` hoặc `module.submodule.resource:action`
- Ví dụ: 
  - `system_admin:read`
  - `sa.masterdata.orgunit:write`
  - `iam:read`

### Route Export
- Format: `camelCase` với suffix `Route` hoặc `Routes`
- Ví dụ: `systemModulesRoute`, `saMasterDataRoutes`, `saIamRoutes`
- **Quan trọng:** Tên này phải khớp chính xác với tên export trong file routes.tsx

## Module Registry Page

Trang Module Registry (`/system/modules`) hiển thị:

1. **Danh sách modules** với thông tin:
   - Module ID, Name, Version
   - Base Path
   - Số lượng permissions
   - Release type (major/minor/patch)
   - Compatibility range
   - Status (Enabled/Disabled)

2. **Thao tác**:
   - 📄 **Xem manifest**: Mở drawer hiển thị chi tiết module.json
   - 📋 **Preview menu**: Xem preview menu item sẽ được tạo từ manifest
   - 🔌 **Toggle status**: Bật/tắt module (mock)

3. **Thống kê**:
   - Tổng số modules
   - Số modules enabled/disabled
   - Tổng số permissions

## Export ZIP cho Codex

### Cấu trúc ZIP cần export

Khi export module để đưa vào Codex (VSCode), cấu trúc thư mục phải rõ ràng:

```
module-export.zip
├── module.json                      # Root manifest (optional)
├── README.md                        # Documentation
└── src/
    └── modules/
        └── system-admin/
            ├── module.json          # ✅ Module manifest
            ├── index.ts
            ├── routes.tsx           # ✅ Routes với export name đúng
            ├── sa-master-data/
            │   ├── module.json      # ✅ Sub-module manifest
            │   ├── routes.tsx
            │   └── pages/
            ├── sa-iam/
            │   ├── module.json      # ✅ Sub-module manifest
            │   ├── routes.tsx
            │   └── pages/
            └── sa-system-config/
                ├── module.json      # ✅ Sub-module manifest
                ├── routes.tsx
                └── pages/
```

### Checklist trước khi export

- [ ] Tất cả module.json hợp lệ (validate với schema)
- [ ] `routeExport` khớp với export name trong routes.tsx
- [ ] Permissions đầy đủ và không trùng lặp
- [ ] Version numbers tuân theo semver
- [ ] Compatibility ranges hợp lý
- [ ] Entry và routes paths đúng

### Validation Script (Mock)

Codex sẽ kiểm tra:

1. ✅ Có file module.json ở đúng vị trí
2. ✅ Schema hợp lệ
3. ✅ routeExport tồn tại trong routes.tsx
4. ✅ basePath không trùng với module khác
5. ✅ permissions format đúng
6. ⚠️ Warning nếu version < minAppVersion
7. ⚠️ Warning nếu có breaking changes

## Tích hợp trong Codex

Sau khi import module ZIP vào Codex, tool sẽ:

1. **Đọc tất cả module.json**
2. **Rà soát cấu trúc**:
   - Validate paths
   - Check exports
   - Verify permissions
3. **Generate menu config**:
   - Từ `ui.menuLabel` và `ui.menuPath`
   - Map với permissions
4. **Generate route config**:
   - Import route từ `routes` file
   - Register với router
5. **Map permissions**:
   - Link với database
   - Apply role-based filtering

## Maintenance

### Khi thêm module mới

1. Tạo thư mục module trong `src/modules/`
2. Tạo `module.json` với đầy đủ thông tin
3. Tạo `routes.tsx` với export name khớp `routeExport`
4. Thêm vào `MODULE_REGISTRY` trong `mocks/moduleRegistry.mock.ts`
5. Test trên Module Registry page

### Khi update module

1. Cập nhật version trong module.json (theo semver)
2. Cập nhật `release.notes`
3. Nếu có breaking changes, thêm vào `release.breaking[]`
4. Cập nhật `release.type` (major/minor/patch)
5. Sync với MODULE_REGISTRY mock

## Best Practices

1. **Version Management**:
   - Luôn tăng version khi có thay đổi
   - Tuân thủ semantic versioning
   - Document breaking changes

2. **Permissions**:
   - Granular permissions (read/write/delete)
   - Consistent naming convention
   - Không duplicate permissions

3. **UI Config**:
   - Menu labels ngắn gọn, dễ hiểu
   - Menu paths không trùng lặp
   - Consistent với basePath

4. **Compatibility**:
   - Test với minAppVersion và maxAppVersion
   - Update khi có breaking API changes
   - Document upgrade paths

## Troubleshooting

### Lỗi: "routeExport not found"
- Kiểm tra export name trong routes.tsx
- Đảm bảo khớp chính xác với `routeExport` trong module.json

### Lỗi: "basePath conflict"
- Kiểm tra không có 2 modules cùng basePath
- Unique constraint trên basePath

### Warning: "Version mismatch"
- Cập nhật minAppVersion/maxAppVersion
- Hoặc upgrade app version

## Tài liệu tham khảo

- `/src/modules/system-admin/mocks/moduleRegistry.mock.ts` - Mock data registry
- `/src/modules/system-admin/module.json` - Root module manifest
- `/src/modules/system-admin/sa-*/module.json` - Sub-module manifests
- `/src/modules/system-admin/pages/ModuleRegistryPage.tsx` - UI implementation
