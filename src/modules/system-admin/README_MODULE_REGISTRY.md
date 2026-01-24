# System Admin - Module Registry System

## 🎯 Mục đích

Module Registry System là cơ chế quản lý module manifest thông qua file `module.json` chuẩn hoá, cho phép:

1. **Tự động discovery**: Phát hiện và đăng ký module qua manifest
2. **Menu generation**: Tạo menu items từ cấu hình UI
3. **Permission mapping**: Map permissions với database
4. **Version tracking**: Quản lý version và compatibility
5. **Export/Import**: Hỗ trợ export ZIP cho Codex

## 📁 Cấu trúc Files

```
src/modules/system-admin/
├── module.json                              # ✅ Module gốc manifest
├── routes.tsx                               # Export: systemModulesRoute
│
├── pages/
│   └── ModuleRegistryPage.tsx              # Trang quản lý module registry
│
├── components/
│   ├── ModuleRegistryTable.tsx             # Table hiển thị modules
│   ├── ModuleManifestDrawer.tsx            # Drawer xem chi tiết manifest
│   └── MenuPreviewModal.tsx                # Modal preview menu items
│
├── mocks/
│   ├── moduleRegistry.mock.ts              # ✅ Mock data registry (CENTRAL)
│   └── index.ts                            # Export helper functions
│
├── services/
│   └── moduleAdminService.ts               # Service (updated to use MODULE_REGISTRY)
│
├── sa-master-data/
│   ├── module.json                         # ✅ Sub-module manifest
│   └── routes.tsx                          # Export: saMasterDataRoutes
│
├── sa-iam/
│   ├── module.json                         # ✅ Sub-module manifest
│   └── routes.tsx                          # Export: saIamRoutes
│
├── sa-system-config/
│   ├── module.json                         # ✅ Sub-module manifest
│   └── routes.tsx                          # Export: saSystemConfigRoutes
│
├── MODULE_MANIFEST_GUIDE.md                # 📖 Hướng dẫn chi tiết
└── README_MODULE_REGISTRY.md               # 📖 File này
```

## ✅ Acceptance Criteria (Hoàn thành)

### 1. Module Manifest Files ✅

- [x] `/src/modules/system-admin/module.json` - Root module
- [x] `/src/modules/system-admin/sa-master-data/module.json` - Sub-module 1
- [x] `/src/modules/system-admin/sa-iam/module.json` - Sub-module 2
- [x] `/src/modules/system-admin/sa-system-config/module.json` - Sub-module 3

Tất cả files đều tuân thủ schema đầy đủ với:
- id, name, version, basePath
- entry, routes, routeExport
- permissions (array)
- ui (menuLabel, menuPath)
- release (type, notes, breaking)
- compat (minAppVersion, maxAppVersion)

### 2. Route Exports ✅

Tất cả routes.tsx export đúng tên `routeExport`:

| Module | routeExport | Export Name in routes.tsx | Status |
|--------|-------------|---------------------------|--------|
| system-admin | systemModulesRoute | ✅ systemModulesRoute | Match |
| sa-master-data | saMasterDataRoutes | ✅ saMasterDataRoutes | Match |
| sa-iam | saIamRoutes | ✅ saIamRoutes | Match |
| sa-system-config | saSystemConfigRoutes | ✅ saSystemConfigRoutes | Match |

### 3. Mock Registry ✅

File `/src/modules/system-admin/mocks/moduleRegistry.mock.ts` chứa:

- [x] Type `ModuleManifest` với đầy đủ fields
- [x] Constant `MODULE_REGISTRY` array chứa 4 modules
- [x] Helper `getModuleById()`
- [x] Helper `getEnabledModules()`
- [x] Helper `generateMenuItemsFromModules()`

### 4. Module Registry Page ✅

Trang `/system/modules` (`ModuleRegistryPage.tsx`) có:

- [x] List tất cả modules từ MODULE_REGISTRY
- [x] Hiển thị: id, name, version, basePath, permissions count, release type, compat, status
- [x] Nút "Xem manifest" (FileJson icon) → Mở drawer với parsed view + raw JSON
- [x] Nút "Preview menu" (Menu icon) → Mở modal preview menu items
- [x] Toggle status Enabled/Disabled (mock)
- [x] Statistics section (tổng modules, enabled/disabled, total permissions)

### 5. Components ✅

**ModuleRegistryTable.tsx**:
- Hiển thị modules trong table format
- Actions: View manifest, Preview menu, Toggle status
- Badges cho version, release type, status

**ModuleManifestDrawer.tsx**:
- Drawer từ bên phải
- 2 tabs: "Thông tin chi tiết" (parsed) và "Raw JSON"
- Parsed view: Basic info, UI config, Permissions, Release info, Compatibility, Runtime status
- Raw JSON: Copy button
- Responsive và có animation

**MenuPreviewModal.tsx**:
- Modal giữa màn hình
- Hiển thị UI config
- Preview horizontal & vertical menu layouts
- JSON output của menu object
- Info note về mock behavior

### 6. Service Integration ✅

File `moduleAdminService.ts`:
- [x] Import MODULE_REGISTRY
- [x] `listModules()` convert từ MODULE_REGISTRY
- [x] `getModule()` find từ MODULE_REGISTRY
- [x] `getModuleManifest()` return full manifest

## 🚀 Quick Start

### Xem Module Registry

```bash
# Navigate to
/system/modules
```

