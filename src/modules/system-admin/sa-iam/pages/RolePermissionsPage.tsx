/**
 * ROLE PERMISSIONS MATRIX - Phân quyền theo vai trò
 * Permission: sa.iam.assignment.read
 */

import React from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  ReloadOutlined,
  SaveOutlined,
  UndoOutlined,
  CheckSquareOutlined,
  BorderOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "@/layouts/PageHeader";
import { PermissionGate } from "../../_shared";
import { rolesService, type RoleRecord, type RoleStatusValue } from "../services/roles.service";
import {
  rolePermissionsService,
  type PermissionDefinition,
  type ModuleOption,
} from "../services/rolePermissions.service";

type PermissionActionKey = "READ" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT";

type PermissionMatrixItem = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  moduleKey: string;
  moduleLabel: string;
  resourceKey: string;
  actionKey: PermissionActionKey | "";
  status: RoleStatusValue;
  sort_order?: number | null;
};

type MatrixCell = {
  permissionId: string;
  status: RoleStatusValue;
  code: string;
  name: string;
};

type MatrixRow = {
  key: string;
  moduleKey: string;
  moduleLabel: string;
  resourceKey: string;
  resourceLabel: string;
  actions: Record<PermissionActionKey, MatrixCell | null>;
  isGroup?: boolean;
  children?: MatrixRow[];
};

const ACTIONS: Array<{ key: PermissionActionKey; label: string }> = [
  { key: "READ", label: "Xem" },
  { key: "CREATE", label: "Thêm" },
  { key: "UPDATE", label: "Sửa" },
  { key: "DELETE", label: "Xóa" },
  { key: "EXPORT", label: "Xuất" },
];

const ACTION_ALIASES: Record<string, PermissionActionKey> = {
  read: "READ",
  view: "READ",
  list: "READ",
  get: "READ",
  create: "CREATE",
  add: "CREATE",
  new: "CREATE",
  update: "UPDATE",
  edit: "UPDATE",
  write: "UPDATE",
  delete: "DELETE",
  remove: "DELETE",
  destroy: "DELETE",
  export: "EXPORT",
  download: "EXPORT",
};

