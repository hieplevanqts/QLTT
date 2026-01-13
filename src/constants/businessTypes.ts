/**
 * Business Types Constants
 * Shared across Add Store Dialog and Advanced Filters
 */

export interface BusinessTypeOption {
  value: string;
  label: string;
}

export const BUSINESS_TYPES: BusinessTypeOption[] = [
  { value: 'fresh-food', label: 'Thực phẩm tươi sống' },
  { value: 'processed-food', label: 'Thực phẩm chế biến' },
  { value: 'consumer-goods', label: 'Hàng tiêu dùng' },
  { value: 'electronics', label: 'Điện máy - Điện tử' },
  { value: 'fashion', label: 'Thời trang - Phụ kiện' },
  { value: 'furniture', label: 'Nội thất - Gia dụng' },
  { value: 'construction', label: 'Vật liệu xây dựng' },
  { value: 'pharmacy', label: 'Dược phẩm - Y tế' },
  { value: 'cosmetics', label: 'Mỹ phẩm - Làm đẹp' },
  { value: 'restaurant', label: 'Nhà hàng - Ăn uống' },
  { value: 'service', label: 'Dịch vụ' },
  { value: 'other', label: 'Khác' },
];

/**
 * Get business type label from value
 */
export const getBusinessTypeLabel = (value: string): string => {
  const businessType = BUSINESS_TYPES.find(bt => bt.value === value);
  return businessType?.label || value;
};
