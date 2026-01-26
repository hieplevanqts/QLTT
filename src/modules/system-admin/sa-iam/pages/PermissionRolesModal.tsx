import React from "react";
import { Button, Input, Modal, Space, Table, Tag, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  permissionsService,
  type PermissionRecord,
  type PermissionRoleRecord,
} from "../services/permissions.service";

type PermissionRolesModalProps = {
  open: boolean;
  permission: PermissionRecord | null;
  onClose: () => void;
};

const statusLabel = (status?: number | null) => (status === 1 ? "Hoạt động" : "Ngừng");
const statusColor = (status?: number | null) => (status === 1 ? "green" : "red");

export default function PermissionRolesModal({
  open,
  permission,
  onClose,
}: PermissionRolesModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [roles, setRoles] = React.useState<PermissionRoleRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [searchText, setSearchText] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const loadRoles = React.useCallback(async () => {
    if (!permission?.id) return;
    setLoading(true);
    try {
      const result = await permissionsService.listRolesByPermission(permission.id, {
        q: searchText,
        page,
        pageSize,
      });
      setRoles(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, permission?.id, searchText]);

  React.useEffect(() => {
    if (!open) return;
    void loadRoles();
  }, [open, loadRoles]);

  React.useEffect(() => {
    if (!open) return;
    setPage(1);
  }, [searchText, open]);

  React.useEffect(() => {
    if (open) return;
    setRoles([]);
    setTotal(0);
    setSearchText("");
    setPage(1);
    setPageSize(10);
  }, [open]);

  const handleViewRole = (roleId?: string | null) => {
    if (!roleId) return;
    navigate(`/system-admin/iam/role-permissions/${roleId}`);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        permission ? `Vai trò đang dùng quyền: ${permission.name}` : "Danh sách vai trò"
      }
      centered
      width={860}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Input.Search
            placeholder="Tìm theo mã, tên vai trò..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            allowClear
            style={{ width: 280 }}
          />
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          dataSource={roles}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          columns={[
            {
              title: "Mã vai trò",
              dataIndex: "code",
              key: "code",
              width: 160,
              render: (value: string) => <span style={{ fontWeight: 600 }}>{value}</span>,
            },
            {
              title: "Tên vai trò",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              width: 120,
              render: (value: number) => (
                <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
              ),
            },
            {
              title: "Thao tác",
              key: "actions",
              width: 80,
              render: (_: unknown, record: PermissionRoleRecord) => (
                <Tooltip title="Xem vai trò">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewRole(record.id)}
                  />
                </Tooltip>
              ),
            },
          ]}
        />
      </Space>
    </Modal>
  );
}
