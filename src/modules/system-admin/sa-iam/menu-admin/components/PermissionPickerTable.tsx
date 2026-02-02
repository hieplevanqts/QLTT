import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import * as React from "react";
import type { PermissionRecord } from "../menu.types";
const { Text } = Typography;

const highlightMatch = (value: string, keyword: string) => {
  if (!keyword) return value;
  const lower = value.toLowerCase();
  const lowerKey = keyword.toLowerCase();
  const index = lower.indexOf(lowerKey);
  if (index === -1) return value;
  const before = value.slice(0, index);
  const match = value.slice(index, index + keyword.length);
  const after = value.slice(index + keyword.length);
  return (
    <span>
      {before}
      <mark className="rounded bg-yellow-100 px-1">{match}</mark>
      {after}
    </span>
  );
};

export interface PermissionPickerTableProps {
  data: PermissionRecord[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  selectedIds?: string[];
  onSelectChange?: (ids: string[]) => void;
  disabled?: boolean;
  emptyText?: string;
  highlight?: string;
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
  disabled,
  emptyText,
  highlight,
}) => {
  const columns = React.useMemo<ColumnsType<PermissionRecord>>(
    () => [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        width: 200,
        render: (value: string) => (
          <Text code copyable={{ text: value }}>
            {highlight ? highlightMatch(value, highlight) : value}
          </Text>
        ),
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (value: string) => (highlight ? highlightMatch(value, highlight) : value),
      },
      {
        title: "Resource",
        dataIndex: "resource",
        key: "resource",
        width: 140,
        render: (value: string) => (highlight ? highlightMatch(value, highlight) : value),
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 120,
        render: () => <Tag color="blue">READ</Tag>,
      },
    ],
    [highlight],
  );

  const rowSelection = disabled
    ? {
        selectedRowKeys: [],
        getCheckboxProps: () => ({ disabled: true }),
      }
    : {
        selectedRowKeys: selectedIds,
        onChange: (keys: React.Key[]) => onSelectChange?.(keys as string[]),
      };

  return (
    <Table
      bordered
      size="middle"
      scroll={{ y: 360 }}
      sticky
      rowKey="_id"
      columns={columns}
      dataSource={data}
      loading={loading}
      rowSelection={rowSelection}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: (nextPage, nextSize) => onPageChange?.(nextPage, nextSize),
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
      }}
      locale={{ emptyText: emptyText ?? "Không có quyền PAGE phù hợp" }}
    />
  );
};
