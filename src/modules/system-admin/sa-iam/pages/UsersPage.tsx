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
  Alert,
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
  message,
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
  KeyOutlined,
} from "@ant-design/icons";

import { PermissionGate, EmptyState } from "../../_shared";
import PageHeader from "@/layouts/PageHeader";
import AppTable from "@/components/data-table/AppTable";
import { getColumnSearchProps } from "@/components/data-table/columnSearch";
import { useIamIdentity } from "@/shared/iam/useIamIdentity";
import { supabase } from "@/api/supabaseClient";
import { CenteredModalShell } from "@/components/overlays/CenteredModalShell";
import { EnterpriseModalHeader } from "@/components/overlays/EnterpriseModalHeader";
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

const PERM_USER_READ = "system-admin.user.read";
const PERM_USER_CREATE = "system-admin.user.create";
const PERM_USER_UPDATE = "system-admin.user.update";
const PERM_USER_LOCK = "system-admin.user.lock.update";
const PERM_USER_ROLES_UPDATE = "system-admin.user_roles.update";
const PERM_USER_RESET_PASSWORD = "system-admin.user.reset_password.update";
const PERM_USER_DELETE = "system-admin.user.delete";
const DEFAULT_RESET_PASSWORD = "Vhv@1234";

const inferScopeLevelFromPath = (path?: string | null): number | null => {
  if (!path) return null;
  const segments = path.split(".").filter(Boolean);
  const inferred = segments.length;
  if (inferred === 1 || inferred === 2 || inferred === 3) return inferred;
  return null;
};

