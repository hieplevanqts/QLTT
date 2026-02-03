import React from 'react';
import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd';
import { vnGeoTreeData } from '@/modules/kpi/mocks/vnGeoUnits.mock';

interface GeoUnitTreeSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
  width?: number;
}

const normalizeVi = (input: string) =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

export default function GeoUnitTreeSelect({ value, onChange, width = 360 }: GeoUnitTreeSelectProps) {
  const handleChange: TreeSelectProps['onChange'] = (nextValue) => {
    const normalized = (nextValue as string[]) || [];
    if (normalized.includes('ALL')) {
      onChange([]);
      return;
    }
    onChange(normalized);
  };

  const placeholder = value.length === 0 ? 'Tất cả địa bàn' : 'Chọn địa bàn';

  return (
    <TreeSelect
      treeData={vnGeoTreeData}
      value={value}
      onChange={handleChange}
      treeCheckable
      showSearch
      allowClear
      maxTagCount="responsive"
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      placeholder={placeholder}
      style={{ width }}
      dropdownStyle={{ maxHeight: 360, overflow: 'auto', minWidth: width }}
      filterTreeNode={(search, node) => {
        const label = (node as any).label || (typeof node.title === 'string' ? node.title : '');
        return normalizeVi(label).includes(normalizeVi(search));
      }}
    />
  );
}
