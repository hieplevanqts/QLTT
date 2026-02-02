/**
 * ROLES PAGE - Quản lý vai trò
 * Permission: sa.iam.role.read
 */

import React from "react";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
  type InputRef,
  type MenuProps,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  TeamOutlined,
  UserAddOutlined,
  KeyOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/layouts/PageHeader";
import AppTable from "@/components/data-table/AppTable";
import { getColumnSearchProps } from "@/components/data-table/columnSearch";
import { PermissionGate } from "../../_shared";
import { rolesService, type RoleRecord, type RoleStatusValue } from "../services/roles.service";
import RoleUsersModal from "./RoleUsersModal";
import RoleUserAssignmentModal from "./RoleUserAssignmentModal";
import { CenteredModalShell } from "@/components/overlays/CenteredModalShell";
import { EnterpriseModalHeader } from "@/components/overlays/EnterpriseModalHeader";

type FormMode = "create" | "edit";

type RoleFormValues = {
  code: string;
  name: string;
  description?: string;
  status: RoleStatusValue;
  sort_order?: number | null;
};

const statusLabel = (status?: RoleStatusValue | null) => (status === 1 ? "Hoạt động" : "Ngừng");
const statusColor = (status?: RoleStatusValue | null) => (status === 1 ? "green" : "red");
const nextStatus = (status?: RoleStatusValue | null) => (status === 1 ? 0 : 1);

