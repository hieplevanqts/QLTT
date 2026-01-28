import React from "react";
import {
  Button,
  Dropdown,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  type InputRef,
  type MenuProps,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  StopOutlined,
} from "@ant-design/icons";

import AppTable from "@/components/data-table/AppTable";
import {
  getColumnSearchProps,
  type ColumnSearchState,
} from "@/components/data-table/columnSearch";
import type { ModuleRecord, ModuleStatusValue } from "../../services/modules.service";

type ModulesTableProps = {
  data: ModuleRecord[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  statusFilter: "all" | "active" | "inactive";
  groupFilter: string;
  groupOptions: Array<{ label: string; value: string }>;
  canUpdate?: boolean;
  canDelete?: boolean;
  onChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ModuleRecord> | SorterResult<ModuleRecord>[],
    extra: TableCurrentDataSource<ModuleRecord>,
  ) => void;
  onEdit: (record: ModuleRecord) => void;
  onToggleStatus: (record: ModuleRecord) => void;
  onDelete: (record: ModuleRecord) => void;
  onRefresh?: () => void;
};

const statusLabel = (status: ModuleStatusValue) =>
  status === 1 ? "Hoạt động" : "Ngừng";
const statusColor = (status: ModuleStatusValue) =>
  status === 1 ? "green" : "orange";

export function ModulesTable({
  data,
  loading,
  total,
  page,
  pageSize,
  statusFilter,
  groupFilter,
  groupOptions,
  canUpdate,
  canDelete,
  onChange,
  onEdit,
  onToggleStatus,
  onDelete,
}: ModulesTableProps) {
  const searchInput = React.useRef<InputRef>(null);
  const [columnSearchText, setColumnSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");

  const columnSearchState: ColumnSearchState = {
    searchText: columnSearchText,
    searchedColumn,
    setSearchText: setColumnSearchText,
    setSearchedColumn,
    inputRef: searchInput,
  };

  const getMoreActions = (record: ModuleRecord): MenuProps => ({
    items: [
      {
        key: "toggle",
        label: record.status === 1 ? "Ngừng phân hệ" : "Kích hoạt phân hệ",
        onClick: () => onToggleStatus(record),
        disabled: !canUpdate,
      },
      {
        key: "delete",
        danger: true,
        label: "Xóa mềm",
        onClick: () => onDelete(record),
        disabled: !canDelete,
      },
    ],
  });

  const columns: ColumnsType<ModuleRecord> = [
    {
      title: "Mã phân hệ",
      dataIndex: "key",
      key: "key",
      width: 180,
      sorter: (a, b) => (a.key || "").localeCompare(b.key || "", "vi"),
      ...getColumnSearchProps<ModuleRecord>("key", columnSearchState, {
        placeholder: "Tìm theo mã phân hệ",
      }),
    },
    {
      title: "Tên phân hệ",
      dataIndex: "name",
      key: "name",
      width: 240,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || "", "vi"),
      ...getColumnSearchProps<ModuleRecord>("name", columnSearchState, {
        placeholder: "Tìm theo tên phân hệ",
      }),
    },
    {
      title: "Nhóm",
      dataIndex: "group",
      key: "group",
      width: 140,
      filters: groupOptions.map((g) => ({ text: g.label, value: g.value })),
      filteredValue: groupFilter !== "all" ? [groupFilter] : null,
      onFilter: (value, record) => record.group === value,
      sorter: (a, b) => (a.group || "").localeCompare(b.group || "", "vi"),
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      sorter: (a, b) =>
        (a.description || "").localeCompare(b.description || "", "vi"),
      ...getColumnSearchProps<ModuleRecord>(
        "description",
        columnSearchState,
        {
          placeholder: "Tìm theo mô tả",
        },
      ),
      render: (value?: string | null) => value || "—",
    },
    {
      title: "Số quyền",
      dataIndex: "permission_count",
      key: "permission_count",
      width: 110,
      align: "right",
      sorter: (a, b) => (a.permission_count ?? 0) - (b.permission_count ?? 0),
      render: (value?: number | null) => value ?? 0,
    },
    {
      title: "Thứ tự",
      dataIndex: "sort_order",
      key: "sort_order",
      width: 90,
      align: "right",
      sorter: (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Hoạt động", value: 1 },
        { text: "Ngừng", value: 0 },
      ],
      filteredValue:
        statusFilter === "all" ? null : [statusFilter === "active" ? 1 : 0],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => (a.status ?? 0) - (b.status ?? 0),
      render: (value: ModuleStatusValue) => (
        <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 170,
      render: (_: unknown, record) => (
        <Space size={4}>
          <Tooltip title="Sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              disabled={!canUpdate}
            />
          </Tooltip>
          <Popconfirm
            title={record.status === 1 ? "Ngừng phân hệ?" : "Kích hoạt phân hệ?"}
            okText="Xác nhận"
            cancelText="Hủy"
            onConfirm={() => onToggleStatus(record)}
            disabled={!canUpdate}
          >
            <Tooltip title={record.status === 1 ? "Ngừng" : "Kích hoạt"}>
              <Button
                type="text"
                size="small"
                danger={record.status === 1}
                icon={record.status === 1 ? <StopOutlined /> : <CheckCircleOutlined />}
                disabled={!canUpdate}
              />
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title="Xóa mềm phân hệ này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDelete(record)}
            disabled={!canDelete}
          >
            <Tooltip title="Xóa mềm">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                disabled={!canDelete}
              />
            </Tooltip>
          </Popconfirm>
          <Dropdown menu={getMoreActions(record)} trigger={["click"]}>
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <AppTable<ModuleRecord>
      rowKey={(record) => record.id}
      bordered
      size="middle"
      loading={loading}
      columns={columns}
      dataSource={data}
      scroll={{ x: 1200 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        showTotal: (t) => `Tổng: ${t} phân hệ`,
      }}
      onChange={onChange}
    />
  );
}
