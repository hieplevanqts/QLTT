import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import * as React from "react";
import type { PermissionRecord } from "../menu.types";

export interface PermissionPickerTableProps {
  data: PermissionRecord[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  selectedIds?: string[];
  onSelectChange?: (ids: string[]) => void;
  onBulkAssign?: () => void;
}

export const PermissionPickerTable: React.FC<PermissionPickerTableProps> = ({
  data,
  loading,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  selectedIds = [],
  onSelectChange,
  onBulkAssign,
}) => {
  const columns = React.useMemo<ColumnsType<PermissionRecord>>(
    () => [
      { title: "Mã quyền", dataIndex: "code", key: "code", width: 200 },
      { title: "Tên quyền", dataIndex: "name", key: "name" },
      { title: "Resource", dataIndex: "resource", key: "resource", width: 140 },
      { title: "Action", dataIndex: "action", key: "action", width: 120 },
      { title: "Category", dataIndex: "category", key: "category", width: 120 },
    ],
    [],
  );

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size={8}>
      <Space>
        <Button type="primary" onClick={onBulkAssign} disabled={!selectedIds.length}>
          Gán đã chọn
        </Button>
      </Space>
      <Table
        bordered
        size="middle"
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (keys) => onSelectChange?.(keys as string[]),
        }}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (nextPage, nextSize) => onPageChange?.(nextPage, nextSize),
          showSizeChanger: true,
        }}
      />
    </Space>
  );
};