export default function RolesPage() {
  const navigate = useNavigate();
  const searchInput = React.useRef<InputRef>(null);
  const [columnSearchText, setColumnSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [roles, setRoles] = React.useState<RoleRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<FormMode>("create");
  const [editingRole, setEditingRole] = React.useState<RoleRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm<RoleFormValues>();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [viewRole, setViewRole] = React.useState<RoleRecord | null>(null);
  const [usersModalOpen, setUsersModalOpen] = React.useState(false);
  const [usersRole, setUsersRole] = React.useState<RoleRecord | null>(null);
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);
  const [assignRole, setAssignRole] = React.useState<RoleRecord | null>(null);

  const loadRoles = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await rolesService.listRoles({
        q: searchText,
        status: statusFilter,
        page,
        pageSize,
      });
      setRoles(result.data);
      setTotal(result.total);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải vai trò.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText, statusFilter]);

  React.useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  React.useEffect(() => {
    setPage(1);
  }, [searchText, statusFilter]);

  const openCreate = () => {
    setFormMode("create");
    setEditingRole(null);
    form.resetFields();
    form.setFieldsValue({
      status: 1,
      sort_order: 0,
    });
    setModalOpen(true);
  };

  const openEdit = (role: RoleRecord) => {
    setFormMode("edit");
    setEditingRole(role);
    form.resetFields();
    form.setFieldsValue({
      code: role.code,
      name: role.name,
      description: role.description ?? "",
      status: role.status ?? 1,
      sort_order: role.sort_order ?? 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      if (formMode === "create") {
        const existing = await rolesService.getRoleByCode(values.code.trim());
        if (existing) {
          message.error("Mã vai trò đã tồn tại.");
          setSubmitting(false);
          return;
        }
        await rolesService.createRole({
          code: values.code.trim(),
          name: values.name.trim(),
          description: values.description?.trim() || null,
          status: values.status ?? 1,
          sort_order: values.sort_order ?? 0,
        });
        message.success("Đã tạo vai trò.");
      } else if (editingRole) {
        await rolesService.updateRole(editingRole.id, {
          name: values.name.trim(),
          description: values.description?.trim() || null,
          status: values.status ?? editingRole.status ?? 1,
          sort_order: values.sort_order ?? editingRole.sort_order ?? 0,
        });
        message.success("Đã cập nhật vai trò.");
      }
      setModalOpen(false);
      await loadRoles();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu vai trò.";
      message.error(messageText);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (role: RoleRecord) => {
    try {
      await rolesService.setRoleStatus(role.id, nextStatus(role.status));
      message.success("Đã cập nhật trạng thái.");
      await loadRoles();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật trạng thái.";
      message.error(messageText);
    }
  };

  const handleDelete = async (role: RoleRecord) => {
    try {
      await rolesService.softDeleteRole(role.id);
      message.success("Đã xóa vai trò.");
      await loadRoles();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể xóa vai trò.";
      message.error(messageText);
    }
  };

  const openView = (role: RoleRecord) => {
    setViewRole(role);
    setDrawerOpen(true);
  };

  const openUsersModal = (role: RoleRecord) => {
    setUsersRole(role);
    setUsersModalOpen(true);
  };

  const openAssignUsers = (role: RoleRecord) => {
    setAssignRole(role);
    setAssignModalOpen(true);
  };

  const getMoreActions = (record: RoleRecord): MenuProps => ({
    items: [
      {
        key: "view",
        label: "Xem chi tiết",
        onClick: () => openView(record),
      },
      {
        key: "assign",
        label: "Phân quyền",
        onClick: () => navigate(`/system-admin/iam/role-permissions/${record.id}`),
      },
    ],
  });

  return (
    <PermissionGate permission="sa.iam.role.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "IAM", href: "/system-admin/iam" },
            { label: "Vai trò" },
          ]}
          title="Quản lý Vai trò"
          subtitle="Quản lý vai trò và phân quyền trong hệ thống"
          actions={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => loadRoles()}>
                Làm mới
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Thêm vai trò
              </Button>
            </Space>
          }
        />

        <div className="px-6 pb-8">
          <Card>
            <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
              <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                <Space wrap>
                  <Input
                    placeholder="Tìm theo mã, tên vai trò..."
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    allowClear
                    style={{ width: 260 }}
                  />
                  <Select
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    style={{ width: 160 }}
                    options={[
                      { value: "all", label: "Tất cả trạng thái" },
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Ngừng" },
                    ]}
                  />
                </Space>
                <Typography.Text type="secondary">
                  Tổng: <strong>{total}</strong> vai trò
                </Typography.Text>
              </Space>

              <AppTable
                rowKey="id"
                loading={loading}
                dataSource={roles}
                pagination={{
                  current: page,
                  pageSize,
                  total,
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
                    sorter: (a: RoleRecord, b: RoleRecord) => a.code.localeCompare(b.code, "vi"),
                    ellipsis: true,
                    ...getColumnSearchProps<RoleRecord>(
                      "code",
                      {
                        searchText: columnSearchText,
                        searchedColumn,
                        setSearchText: setColumnSearchText,
                        setSearchedColumn,
                        inputRef: searchInput,
                      },
                      { placeholder: "Tìm mã vai trò" },
                    ),
                  },
                  {
                    title: "Tên vai trò",
                    dataIndex: "name",
                    key: "name",
                    sorter: (a: RoleRecord, b: RoleRecord) => a.name.localeCompare(b.name, "vi"),
                    ellipsis: true,
                    ...getColumnSearchProps<RoleRecord>(
                      "name",
                      {
                        searchText: columnSearchText,
                        searchedColumn,
                        setSearchText: setColumnSearchText,
                        setSearchedColumn,
                        inputRef: searchInput,
                      },
                      { placeholder: "Tìm tên vai trò" },
                    ),
                  },
                  {
                    title: "Mô tả",
                    dataIndex: "description",
                    key: "description",
                    render: (value?: string) => value || "-",
                    ellipsis: true,
                    ...getColumnSearchProps<RoleRecord>(
                      "description",
                      {
                        searchText: columnSearchText,
                        searchedColumn,
                        setSearchText: setColumnSearchText,
                        setSearchedColumn,
                        inputRef: searchInput,
                      },
                      { placeholder: "Tìm mô tả" },
                    ),
                  },
                  {
                    title: "Số người dùng",
                    dataIndex: "user_count",
                    key: "user_count",
                    width: 130,
                    render: (value: number | null | undefined) => value ?? 0,
                    sorter: (a: RoleRecord, b: RoleRecord) =>
                      (a.user_count ?? 0) - (b.user_count ?? 0),
                    align: "center",
                  },
                  {
                    title: "Trạng thái",
                    dataIndex: "status",
                    key: "status",
                    width: 120,
                    render: (value: RoleStatusValue) => (
                      <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
                    ),
                    sorter: (a: RoleRecord, b: RoleRecord) =>
                      (a.status ?? 0) - (b.status ?? 0),
                    align: "center",
                  },
                  {
                    title: "Thao tác",
                    key: "actions",
                    width: 280,
                    fixed: "right",
                    render: (_: unknown, record: RoleRecord) => (
                      <Space>
                        <Tooltip title="Xem">
                          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => openView(record)} />
                        </Tooltip>
                        <Tooltip title={record.is_system ? "System role không thể chỉnh sửa" : "Sửa"}>
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(record)}
                            disabled={Boolean(record.is_system)}
                          />
                        </Tooltip>
                        <Tooltip title="Người dùng thuộc vai trò">
                          <Button
                            type="text"
                            size="small"
                            icon={<TeamOutlined />}
                            onClick={() => openUsersModal(record)}
                          />
                        </Tooltip>
                        <Tooltip title="Gán người dùng">
                          <Button
                            type="text"
                            size="small"
                            icon={<UserAddOutlined />}
                            onClick={() => openAssignUsers(record)}
                          />
                        </Tooltip>
                        <Tooltip title="Phân quyền">
                          <Button
                            type="text"
                            size="small"
                            icon={<KeyOutlined />}
                            onClick={() => navigate(`/system-admin/iam/role-permissions/${record.id}`)}
                          />
                        </Tooltip>
                        <Tooltip
                          title={
                            record.is_system
                              ? "System role không thể đổi trạng thái"
                              : record.status === 1
                                ? "Ngừng"
                                : "Kích hoạt"
                          }
                        >
                          <Popconfirm
                            title={record.status === 1 ? "Ngừng vai trò này?" : "Kích hoạt vai trò này?"}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            onConfirm={() => handleToggleStatus(record)}
                            disabled={Boolean(record.is_system)}
                          >
                            <Button
                              type="text"
                              size="small"
                              danger={record.status === 1}
                              icon={record.status === 1 ? <StopOutlined /> : <CheckCircleOutlined />}
                              disabled={Boolean(record.is_system)}
                            />
                          </Popconfirm>
                        </Tooltip>
                        <Tooltip title={record.is_system ? "System role không thể xóa" : "Xóa"}>
                          <Popconfirm
                            title="Xóa vai trò này?"
                            okText="Xác nhận"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(record)}
                            disabled={Boolean(record.is_system)}
                          >
                            <Button
                              type="text"
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              disabled={Boolean(record.is_system)}
                            />
                          </Popconfirm>
                        </Tooltip>
                        <Dropdown menu={getMoreActions(record)}>
                          <Button type="text" size="small" icon={<MoreOutlined />} />
                        </Dropdown>
                      </Space>
                    ),
                  },
                ]}
              />
            </Space>
          </Card>
        </div>
      </div>

      <CenteredModalShell
        open={modalOpen}
        onClose={closeModal}
        width={760}
        header={
          <EnterpriseModalHeader
            title={formMode === "create" ? "Thêm vai trò" : "Chỉnh sửa vai trò"}
            badgeStatus={
              formMode === "edit"
                ? editingRole?.status === 1
                  ? "success"
                  : "default"
                : "default"
            }
            statusLabel={
              formMode === "edit" && editingRole ? statusLabel(editingRole.status) : undefined
            }
            code={formMode === "edit" ? editingRole?.code ?? undefined : undefined}
            moduleTag="iam"
          />
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={closeModal} disabled={submitting}>
              Đóng
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              Lưu
            </Button>
          </div>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="code"
            label="Mã vai trò"
            rules={[
              { required: true, message: "Vui lòng nhập mã vai trò." },
              {
                pattern: /^[A-Z0-9_]+$/,
                message: "Mã chỉ gồm chữ in hoa, số và dấu gạch dưới.",
              },
            ]}
          >
            <Input disabled={formMode === "edit"} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[{ required: true, message: "Vui lòng nhập tên vai trò." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="sort_order" label="Thứ tự">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue={1}>
            <Select
              options={[
                { value: 1, label: "Hoạt động" },
                { value: 0, label: "Ngừng" },
              ]}
            />
          </Form.Item>
        </Form>
      </CenteredModalShell>

      <CenteredModalShell
        header={
          <EnterpriseModalHeader
            title="Chi tiết vai trò"
            badgeStatus={viewRole?.status === 1 ? "success" : "default"}
            statusLabel={viewRole ? statusLabel(viewRole.status) : undefined}
            code={viewRole?.code}
            moduleTag="iam"
          />
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        afterClose={() => setViewRole(null)}
        width={720}
      >
        {viewRole ? (
          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {viewRole.name}
            </Typography.Title>
            <Tag>{viewRole.code}</Tag>
            <Tag color={statusColor(viewRole.status)}>{statusLabel(viewRole.status)}</Tag>
            <Typography.Paragraph>{viewRole.description || "Chưa có mô tả."}</Typography.Paragraph>
            <Typography.Text>
              Số người dùng: <strong>{viewRole.user_count ?? 0}</strong>
            </Typography.Text>
            <Typography.Text>
              Thứ tự: <strong>{viewRole.sort_order ?? 0}</strong>
            </Typography.Text>
            <Typography.Text>
              System role: <strong>{viewRole.is_system ? "Có" : "Không"}</strong>
            </Typography.Text>
          </Space>
        ) : (
          <Typography.Text>Không có dữ liệu.</Typography.Text>
        )}
      </CenteredModalShell>

      <RoleUsersModal
        open={usersModalOpen}
        role={usersRole}
        onClose={() => {
          setUsersModalOpen(false);
          setUsersRole(null);
        }}
        onAssignUsers={(role) => {
          setUsersModalOpen(false);
          setUsersRole(null);
          openAssignUsers(role);
        }}
      />
      <RoleUserAssignmentModal
        open={assignModalOpen}
        role={assignRole}
        onClose={() => {
          setAssignModalOpen(false);
          setAssignRole(null);
        }}
        onSaved={() => {
          void loadRoles();
        }}
      />
    </PermissionGate>
  );
}