const normalizeScopeLevel = (level?: number | null, path?: string | null) => {
  if (level === 1 || level === 2 || level === 3) return level;
  if (level === 0) return 1;
  return inferScopeLevelFromPath(path);
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
  const {
    userId: iamUserId,
    roleCodes: iamRoleCodes,
    isSuperAdmin,
    isAdmin,
    departmentId,
    departmentPath,
    departmentLevel,
    loading: identityLoading,
    hasPerm,
  } = useIamIdentity();
  const searchInput = React.useRef<InputRef>(null);
  const [columnSearchText, setColumnSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive" | "locked">("all");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const scopeLevel = normalizeScopeLevel(departmentLevel ?? null, departmentPath ?? null);
  const scopeDepartmentId = scopeLevel ? departmentId ?? null : null;
  const scopeDepartmentPath = isSuperAdmin ? null : departmentPath ?? null;
  const listScopePath = isSuperAdmin ? "" : departmentPath ?? null;
  const isScopeChiCuc = scopeLevel === 2;
  const isScopeDoi = scopeLevel === 3;
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [departmentScope, setDepartmentScope] = React.useState<DepartmentScopeRecord[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const permissionCodesToCheck = React.useMemo(
    () => [
      PERM_USER_READ,
      PERM_USER_CREATE,
      PERM_USER_UPDATE,
      PERM_USER_LOCK,
      PERM_USER_ROLES_UPDATE,
      PERM_USER_RESET_PASSWORD,
      PERM_USER_DELETE,
    ],
    [],
  );
  const [availablePermissionCodes, setAvailablePermissionCodes] = React.useState<Set<string>>(
    new Set(),
  );
  const [permissionsChecked, setPermissionsChecked] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    if (permissionCodesToCheck.length === 0) return () => undefined;
    const loadPermissionCodes = async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select("code")
        .in("code", permissionCodesToCheck)
        .eq("status", 1);
      if (error) {
        if (import.meta.env.DEV) {
          console.warn("[iam] permissions lookup failed", error);
        }
        if (mounted) {
          setPermissionsChecked(false);
        }
        return;
      }
      const found = new Set(
        (data || []).map((row: any) => String(row.code).toLowerCase()).filter(Boolean),
      );
      if (mounted) {
        setAvailablePermissionCodes(found);
        setPermissionsChecked(true);
      }
      if (import.meta.env.DEV) {
        permissionCodesToCheck.forEach((code) => {
          if (!found.has(code.toLowerCase())) {
            console.warn(`[iam] missing permission code in DB: ${code}`);
          }
        });
      }
    };
    void loadPermissionCodes();
    return () => {
      mounted = false;
    };
  }, [permissionCodesToCheck]);

  const isPermissionMissing = React.useCallback(
    (code: string) => {
      if (!code) return false;
      if (!permissionsChecked) return false;
      return !availablePermissionCodes.has(code.toLowerCase());
    },
    [availablePermissionCodes, permissionsChecked],
  );

  const canManageUsers = isSuperAdmin || isAdmin;
  const canCreate = canManageUsers && hasPerm(PERM_USER_CREATE);
  const canUpdate = canManageUsers && hasPerm(PERM_USER_UPDATE);
  const canDelete = canManageUsers && hasPerm(PERM_USER_DELETE);

  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState<UserRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [roles, setRoles] = React.useState<RoleOption[]>([]);
  const showNoRoleBanner = !identityLoading && iamRoleCodes.length === 0;

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
    if (listScopePath == null && (!scopeDepartmentId || !scopeLevel)) {
      setDepartmentScope([]);
      return;
    }
    try {
      const result = await usersService.listDepartmentScope(
        scopeDepartmentId,
        scopeLevel,
        listScopePath,
      );
      setDepartmentScope(result);
    } catch (err) {
      const messageText =
        err instanceof Error ? err.message : "Không thể tải danh sách đơn vị quản lý.";
      Modal.error({ title: "Lỗi tải đơn vị", content: messageText });
    }
  }, [listScopePath, scopeDepartmentId, scopeLevel]);

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
        scopeDepartmentPath,
        scopeLevel,
        viewerUserId: iamUserId,
        isSuperAdmin,
        isAdmin,
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
    isAdmin,
    isSuperAdmin,
    iamUserId,
    page,
    pageSize,
    roleFilter,
    scopeDepartmentId,
    scopeDepartmentPath,
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
        await usersService.updateUser(editingUser.id, values, {
          actorIsSuperAdmin: isSuperAdmin,
        });
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

  const handleResetPassword = async (record: UserRecord) => {
    Modal.confirm({
      title: "Khởi tạo mật khẩu",
      content: (
        <div className="space-y-2">
          <div>
            Reset mật khẩu cho <strong>{record.username || record.email || record.id}</strong> về
            mặc định <strong>{DEFAULT_RESET_PASSWORD}</strong>?
          </div>
          <div className="text-xs text-slate-500">
            Người dùng sẽ cần đổi mật khẩu sau khi đăng nhập.
          </div>
        </div>
      ),
      okText: "Khởi tạo",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await usersService.resetUserPassword(record.id, DEFAULT_RESET_PASSWORD);
          message.success("Đã khởi tạo mật khẩu.");
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Không thể khởi tạo mật khẩu.";
          message.error(msg);
        }
      },
    });
  };

  const isTargetSuperAdmin = React.useCallback((record: UserRecord) => {
    return (record.roles || []).some(
      (role) => (role.code || "").toLowerCase() === "super-admin",
    );
  }, []);

  const isRecordInScope = React.useCallback(
    (record: UserRecord) => {
      if (isSuperAdmin) return true;
      const isSelf = iamUserId ? record.id === iamUserId : false;
      if (isSelf) return true;
      if (isAdmin) {
        if (!departmentPath || !record.department_path) return false;
        return record.department_path.startsWith(departmentPath);
      }
      return false;
    },
    [departmentPath, iamUserId, isAdmin, isSuperAdmin],
  );

  const getActionScopeReason = React.useCallback(
    (record: UserRecord) => {
      if (!isSuperAdmin && isTargetSuperAdmin(record)) {
        return "Bạn không thể thao tác tài khoản Super Admin.";
      }
      if (!isRecordInScope(record)) {
        return "Bạn không có quyền thao tác người dùng thuộc đơn vị khác.";
      }
      return null;
    },
    [isRecordInScope, isSuperAdmin, isTargetSuperAdmin],
  );

  const getPermissionReason = React.useCallback(
    (code: string, allowed: boolean) => {
      if (allowed || !code) return null;
      if (isPermissionMissing(code)) {
        return `Thiếu quyền: ${code}`;
      }
      return `Bạn thiếu quyền ${code} để thực hiện thao tác này.`;
    },
    [isPermissionMissing],
  );

  const renderIconButton = (
    options: {
      title: string;
      icon: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      danger?: boolean;
    },
    reason?: string | null,
  ) => {
    const { title, icon, onClick, disabled, danger } = options;
    const tooltipTitle = reason ?? title;
    const button = (
      <Button
        type="text"
        size="small"
        icon={icon}
        onClick={onClick}
        disabled={disabled}
        danger={danger}
      />
    );
    return (
      <Tooltip title={tooltipTitle}>
        {disabled ? <span>{button}</span> : button}
      </Tooltip>
    );
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
          {showNoRoleBanner && (
            <Alert
              type="warning"
              showIcon
              message="Tài khoản chưa được gán vai trò"
              style={{ marginBottom: 16 }}
            />
          )}
          <Card>
            <AppTable<UserRecord>
              rowKey="_id"
              bordered
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
                showSizeChanger: true,
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
                  width: 220,
                  fixed: "right",
                  render: (_: unknown, record: UserRecord) => {
                    const scopeReason = getActionScopeReason(record);
                    const canViewByPerm = hasPerm(PERM_USER_READ);
                    const canAssignByPerm = hasPerm(PERM_USER_ROLES_UPDATE);
                    const canEditByPerm = hasPerm(PERM_USER_UPDATE);
                    const canDeleteByPerm = hasPerm(PERM_USER_DELETE);
                    const canLockByPerm =
                      hasPerm(PERM_USER_LOCK) ||
                      (isPermissionMissing(PERM_USER_LOCK) && hasPerm(PERM_USER_UPDATE));
                    const canResetByPerm =
                      hasPerm(PERM_USER_RESET_PASSWORD) ||
                      (isPermissionMissing(PERM_USER_RESET_PASSWORD) && hasPerm(PERM_USER_UPDATE));

                    const viewReason = scopeReason ?? getPermissionReason(PERM_USER_READ, canViewByPerm);
                    const assignReason =
                      scopeReason ?? getPermissionReason(PERM_USER_ROLES_UPDATE, canAssignByPerm);
                    const editReason = scopeReason ?? getPermissionReason(PERM_USER_UPDATE, canEditByPerm);
                    const deleteReason =
                      scopeReason ?? getPermissionReason(PERM_USER_DELETE, canDeleteByPerm);
                    const lockReason = scopeReason ?? getPermissionReason(PERM_USER_LOCK, canLockByPerm);
                    const resetReason =
                      scopeReason ?? getPermissionReason(PERM_USER_RESET_PASSWORD, canResetByPerm);

                    const canView = !viewReason;
                    const canAssign = !assignReason;
                    const canEditAction = !editReason;
                    const canDeleteAction = !deleteReason;
                    const canToggle = !lockReason;
                    const canResetAction = !resetReason;

                    return (
                      <Space>
                        {renderIconButton(
                          {
                            title: "Xem chi tiết",
                            icon: <EyeOutlined />,
                            onClick: () => navigate(`/system-admin/iam/users/${record.id}`),
                            disabled: !canView,
                          },
                          viewReason,
                        )}
                        {renderIconButton(
                          {
                            title: "Gán vai trò",
                            icon: <TeamOutlined />,
                            onClick: () => openRolesModal(record),
                            disabled: !canAssign,
                          },
                          assignReason,
                        )}
                        {renderIconButton(
                          {
                            title: "Chỉnh sửa",
                            icon: <EditOutlined />,
                            onClick: () => openEditModal(record),
                            disabled: !canEditAction,
                          },
                          editReason,
                        )}
                        <Popconfirm
                          title="Xóa người dùng?"
                          description="Thao tác này sẽ ẩn người dùng khỏi danh sách."
                          okText="Xóa"
                          cancelText="Hủy"
                          onConfirm={() => handleDeleteUser(record)}
                          disabled={!canDeleteAction}
                        >
                          <span>
                            {renderIconButton(
                              {
                                title: "Xóa",
                                icon: <DeleteOutlined />,
                                disabled: !canDeleteAction,
                                danger: true,
                              },
                              deleteReason,
                            )}
                          </span>
                        </Popconfirm>
                        {renderIconButton(
                          {
                            title: record.status === 2 ? "Mở khóa" : "Khóa tài khoản",
                            icon: record.status === 2 ? <UnlockOutlined /> : <LockOutlined />,
                            onClick: () => handleToggleStatus(record),
                            disabled: !canToggle,
                          },
                          lockReason,
                        )}
                        {renderIconButton(
                          {
                            title: "Khởi tạo mật khẩu",
                            icon: <KeyOutlined />,
                            onClick: () => handleResetPassword(record),
                            disabled: !canResetAction,
                          },
                          resetReason,
                        )}
                        <Dropdown menu={getMoreActions(record)}>
                          <Button type="text" size="small" icon={<MoreOutlined />} />
                        </Dropdown>
                      </Space>
                    );
                  },
                },
              ]}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </div>

        <CenteredModalShell
          open={formOpen}
          onClose={() => setFormOpen(false)}
          width={760}
          header={
            <EnterpriseModalHeader
              title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}
              badgeStatus={
                editingUser
                  ? editingUser.status === 1
                    ? "success"
                    : editingUser.status === 0
                      ? "warning"
                      : "error"
                  : "default"
              }
              statusLabel={editingUser ? statusLabel(editingUser.status) : undefined}
              code={editingUser?.username}
              moduleTag="iam"
            />
          }
          footer={
            <div className="flex justify-end gap-2">
              <Button onClick={() => setFormOpen(false)}>Đóng</Button>
              <Button type="primary" onClick={handleSubmit}>
                Lưu
              </Button>
            </div>
          }
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
        </CenteredModalShell>

        <UserRolesModal
          open={rolesModalOpen}
          user={rolesTarget}
          roles={roles}
          canAssignSuperAdmin={isSuperAdmin}
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
  canAssignSuperAdmin: boolean;
  onClose: () => void;
  onSave: (roleIds: string[], primaryRoleId?: string | null) => void;
};

