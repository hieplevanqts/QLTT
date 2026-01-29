import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import * as React from "react";
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
      { title: "Mã quyền", dataIndex: "code", key: "code", width: 180 },
      { title: "Tên quyền", dataIndex: "name", key: "name" },
      { title: "Resource", dataIndex: "resource", key: "resource", width: 140 },
      { title: "Action", dataIndex: "action", key: "action", width: 120 },
      {
        title: "Thao tác",
        key: "actions",
        width: 120,
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => onRemove?.(record._id)}>
              Gỡ
            </Button>
          </Space>
        ),
      },
    ],
    [onRemove],
  );

  return (
    <>
      <Text type="secondary">Đã gán: {data.length}</Text>
      <Table
        bordered
        size="middle"
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
    </>
  );
};