const formatResourceLabel = (value: string) => {
  if (!value) return "Chức năng";
  return value
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const parsePermission = (
  row: PermissionDefinition,
  moduleLookup: Map<string, ModuleOption>,
): PermissionMatrixItem => {
  const code = String(row.code ?? "");
  const name = String(row.name ?? "");
  const description = row.description ?? null;
  const status = Number(row.status ?? 1) as RoleStatusValue;
  const sort_order = row.sort_order ?? null;

  const moduleFromLookup =
    row.module_id && moduleLookup.has(row.module_id)
      ? moduleLookup.get(row.module_id)
      : null;
  const moduleRaw =
    moduleFromLookup?.code ?? row.module ?? row.permission_type ?? "";
  const resourceRaw = row.resource ?? "";
  const actionRaw = row.action ?? "";

  let moduleKey = String(moduleRaw || "").trim();
  let resourceKey = String(resourceRaw || "").trim();
  let actionKey = String(actionRaw || "").trim().toUpperCase();

  if (!actionKey) {
    const tokens = code
      .replace(/[-]/g, "_")
      .split(/[.:_]/)
      .map((t) => t.trim())
      .filter(Boolean);
    const lastToken = tokens[tokens.length - 1]?.toLowerCase();
    if (lastToken && ACTION_ALIASES[lastToken]) {
      actionKey = ACTION_ALIASES[lastToken];
      const resourceTokens = tokens.slice(0, -1);
      if (!moduleKey && resourceTokens.length >= 2) {
        moduleKey = resourceTokens[0];
        resourceKey = resourceTokens.slice(1).join("_");
      } else if (!resourceKey) {
        resourceKey = resourceTokens.join("_");
      }
    }
  }

  if (!moduleKey) {
    const tokens = code
      .replace(/[-]/g, "_")
      .split(/[.:_]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tokens.length >= 3) {
      moduleKey = tokens[0];
      if (!resourceKey) {
        resourceKey = tokens.slice(1, -1).join("_");
      }
    }
  }

  if (!resourceKey) {
    const tokens = code
      .replace(/[-]/g, "_")
      .split(/[.:_]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tokens.length >= 2) {
      resourceKey = tokens.slice(0, -1).join("_");
    } else {
      resourceKey = name || code || "Chức năng";
    }
  }

  if (!moduleKey) {
    moduleKey = "Khác";
  }

  const moduleLabel = moduleFromLookup
    ? `${moduleFromLookup.code} - ${moduleFromLookup.name}`
    : moduleKey;

  return {
    id: row.id,
    code,
    name,
    description,
    moduleKey,
    moduleLabel,
    resourceKey,
    actionKey: (actionKey as PermissionActionKey) || "",
    status,
    sort_order,
  };
};

const buildMatrixRows = (
  permissions: PermissionMatrixItem[],
  moduleFilter: string,
  searchText: string,
  resourceFilter: string,
): MatrixRow[] => {
  const search = searchText.trim().toLowerCase();
  const resourceSearch = resourceFilter.trim().toLowerCase();

  const filtered = permissions.filter((perm) => {
    if (moduleFilter !== "all" && perm.moduleKey !== moduleFilter) return false;
    if (search) {
      const haystack = [
        perm.code,
        perm.name,
        perm.description,
        perm.moduleKey,
        perm.moduleLabel,
        perm.resourceKey,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (resourceSearch) {
      const label = formatResourceLabel(perm.resourceKey).toLowerCase();
      if (!label.includes(resourceSearch)) return false;
    }
    return true;
  });

  const moduleMap = new Map<string, Map<string, MatrixRow>>();

  filtered.forEach((perm) => {
    if (!perm.actionKey) return;
    if (!moduleMap.has(perm.moduleKey)) {
      moduleMap.set(perm.moduleKey, new Map());
    }
    const resourceMap = moduleMap.get(perm.moduleKey)!;
    if (!resourceMap.has(perm.resourceKey)) {
      resourceMap.set(perm.resourceKey, {
        key: `${perm.moduleKey}:${perm.resourceKey}`,
        moduleKey: perm.moduleKey,
        moduleLabel: perm.moduleLabel,
        resourceKey: perm.resourceKey,
        resourceLabel: formatResourceLabel(perm.resourceKey),
        actions: {
          READ: null,
          CREATE: null,
          UPDATE: null,
          DELETE: null,
          EXPORT: null,
        },
      });
    }
    const row = resourceMap.get(perm.resourceKey)!;
    if (!row.actions[perm.actionKey]) {
      row.actions[perm.actionKey] = {
        permissionId: perm.id,
        status: perm.status,
        code: perm.code,
        name: perm.name,
      };
    }
  });

  const rows: MatrixRow[] = [];
  Array.from(moduleMap.entries())
    .sort(([a], [b]) => a.localeCompare(b, "vi"))
    .forEach(([moduleKey, resourceMap]) => {
      const children = Array.from(resourceMap.values()).sort((a, b) =>
        a.resourceLabel.localeCompare(b.resourceLabel, "vi"),
      );
      rows.push({
        key: `module:${moduleKey}`,
        moduleKey,
        moduleLabel: children[0]?.moduleLabel || moduleKey,
        resourceKey: moduleKey,
        resourceLabel: moduleKey,
        actions: {
          READ: null,
          CREATE: null,
          UPDATE: null,
          DELETE: null,
          EXPORT: null,
        },
        isGroup: true,
        children,
      });
    });

  return rows;
};

const collectPermissionIds = (rows: MatrixRow[]) => {
  const perAction: Record<PermissionActionKey, string[]> = {
    READ: [],
    CREATE: [],
    UPDATE: [],
    DELETE: [],
    EXPORT: [],
  };
  const perRow: Record<string, string[]> = {};
  const perModule: Record<string, string[]> = {};

  const pushIfActive = (cell: MatrixCell | null, list: string[]) => {
    if (!cell) return;
    if (cell.status === 0) return;
    list.push(cell.permissionId);
  };

  rows.forEach((row) => {
    if (row.isGroup) {
      const moduleIds: string[] = [];
      row.children?.forEach((child) => {
        const rowIds: string[] = [];
        ACTIONS.forEach((action) => {
          const cell = child.actions[action.key];
          pushIfActive(cell, rowIds);
          pushIfActive(cell, perAction[action.key]);
        });
        perRow[child.key] = rowIds;
        moduleIds.push(...rowIds);
      });
      perModule[row.moduleKey] = moduleIds;
    } else {
      const rowIds: string[] = [];
      ACTIONS.forEach((action) => {
        const cell = row.actions[action.key];
        pushIfActive(cell, rowIds);
        pushIfActive(cell, perAction[action.key]);
      });
      perRow[row.key] = rowIds;
      perModule[row.moduleKey] = [...(perModule[row.moduleKey] || []), ...rowIds];
    }
  });

  return { perAction, perRow, perModule };
};

export default function RolePermissionsPage() {
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId?: string }>();

  const permissionsCache = React.useRef<PermissionDefinition[] | null>(null);

  const [roles, setRoles] = React.useState<RoleRecord[]>([]);
  const [rolesLoading, setRolesLoading] = React.useState(false);
  const [rolesTotal, setRolesTotal] = React.useState(0);
  const [rolesPage, setRolesPage] = React.useState(1);
  const [rolesPageSize, setRolesPageSize] = React.useState(8);
  const [rolesSearch, setRolesSearch] = React.useState("");
  const [rolesStatusFilter, setRolesStatusFilter] =
    React.useState<"all" | "active" | "inactive">("all");

  const [selectedRole, setSelectedRole] = React.useState<RoleRecord | null>(null);

  const [rawPermissions, setRawPermissions] = React.useState<PermissionDefinition[]>([]);
  const [moduleLookup, setModuleLookup] = React.useState<Map<string, ModuleOption>>(new Map());
  const [matrixLoading, setMatrixLoading] = React.useState(false);
  const [assignedIds, setAssignedIds] = React.useState<Set<string>>(new Set());
  const [baselineIds, setBaselineIds] = React.useState<Set<string>>(new Set());

  const [moduleFilter, setModuleFilter] = React.useState("all");
  const [searchText, setSearchText] = React.useState("");
  const [resourceFilter, setResourceFilter] = React.useState("");

  const [tablePageSize, setTablePageSize] = React.useState(10);

  const isRoleInactive = selectedRole?.status === 0;

  const loadRoles = React.useCallback(async () => {
    setRolesLoading(true);
    try {
      const result = await rolesService.listRoles({
        q: rolesSearch,
        status: rolesStatusFilter,
        page: rolesPage,
        pageSize: rolesPageSize,
      });
      setRoles(result.data);
      setRolesTotal(result.total);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh sách vai trò.";
      message.error(messageText);
    } finally {
      setRolesLoading(false);
    }
  }, [rolesPage, rolesPageSize, rolesSearch, rolesStatusFilter]);

  React.useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  React.useEffect(() => {
    setRolesPage(1);
  }, [rolesSearch, rolesStatusFilter]);

  React.useEffect(() => {
    if (!roleId) return;
    const existing = roles.find((role) => role.id === roleId);
    if (existing) {
      setSelectedRole(existing);
      return;
    }
    void (async () => {
      try {
        const role = await rolesService.getRoleById(roleId);
        if (role) {
          setSelectedRole(role);
        }
      } catch (_err) {
        message.error("Không thể tải thông tin vai trò.");
      }
    })();
  }, [roleId, roles]);

  const loadPermissions = React.useCallback(async () => {
    if (permissionsCache.current) {
      setRawPermissions(permissionsCache.current);
      return;
    }
    try {
      const list = await rolePermissionsService.listPermissions();
      permissionsCache.current = list;
      setRawPermissions(list);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh mục quyền.";
      message.error(messageText);
    }
  }, []);

  const loadModules = React.useCallback(async () => {
    try {
      const modules = await rolePermissionsService.listModules();
      const map = new Map<string, ModuleOption>();
      modules.forEach((item) => {
        map.set(item.id, item);
      });
      setModuleLookup(map);
    } catch (_err) {
      setModuleLookup(new Map());
    }
  }, []);

  const loadRolePermissions = React.useCallback(async (role: RoleRecord) => {
    setMatrixLoading(true);
    try {
      const ids = await rolePermissionsService.listRolePermissionIds(role.id);
      const set = new Set(ids);
      setAssignedIds(new Set(set));
      setBaselineIds(new Set(set));
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải quyền đã gán.";
      message.error(messageText);
    } finally {
      setMatrixLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadPermissions();
    void loadModules();
  }, [loadPermissions, loadModules]);

  const permissions = React.useMemo(
    () => rawPermissions.map((perm) => parsePermission(perm, moduleLookup)),
    [rawPermissions, moduleLookup],
  );

  React.useEffect(() => {
    if (!selectedRole) {
      setAssignedIds(new Set());
      setBaselineIds(new Set());
      return;
    }
    void loadRolePermissions(selectedRole);
  }, [selectedRole, loadRolePermissions]);

  const moduleOptions = React.useMemo(() => {
    const map = new Map<string, string>();
    permissions.forEach((perm) => {
      if (!map.has(perm.moduleKey)) {
        map.set(perm.moduleKey, perm.moduleLabel);
      }
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "vi"));
  }, [permissions]);

  const matrixRows = React.useMemo(
    () => buildMatrixRows(permissions, moduleFilter, searchText, resourceFilter),
    [permissions, moduleFilter, searchText, resourceFilter],
  );

  const permissionIndex = React.useMemo(() => collectPermissionIds(matrixRows), [matrixRows]);

  const isDirty = React.useMemo(() => {
    if (assignedIds.size !== baselineIds.size) return true;
    for (const id of assignedIds) {
      if (!baselineIds.has(id)) return true;
    }
    return false;
  }, [assignedIds, baselineIds]);

  const handleRoleSelect = (role: RoleRecord) => {
    setSelectedRole(role);
    navigate(`/system-admin/iam/role-permissions/${role.id}`);
  };

  const togglePermission = (permissionId: string, checked: boolean) => {
    if (isRoleInactive) return;
    setAssignedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(permissionId);
      } else {
        next.delete(permissionId);
      }
      return next;
    });
  };

  const toggleRow = (rowKey: string, checked: boolean) => {
    if (isRoleInactive) return;
    const ids = permissionIndex.perRow[rowKey] || [];
    setAssignedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const toggleActionColumn = (actionKey: PermissionActionKey, checked: boolean) => {
    if (isRoleInactive) return;
    const ids = permissionIndex.perAction[actionKey] || [];
    setAssignedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const toggleModule = (moduleKey: string, checked: boolean) => {
    if (isRoleInactive) return;
    const ids = permissionIndex.perModule[moduleKey] || [];
    setAssignedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (isRoleInactive) return;
    const allIds = Object.values(permissionIndex.perAction).flat();
    setAssignedIds(() => (checked ? new Set(allIds) : new Set()));
  };

  const handleReset = () => {
    setAssignedIds(new Set(baselineIds));
  };

  const handleSave = async () => {
    if (!selectedRole) {
      message.warning("Vui lòng chọn vai trò.");
      return;
    }
    if (isRoleInactive) {
      message.warning("Vai trò đang ngừng, không thể phân quyền.");
      return;
    }
    const toAdd: string[] = [];
    const toRemove: string[] = [];

    assignedIds.forEach((id) => {
      if (!baselineIds.has(id)) toAdd.push(id);
    });
    baselineIds.forEach((id) => {
      if (!assignedIds.has(id)) toRemove.push(id);
    });

    try {
      setMatrixLoading(true);
      if (toAdd.length > 0) {
        await rolePermissionsService.addRolePermissions(selectedRole.id, toAdd);
      }
      if (toRemove.length > 0) {
        await rolePermissionsService.removeRolePermissions(selectedRole.id, toRemove);
      }
      message.success("Đã lưu phân quyền.");
      await loadRolePermissions(selectedRole);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu phân quyền.";
      message.error(messageText);
    } finally {
      setMatrixLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (selectedRole) {
      await loadRolePermissions(selectedRole);
    }
  };

  const columns = [
    {
      title: "Phân hệ",
      dataIndex: "moduleKey",
      key: "module",
      width: 180,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            value={moduleFilter}
            onChange={(value) => setModuleFilter(value)}
            style={{ width: 220 }}
            options={[{ value: "all", label: "Tất cả phân hệ" }, ...moduleOptions]}
          />
        </div>
      ),
      render: (_: string, record: MatrixRow) => {
        if (record.isGroup) {
          const moduleIds = permissionIndex.perModule[record.moduleKey] || [];
          const selectedCount = moduleIds.filter((id) => assignedIds.has(id)).length;
          return (
            <Space direction="vertical" size={2}>
              <Typography.Text strong>{record.moduleLabel}</Typography.Text>
              <Typography.Text type="secondary">
                {selectedCount}/{moduleIds.length} quyền
              </Typography.Text>
              <Space size={4}>
                <Button
                  type="link"
                  size="small"
                  disabled={moduleIds.length === 0 || isRoleInactive}
                  onClick={() => toggleModule(record.moduleKey, true)}
                >
                  Chọn tất cả
                </Button>
                <Button
                  type="link"
                  size="small"
                  disabled={moduleIds.length === 0 || isRoleInactive}
                  onClick={() => toggleModule(record.moduleKey, false)}
                >
                  Bỏ chọn
                </Button>
              </Space>
            </Space>
          );
        }
        return <Typography.Text>{record.moduleLabel}</Typography.Text>;
      },
    },
    {
      title: "Chức năng",
      dataIndex: "resourceLabel",
      key: "resource",
      width: 260,
      sorter: (a: MatrixRow, b: MatrixRow) =>
        a.resourceLabel.localeCompare(b.resourceLabel, "vi"),
      sortDirections: ["ascend", "descend"] as Array<"ascend" | "descend">,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Lọc theo chức năng"
            value={resourceFilter}
            onChange={(event) => setResourceFilter(event.target.value)}
            allowClear
            style={{ width: 220 }}
          />
        </div>
      ),
      onFilter: () => true,
      render: (_: string, record: MatrixRow) => {
        if (record.isGroup) {
          return <Typography.Text strong>{record.moduleLabel}</Typography.Text>;
        }
        const rowIds = permissionIndex.perRow[record.key] || [];
        const selectedCount = rowIds.filter((id) => assignedIds.has(id)).length;
        const rowChecked = rowIds.length > 0 && selectedCount === rowIds.length;
        const rowIndeterminate = selectedCount > 0 && selectedCount < rowIds.length;
        return (
          <Space>
            <Checkbox
              checked={rowChecked}
              indeterminate={rowIndeterminate}
              disabled={isRoleInactive}
              onChange={(event) => toggleRow(record.key, event.target.checked)}
            />
            <span>{record.resourceLabel}</span>
          </Space>
        );
      },
    },
    ...ACTIONS.map((action) => ({
      title: (
        <Space direction="vertical" size={2} align="center">
          <span>{action.label}</span>
          <Checkbox
            checked={
              (permissionIndex.perAction[action.key] || []).length > 0 &&
              (permissionIndex.perAction[action.key] || []).every((id) => assignedIds.has(id))
            }
            indeterminate={
              (permissionIndex.perAction[action.key] || []).some((id) => assignedIds.has(id)) &&
              !(permissionIndex.perAction[action.key] || []).every((id) => assignedIds.has(id))
            }
            onChange={(event) => toggleActionColumn(action.key, event.target.checked)}
            disabled={isRoleInactive}
          />
        </Space>
      ),
      dataIndex: action.key,
      key: action.key,
      align: "center" as const,
      width: 110,
      render: (_: unknown, record: MatrixRow) => {
        if (record.isGroup) return null;
        const cell = record.actions[action.key];
        if (!cell) {
          return <Checkbox disabled />;
        }
        const isInactive = cell.status === 0;
        const checkbox = (
          <Checkbox
            checked={assignedIds.has(cell.permissionId)}
            onChange={(event) => togglePermission(cell.permissionId, event.target.checked)}
            disabled={isRoleInactive || isInactive}
          />
        );
        if (isInactive) {
          return (
            <Tooltip title="Quyền đang ngừng">
              <span>{checkbox}</span>
            </Tooltip>
          );
        }
        return checkbox;
      },
    })),
  ];

  return (
    <PermissionGate permission="sa.iam.assignment.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "IAM", href: "/system-admin/iam" },
            { label: "Phân quyền" },
          ]}
          title="Phân quyền theo vai trò"
          subtitle="Gán quyền theo vai trò bằng ma trận hành động"
          actions={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} disabled={!selectedRole}>
                Làm mới
              </Button>
              <Button icon={<UndoOutlined />} onClick={handleReset} disabled={!isDirty}>
                Hoàn tác
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                disabled={!isDirty || isRoleInactive}
              >
                Lưu thay đổi
              </Button>
            </Space>
          }
        />

        <div className="px-6 pb-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-3">
              <Card title="Vai trò">
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Input
                    placeholder="Tìm theo mã, tên vai trò..."
                    value={rolesSearch}
                    onChange={(event) => setRolesSearch(event.target.value)}
                    allowClear
                  />
                  <Select
                    value={rolesStatusFilter}
                    onChange={(value) => setRolesStatusFilter(value)}
                    options={[
                      { value: "all", label: "Tất cả trạng thái" },
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Ngừng" },
                    ]}
                  />
                  <Table
                    rowKey="id"
                    size="small"
                    loading={rolesLoading}
                    dataSource={roles}
                    pagination={{
                      current: rolesPage,
                      pageSize: rolesPageSize,
                      total: rolesTotal,
                      showSizeChanger: true,
                      pageSizeOptions: [8, 12, 20],
                      onChange: (nextPage, nextPageSize) => {
                        setRolesPage(nextPage);
                        setRolesPageSize(nextPageSize);
                      },
                    }}
                    rowSelection={{
                      type: "radio",
                      selectedRowKeys: selectedRole ? [selectedRole.id] : [],
                      onSelect: (role) => handleRoleSelect(role),
                    }}
                    columns={[
                      {
                        title: "Mã",
                        dataIndex: "code",
                        key: "code",
                        width: 120,
                        render: (value: string) => <strong>{value}</strong>,
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
                        width: 90,
                        render: (value: RoleStatusValue) => (
                          <Tag color={value === 1 ? "green" : "red"}>
                            {value === 1 ? "Hoạt động" : "Ngừng"}
                          </Tag>
                        ),
                      },
                    ]}
                  />
                </Space>
              </Card>
            </div>

            <div className="col-span-12 xl:col-span-9">
              <Card
                title="Ma trận quyền"
                extra={
                  selectedRole ? (
                    <Typography.Text type="secondary">
                      Vai trò: <strong>{selectedRole.name}</strong>
                    </Typography.Text>
                  ) : null
                }
              >
                {!selectedRole ? (
                  <Alert
                    type="info"
                    message="Chọn một vai trò bên trái để bắt đầu phân quyền."
                  />
                ) : (
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {isRoleInactive && (
                      <Alert
                        type="warning"
                        message="Vai trò đang ngừng. Không thể chỉnh sửa phân quyền."
                      />
                    )}
                    {isDirty && (
                      <Alert type="warning" message="Có thay đổi chưa lưu." showIcon />
                    )}
                    <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                      <Space wrap>
                        <Input
                          placeholder="Tìm theo mã, tên quyền..."
                          value={searchText}
                          onChange={(event) => setSearchText(event.target.value)}
                          allowClear
                          style={{ width: 260 }}
                        />
                        <Select
                          value={moduleFilter}
                          onChange={(value) => setModuleFilter(value)}
                          style={{ width: 220 }}
                          options={[{ value: "all", label: "Tất cả phân hệ" }, ...moduleOptions]}
                        />
                      </Space>
                      <Space>
                        <Button
                          icon={<CheckSquareOutlined />}
                          onClick={() => handleSelectAll(true)}
                          disabled={isRoleInactive}
                        >
                          Chọn tất cả
                        </Button>
                        <Button
                          icon={<BorderOutlined />}
                          onClick={() => handleSelectAll(false)}
                          disabled={isRoleInactive}
                        >
                          Bỏ chọn tất cả
                        </Button>
                      </Space>
                    </Space>

                    <Table
                      rowKey="key"
                      bordered
                      sticky
                      tableLayout="fixed"
                      size="middle"
                      loading={matrixLoading}
                      dataSource={matrixRows}
                      columns={columns}
                      pagination={{
                        pageSize: tablePageSize,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50],
                        onShowSizeChange: (_current, size) => setTablePageSize(size),
                      }}
                      expandable={{
                        defaultExpandAllRows: true,
                        expandRowByClick: false,
                      }}
                      scroll={{ x: "max-content", y: 520 }}
                    />
                  </Space>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  );
}
