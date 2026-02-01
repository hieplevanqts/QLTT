# Store Status Mapping Guide

Cập nhật ngày: 31/01/2026

## Store Status Values (5 Statuses)

### Database & API Values
The store/merchant status field accepts these values:

| Status Code | Vietnamese Label | Icon | Meaning |
|---|---|---|---|
| `active` | Đang hoạt động | ✓ | Store is active and operating normally |
| `pending` | Chờ duyệt | ⏱ | Waiting for verification/approval |
| `suspended` | Tạm ngưng hoạt động | ⏸ | Store is temporarily suspended |
| `rejected` | Từ chối phê duyệt | ✗ | Application has been rejected |
| `refuse` | Ngừng hoạt động | ✗ | Store permanently closed (refuse status) |

## Frontend Type Definition

```typescript
export type FacilityStatus = 
  | 'active'            // Đang hoạt động
  | 'pending'           // Chờ duyệt
  | 'suspended'         // Tạm ngưng hoạt động
  | 'rejected'          // Từ chối phê duyệt
  | 'refuse';           // Ngừng hoạt động
```

## Files Updated

### 1. **API Layer** - `src/utils/api/storesApi.ts`
- ✅ Updated `mapStatus()` function to map legacy values to new 5 statuses
- ✅ Updated `fetchStoresStats()` to count by 'refuse' instead of 'closed'
- ✅ Updated `updateMerchantStatus()` to normalize 'closed' → 'refuse'
- ✅ Added normalization for backward compatibility

### 2. **Type Definitions** - `src/components/ui-kit/FacilityStatusBadge.tsx`
- ✅ Changed type from `'closed'` to `'refuse'`
- ✅ Updated status configuration mapping
- ✅ Kept CSS variant class as `'closed'` for backward compatibility

### 3. **Data & Mock** - `src/utils/data/mockStores.ts`
- ✅ Updated mock status list to use 'refuse'
- ✅ Updated inspection date logic for 'refuse' status

### 4. **Export Functions** - `src/utils/exportStoresCSV.ts`
- ✅ Updated STATUS_MAP to use 'refuse' as key

### 5. **Store List Page** - `src/modules/registry/pages/StoresListPage.tsx`
- ✅ Updated stats tracking to use 'refuse'
- ✅ Updated status filter values from 'closed' to 'refuse'
- ✅ Updated handleClose() action to use 'refuse'
- ✅ Updated summary cards
- ✅ Updated bulk action handlers

### 6. **Store Detail Page** - `src/modules/registry/pages/StoreDetailPage.tsx`
- ✅ Updated getStatusBadge() mapping
- ✅ Updated handleUpdateStatus() calls
- ✅ Updated conditional rendering for 'refuse' status

### 7. **Store Edit Page** - `src/modules/registry/pages/FullEditRegistryPage.tsx`
- ✅ Updated OPERATION_STATUS_OPTIONS
- ✅ Updated validation list

## Status Transitions

### From `active` (Đang hoạt động)
- → `suspended` (Tạm ngưng hoạt động) - via Suspend button
- → `refuse` (Ngừng hoạt động) - via Close button

### From `suspended` (Tạm ngưng hoạt động)
- → `active` (Đang hoạt động) - via Resume button
- → `refuse` (Ngừng hoạt động) - via Close button

### From `pending` (Chờ duyệt)
- → `active` (Đang hoạt động) - via Approve button
- → `rejected` (Từ chối phê duyệt) - via Reject button

### From `rejected` (Từ chối phê duyệt)
- → `pending` (Chờ duyệt) - via Re-review button

### From `refuse` (Ngừng hoạt động)
- → `active` (Đang hoạt động) - via Reopen button

## CSV Export Mapping

When exporting to CSV, statuses are mapped as follows:

```typescript
const STATUS_MAP: Record<FacilityStatus, string> = {
  active: 'Hoạt động',
  pending: 'Chờ duyệt',
  suspended: 'Tạm ngưng',
  refuse: 'Ngừng hoạt động',
  rejected: 'Từ chối phê duyệt',
};
```

## API Backward Compatibility

The API layer includes automatic normalization:

```typescript
// Normalize older 'closed' value to new 'refuse'
const normalizedStatus = status === 'closed' ? 'refuse' : status;
```

This ensures that:
- Old API responses with 'closed' are automatically mapped to 'refuse'
- Gradual migration from legacy 'closed' to 'refuse'

## Stats Tracking

The `fetchStoresStats()` function now tracks:
- `total` - Total stores
- `active` - Đang hoạt động
- `pending` - Chờ duyệt
- `suspended` - Tạm ngưng
- `refuse` - Ngừng hoạt động
- `rejected` - Từ chối phê duyệt

## Testing Checklist

- [x] TS compilation: No errors
- [x] Status filter dropdown shows 'refuse'
- [x] Summary cards display correct counts
- [x] Close store action updates to 'refuse'
- [x] CSV export uses correct label mapping
- [x] Status badges display with correct icons/colors
- [x] All status transitions work correctly

## Notes

- The frontend type `FacilityStatus` uses 'refuse' consistently
- CSS variant class remains 'closed' for styling purposes (backward compatible)
- API responses with legacy 'closed' are normalized to 'refuse'
- All business logic uses the new 'refuse' status code
