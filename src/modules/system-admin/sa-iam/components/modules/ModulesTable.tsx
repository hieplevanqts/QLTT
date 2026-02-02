import React from "react";
import {
  Button,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  StopOutlined,
} from "@ant-design/icons";

import AppTable from "@/components/data-table/AppTable";
import type { ModuleRecord, ModuleStatusValue } from "../../services/modules.service";

type ModulesTableProps = {
  data: ModuleRecord[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
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
  onViewPermissions: (record: ModuleRecord) => void;
  onGeneratePermissions: (record: ModuleRecord) => void;
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
  canUpdate,
  canDelete,
  onChange,
  onEdit,
  onToggleStatus,
  onDelete,
  onViewPermissions,
  onGeneratePermissions,
}: ModulesTableProps) {
  const isKebabCase = (value?: string | null) =>
    Boolean(value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
  const getPermTotal = (record: ModuleRecord) => record.permission_count ?? 0;
  const getPermPage = (record: ModuleRecord) => record.permission_page_count ?? 0;
  const getPermFeature = (record: ModuleRecord) => record.permission_feature_count ?? 0;
  const getSource = (record: ModuleRecord) =>
    typeof record.meta_source === "string" ? record.meta_source : "";

  const columns: ColumnsType<ModuleRecord> = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 220,
      sorter: (a, b) => (a.key || "").localeCompare(b.key || "", "vi"),
      render: (value: string, record: ModuleRecord) => (
        <Space direction="vertical" size={4}>
          <Typography.Text code copyable={{ text: value }}>
            {value || "—"}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-xs">
            {record.code || value || "—"}
          </Typography.Text>
          {record.key_is_kebab === false && (
            <Tooltip title="Key phải theo kebab-case (vd: system-admin). Nên trùng folder src/modules/<key>.">
              <Tag color="red">Key không chuẩn</Tag>
            </Tooltip>
          )}
          {record.key_is_kebab == null && !isKebabCase(value) && (
            <Tooltip title="Key phải theo kebab-case (vd: system-admin). Nên trùng folder src/modules/<key>.">
              <Tag color="red">Key không chuẩn</Tag>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 260,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || "", "vi"),
      render: (value?: string | null) => value || "—",
    },
    {
      title: "Nhóm",
      dataIndex: "group",
      key: "group",
      width: 120,
      sorter: (a, b) => (a.group || "").localeCompare(b.group || "", "vi"),
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "Quyền",
      key: "permissions",
      width: 210,
      render: (_: unknown, record: ModuleRecord) => (
        <Space size={4} wrap>
          <Tag color="blue">PAGE {getPermPage(record)}</Tag>
          <Tag color="gold">FEATURE {getPermFeature(record)}</Tag>
          <Tag color="geekblue">TOTAL {getPermTotal(record)}</Tag>
          {getPermTotal(record) === 0 && (
            <Tag color="volcano">Chưa khai báo quyền</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Source",
      key: "source",
      width: 220,
      render: (_: unknown, record: ModuleRecord) => {
        const sourceValue = getSource(record);
        if (!sourceValue) return "—";
        return (
          <Typography.Text
            ellipsis={{ tooltip: sourceValue }}
            copyable={{ text: sourceValue }}
            className="max-w-[200px]"
          >
            {sourceValue}
          </Typography.Text>
        );
      },
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
      sorter: (a, b) => (a.status ?? 0) - (b.status ?? 0),
      render: (value: ModuleStatusValue) => (
        <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 230,
      render: (_: unknown, record) => (
        <Space size={4}>
          <Tooltip title="Sinh quyền">
            <Button
              type="text"
              size="small"
              icon={<ThunderboltOutlined />}
              onClick={() => onGeneratePermissions(record)}
              disabled={!canUpdate}
            >
              Sinh quyền
            </Button>
          </Tooltip>
          <Tooltip title="Xem quyền">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewPermissions(record)}
            />
          </Tooltip>
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
      scroll={{ x: 1500 }}
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
