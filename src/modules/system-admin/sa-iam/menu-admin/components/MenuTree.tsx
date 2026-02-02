import { Input, Select, Space, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import * as React from "react";

export interface MenuTreeProps {
  treeData: DataNode[];
  loading?: boolean;
  selectedKeys?: React.Key[];
  moduleOptions?: Array<{ label: string; value: string }>;
  moduleGroupOptions?: Array<{ label: string; value: string }>;
  onSelect?: (keys: React.Key[]) => void;
  onDrop?: (info: any) => void;
  onSearch?: (value: string) => void;
  onFilterStatus?: (value: string) => void;
  onFilterModule?: (value: string) => void;
  onFilterGroup?: (value: string) => void;
}

export const MenuTree: React.FC<MenuTreeProps> = ({
  treeData,
  selectedKeys,
  moduleOptions,
  moduleGroupOptions,
  onSelect,
  onDrop,
  onSearch,
  onFilterStatus,
  onFilterModule,
  onFilterGroup,
}) => {
  return (
    <Space orientation="vertical" style={{ width: "100%" }} size={8}>
      <Input.Search placeholder="Tìm theo mã/tên/path..." onSearch={onSearch} allowClear />
      <Space wrap>
        <Select
          placeholder="Tất cả trạng thái"
          onChange={onFilterStatus}
          options={[
            { label: "Tất cả trạng thái", value: "all" },
            { label: "Hoạt động", value: "active" },
            { label: "Ngừng", value: "inactive" },
          ]}
          style={{ minWidth: 160 }}
        />
        <Select
          placeholder="Tất cả nhóm"
          onChange={onFilterGroup}
          options={[{ label: "Tất cả nhóm", value: "all" }, ...(moduleGroupOptions ?? [])]}
          style={{ minWidth: 160 }}
        />
        <Select
          placeholder="Tất cả phân hệ"
          onChange={onFilterModule}
          options={[{ label: "Tất cả phân hệ", value: "all" }, ...(moduleOptions ?? [])]}
          showSearch
          optionFilterProp="label"
          popupMatchSelectWidth={false}
          dropdownStyle={{ minWidth: 360 }}
          filterOption={(input, option) =>
            String(option?.label ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          style={{ minWidth: 180 }}
        />
      </Space>
      <Tree
        showLine
        blockNode
        draggable
        treeData={treeData}
        selectedKeys={selectedKeys}
        onSelect={(keys) => onSelect?.(keys)}
        onDrop={onDrop}
      />
    </Space>
  );
};
