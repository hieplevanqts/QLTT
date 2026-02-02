import { Button, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import * as React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import type { PermissionRecord } from "../menu.types";

const { Text } = Typography;

export interface AssignedPermissionsTableProps {
  data: PermissionRecord[];
  loading?: boolean;
  onRemove?: (permissionId: string) => void;
}

export const AssignedPermissionsTable: React.FC<AssignedPermissionsTableProps> = ({
  data,
  loading,
  onRemove,
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
            {value}
          </Text>
        ),
      },
      { title: "Tên", dataIndex: "name", key: "name" },
      { title: "Resource", dataIndex: "resource", key: "resource", width: 140 },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 120,
        render: () => <Tag color="blue">READ</Tag>,
      },
      {
        title: "Remove",
        key: "actions",
        width: 100,
        render: (_, record) => (
          <Space>
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove?.(record._id)}
            />
          </Space>
        ),
      },
    ],
    [onRemove],
  );

  return (
    <Table
      bordered
      size="middle"
      rowKey="_id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      locale={{ emptyText: "Menu chưa có quyền hiển thị" }}
    />
  );
};
