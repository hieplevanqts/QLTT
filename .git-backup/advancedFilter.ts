/**
 * Advanced Filter Types
 * For WEB02-03 Advanced Filter Builder
 */

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterOrEqual'
  | 'lessOrEqual'
  | 'between'
  | 'has'
  | 'hasNot'
  | 'in'
  | 'notIn';

export type FilterFieldType = 
  | 'text'
  | 'select'
  | 'multiSelect'
  | 'date'
  | 'dateRange'
  | 'number'
  | 'boolean';

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
  operators: FilterOperator[];
  options?: { value: string; label: string }[];
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
}

export type LogicOperator = 'AND' | 'OR';

export interface FilterGroup {
  id: string;
  logic: LogicOperator;
  conditions: FilterCondition[];
  groups: FilterGroup[];
}

export type PresetScope = 'personal' | 'unit';

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filter: FilterGroup;
  scope: PresetScope;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isStandard?: boolean; // Chi cục/Cục standard preset
  shared?: boolean;
}

// Operator labels
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'Bằng',
  notEquals: 'Không bằng',
  contains: 'Chứa',
  notContains: 'Không chứa',
  greaterThan: 'Lớn hơn',
  lessThan: 'Nhỏ hơn',
  greaterOrEqual: 'Lớn hơn hoặc bằng',
  lessOrEqual: 'Nhỏ hơn hoặc bằng',
  between: 'Trong khoảng',
  has: 'Có',
  hasNot: 'Không có',
  in: 'Trong danh sách',
  notIn: 'Không trong danh sách',
};

// Available filter fields for Registry
export const REGISTRY_FILTER_FIELDS: FilterField[] = [
  {
    id: 'status',
    label: 'Trạng thái',
    type: 'select',
    operators: ['equals', 'notEquals', 'in', 'notIn'],
    options: [
      { value: 'active', label: 'Đang hoạt động' },
      { value: 'pending', label: 'Chờ duyệt' },
      { value: 'suspended', label: 'Tạm ngừng hoạt động' },
      { value: 'closed', label: 'Ngừng hoạt động' },
    ],
  },
  {
    id: 'industry',
    label: 'Ngành hàng',
    type: 'multiSelect',
    operators: ['equals', 'notEquals', 'in', 'notIn', 'contains'],
    options: [
      { value: 'food', label: 'Thực phẩm' },
      { value: 'beverage', label: 'Đồ uống' },
      { value: 'cosmetics', label: 'Mỹ phẩm' },
      { value: 'pharmacy', label: 'Dược phẩm' },
      { value: 'fashion', label: 'Thời trang' },
      { value: 'electronics', label: 'Điện tử' },
      { value: 'furniture', label: 'Nội thất' },
      { value: 'construction', label: 'Xây dựng' },
      { value: 'automotive', label: 'Ô tô - Xe máy' },
      { value: 'service', label: 'Dịch vụ' },
    ],
  },
  {
    id: 'jurisdiction',
    label: 'Địa bàn quản lý',
    type: 'select',
    operators: ['equals', 'notEquals', 'in', 'notIn'],
    options: [
      { value: 'q1', label: 'Chi cục QLTT Phường 1' },
      { value: 'q2', label: 'Chi cục QLTT Phường 2' },
      { value: 'q3', label: 'Chi cục QLTT Phường 3' },
      { value: 'q7', label: 'Chi cục QLTT Phường 7' },
      { value: 'td', label: 'Chi cục QLTT Thủ Đức' },
      { value: 'bt', label: 'Chi cục QLTT Bình Thạnh' },
      { value: 'tb', label: 'Chi cục QLTT Tân Bình' },
    ],
  },
  {
    id: 'riskLevel',
    label: 'Mức độ rủi ro',
    type: 'select',
    operators: ['equals', 'notEquals', 'greaterOrEqual', 'lessOrEqual'],
    options: [
      { value: 'low', label: 'Thấp' },
      { value: 'medium', label: 'Trung bình' },
      { value: 'high', label: 'Cao' },
      { value: 'critical', label: 'Rất cao' },
    ],
  },
  {
    id: 'createdDate',
    label: 'Ngày tạo',
    type: 'dateRange',
    operators: ['equals', 'greaterThan', 'lessThan', 'between'],
  },
  {
    id: 'updatedDate',
    label: 'Ngày cập nhật',
    type: 'dateRange',
    operators: ['equals', 'greaterThan', 'lessThan', 'between'],
  },
  {
    id: 'hasViolations',
    label: 'Vi phạm',
    type: 'boolean',
    operators: ['has', 'hasNot'],
  },
  {
    id: 'hasComplaints',
    label: 'Phản ánh',
    type: 'boolean',
    operators: ['has', 'hasNot'],
  },
  {
    id: 'name',
    label: 'Tên cửa hàng',
    type: 'text',
    operators: ['contains', 'notContains', 'equals'],
  },
  {
    id: 'taxCode',
    label: 'Mã số thuế',
    type: 'text',
    operators: ['equals', 'contains'],
  },
  {
    id: 'ownerName',
    label: 'Chủ hộ',
    type: 'text',
    operators: ['contains', 'notContains', 'equals'],
  },
];

// Helper to get field by id
export function getFilterField(fieldId: string): FilterField | undefined {
  return REGISTRY_FILTER_FIELDS.find(f => f.id === fieldId);
}

// Helper to generate unique ID
export function generateFilterId(): string {
  return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create empty condition
export function createEmptyCondition(): FilterCondition {
  return {
    id: generateFilterId(),
    field: '',
    operator: 'equals',
    value: null,
  };
}

// Create empty group
export function createEmptyGroup(logic: LogicOperator = 'AND'): FilterGroup {
  return {
    id: generateFilterId(),
    logic,
    conditions: [createEmptyCondition()],
    groups: [],
  };
}