function UserRolesModal({
  open,
  user,
  roles,
  canAssignSuperAdmin,
  onClose,
  onSave,
}: UserRolesModalProps) {
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

  const roleOptions = roles.map((role) => {
    const isSuperAdminRole = (role.code || "").toLowerCase() === "super-admin";
    const disabled = isSuperAdminRole && !canAssignSuperAdmin;
    const label = disabled ? (
      <Tooltip title="Chỉ Super Admin mới được gán quyền Super Admin.">
        <span>{`${role.code} - ${role.name}`}</span>
      </Tooltip>
    ) : (
      `${role.code} - ${role.name}`
    );
    return {
      label,
      value: role.id,
      disabled,
    };
  });

  const handleSave = () => {
    onSave(selectedRoles, primaryRoleId);
  };

  return (
    <CenteredModalShell
      open={open}
      onClose={onClose}
      width={680}
      header={
        <EnterpriseModalHeader
          title={user ? `Gán vai trò cho ${user.full_name || user.username || ""}` : "Gán vai trò"}
          badgeStatus={
            user
              ? user.status === 1
                ? "success"
                : user.status === 0
                  ? "warning"
                  : "error"
              : "default"
          }
          statusLabel={user ? statusLabel(user.status) : undefined}
          code={user?.username}
          moduleTag="iam"
        />
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Đóng</Button>
          <Button type="primary" onClick={handleSave}>
            Lưu
          </Button>
        </div>
      }
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
    </CenteredModalShell>
  );
}
