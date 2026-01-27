# Quy Trình Chi Tiết Fix Git Conflict

## Tổng Quan

Khi có conflict trong Git (merge hoặc rebase), bạn cần giải quyết bằng cách chọn giữa:
- **HEAD/Current (--ours)**: Phiên bản hiện tại của branch bạn đang làm việc
- **Incoming (--theirs)**: Phiên bản từ branch đang được merge/rebase vào

## Các Bước Chi Tiết

### Bước 1: Kiểm Tra Trạng Thái Conflict

```bash
git status
```

**Kết quả sẽ hiển thị:**
- `Unmerged paths`: Danh sách files có conflict
- `Changes to be committed`: Files đã được merge thành công
- Trạng thái: `interactive rebase in progress` hoặc `You have unmerged paths`

**Ví dụ output:**
```
Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   package.json
	both modified:   src/utils/api/locationsApi.ts
```

### Bước 2: Xem Chi Tiết Conflict Trong File

```bash
# Tìm các conflict markers trong file
grep -n "<<<<<<< HEAD\|=======\|>>>>>>>" <file_path>
```

**Conflict markers:**
- `<<<<<<< HEAD`: Bắt đầu phiên bản current (HEAD)
- `=======`: Ngăn cách giữa 2 phiên bản
- `>>>>>>> commit_hash`: Kết thúc phiên bản incoming

**Ví dụ conflict:**
```typescript
<<<<<<< HEAD
export async function fetchWardsByProvinceId(provinceId: string) {
=======
export async function fetchWardsByProvinceId(provinceId: string) {
  if (!provinceId) return [];
>>>>>>> 09efbea (feat: update screen plans 2)
```

### Bước 3: Chọn Chiến Lược Giải Quyết

#### 3.1. Ưu Tiên Current (HEAD) - Giữ Phiên Bản Hiện Tại

```bash
# Giải quyết từng file
git checkout --ours <file_path>
git add <file_path>

# Hoặc giải quyết nhiều files cùng lúc
git checkout --ours file1.ts file2.ts file3.ts
git add file1.ts file2.ts file3.ts

# Hoặc tất cả files có conflict
git checkout --ours .
git add .
```

**Khi nào dùng:**
- Bạn muốn giữ code hiện tại của mình
- Code incoming có thể làm hỏng tính năng đang hoạt động
- Bạn đã test kỹ code hiện tại

#### 3.2. Ưu Tiên Incoming (Theirs) - Chấp Nhận Phiên Bản Mới

```bash
# Giải quyết từng file
git checkout --theirs <file_path>
git add <file_path>

# Hoặc giải quyết nhiều files cùng lúc
git checkout --theirs file1.ts file2.ts file3.ts
git add file1.ts file2.ts file3.ts

# Hoặc tất cả files có conflict
git checkout --theirs .
git add .
```

**Khi nào dùng:**
- Bạn muốn chấp nhận thay đổi từ branch khác
- Code incoming có tính năng mới hoặc fix bug quan trọng
- Bạn chưa có thay đổi quan trọng trong file đó

#### 3.3. Merge Thủ Công - Kết Hợp Cả Hai

```bash
# Mở file trong editor
code <file_path>

# Xóa conflict markers và chỉnh sửa code để kết hợp cả hai phiên bản
# Sau đó:
git add <file_path>
```

**Ví dụ merge thủ công:**
```typescript
// Trước (có conflict):
<<<<<<< HEAD
export async function fetchWardsByProvinceId(provinceId: string) {
=======
export async function fetchWardsByProvinceId(provinceId: string) {
  if (!provinceId) return [];
>>>>>>> 09efbea

// Sau (đã merge):
export async function fetchWardsByProvinceId(provinceId: string) {
  if (!provinceId) return []; // Thêm validation từ incoming
  // Giữ logic từ HEAD
```

### Bước 4: Đánh Dấu Conflict Đã Được Giải Quyết

```bash
# Sau khi sửa conflict, add file để đánh dấu đã giải quyết
git add <file_path>

# Hoặc add tất cả files đã sửa
git add .
```

### Bước 5: Tiếp Tục Merge/Rebase

#### Nếu đang Merge:
```bash
git commit
# Hoặc với message:
git commit -m "Merge: resolve conflicts"
```

#### Nếu đang Rebase:
```bash
git rebase --continue
# Git sẽ tự động tạo commit message
```

### Bước 6: Xác Nhận Hoàn Thành

```bash
git status
```

**Kết quả mong đợi:**
```
On branch main
nothing to commit, working tree clean
```

## Chiến Lược Theo Loại File

### 1. Package Files (`package.json`, `yarn.lock`, `package-lock.json`)

**Khuyến nghị:** Ưu tiên current (--ours) vì:
- Dependencies đã được test với code hiện tại
- Tránh conflict về version

```bash
git checkout --ours package.json package-lock.json yarn.lock
git add package.json package-lock.json yarn.lock
```

### 2. Context Files (`AuthContext.tsx`, `QLTTScopeContext.tsx`)

**Khuyến nghị:** Ưu tiên current (--ours) vì:
- Logic authentication/authorization đã được test kỹ
- Thay đổi có thể ảnh hưởng toàn bộ app

```bash
git checkout --ours src/contexts/AuthContext.tsx src/contexts/QLTTScopeContext.tsx
git add src/contexts/AuthContext.tsx src/contexts/QLTTScopeContext.tsx
```

