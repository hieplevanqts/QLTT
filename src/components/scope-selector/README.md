# Scope Selector Component

Component chọn phạm vi công tác cho hệ thống MAPPA Web Portal theo cấu trúc phân cấp của Tổng cục Quản lý thị trường.

## Cấu trúc phân cấp

```
Tổng cục Quản lý thị trường (Organization)
├─ Toàn quốc (National - default cho Central Admin)
├─ Hồ Chí Minh (Province)
│   ├─ Tất cả chi cục
│   ├─ Chi cục 1 (Division)
│   │   ├─ Tất cả đội
│   │   ├─ Đội 1 (Team)
│   │   └─ Đội 2
│   └─ Chi cục 2
└─ ... (63 tỉnh thành)
```

## Quyền hạn theo cấp

### Cấp Cục (Central Admin) - `level: 'cuc'`
- Username pattern: `QT_*` (ví dụ: `QT_TEST`, `QT_ADMIN`)
- **Quyền hạn**: Full access, có thể chọn từ "Toàn quốc" đến từng đội cụ thể
- **Options hiển thị**: Tất cả 63 tỉnh và các chi cục/đội thuộc tỉnh đó

### Cấp Chi cục (Provincial Director) - `level: 'chicuc'`
- Username pattern: `QT{MÃ_TỈNH}_*` (ví dụ: `QT24_TEST` = Chi cục TP.HCM)
- **Quyền hạn**: Chỉ thấy tỉnh của mình, có thể chọn các chi cục/đội trong tỉnh
- **Options hiển thị**: Chỉ 1 tỉnh được gán + các chi cục/đội thuộc tỉnh đó

### Cấp Đội (Team Level) - `level: 'doi'`
- Username pattern: `QT{MÃ_TỈNH}{MÃ_ĐỘI}_*` (ví dụ: `QT2401_TEST` = Đội 1, Chi cục TP.HCM)
- **Quyền hạn**: Bị khóa vào scope của đội mình, KHÔNG thể thay đổi
- **UI**: Hiển thị locked state với icon khóa

## Usage

### Basic Usage

```tsx
import { ScopeSelector } from '@/components/scope-selector/ScopeSelector';

function MyComponent() {
  return (
    <div>
      <ScopeSelector />
    </div>
  );
}
```

### With Context

```tsx
import { useQLTTScope } from '@/contexts/QLTTScopeContext';

function MyComponent() {
  const { scope, getScopeDisplayText, canChangeScope } = useQLTTScope();
  
  return (
    <div>
      <p>Current scope: {getScopeDisplayText()}</p>
      <p>Province: {scope.province || 'All'}</p>
      <p>Division: {scope.division || 'All'}</p>
      <p>Team: {scope.team || 'All'}</p>
    </div>
  );
}
```

## Scope State Structure

```typescript
interface QLTTScope {
  province: string | null;  // null = "Toàn quốc"
  division: string | null;  // null = "Tất cả chi cục"
  team: string | null;      // null = "Tất cả đội"
}
```

### Examples

- **Toàn quốc**: `{ province: null, division: null, team: null }`
- **Tỉnh HCM**: `{ province: '24', division: null, team: null }`
- **Chi cục 1 HCM**: `{ province: '24', division: '01', team: null }`
- **Đội 1, Chi cục 1 HCM**: `{ province: '24', division: '01', team: '01' }`

## Display Format

| Scope Level | Display Text |
|-------------|--------------|
| National | "Tổng cục Quản lý thị trường / Toàn quốc" |
| Province | "Tổng cục QLTT / Hồ Chí Minh" |
| Division | "Tổng cục QLTT / Hồ Chí Minh / Chi cục 1" |
| Team | "Tổng cục QLTT / HCM / Chi cục 1 / Đội 1" |

## Styling

Component sử dụng CSS Modules với CSS variables từ `/src/styles/theme.css`:

- `--color-primary`: Màu chính (#005cb6)
- `--border`: Màu viền
- `--radius-md`: Border radius
- `--spacing-*`: Spacing scale

### Customization

Override CSS variables trong theme.css để thay đổi style:

```css
:root {
  --color-primary: #005cb6;
  --radius-md: 8px;
  --spacing-3: 12px;
}
```

## State Management

State được quản lý bởi `QLTTScopeContext` và tự động lưu vào `localStorage`:

- **Key**: `mappa-scope`
- **Format**: JSON string của `QLTTScope` object
- **Auto-restore**: Tự động khôi phục scope khi reload page

## Testing

### Test với các user levels khác nhau

1. **Central Admin**: 
   - Login: `QT_TEST`
   - Expected: Thấy tất cả options từ "Toàn quốc" đến từng đội

2. **Provincial Director**:
   - Login: `QT24_TEST` (TP.HCM)
   - Expected: Chỉ thấy Hồ Chí Minh và các chi cục/đội trong HCM

3. **Team Level**:
   - Login: `QT2401_TEST` (Đội 1, HCM)
   - Expected: Selector bị lock, hiển thị icon khóa

### Demo Page

Truy cập `/demo/scope-selector` để xem demo đầy đủ với debug information.

## Integration

Component đã được tích hợp vào:

- **TopUtilityBar** (`/src/layouts/TopUtilityBar.tsx`): Hiển thị trên header
- **RootLayout** (`/src/app/components/layout/RootLayout.tsx`): Provider wrapping
- **TestPage** (`/src/pages/TestPage.tsx`): Debug info

## API Reference

### Context: `QLTTScopeContext`

```typescript
interface QLTTScopeContextType {
  scope: QLTTScope;
  setScope: (scope: QLTTScope) => void;
  canChangeScope: boolean;
  availableProvinces: ProvinceOption[];
  getScopeDisplayText: () => string;
}
```

### Hook: `useQLTTScope()`

```typescript
const {
  scope,           // Current scope state
  setScope,        // Function to update scope
  canChangeScope,  // Can user change scope?
  availableProvinces, // List of provinces user can access
  getScopeDisplayText, // Get formatted display text
} = useQLTTScope();
```

## Files

- `/src/app/components/scope-selector/ScopeSelector.tsx` - Main component
- `/src/app/components/scope-selector/ScopeSelector.module.css` - Styles
- `/src/contexts/QLTTScopeContext.tsx` - Context & state management
- `/src/pages/ScopeSelectorDemo.tsx` - Demo page

## Notes

- Component tự động mở ra division/team khi scope hiện tại match
- Click vào province/division sẽ toggle expand/collapse
- Selected item được highlight với background color
- Dropdown tự động đóng khi click bên ngoài
- Scope state được persist trong localStorage
