/**
 * MAPPA Portal - Registry Components
 * 
 * Bộ components tái sử dụng cho các trang quản lý danh mục (CRUD operations)
 * 
 * @see README.md để biết thêm chi tiết và usage examples
 */

// ============================================================================
// CORE REGISTRY COMPONENTS
// ============================================================================

/**
 * RegistryTable - Bảng danh sách với selection, sorting, pagination
 * Mapped from: /src/ui-kit/DataTable.tsx
 */
export { default as RegistryTable } from '@/components/ui-kit/DataTable';
export type { Column as RegistryColumn } from '@/components/ui-kit/DataTable';

/**
 * RegistryFilterBar - Bộ lọc nâng cao với saved views
 * Mapped from: /src/patterns/FilterActionBar.tsx
 */
export { default as RegistryFilterBar } from '@/components/patterns/FilterActionBar';

/**
 * RegistryDetailTabs - Drawer/Modal chi tiết entity với tabs
 * Mapped from: /src/patterns/EntityDrawer.tsx
 */
export { default as RegistryDetailTabs } from '@/components/patterns/EntityDrawer';

/**
 * RegistryBulkActions - Thanh hành động hàng loạt
 * Mapped from: /src/patterns/BulkActionBar.tsx
 */
export { default as RegistryBulkActions } from '@/components/patterns/BulkActionBar';
export type { BulkAction as RegistryBulkAction } from '@/components/patterns/BulkActionBar';

/**
 * RegistryActionColumn - Cột thao tác trong bảng
 * Mapped from: /src/patterns/ActionColumn.tsx
 */
export { default as RegistryActionColumn } from '@/components/patterns/ActionColumn';
export { CommonActions as RegistryCommonActions } from '@/components/patterns/ActionColumn';
export type { Action as RegistryAction } from '@/components/patterns/ActionColumn';

/**
 * RegistrySummaryCard - Thẻ thống kê (single card)
 * Mapped from: /src/patterns/SummaryCard.tsx
 */
export { default as RegistrySummaryCard } from '@/components/patterns/SummaryCard';

// ============================================================================
// SUPPORT COMPONENTS
// ============================================================================

/**
 * RegistryEmptyState - Trạng thái rỗng cho bảng/list
 * Mapped from: /src/ui-kit/EmptyState.tsx
 */
export { default as RegistryEmptyState } from '@/components/ui-kit/EmptyState';

/**
 * RegistryTableFooter - Footer với pagination
 * Mapped from: /src/ui-kit/TableFooter.tsx
 */
export { default as RegistryTableFooter } from '@/components/ui-kit/TableFooter';

/**
 * RegistryStatusBadge - Badge hiển thị trạng thái
 * Mapped from: /src/ui-kit/FacilityStatusBadge.tsx
 */
export { default as RegistryStatusBadge } from '@/components/ui-kit/FacilityStatusBadge';
export type { FacilityStatus as RegistryStatus } from '@/components/ui-kit/FacilityStatusBadge';

// ============================================================================
// DIALOG COMPONENTS
// ============================================================================

/**
 * RegistryConfirmDialog - Dialog xác nhận hành động
 * Mapped from: /src/ui-kit/ConfirmDialog.tsx
 */
export { ConfirmDialog as RegistryConfirmDialog } from '@/components/ui-kit/ConfirmDialog';
export type { ConfirmVariant as RegistryConfirmVariant } from '@/components/ui-kit/ConfirmDialog';

/**
 * RegistryImportDialog - Dialog import dữ liệu
 * Mapped from: /src/ui-kit/ImportDialog.tsx
 */
export { ImportDialog as RegistryImportDialog } from '@/components/ui-kit/ImportDialog';

/**
 * RegistryExportDialog - Dialog export dữ liệu
 * Mapped from: /src/ui-kit/ExportDialog.tsx
 */
export { ExportDialog as RegistryExportDialog } from '@/components/ui-kit/ExportDialog';
export type { ExportOptions as RegistryExportOptions } from '@/components/ui-kit/ExportDialog';

// ============================================================================
// PLANNED COMPONENTS (Coming soon)
// ============================================================================

/**
 * TODO: RegistrySavedViews - Quản lý bộ lọc đã lưu
 * Component to save/load/manage filter presets (like Google Sheets views)
 * 
 * Usage:
 * <RegistrySavedViews
 *   views={savedViews}
 *   currentView={activeView}
 *   onViewChange={loadView}
 *   onSaveView={saveNewView}
 * />
 */
// export { default as RegistrySavedViews } from './RegistrySavedViews';

/**
 * TODO: RegistryWizard - Multi-step wizard cho thêm mới phức tạp
 * Step-by-step form with progress indicator
 * 
 * Usage:
 * <RegistryWizard
 *   steps={[
 *     { key: 'basic', title: 'Thông tin cơ bản', component: <BasicForm /> },
 *     { key: 'details', title: 'Chi tiết', component: <DetailForm /> },
 *   ]}
 *   onComplete={handleSubmit}
 * />
 */
// export { default as RegistryWizard } from './RegistryWizard';

/**
 * TODO: DiffViewer - So sánh thay đổi (before/after)
 * Side-by-side or inline diff viewer for audit trails
 * 
 * Usage:
 * <DiffViewer
 *   before={originalData}
 *   after={modifiedData}
 *   mode="side-by-side"
 * />
 */
// export { default as DiffViewer } from './DiffViewer';

/**
 * TODO: VerificationForm - Form phê duyệt/xác minh
 * Approve/reject workflow with comments
 * 
 * Usage:
 * <VerificationForm
 *   data={pendingStore}
 *   onApprove={approve}
 *   onReject={reject}
 *   onRequestChanges={requestChanges}
 * />
 */
// export { default as VerificationForm } from './VerificationForm';

/**
 * TODO: MergeWorkbench - Gộp duplicate records
 * UI for resolving duplicate entities
 * 
 * Usage:
 * <MergeWorkbench
 *   duplicates={[record1, record2]}
 *   onMerge={handleMerge}
 * />
 */
// export { default as MergeWorkbench } from './MergeWorkbench';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Common types used across Registry components
 */
export interface RegistryFilter {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'daterange' | 'text';
  options?: Array<{ value: string; label: string }>;
  advanced?: boolean;
}

export interface RegistrySavedView {
  id: string;
  name: string;
  filters: Record<string, any>;
  sorting?: { key: string; direction: 'asc' | 'desc' };
  isDefault?: boolean;
  isShared?: boolean;
  createdBy?: string;
  createdAt?: string;
}

export interface RegistryPageState {
  filters: Record<string, any>;
  search: string;
  sorting?: { key: string; direction: 'asc' | 'desc' };
  pagination: {
    page: number;
    pageSize: number;
  };
  selectedRows: Set<string | number>;
}