### 3. API Files (`locationsApi.ts`, `departmentsApi.ts`, `merchantsApi.ts`)

**Khuyến nghị:** 
- Nếu incoming có tính năng mới → dùng `--theirs`
- Nếu current đã được test kỹ → dùng `--ours`

```bash
# Ví dụ: ưu tiên incoming cho API updates
git checkout --theirs src/utils/api/locationsApi.ts
git add src/utils/api/locationsApi.ts
```

### 4. Component Files (Layout, Pages)

**Khuyến nghị:** Ưu tiên incoming (--theirs) vì:
- Thường có UI/UX improvements
- Dễ test lại sau khi merge

```bash
git checkout --theirs src/layouts/HorizontalNavBar.tsx src/layouts/VerticalSidebar.tsx
git add src/layouts/HorizontalNavBar.tsx src/layouts/VerticalSidebar.tsx
```

### 5. Server Files (`server/index.ts`, `server/importer/*`)

**Khuyến nghị:** Ưu tiên current (--ours) nếu đã có thay đổi local, ngược lại dùng incoming

```bash
git checkout --ours server/index.ts server/importer/*
git add server/index.ts server/importer/*
```

## Quy Trình Tự Động Hóa (Khi Có Nhiều Conflicts)

### Script Giải Quyết Tất Cả Conflicts

```bash
#!/bin/bash
# Giải quyết tất cả conflicts ưu tiên current
git checkout --ours .
git add .

# Hoặc ưu tiên incoming
git checkout --theirs .
git add .
```

### Quy Trình Từng Bước Tự Động

```bash
# 1. Kiểm tra conflicts
git status | grep "both modified\|both added"

# 2. Giải quyết theo loại file
git checkout --ours package.json yarn.lock package-lock.json
git checkout --ours src/contexts/*.tsx
git checkout --theirs src/utils/api/*.ts
git checkout --theirs src/layouts/*.tsx

# 3. Add tất cả
git add .

# 4. Tiếp tục merge/rebase
git commit  # Nếu đang merge
# hoặc
git rebase --continue  # Nếu đang rebase
```

## Xử Lý Các Tình Huống Đặc Biệt

### 1. Conflict Trong File Binary

```bash
# Chọn một trong hai phiên bản
git checkout --ours image.png
# hoặc
git checkout --theirs image.png
git add image.png
```

### 2. File Bị Xóa Ở Một Bên

```bash
# Giữ file (nếu muốn giữ)
git add <file_path>

# Xóa file (nếu muốn xóa)
git rm <file_path>
```

### 3. Hủy Merge/Rebase Nếu Quá Phức Tạp

```bash
# Hủy merge
git merge --abort

# Hủy rebase
git rebase --abort
```

## Best Practices

1. **Luôn kiểm tra trạng thái trước khi giải quyết:**
   ```bash
   git status
   ```

2. **Xem diff trước khi quyết định:**
   ```bash
   git diff <file_path>
   ```

3. **Test sau khi giải quyết conflict:**
   ```bash
   npm run build  # hoặc yarn build
   npm test       # nếu có tests
   ```

4. **Commit message rõ ràng:**
   ```bash
   git commit -m "Resolve conflicts: prioritize current/incoming changes"
   ```

5. **Backup trước khi rebase lớn:**
   ```bash
   git branch backup-before-rebase
   ```

## Ví Dụ Thực Tế

### Ví Dụ 1: Rebase với 40 Commits

```bash
# Bước 1: Kiểm tra
git status

# Bước 2: Giải quyết từng conflict
# Commit 1-10: Ưu tiên current cho contexts
git checkout --ours src/contexts/*.tsx
git add src/contexts/*.tsx
git rebase --continue

# Commit 11-20: Ưu tiên incoming cho API
git checkout --theirs src/utils/api/*.ts
git add src/utils/api/*.ts
git rebase --continue

# Commit 21-30: Ưu tiên current cho package files
git checkout --ours package.json yarn.lock
git add package.json yarn.lock
git rebase --continue

# ... tiếp tục cho đến hết
```

### Ví Dụ 2: Merge với Nhiều Conflicts

```bash
# Giải quyết tất cả cùng lúc
git checkout --ours package.json yarn.lock
git checkout --ours src/contexts/*.tsx
git checkout --theirs src/utils/api/*.ts
git checkout --theirs src/layouts/*.tsx

# Add và commit
git add .
git commit -m "Merge: resolve conflicts prioritizing current for core files"
```

## Troubleshooting

### Lỗi: "needs merge"
```bash
# File chưa được đánh dấu là đã giải quyết
git add <file_path>
```

### Lỗi: "You must edit all merge conflicts"
```bash
# Kiểm tra files còn conflict
git status | grep "both modified\|both added"

# Giải quyết từng file
git checkout --ours <file_path>
git add <file_path>
```

### Lỗi: "error: could not apply"
```bash
# Thử skip commit nếu không quan trọng
git rebase --skip

# Hoặc abort và thử lại
git rebase --abort
```

## Tóm Tắt

1. **Kiểm tra:** `git status`
2. **Xem conflict:** `grep` hoặc mở file
3. **Chọn chiến lược:** `--ours` (current) hoặc `--theirs` (incoming)
4. **Đánh dấu đã giải quyết:** `git add`
5. **Tiếp tục:** `git commit` (merge) hoặc `git rebase --continue`
6. **Xác nhận:** `git status`