Trang này sẽ hiển thị:
- 4 modules (system-admin + 3 sub-modules)
- Tất cả enabled by default
- Tổng 48 permissions (estimated)

### Xem Chi tiết Manifest

1. Click icon 📄 (FileJson) ở cột "Thao tác"
2. Drawer sẽ mở từ bên phải
3. Tab "Thông tin chi tiết": Xem parsed view
4. Tab "Raw JSON": Xem + Copy JSON

### Preview Menu Items

1. Click icon 📋 (Menu) ở cột "Thao tác"
2. Modal sẽ hiển thị:
   - Cấu hình UI (menuLabel, menuPath, moduleId)
   - Preview menu horizontal layout
   - Preview menu vertical layout
   - JSON output

### Toggle Module Status

1. Click icon 🔌 (Power) ở cột "Thao tác"
2. Status sẽ chuyển Enabled ↔ Disabled
3. Mock only (không persist)

## 📦 Export ZIP cho Codex

### Chuẩn bị Export

Các file cần thiết đã sẵn sàng:

```
✅ src/modules/system-admin/module.json
✅ src/modules/system-admin/sa-master-data/module.json
✅ src/modules/system-admin/sa-iam/module.json
✅ src/modules/system-admin/sa-system-config/module.json
✅ All routes.tsx với correct exports
✅ MODULE_MANIFEST_GUIDE.md (documentation)
```

### Structure để Export

```
system-admin-v0.2.0.zip
├── README.md                        # Overview
├── MODULE_MANIFEST_GUIDE.md         # Detailed guide
└── src/
    └── modules/
        └── system-admin/
            ├── module.json
            ├── index.ts
            ├── routes.tsx
            ├── pages/
            ├── components/
            ├── services/
            ├── mocks/
            │   └── moduleRegistry.mock.ts
            ├── sa-master-data/
            │   ├── module.json
            │   ├── routes.tsx
            │   └── ...
            ├── sa-iam/
            │   ├── module.json
            │   ├── routes.tsx
            │   └── ...
            └── sa-system-config/
                ├── module.json
                ├── routes.tsx
                └── ...
```

### Codex Workflow

Khi import ZIP vào Codex:

1. **Scan**: Tìm tất cả `module.json` files
2. **Validate**: Check schema, paths, exports
3. **Extract**: Parse manifest data
4. **Generate**:
   - Menu items từ `ui.menuLabel` + `ui.menuPath`
   - Route configs từ `routeExport`
   - Permission maps từ `permissions[]`
5. **Report**: Hiển thị kết quả validation

## 🔧 Development

### Thêm Module Mới

1. Tạo thư mục module:
```bash
mkdir -p src/modules/my-new-module
```

2. Tạo `module.json`:
```json
{
  "id": "my-new-module",
  "name": "Module Mới",
  "version": "0.1.0",
  "basePath": "/my-new-module",
  "entry": "src/modules/my-new-module/index.ts",
  "routes": "src/modules/my-new-module/routes.tsx",
  "permissions": ["my_module:read", "my_module:write"],
  "ui": {
    "menuLabel": "Module Mới",
    "menuPath": "/my-new-module"
  },
  "routeExport": "myNewModuleRoute",
  "release": {
    "type": "minor",
    "notes": "Initial release",
    "breaking": []
  },
  "compat": {
    "minAppVersion": "0.1.0",
    "maxAppVersion": "0.9.0"
  }
}
```

3. Tạo `routes.tsx`:
```tsx
export const myNewModuleRoute: RouteObject = {
  path: 'my-new-module',
  children: [...]
};
```

4. Thêm vào `MODULE_REGISTRY`:
```ts
// mocks/moduleRegistry.mock.ts
export const MODULE_REGISTRY: ModuleManifest[] = [
  // ... existing modules
  {
    id: 'my-new-module',
    name: 'Module Mới',
    // ... full manifest
  }
];
```

### Update Module Version

1. Cập nhật version trong `module.json`
2. Cập nhật `release.type` và `release.notes`
3. Nếu có breaking changes: thêm vào `release.breaking[]`
4. Sync với `MODULE_REGISTRY` mock

## 🧪 Testing

### Test Cases

**Test 1: Load Module Registry Page**
- Navigate to `/system/modules`
- Verify 4 modules hiển thị
- Verify all columns có data

**Test 2: View Manifest**
- Click FileJson icon
- Verify drawer mở
- Switch giữa 2 tabs
- Verify data đầy đủ

**Test 3: Preview Menu**
- Click Menu icon
- Verify modal mở
- Verify preview horizontal/vertical
- Verify JSON output

**Test 4: Toggle Status**
- Click Power icon
- Verify status chuyển đổi
- Verify counter cập nhật

## 📚 Tài liệu

- `MODULE_MANIFEST_GUIDE.md` - Chi tiết về schema, quy tắc, best practices
- Source code trong `/src/modules/system-admin/`
- Mock data: `/src/modules/system-admin/mocks/moduleRegistry.mock.ts`

## 🎉 Summary

Module Registry System hoàn chỉnh với:

✅ 4 module.json files (1 root + 3 sub-modules)
✅ Mock registry với helper functions
✅ Module Registry Page với full features
✅ 3 components: Table, Drawer, Modal
✅ Service integration
✅ Comprehensive documentation
✅ Ready for ZIP export to Codex

**Status**: 🟢 Production Ready (Mock Mode)
**Export Ready**: ✅ Yes
**Codex Compatible**: ✅ Yes (manifest-driven)
