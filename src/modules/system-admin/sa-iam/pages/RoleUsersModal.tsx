import React from "react";
import { Button, Input, Modal, Select, Space, Table, Tag, Tooltip, message } from "antd";
import { EyeOutlined, UserAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { rolesService, type RoleRecord, type RoleUserRecord } from "../services/roles.service";

type RoleUsersModalProps = {
  open: boolean;
  role: RoleRecord | null;
  onClose: () => void;
  onAssignUsers?: (role: RoleRecord) => void;
};

const statusLabel = (status?: number | string | null) => {
  if (status === 1 || status === "active") return "Hoạt động";
  if (status === 0 || status === "inactive") return "Tạm dừng";
  if (status === 2 || status === "locked") return "Khóa";
  return "Không xác định";
};

const statusColor = (status?: number | string | null) => {
  if (status === 1 || status === "active") return "green";
  if (status === 0 || status === "inactive") return "red";
  if (status === 2 || status === "locked") return "orange";
  return "default";
};

export default function RoleUsersModal({ open, role, onClose, onAssignUsers }: RoleUsersModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState<RoleUserRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [searchText, setSearchText] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive" | "locked">("all");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const loadUsers = React.useCallback(async () => {
    if (!role?.id) return;
    setLoading(true);
    try {
      const result = await rolesService.listRoleUsers(role.id, {
        q: searchText,
        status: statusFilter,
        page,
        pageSize,
      });
      setUsers(result.data);
      setTotal(result.total);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải người dùng.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, role?.id, searchText, statusFilter]);

  React.useEffect(() => {
    if (!open) return;
    void loadUsers();
  }, [open, loadUsers]);

  React.useEffect(() => {
    if (!open) return;
    setPage(1);
  }, [searchText, statusFilter, open]);

  React.useEffect(() => {
    if (open) return;
    setUsers([]);
    setTotal(0);
    setSearchText("");
    setStatusFilter("all");
    setPage(1);
    setPageSize(10);
  }, [open]);

  const handleViewUser = (userId?: string | null) => {
    if (!userId) return;
    navigate(`/system-admin/iam/users/${userId}`);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={role ? `Người dùng thuộc vai trò: ${role.name}` : "Danh sách người dùng"}
      centered
      width={900}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Space wrap>
            <Input.Search
              placeholder="Tìm theo username, họ tên, email..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              allowClear
              style={{ width: 280 }}
            />
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: 180 }}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Tạm dừng" },
                { value: "locked", label: "Khóa" },
              ]}
            />
          </Space>
          {role && onAssignUsers ? (
            <Button icon={<UserAddOutlined />} onClick={() => onAssignUsers(role)}>
              Gán người dùng
            </Button>
          ) : null}
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          dataSource={users}
          bordered
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
              title: "Username",
              dataIndex: "username",
              key: "username",
              width: 160,
              render: (value: string) => value || "-",
            },
            {
              title: "Họ và tên",
              dataIndex: "full_name",
              key: "full_name",
              render: (value: string) => value || "-",
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
              render: (value: string) => value || "-",
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              width: 120,
              render: (value: number | string | null) => (
                <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
              ),
            },
            {
              title: "Đăng nhập lần cuối",
              dataIndex: "lastLoginAt",
              key: "lastLoginAt",
              width: 180,
              render: (value?: string | null) =>
                value
                  ? new Date(value).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-",
            },
            {
              title: "Thao tác",
              key: "actions",
              width: 80,
              render: (_: unknown, record: RoleUserRecord) => (
                <Tooltip title="Xem chi tiết">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewUser(record.id)}
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
