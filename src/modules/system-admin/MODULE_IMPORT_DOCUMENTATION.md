# Tài liệu chi tiết: Quy trình Import Module

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Cấu trúc Module Package](#cấu-trúc-module-package)
3. [Quy trình Import](#quy-trình-import)
4. [Các bước chi tiết](#các-bước-chi-tiết)
5. [Validation & Error Handling](#validation--error-handling)
6. [Module Manifest Overrides](#module-manifest-overrides)
7. [Import Job Lifecycle](#import-job-lifecycle)
8. [Rollback & Update](#rollback--update)
9. [API Endpoints](#api-endpoints)
10. [Troubleshooting](#troubleshooting)

---

## Tổng quan

Hệ thống Module Import cho phép người dùng cài đặt các module mới vào ứng dụng thông qua việc upload file ZIP chứa code và cấu hình của module. Quá trình này được quản lý bởi một hệ thống job-based với các bước validation, import, và rollback.

### Các thành phần chính:
- **ModuleImportPage**: Giao diện upload và import module
- **ModuleImportHistoryPage**: Lịch sử các job import
- **ModuleDetailPage**: Chi tiết module đã cài đặt
- **moduleAdminService**: Service gọi API backend
- **Backend API**: Xử lý validation, import, và quản lý module

---

## Cấu trúc Module Package

### 1. File ZIP Structure

Module package phải là một file ZIP với cấu trúc sau:

```
module-package.zip
├── <moduleId>/              # Tên thư mục phải trùng với module.json.id
│   ├── module.json          # BẮT BUỘC - File manifest
│   ├── index.ts             # Entry point (theo module.json.entry)
│   ├── routes.tsx           # Route definitions (theo module.json.routes)
│   ├── components/          # Các component của module
│   ├── pages/               # Các page của module
│   ├── services/            # Các service của module
│   └── ...                  # Các file khác
```

**Hoặc:**

```
module-package.zip
├── src/
│   └── modules/
│       └── <moduleId>/      # Tên thư mục phải trùng với module.json.id
│           ├── module.json
│           └── ...
```

### 2. module.json (Manifest File)

File `module.json` là file bắt buộc, phải nằm ở thư mục gốc của module. Cấu trúc tối thiểu:

```json
{
  "id": "kpi-qltt",                    // BẮT BUỘC - ID duy nhất của module
  "name": "KPI & Thống kê QLTT",        // BẮT BUỘC - Tên hiển thị
  "version": "0.1.0",                   // BẮT BUỘC - Phiên bản (semver)
  "basePath": "/kpi",                   // BẮT BUỘC - Base path cho routes (phải unique)
  "entry": "src/modules/kpi-qltt/index.ts",  // BẮT BUỘC - Entry point
  "routes": "src/modules/kpi-qltt/routes.tsx", // BẮT BUỘC - File routes
  "routeExport": "kpiQlttRoute",        // BẮT BUỘC - Tên export của route object
  "permissions": [                      // BẮT BUỘC - Danh sách permissions
    "reports:read",
    "reports:export"
  ],
  "ui": {
    "menuLabel": "KPI QLTT",            // BẮT BUỘC - Label hiển thị trong menu
    "menuPath": "/kpi"                  // BẮT BUỘC - Path trong menu
  }
}
```

### 3. Yêu cầu về File

**File được phép:**
- `.ts`, `.tsx` - TypeScript files
- `.css`, `.scss` - Stylesheets
- `.json` - JSON files
- `.md` - Markdown files
- Images: `.png`, `.jpg`, `.jpeg`, `.svg`, `.gif`, `.webp`

**File bị cấm:**
- `package.json`
- `App.tsx`
- `main.tsx`
- `routes/*` (trừ routes.tsx trong module)
- `.env*`
- `vite.config.ts`
- `tsconfig*.json`
- Các file hệ thống khác

**Giới hạn:**
- Tối đa 5MB cho toàn bộ package
- Tối đa 300 files

---

## Quy trình Import

### Flow Diagram

```
[User] → [Upload ZIP] → [Frontend Validation]
    ↓
[POST /system-admin/modules/import]
    ↓
[Backend: Create Import Job]
    ↓
[Status: pending] → [Status: validating]
    ↓
[Backend: Validate Package]
    ├─→ [Validation Failed] → [Status: failed]
    └─→ [Validation Success] → [Status: importing]
         ↓
    [Backend: Extract & Install]
         ├─→ [Install Failed] → [Status: failed]
         └─→ [Install Success] → [Status: completed]
              ↓
         [Update Registry]
         [Generate installedModules.ts]
         [Update Menu Registry]
```

### Các bước trong Frontend

1. **Upload File** (`ModuleImportPage`)
   - User chọn file ZIP
   - Frontend hiển thị thông tin file (size, name)
   - User có thể điền override form nếu cần

2. **Submit Import**
   - Gọi `moduleAdminService.importModule(file, overrides)`
   - Tạo FormData với file và manifestOverrides (nếu có)
   - POST đến `/system-admin/modules/import`

3. **Polling Job Status**
   - Frontend bắt đầu polling mỗi 1.5 giây
   - Gọi `moduleAdminService.getImportJob(jobId)`
   - Cập nhật UI theo status:
     - `pending`, `validating`, `importing` → Hiển thị "Đang xử lý..."
     - `completed` → Hiển thị "Hoàn tất"
     - `failed` → Hiển thị lỗi

4. **Display Results**
   - Validation results (errors, warnings)
   - Timeline events
   - Job metadata (ID, status, module info, file info)

---

## Các bước chi tiết

### Bước 1: Upload & Validation (Frontend)

**File:** `ModuleImportPage.tsx`

```typescript
const handleImport = async () => {
  // 1. Kiểm tra file đã được chọn
  if (!file) {
    setError("Hãy chọn file ZIP để import.");
    return;
  }

  // 2. Build overrides từ form (nếu có)
  const overrides = buildOverrides(overrideForm);

  // 3. Set state: uploading
  setStep("uploading");
  setError(null);

  // 4. Gọi API import
  const createdJob = await moduleAdminService.importModule(file, overrides);
  setJob(createdJob);

  // 5. Bắt đầu polling nếu job đang xử lý
  if (["pending", "validating", "importing"].includes(createdJob.status)) {
    setStep("processing");
    setPolling(true);
  } else {
    setStep(createdJob.status === "failed" ? "error" : "done");
  }
};
```

### Bước 2: Backend Processing

**API Endpoint:** `POST /system-admin/modules/import`

**Request:**
- `file`: File ZIP (multipart/form-data)
- `manifestOverrides`: JSON string (optional) - Override các giá trị trong module.json

**Response:**
```typescript
{
  id: string;                    // Job ID
  status: ImportStatus;          // pending | validating | importing | completed | failed | rolled_back
  moduleId?: string;
  moduleName?: string;
  version?: string;
  fileName?: string;
  fileSize?: number;
  storedZipName?: string;        // Tên file ZIP đã lưu
  storedZipSize?: number;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
  validationResults?: ValidationResult[];
  timeline?: TimelineEvent[];
}
```

**Backend xử lý:**

1. **Create Job** (Status: `pending`)
   - Tạo ImportJob record
   - Lưu file ZIP tạm thời
   - Trả về job ID

2. **Validation** (Status: `validating`)
   - Extract ZIP file
   - Kiểm tra cấu trúc thư mục
   - Validate `module.json`:
     - Kiểm tra các trường bắt buộc
     - Validate format (JSON, semver, etc.)
     - Kiểm tra `basePath` không trùng với module đã cài
     - Kiểm tra `id` trùng với tên thư mục
   - Kiểm tra file types (chỉ cho phép file types được phép)
   - Kiểm tra file bị cấm
   - Kiểm tra size và file count limits
   - Kiểm tra path traversal attacks
   - Tạo `validationResults` array

3. **Installation** (Status: `importing`)
   - Nếu module đã tồn tại:
     - Tạo backup: `.system_admin/backups/<moduleId>/<timestamp>`
     - Xóa module cũ
   - Copy files vào `src/modules/<moduleId>/`
   - Update registry: `.system_admin/registry.json`
   - Generate `src/imports/installedModules.ts`
   - Update menu registry: `.system_admin/menu_registry.json`
   - Update import history: `.system_admin/import_history.json`

4. **Completion** (Status: `completed`)
   - Lưu ZIP file vào storage (nếu cần)
   - Cập nhật job với thông tin module
   - Trả về job với status `completed`

### Bước 3: Polling & Status Updates

**File:** `ModuleImportPage.tsx`

```typescript
useEffect(() => {
  let timer: number | undefined;

  if (polling && job?.id) {
    timer = window.setInterval(async () => {
      try {
        const data = await moduleAdminService.getImportJob(job.id);
        setJob(data);
        
        // Dừng polling khi job hoàn tất hoặc thất bại
        if (!["pending", "validating", "importing"].includes(data.status)) {
          setPolling(false);
          setStep(data.status === "failed" ? "error" : "done");
        }
      } catch (err) {
        setPolling(false);
        setError(err instanceof Error ? err.message : "Không thể tải trạng thái job.");
      }
    }, 1500); // Poll mỗi 1.5 giây
  }

  return () => {
    if (timer) {
      window.clearInterval(timer);
    }
  };
}, [polling, job?.id]);
```

---

## Validation & Error Handling

### Validation Results

Backend trả về array `validationResults` với các loại:

```typescript
type ValidationResult = {
  type: "error" | "warning" | "info";
  message: string;
  field?: string;  // Trường trong module.json (nếu có)
  path?: string;   // Đường dẫn file (nếu có)
};
```

### Các lỗi validation phổ biến:

1. **Missing module.json**
   - Type: `error`
   - Message: "module.json not found in root directory"

2. **Invalid module.json**
   - Type: `error`
   - Message: "Invalid JSON format in module.json"
   - Field: Tên trường bị lỗi

3. **Missing required fields**
   - Type: `error`
   - Message: "Missing required field: <fieldName>"
   - Field: Tên trường thiếu

4. **Duplicate basePath**
   - Type: `error`
   - Message: "basePath '/kpi' is already used by module 'other-module'"

5. **Folder name mismatch**
   - Type: `error`
   - Message: "Folder name 'wrong-name' does not match module.json.id 'correct-id'"

6. **Forbidden file**
   - Type: `error`
   - Message: "Forbidden file: package.json"
   - Path: Đường dẫn file bị cấm

7. **File size exceeded**
   - Type: `error`
   - Message: "Package size (6MB) exceeds limit (5MB)"

8. **File count exceeded**
   - Type: `error`
   - Message: "File count (350) exceeds limit (300)"

### Error Display

Frontend hiển thị validation results trong component `ValidationResults`:

- **Errors**: Hiển thị với màu đỏ, có icon cảnh báo
- **Warnings**: Hiển thị với màu vàng
- **Info**: Hiển thị với màu xanh

Nếu có lỗi liên quan đến `module.json`, frontend hiển thị form override để user có thể sửa và import lại.

---

## Module Manifest Overrides

### Khi nào sử dụng Overrides?

Khi validation phát hiện thiếu hoặc sai các trường trong `module.json`, user có thể điền form override để bổ sung/sửa các giá trị này mà không cần sửa file ZIP.

### Override Form Fields

```typescript
{
  name: string;              // Tên module
  version: string;           // Phiên bản
  basePath: string;          // Base path cho routes
  entry: string;             // Entry point file
  routes: string;            // Routes file path
  routeExport: string;       // Tên export của route object
  permissions: string;       // Permissions (phân tách bằng dấu phẩy)
  menuLabel: string;         // Menu label
  menuPath: string;          // Menu path
}
```

### Build Overrides Function

```typescript
const buildOverrides = (form): ModuleManifestOverrides | undefined => {
  const overrides: ModuleManifestOverrides = {};
  
  // Chỉ thêm các trường không rỗng
  if (form.name.trim()) overrides.name = form.name.trim();
  if (form.version.trim()) overrides.version = form.version.trim();
  if (form.basePath.trim()) overrides.basePath = form.basePath.trim();
  if (form.entry.trim()) overrides.entry = form.entry.trim();
  if (form.routes.trim()) overrides.routes = form.routes.trim();
  if (form.routeExport.trim()) overrides.routeExport = form.routeExport.trim();
  
  // Parse permissions từ string (phân tách bằng dấu phẩy hoặc xuống dòng)
  if (form.permissions.trim()) {
    overrides.permissions = form.permissions
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  
  // UI overrides
  if (form.menuLabel.trim() || form.menuPath.trim()) {
    overrides.ui = {
      ...(form.menuLabel.trim() ? { menuLabel: form.menuLabel.trim() } : {}),
      ...(form.menuPath.trim() ? { menuPath: form.menuPath.trim() } : {}),
    };
  }
  
  return Object.keys(overrides).length > 0 ? overrides : undefined;
};
```

### Gửi Overrides lên Backend

```typescript
const data = new FormData();
data.append("file", file);
if (overrides && Object.keys(overrides).length > 0) {
  data.append("manifestOverrides", JSON.stringify(overrides));
}
```

Backend sẽ merge overrides vào `module.json` trước khi validation và installation.

---

## Import Job Lifecycle

### Job States

```typescript
type ImportStatus = 
  | "pending"      // Job vừa được tạo, chờ xử lý
  | "validating"   // Đang validate package
  | "importing"    // Đang cài đặt module
  | "completed"    // Hoàn tất thành công
  | "failed"       // Thất bại
  | "rolled_back"; // Đã rollback
```

### State Transitions

```
pending → validating → importing → completed
                ↓           ↓
             failed      failed
                ↓
          rolled_back (nếu rollback)
```

### Timeline Events

Mỗi job có một `timeline` array ghi lại các sự kiện:

```typescript
type TimelineEvent = {
  timestamp: string;
  status: ImportStatus;
  message: string;
  details?: string;
};
```

Ví dụ:
```json
[
  {
    "timestamp": "2024-01-15T10:00:00Z",
    "status": "pending",
    "message": "Job created",
    "details": "File: module-v1.0.0.zip"
  },
  {
    "timestamp": "2024-01-15T10:00:01Z",
    "status": "validating",
    "message": "Starting validation",
    "details": "Checking module.json..."
  },
  {
    "timestamp": "2024-01-15T10:00:05Z",
    "status": "importing",
    "message": "Validation passed",
    "details": "Installing to src/modules/kpi-qltt/"
  },
  {
    "timestamp": "2024-01-15T10:00:10Z",
    "status": "completed",
    "message": "Module installed successfully",
    "details": "Registry updated, routes generated"
  }
]
```

### Job Metadata

```typescript
type ImportJob = {
  id: string;                    // Unique job ID
  status: ImportStatus;
  moduleId?: string;             // Module ID (sau khi validate)
  moduleName?: string;            // Module name
  version?: string;               // Module version
  fileName?: string;              // Tên file ZIP gốc
  fileSize?: number;              // Kích thước file (bytes)
  storedZipName?: string;         // Tên file ZIP đã lưu (nếu có)
  storedZipSize?: number;         // Kích thước file ZIP đã lưu
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
  errorMessage?: string;          // Error message (nếu failed)
  validationResults?: ValidationResult[];
  timeline?: TimelineEvent[];
};
```

---

## Rollback & Update

### Rollback Module

Rollback cho phép khôi phục module về phiên bản trước đó.

**Có 2 cách rollback:**

1. **Rollback từ backup** (nếu có):
   ```typescript
   await moduleAdminService.rollbackModule(moduleId, {
     jobId: backupJobId,  // Job ID của backup
     requestedBy: userId,
     requestedByName: userName
   });
   ```

2. **Rollback từ file ZIP**:
   ```typescript
   await moduleAdminService.rollbackModule(moduleId, {
     file: zipFile,
     requestedBy: userId,
     requestedByName: userName
   });
   ```

**Quy trình rollback:**
1. Tạo backup của module hiện tại
2. Khôi phục từ backup hoặc install từ ZIP
3. Update registry và routes
4. Tạo ImportJob với status `rolled_back`

### Update Module

Update cho phép cập nhật module lên phiên bản mới.

**Bước 1: Inspect Update**
```typescript
const analysis = await moduleAdminService.inspectUpdate(moduleId, newZipFile);
```

Response:
```typescript
type ModuleUpdateAnalysis = {
  currentVersion: string;
  newVersion: string;
  releaseType: "major" | "minor" | "patch" | "prerelease";
  breakingChanges: string[];
  newFiles: string[];
  modifiedFiles: string[];
  deletedFiles: string[];
  menuChanges: {
    added: MenuItem[];
    removed: MenuItem[];
    modified: MenuItem[];
  };
};
```

**Bước 2: Confirm Update**
```typescript
await moduleAdminService.updateModule(moduleId, {
  file: newZipFile,
  updateType: "minor",  // major | minor | patch | prerelease
  selectedMenuIds: [...],  // Menu items muốn giữ lại
  updatedBy: userId,
  updatedByName: userName
});
```

**Quy trình update:**
1. Tạo backup của module hiện tại
2. Validate package mới
3. Merge menu changes (nếu có)
4. Install module mới
5. Update registry và routes
6. Tạo ImportJob với status `completed`

---

## API Endpoints

### Module Management

#### GET `/system-admin/modules`
Lấy danh sách tất cả modules đã cài đặt.

**Response:**
```typescript
ModuleInfo[] = [{
  id: string;
  name: string;
  version: string;
  basePath: string;
  status: "active" | "inactive";
  installedAt: string;
  installedBy?: string;
  installedByName?: string;
}]
```

#### GET `/system-admin/modules/:id`
Lấy chi tiết module.

**Response:**
```typescript
ModuleDetail = {
  ...ModuleInfo;
  entry: string;
  routes: string;
  routeExport: string;
  permissions: string[];
  ui: {
    menuLabel: string;
    menuPath: string;
  };
  importHistory: ImportJob[];
}
```

### Import Jobs

#### POST `/system-admin/modules/import`
Tạo import job mới.

**Request:**
- `file`: File (multipart/form-data)
- `manifestOverrides`: string (JSON, optional)

**Response:** `ImportJob`

#### GET `/system-admin/modules/import-jobs`
Lấy danh sách tất cả import jobs.

**Response:** `ImportJob[]`

#### GET `/system-admin/modules/import-jobs/:jobId`
Lấy chi tiết import job.

**Response:** `ImportJob`

#### DELETE `/system-admin/modules/import-jobs/:jobId/zip`
Xóa file ZIP lưu trữ của job.

**Response:** `ImportJob`

### Rollback

#### POST `/system-admin/modules/:id/rollback`
Rollback module từ backup.

**Request:**
```json
{
  "jobId": "backup-job-id",
  "requestedBy": "user-id",
  "requestedByName": "User Name"
}
```

**Response:** `ImportJob`

#### POST `/system-admin/modules/:id/rollback/upload`
Rollback module từ file ZIP.

**Request:**
- `file`: File (multipart/form-data)
- `requestedBy`: string
- `requestedByName`: string

**Response:** `ImportJob`

### Update

#### POST `/system-admin/modules/:id/update/inspect`
Phân tích update trước khi cập nhật.

**Request:**
- `file`: File (multipart/form-data)

**Response:** `ModuleUpdateAnalysis`

#### POST `/system-admin/modules/:id/update`
Cập nhật module.

**Request:**
- `file`: File (multipart/form-data)
- `updateType`: string ("major" | "minor" | "patch" | "prerelease")
- `selectedMenuIds`: string (JSON array, optional)
- `updatedBy`: string
- `updatedByName`: string

**Response:** `ImportJob`

---

## Troubleshooting

### Lỗi thường gặp

#### 1. "module.json not found"
**Nguyên nhân:** File ZIP không chứa `module.json` ở thư mục gốc.

**Giải pháp:**
- Đảm bảo `module.json` nằm ở thư mục gốc của module
- Kiểm tra cấu trúc thư mục trong ZIP

#### 2. "basePath '/kpi' is already used"
**Nguyên nhân:** `basePath` đã được sử dụng bởi module khác.

**Giải pháp:**
- Thay đổi `basePath` trong `module.json`
- Hoặc sử dụng override form để override `basePath`

#### 3. "Folder name does not match module.json.id"
**Nguyên nhân:** Tên thư mục trong ZIP không trùng với `module.json.id`.

**Giải pháp:**
- Đổi tên thư mục trong ZIP thành `module.json.id`
- Hoặc sửa `module.json.id` thành tên thư mục

#### 4. "Package size exceeds limit"
**Nguyên nhân:** File ZIP vượt quá 5MB.

**Giải pháp:**
- Giảm kích thước package
- Loại bỏ các file không cần thiết
- Nén ảnh và assets

#### 5. "Forbidden file: package.json"
**Nguyên nhân:** Package chứa file bị cấm.

**Giải pháp:**
- Xóa các file bị cấm khỏi package
- Kiểm tra danh sách file bị cấm trong documentation

#### 6. "Import job stuck in 'validating' status"
**Nguyên nhân:** Backend đang xử lý hoặc gặp lỗi.

**Giải pháp:**
- Kiểm tra backend logs
- Đợi thêm vài giây (validation có thể mất thời gian)
- Refresh trang và kiểm tra lại job status

#### 7. "Routes not working after import"
**Nguyên nhân:** `installedModules.ts` chưa được generate hoặc route export sai.

**Giải pháp:**
- Kiểm tra `src/imports/installedModules.ts` có chứa route mới không
- Kiểm tra `routeExport` trong `module.json` có đúng không
- Kiểm tra file `routes.tsx` có export đúng tên không

### Debug Tips

1. **Kiểm tra Validation Results:**
   - Xem chi tiết validation results trong UI
   - Sửa các lỗi được báo
   - Sử dụng override form nếu cần

2. **Kiểm tra Timeline:**
   - Xem timeline events để biết job đang ở bước nào
   - Kiểm tra error message trong timeline

3. **Kiểm tra Backend Logs:**
   - Xem logs của backend API
   - Kiểm tra file system permissions
   - Kiểm tra disk space

4. **Kiểm tra Registry:**
   - Xem `.system_admin/registry.json`
   - Kiểm tra module đã được thêm vào registry chưa

5. **Kiểm tra installedModules.ts:**
   - Xem `src/imports/installedModules.ts`
   - Đảm bảo route mới được export đúng

---

## Best Practices

### 1. Module Development

- **Versioning:** Sử dụng semantic versioning (semver)
- **Testing:** Test module trước khi package
- **Documentation:** Thêm README.md trong module
- **Dependencies:** Tránh dependencies conflict với core app

### 2. Package Preparation

- **Clean Build:** Chỉ include các file cần thiết
- **No Source Maps:** Loại bỏ `.map` files trong production
- **Optimize Assets:** Nén ảnh và assets
- **Validate Locally:** Test module.json trước khi package

### 3. Import Process

- **Backup First:** Luôn backup trước khi import module mới
- **Test in Dev:** Test module trong môi trường dev trước
- **Monitor Jobs:** Theo dõi import jobs để phát hiện lỗi sớm
- **Keep History:** Giữ lại import history để rollback nếu cần

### 4. Security

- **Validate Input:** Luôn validate package trước khi import
- **Path Traversal:** Kiểm tra path traversal attacks
- **File Types:** Chỉ cho phép file types được phép
- **Permissions:** Kiểm tra permissions của module

---

## Kết luận

Hệ thống Module Import cung cấp một cách an toàn và linh hoạt để cài đặt và quản lý các module trong ứng dụng. Quá trình được thiết kế với nhiều lớp validation và error handling để đảm bảo tính ổn định và bảo mật của hệ thống.

Để biết thêm chi tiết, xem:
- `INTEGRATION.md` - Tài liệu tích hợp
- `ModuleImportPage.tsx` - Source code frontend
- Backend API documentation - Tài liệu API backend

