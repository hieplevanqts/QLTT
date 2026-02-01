/**
 * USERS PAGE - Quản lý người dùng
 * Permission: sa.iam.user.read
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Dropdown,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Tag,
  TreeSelect,
  Tooltip,
  Typography,
  type InputRef,
  type MenuProps,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
  MoreOutlined,
} from "@ant-design/icons";

import { PermissionGate, EmptyState, usePermissions } from "../../_shared";
import PageHeader from "@/layouts/PageHeader";
import AppTable from "@/components/data-table/AppTable";
import { getColumnSearchProps } from "@/components/data-table/columnSearch";
import { useAuth } from "@/contexts/AuthContext";
import {
  usersService,
  type DepartmentScopeRecord,
  type RoleOption,
  type UserRecord,
  type UserStatusValue,
} from "../services/users.service";

const formatDateTime = (value?: string | null) => {
  if (!value) return "Chưa đăng nhập";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusColor = (status: UserStatusValue) => {
  if (status === 1) return "green";
  if (status === 0) return "orange";
  return "red";
};

const statusLabel = (status: UserStatusValue) => {
  if (status === 1) return "Hoạt động";
  if (status === 0) return "Tạm dừng";
  return "Khóa";
};

const inferScopeLevelFromCode = (code?: string | null): number | null => {
  if (!code) return null;
  const trimmed = code.trim();
  if (trimmed.length === 2) return 1; // "QT" -> Cap Cuc
  if (trimmed.length >= 4 && trimmed.length % 2 === 0) {
    const inferred = trimmed.length / 2;
    if (inferred === 1 || inferred === 2 || inferred === 3) return inferred;
  }
  return null;
};

const normalizeScopeLevel = (level?: number | null, code?: string | null) => {
  if (level === 1 || level === 2 || level === 3) return level;
  if (level === 0) return 1;
  return inferScopeLevelFromCode(code);
};

const buildDepartmentTreeData = (departments: DepartmentScopeRecord[]) => {
  const map = new Map<string, DepartmentScopeRecord & { children: string[] }>();
  departments.forEach((dept) => {
    map.set(dept.id, { ...dept, children: [] });
  });
  map.forEach((dept) => {
    if (dept.parent_id && map.has(dept.parent_id)) {
      map.get(dept.parent_id)!.children.push(dept.id);
    }
  });
  const sortIds = (ids: string[]) =>
    ids.sort((a, b) => {
      const da = map.get(a);
      const db = map.get(b);
      if (!da || !db) return 0;
      const orderA = da.order_index ?? 0;
      const orderB = db.order_index ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return (da.name || "").localeCompare(db.name || "", "vi");
    });
  const toNode = (id: string): any => {
    const dept = map.get(id);
    if (!dept) return null;
    const children = sortIds(dept.children).map(toNode).filter(Boolean);
    const label = dept.code ? `${dept.name} (${dept.code})` : dept.name;
    return {
      title: label,
      value: dept.id,
      key: dept.id,
      selectable: true,
      children: children.length > 0 ? children : undefined,
    };
  };
  const roots = Array.from(map.values()).filter((dept) => !dept.parent_id || !map.has(dept.parent_id));
  return sortIds(roots.map((r) => r.id)).map(toNode).filter(Boolean);
};

export default function UsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const searchInput = React.useRef<InputRef>(null);
  const [columnSearchText, setColumnSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive" | "locked">("all");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const scopeLevel = normalizeScopeLevel(
    user?.departmentInfo?.level ?? null,
    user?.departmentInfo?.code ?? null,
  );
  // Only send scope to RPC when the level is valid; otherwise it can filter everything out.
  const scopeDepartmentId = scopeLevel ? user?.departmentInfo?.id ?? null : null;
  const isScopeCuc = scopeLevel === 1;
  const isScopeChiCuc = scopeLevel === 2;
  const isScopeDoi = scopeLevel === 3;
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [departmentScope, setDepartmentScope] = React.useState<DepartmentScopeRecord[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const canCreate = hasPermission("sa.iam.user.create");
  const canUpdate = hasPermission("sa.iam.user.update");
  const canDelete = hasPermission("sa.iam.user.delete");

  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState<UserRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [roles, setRoles] = React.useState<RoleOption[]>([]);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserRecord | null>(null);
  const [rolesModalOpen, setRolesModalOpen] = React.useState(false);
  const [rolesTarget, setRolesTarget] = React.useState<UserRecord | null>(null);

  const [form] = Form.useForm();

  const departmentTreeData = React.useMemo(
    () => buildDepartmentTreeData(departmentScope),
    [departmentScope],
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, roleFilter, departmentFilter]);

  React.useEffect(() => {
    if (!scopeDepartmentId || !scopeLevel) return;
    if (isScopeDoi) {
      setDepartmentFilter(scopeDepartmentId);
    } else if (isScopeChiCuc && departmentFilter === "all") {
      setDepartmentFilter(scopeDepartmentId);
    }
  }, [departmentFilter, isScopeChiCuc, isScopeDoi, scopeDepartmentId, scopeLevel]);

  const getMoreActions = (record: UserRecord): MenuProps => ({
    items: [
      {
        key: "view",
        label: "Xem chi tiết",
        onClick: () => navigate(`/system-admin/iam/users/${record.id}`),
      },
    ],
  });

  const loadRoles = React.useCallback(async () => {
    try {
      const result = await usersService.listRoles();
      setRoles(result);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh sách vai trò.";
      Modal.error({ title: "Lỗi tải vai trò", content: messageText });
    }
  }, []);

  const loadDepartmentScope = React.useCallback(async () => {
    if (!scopeDepartmentId || !scopeLevel) {
      setDepartmentScope([]);
      return;
    }
    try {
      const result = await usersService.listDepartmentScope(scopeDepartmentId, scopeLevel);
      setDepartmentScope(result);
    } catch (err) {
      const messageText =
        err instanceof Error ? err.message : "Không thể tải danh sách đơn vị quản lý.";
      Modal.error({ title: "Lỗi tải đơn vị", content: messageText });
    }
  }, [scopeDepartmentId, scopeLevel]);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await usersService.listUsers({
        q: debouncedSearch || undefined,
        status: statusFilter,
        roleId: roleFilter === "all" ? null : roleFilter,
        departmentId:
          departmentFilter === "all" ? (isScopeDoi ? scopeDepartmentId : null) : departmentFilter,
        scopeDepartmentId,
        scopeLevel,
        page,
        pageSize,
        sortBy: sortField || undefined,
        sortDir: sortOrder,
      });
      setUsers(result.data);
      setTotal(result.total);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh sách người dùng.";
      Modal.error({ title: "Lỗi tải dữ liệu", content: messageText });
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    departmentFilter,
    isScopeDoi,
    page,
    pageSize,
    roleFilter,
    scopeDepartmentId,
    scopeLevel,
    sortField,
    sortOrder,
    statusFilter,
  ]);

  React.useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  React.useEffect(() => {
    void loadDepartmentScope();
  }, [loadDepartmentScope]);

  React.useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({
      status: 1,
      department_id: scopeDepartmentId ?? undefined,
    });
    setFormOpen(true);
  };

  const openEditModal = (record: UserRecord) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      full_name: record.full_name,
      email: record.email,
      phone: record.phone,
      status: record.status,
      note: record.note,
      department_id: record.department_id ?? undefined,
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await usersService.updateUser(editingUser.id, values);
      } else {
        await usersService.createUser(values);
      }
      setFormOpen(false);
      void loadUsers();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      const messageText = err instanceof Error ? err.message : "Không thể lưu người dùng.";
      Modal.error({ title: "Lỗi lưu dữ liệu", content: messageText });
    }
  };

  const handleToggleStatus = async (record: UserRecord) => {
    const nextStatus = record.status === 2 ? 1 : 2;
    try {
      await usersService.setUserStatus(record.id, nextStatus);
      void loadUsers();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật trạng thái.";
      Modal.error({ title: "Lỗi cập nhật", content: messageText });
    }
  };

  const handleDeleteUser = async (record: UserRecord) => {
    try {
      await usersService.softDeleteUser(record.id);
      void loadUsers();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể xóa người dùng.";
      Modal.error({ title: "Lỗi xóa dữ liệu", content: messageText });
    }
  };

  const openRolesModal = (record: UserRecord) => {
    setRolesTarget(record);
    setRolesModalOpen(true);
  };

  const handleSaveRoles = async (roleIds: string[], primaryRoleId?: string | null) => {
    if (!rolesTarget) return;
    try {
      await usersService.setUserRoles(rolesTarget.id, roleIds, primaryRoleId ?? null);
      setRolesModalOpen(false);
      setRolesTarget(null);
      void loadUsers();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật vai trò.";
      Modal.error({ title: "Lỗi cập nhật", content: messageText });
    }
  };

  return (
    <PermissionGate permission="sa.iam.user.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "IAM" },
            { label: "Người dùng" },
          ]}
          title="Quản lý Người dùng"
          subtitle="Quản lý tài khoản và thông tin người dùng hệ thống"
          actions={
            <Button type="primary" icon={<PlusOutlined />} disabled={!canCreate} onClick={openCreateModal}>
              Thêm người dùng
            </Button>
          }
        />

        <div className="px-6 pb-8">
          <Card>
            <AppTable<UserRecord>
              rowKey="id"
              loading={loading}
              dataSource={users}
              locale={{ emptyText: <EmptyState title="Không có dữ liệu" message="Chưa có người dùng nào." /> }}
              toolbar={
                <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                  <Space wrap>
                    <Input
                      placeholder="Tìm theo username, họ tên, email..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      allowClear
                      style={{ width: 280 }}
                    />
                    <Select
                      value={statusFilter}
                      onChange={(value) => setStatusFilter(value)}
                      style={{ width: 160 }}
                      options={[
                        { value: "all", label: "Tất cả trạng thái" },
                        { value: "active", label: "Hoạt động" },
                        { value: "inactive", label: "Tạm dừng" },
                        { value: "locked", label: "Khóa" },
                      ]}
                    />
                    <Select
                      value={roleFilter}
                      onChange={(value) => setRoleFilter(value)}
                      style={{ width: 220 }}
                      options={[
                        { value: "all", label: "Tất cả vai trò" },
                        ...roles.map((role) => ({
                          value: role.id,
                          label: `${role.code} - ${role.name}`,
                        })),
                      ]}
                    />
                    <TreeSelect
                      value={departmentFilter === "all" ? undefined : departmentFilter}
                      onChange={(value) => setDepartmentFilter(value ?? "all")}
                      treeData={departmentTreeData}
                      style={{ width: 260 }}
                      placeholder={
                        isScopeDoi ? "Đơn vị của bạn" : "Tất cả đơn vị quản lý"
                      }
                      allowClear={!isScopeDoi}
                      disabled={isScopeDoi}
                      treeDefaultExpandAll={false}
                      showSearch
                      filterTreeNode={(input, node) =>
                        String(node.title).toLowerCase().includes(input.toLowerCase())
                      }
                      notFoundContent="Không có đơn vị phù hợp"
                      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    />
                  </Space>
                  <Typography.Text type="secondary">
                    Tổng: <strong>{total}</strong> người dùng
                  </Typography.Text>
                </Space>
              }
              pagination={{
                current: page,
                pageSize,
                total,
                onChange: (nextPage, nextPageSize) => {
                  setPage(nextPage);
                  setPageSize(nextPageSize);
                },
              }}
              onChange={(pagination, _filters, sorter) => {
                const nextPage = pagination.current ?? 1;
                const nextPageSize = pagination.pageSize ?? pageSize;
                setPage(nextPage);
                setPageSize(nextPageSize);
                if (!Array.isArray(sorter) && sorter.field) {
                  setSortField(String(sorter.field));
                  if (sorter.order) {
                    setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
                  }
                }
              }}
              columns={[
                {
                  title: "Username",
                  dataIndex: "username",
                  key: "username",
                  width: 160,
                  ellipsis: true,
                  sorter: true,
                  ...getColumnSearchProps<UserRecord>(
                    "username",
                    {
                      searchText: columnSearchText,
                      searchedColumn,
                      setSearchText: setColumnSearchText,
                      setSearchedColumn: setSearchedColumn,
                      inputRef: searchInput,
                    },
                    { placeholder: "Tìm username" },
                  ),
                },
                {
                  title: "Họ và tên",
                  dataIndex: "full_name",
                  key: "full_name",
                  width: 200,
                  ellipsis: true,
                  sorter: true,
                  ...getColumnSearchProps<UserRecord>(
                    "full_name",
                    {
                      searchText: columnSearchText,
                      searchedColumn,
                      setSearchText: setColumnSearchText,
                      setSearchedColumn: setSearchedColumn,
                      inputRef: searchInput,
                    },
                    { placeholder: "Tìm họ tên" },
                  ),
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  key: "email",
                  width: 220,
                  ellipsis: true,
                  sorter: true,
                  ...getColumnSearchProps<UserRecord>(
                    "email",
                    {
                      searchText: columnSearchText,
                      searchedColumn,
                      setSearchText: setColumnSearchText,
                      setSearchedColumn: setSearchedColumn,
                      inputRef: searchInput,
                    },
                    { placeholder: "Tìm email" },
                  ),
                },
                {
                  title: "Điện thoại",
                  dataIndex: "phone",
                  key: "phone",
                  width: 140,
                  ellipsis: true,
                },
                {
                  title: "Đơn vị quản lý",
                  dataIndex: "department_name",
                  key: "department_name",
                  width: 220,
                  ellipsis: true,
                  sorter: true,
                  render: (value: string | null | undefined) => value || "-",
                },
                {
                  title: "Vai trò",
                  dataIndex: "roles",
                  key: "roles",
                  width: 220,
                  render: (value: UserRecord["roles"]) => {
                    if (!value || value.length === 0) return "-";
                    const sorted = [...value].sort((a, b) => {
                      if (a.is_primary && !b.is_primary) return -1;
                      if (!a.is_primary && b.is_primary) return 1;
                      return (a.code || "").localeCompare(b.code || "", "vi");
                    });
                    return (
                      <Space wrap>
                        {sorted.map((role) => (
                          <Tag key={role.role_id} color={role.is_primary ? "blue" : "default"}>
                            {role.code}
                          </Tag>
                        ))}
                      </Space>
                    );
                  },
                },
                {
                  title: "Đăng nhập lần cuối",
                  dataIndex: "last_login_at",
                  key: "last_login_at",
                  width: 170,
                  render: (value: string | null) => formatDateTime(value),
                  sorter: true,
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  key: "status",
                  width: 120,
                  align: "center",
                  render: (value: UserStatusValue) => (
                    <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
                  ),
                },
                {
                  title: "Thao tác",
                  key: "actions",
                  width: 180,
                  fixed: "right",
                  render: (_: unknown, record: UserRecord) => (
                    <Space>
                      <Tooltip title="Xem chi tiết">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => navigate(`/system-admin/iam/users/${record.id}`)}
                        />
                      </Tooltip>
                      <Tooltip title="Gán vai trò">
                        <Button
                          type="text"
                          size="small"
                          icon={<TeamOutlined />}
                          disabled={!canUpdate}
                          onClick={() => openRolesModal(record)}
                        />
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          disabled={!canUpdate}
                          onClick={() => openEditModal(record)}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="Xóa người dùng?"
                        description="Thao tác này sẽ ẩn người dùng khỏi danh sách."
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDeleteUser(record)}
                        disabled={!canDelete}
                      >
                        <Tooltip title="Xóa">
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            disabled={!canDelete}
                          />
                        </Tooltip>
                      </Popconfirm>
                      <Tooltip title={record.status === 2 ? "Mở khóa" : "Khóa tài khoản"}>
                        <Button
                          type="text"
                          size="small"
                          icon={record.status === 2 ? <UnlockOutlined /> : <LockOutlined />}
                          disabled={!canUpdate}
                          onClick={() => handleToggleStatus(record)}
                        />
                      </Tooltip>
                      <Dropdown menu={getMoreActions(record)}>
                        <Button type="text" size="small" icon={<MoreOutlined />} />
                      </Dropdown>
                    </Space>
                  ),
                },
              ]}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </div>

        <Modal
          open={formOpen}
          title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}
          onCancel={() => setFormOpen(false)}
          onOk={handleSubmit}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập username." }]}
            >
              <Input disabled={!!editingUser} />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="full_name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone">
              <Input />
            </Form.Item>
            <Form.Item
              label="Đơn vị quản lý"
              name="department_id"
              rules={[{ required: true, message: "Vui lòng chọn đơn vị quản lý." }]}
              tooltip={
                isScopeDoi
                  ? "Bạn chỉ có thể tạo người dùng trong đơn vị của mình."
                  : undefined
              }
            >
              <TreeSelect
                treeData={departmentTreeData}
                placeholder="Chọn đơn vị quản lý"
                disabled={isScopeDoi}
                showSearch
                filterTreeNode={(input, node) =>
                  String(node.title).toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent="Không có đơn vị phù hợp"
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              />
            </Form.Item>
            <Form.Item label="Trạng thái" name="status">
              <Select
                options={[
                  { value: 1, label: "Hoạt động" },
                  { value: 0, label: "Tạm dừng" },
                  { value: 2, label: "Khóa" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mặc định"
              name="default_password"
              tooltip="Dùng để gửi cho người dùng sau khi tạo tài khoản."
              rules={
                editingUser
                  ? []
                  : [{ required: true, message: "Vui lòng nhập mật khẩu mặc định." }]
              }
            >
              <Input.Password placeholder="Nhập mật khẩu mặc định" />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        <UserRolesModal
          open={rolesModalOpen}
          user={rolesTarget}
          roles={roles}
          onClose={() => {
            setRolesModalOpen(false);
            setRolesTarget(null);
          }}
          onSave={handleSaveRoles}
        />
      </div>
    </PermissionGate>
  );
}

type UserRolesModalProps = {
  open: boolean;
  user: UserRecord | null;
  roles: RoleOption[];
  onClose: () => void;
  onSave: (roleIds: string[], primaryRoleId?: string | null) => void;
};

function UserRolesModal({ open, user, roles, onClose, onSave }: UserRolesModalProps) {
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [primaryRoleId, setPrimaryRoleId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !user) return;
    const roleIds = user.roles?.map((role) => role.role_id) ?? [];
    const primary = user.roles?.find((role) => role.is_primary)?.role_id ?? null;
    setSelectedRoles(roleIds);
    setPrimaryRoleId(primary);
  }, [open, user]);

  React.useEffect(() => {
    if (open) return;
    setSelectedRoles([]);
    setPrimaryRoleId(null);
  }, [open]);

  const roleOptions = roles.map((role) => ({
    label: `${role.code} - ${role.name}`,
    value: role.id,
  }));

  const handleSave = () => {
    onSave(selectedRoles, primaryRoleId);
  };

  return (
    <Modal
      open={open}
      title={user ? `Gán vai trò cho ${user.full_name || user.username || ""}` : "Gán vai trò"}
      onCancel={onClose}
      onOk={handleSave}
      okText="Lưu"
      cancelText="Hủy"
      width={680}
    >
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <Typography.Text strong>Vai trò</Typography.Text>
          <Checkbox.Group
            value={selectedRoles}
            options={roleOptions}
            onChange={(values) => setSelectedRoles(values as string[])}
            style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}
          />
        </div>
        <div>
          <Typography.Text strong>Vai trò chính</Typography.Text>
          <Radio.Group
            value={primaryRoleId}
            onChange={(event) => setPrimaryRoleId(event.target.value)}
          >
            <Space orientation="vertical">
              {selectedRoles.map((roleId) => {
                const role = roles.find((item) => item.id === roleId);
                return (
                  <Radio key={roleId} value={roleId}>
                    {role ? `${role.code} - ${role.name}` : roleId}
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        </div>
      </Space>
    </Modal>
  );
}
