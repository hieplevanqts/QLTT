import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import * as React from "react";
import type { MenuHistoryRecord } from "../menu.types";

const { Text } = Typography;

export interface MenuHistoryTableProps {
  data: MenuHistoryRecord[];
  loading?: boolean;
  highlightId?: string;
}

export const MenuHistoryTable: React.FC<MenuHistoryTableProps> = ({
  data,
  loading,
  highlightId,
}) => {
  const columns = React.useMemo<ColumnsType<MenuHistoryRecord>>(
    () => [
      { title: "Mã menu", dataIndex: "code", key: "code", width: 180 },
      { title: "Tên menu", dataIndex: "name", key: "name" },
      {
        title: "Cập nhật",
        dataIndex: "updated_at",
        key: "updated_at",
        width: 180,
        render: (value) => <Text>{value ? new Date(value).toLocaleString() : "-"}</Text>,
      },
      {
        title: "Tạo lúc",
        dataIndex: "created_at",
        key: "created_at",
        width: 180,
        render: (value) => <Text>{value ? new Date(value).toLocaleString() : "-"}</Text>,
      },
    ],
    [],
  );

  return (
    <Table
      bordered
      size="middle"
      rowKey="_id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10 }}
      rowClassName={(record) => (record._id === highlightId ? "menu-history-highlight" : "")}
    />
  );
};
