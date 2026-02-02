import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Table,
  Checkbox,
  Button,
  notification,
  Space,
  Typography,
  Spin,
  Layout,
  Input,
  Tag,
  Divider,
  Empty,
  Form,
  Popconfirm,
  Select,
  Tabs,
  Tooltip,
  message,
} from "antd";
import {
  SaveOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Copy } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { supabase } from "@/api/supabaseClient";
import { rolesService, type RoleRecord } from "../services/roles.service";
import { rolePermissionsService, type ModuleOption } from "../services/rolePermissions.service";
import { CenteredModalShell } from "@/components/overlays/CenteredModalShell";
import { EnterpriseModalHeader } from "@/components/overlays/EnterpriseModalHeader";

const { Text, Title } = Typography;
const { Sider, Content } = Layout;

type MatrixAction = {
  code: string;
  label: string;
  order: number;
};

type MatrixItem = {
  permissionId: string;
  permissionCode: string;
  permissionName: string;
  action: string;
  actionLabel: string;
  actionOrder: number;
  isGranted: boolean;
};

type MatrixRow = {
  resourceKey: string;
  resourceGroup?: string;
  items: Map<string, MatrixItem>;
  primaryCode?: string;
  primaryName?: string;
};

const normalizeBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "true" || trimmed === "1" || trimmed === "yes") return true;
  }
  return false;
};

const buildActionLabel = (action?: string | null, label?: string | null) => {
  const fallback = String(action ?? "").toUpperCase();
  return String(label ?? "").trim() || fallback || "N/A";
};

export default function RolePermissionsMatrixPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesSearch, setRolesSearch] = useState("");

  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [moduleKey, setModuleKey] = useState<string | null>(null);
  const [categoryTab, setCategoryTab] = useState<"PAGE" | "FEATURE">("PAGE");

  const [matrixRows, setMatrixRows] = useState<MatrixRow[]>([]);
  const [matrixActions, setMatrixActions] = useState<MatrixAction[]>([]);
  const [grantedIds, setGrantedIds] = useState<Set<string>>(new Set());
  const [baselineIds, setBaselineIds] = useState<Set<string>>(new Set());
  const [loadingMatrix, setLoadingMatrix] = useState(false);

  const [actionCatalog, setActionCatalog] = useState<{ name: string; code: string }[]>([]);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === roleId),
    [roles, roleId],
  );

  const notify = useCallback(
    (type: "success" | "error" | "info", msg: string) => {
      api[type]({
        message: "Thông báo hệ thống",
        description: msg,
        placement: "bottomRight",
        duration: 3,
      });
    },
    [api],
  );

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const result = await rolesService.listRoles({ q: rolesSearch, page: 1, pageSize: 100 });
      setRoles(result.data || []);
    } catch {
      notify("error", "Lỗi tải danh sách vai trò");
    } finally {
      setRolesLoading(false);
    }
  }, [rolesSearch, notify]);

  const loadModules = useCallback(async () => {
    try {
      const list = await rolePermissionsService.listModules();
      setModules(list);
    } catch {
      notify("error", "Lỗi tải danh sách phân hệ");
      setModules([]);
    }
  }, [notify]);

  const loadActions = useCallback(async () => {
    try {
      const actionRes = await rolePermissionsService.listActions();
      setActionCatalog((actionRes || []).filter((item) => item && item.code));
    } catch {
      notify("error", "Không thể tải danh sách hành động");
    }
  }, [notify]);

  useEffect(() => {
    loadActions();
    loadRoles();
    loadModules();
  }, [loadActions, loadRoles, loadModules]);

  useEffect(() => {
    if (!modules.length) return;
    const valid = moduleKey && modules.some((mod) => (mod.key ?? mod.code) === moduleKey);
    if (!valid) {
      const firstKey = modules[0].key ?? modules[0].code;
      setModuleKey(firstKey || null);
    }
  }, [modules, moduleKey]);

  const fetchMatrix = useCallback(async () => {
    if (!roleId || !moduleKey) {
      setMatrixRows([]);
      setMatrixActions([]);
      setGrantedIds(new Set());
      setBaselineIds(new Set());
      return;
    }

    setLoadingMatrix(true);
    try {
      const { data, error } = await supabase
        .from("v_role_permissions_matrix")
        .select("*")
        .eq("role_id", roleId)
        .eq("module_key", moduleKey)
        .eq("category", categoryTab)
        .order("resource_group", { ascending: true })
        .order("resource_key", { ascending: true })
        .order("action_order", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      const rows: MatrixRow[] = [];
      const rowMap = new Map<string, MatrixRow>();
      const actionMap = new Map<string, MatrixAction>();
      const nextBaseline = new Set<string>();

      (data || []).forEach((raw: any) => {
        const actionCode = String(raw.action ?? "").toUpperCase();
        if (!actionCode) return;
        const actionLabel = buildActionLabel(raw.action, raw.action_label);
        const actionOrder = Number(raw.action_order ?? 0);
        if (!actionMap.has(actionCode)) {
          actionMap.set(actionCode, {
            code: actionCode,
            label: actionLabel,
            order: Number.isNaN(actionOrder) ? 0 : actionOrder,
          });
        }

        const resourceKey = String(raw.resource_key ?? raw.resource ?? "").trim();
        if (!resourceKey) return;
        const resourceGroup = String(raw.resource_group ?? "").trim();

        let row = rowMap.get(resourceKey);
        if (!row) {
          row = { resourceKey, resourceGroup, items: new Map() };
          rowMap.set(resourceKey, row);
          rows.push(row);
        }

        const permissionId =
          raw.permission_id ?? raw.permissionId ?? raw.permission_uuid ?? raw._id ?? raw.id;
        if (!permissionId) return;
        const permissionCode = String(raw.permission_code ?? raw.code ?? "");
        const permissionName = String(raw.permission_name ?? raw.name ?? "");
        const isGranted = normalizeBoolean(raw.is_granted);

        const item: MatrixItem = {
          permissionId: String(permissionId),
          permissionCode,
          permissionName,
          action: actionCode,
          actionLabel,
          actionOrder: Number.isNaN(actionOrder) ? 0 : actionOrder,
          isGranted,
        };

        row.items.set(actionCode, item);
        if (isGranted) nextBaseline.add(String(permissionId));
      });

      const actions = Array.from(actionMap.values()).sort(
        (a, b) => a.order - b.order || a.label.localeCompare(b.label, "vi"),
      );

      rows.forEach((row) => {
        const sorted = Array.from(row.items.values()).sort(
          (a, b) => a.actionOrder - b.actionOrder || a.action.localeCompare(b.action, "vi"),
        );
        const primary =
          row.items.get("READ") ||
          sorted[0];
        row.primaryCode = primary?.permissionCode;
        row.primaryName = primary?.permissionName;
      });

      setMatrixRows(rows);
      setMatrixActions(actions);
      setBaselineIds(new Set(nextBaseline));
      setGrantedIds(new Set(nextBaseline));
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Lỗi tải ma trận quyền");
      setMatrixRows([]);
      setMatrixActions([]);
      setGrantedIds(new Set());
      setBaselineIds(new Set());
    } finally {
      setLoadingMatrix(false);
    }
  }, [roleId, moduleKey, categoryTab, notify]);

  useEffect(() => {
    void fetchMatrix();
  }, [fetchMatrix]);

  const handleSave = async () => {
    if (!roleId) return;
    const toAdd = Array.from(grantedIds).filter((id) => !baselineIds.has(id));
    const toRemove = Array.from(baselineIds).filter((id) => !grantedIds.has(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      notify("info", "Không có thay đổi nào.");
      return;
    }

    setLoadingMatrix(true);
    try {
      if (toAdd.length > 0) {
        await rolePermissionsService.addRolePermissions(roleId, toAdd);
      }
      if (toRemove.length > 0) {
        await rolePermissionsService.removeRolePermissions(roleId, toRemove);
      }
      notify("success", "Lưu thành công!");
      setBaselineIds(new Set(grantedIds));
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Lỗi khi lưu dữ liệu.");
    } finally {
      setLoadingMatrix(false);
    }
  };

  const hasChanges = useMemo(() => {
    if (baselineIds.size !== grantedIds.size) return true;
    for (const id of baselineIds) {
      if (!grantedIds.has(id)) return true;
    }
    return false;
  }, [baselineIds, grantedIds]);

  const handleCopyResource = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      message.success("Đã sao chép resource.");
    } catch {
      message.error("Không thể sao chép.");
    }
  };

  const handlePermissionActionSubmit = async (values: { name: string; code: string }) => {
    try {
      const cleanValues = {
        name: values.name.trim(),
        code: values.code.trim().toUpperCase().replace(/\s/g, ""),
      };

      if (editingActionId) {
        await rolePermissionsService.updateAction(editingActionId, cleanValues);
        notify("success", "Cập nhật hành động thành công");
      } else {
        if (actionCatalog.some((action) => action.code === cleanValues.code)) {
          notify("error", "Mã hành động này đã tồn tại!");
          return;
        }
        await rolePermissionsService.createAction(cleanValues);
        notify("success", "Thêm hành động mới thành công");
      }
      form.resetFields();
      setEditingActionId(null);
      await loadActions();
    } catch {
      notify("error", "Thao tác không thành công");
    }
  };

  const handleDeleteAction = async (code: string) => {
    try {
      await rolePermissionsService.deleteAction(code);
      notify("success", "Đã xóa hành động");
      loadActions();
    } catch {
      notify("error", "Lỗi: Hành động này đang được sử dụng");
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "RESOURCE",
        dataIndex: "resourceKey",
        key: "resource",
        width: 320,
        fixed: "left" as const,
        render: (_: string, record: MatrixRow) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button
                type="text"
                size="small"
                icon={<Copy size={14} />}
                onClick={() => handleCopyResource(record.resourceKey)}
              />
              <div>
                <div className="font-medium text-slate-900">{record.resourceKey}</div>
                {record.resourceGroup ? (
                  <div className="text-xs text-slate-500">{record.resourceGroup}</div>
                ) : null}
              </div>
            </div>
            {record.primaryCode ? (
              <Text
                type="secondary"
                className="text-xs"
                code
                copyable={{ text: record.primaryCode }}
              >
                {record.primaryCode}
              </Text>
            ) : null}
          </div>
        ),
      },
    ];

    const actionColumns = matrixActions.map((action) => ({
      title: (
        <Tooltip title={action.code}>
          <span className="text-xs font-semibold">{action.label}</span>
        </Tooltip>
      ),
      key: action.code,
      dataIndex: action.code,
      align: "center" as const,
      width: 100,
      render: (_: unknown, record: MatrixRow) => {
        const item = record.items.get(action.code);
        if (!item) return null;
        const checked = grantedIds.has(item.permissionId);
        return (
          <Tooltip
            title={
              <div className="space-y-1">
                {item.permissionCode ? (
                  <Text code copyable={{ text: item.permissionCode }}>
                    {item.permissionCode}
                  </Text>
                ) : null}
                <div className="text-xs text-slate-200">{item.permissionName || "—"}</div>
              </div>
            }
          >
            <Checkbox
              checked={checked}
              onChange={(event) => {
                const next = new Set(grantedIds);
                if (event.target.checked) {
                  next.add(item.permissionId);
                } else {
                  next.delete(item.permissionId);
                }
                setGrantedIds(next);
              }}
            />
          </Tooltip>
        );
      },
    }));

    return [...baseColumns, ...actionColumns];
  }, [matrixActions, grantedIds]);

  return (
    <Layout style={{ height: "calc(100vh - 10px)", background: "#f5f5f5", padding: "12px" }}>
      {contextHolder}

      <Sider
        width={280}
        theme="light"
        style={{ borderRadius: 10, marginRight: 12, border: "1px solid #d9d9d9" }}
      >
        <div style={{ padding: "16px" }}>
          <Title level={5} style={{ marginBottom: 12 }}>
            <UserOutlined /> Danh sách Vai trò
          </Title>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm vai trò..."
            size="large"
            onChange={(e) => setRolesSearch(e.target.value)}
            allowClear
          />
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={{ height: "calc(100vh - 120px)", overflowY: "auto", padding: "10px" }}>
          <Spin spinning={rolesLoading}>
            {roles.map((role) => (
              <div
                key={role.id}
                className={`role-item-box ${roleId === role.id ? "active" : ""}`}
                onClick={() =>
                  navigate(`/system-admin/iam/role-permissions/new/${role.id}`)
                }
              >
                <div style={{ flex: 1 }}>
                  <div className="role-main-name">{role.name}</div>
                  <div className="role-sub-code">{role.code}</div>
                </div>
                {role.status === 1 ? (
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                ) : (
                  <StopOutlined style={{ color: "#ff4d4f" }} />
                )}
              </div>
            ))}
          </Spin>
        </div>
      </Sider>

      <Content
        style={{
          borderRadius: 10,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #d9d9d9",
        }}
      >
        {roleId ? (
          <>
            <div
              style={{
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fafafa",
                borderBottom: "2px solid #e8e8e8",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Space size={16}>
                <div
                  style={{
                    background: "#1677ff",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <SettingOutlined style={{ fontSize: "20px", color: "#fff" }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, fontSize: "18px" }}>
                    Ma trận phân quyền
                  </Title>
                  <Tag color="geekblue" style={{ fontWeight: 700 }}>
                    {selectedRole?.name || "..."}
                  </Tag>
                </div>
              </Space>
              <Space size={8} wrap>
                <Select
                  value={moduleKey ?? undefined}
                  onChange={(value) => setModuleKey(value)}
                  placeholder="Chọn phân hệ"
                  style={{ minWidth: 220 }}
                  options={modules.map((mod) => ({
                    label: `${mod.key ?? mod.code} — ${mod.name}`,
                    value: mod.key ?? mod.code,
                  }))}
                />
                <Tabs
                  activeKey={categoryTab}
                  onChange={(key) => setCategoryTab(key as "PAGE" | "FEATURE")}
                  items={[
                    { key: "PAGE", label: "PAGE" },
                    { key: "FEATURE", label: "FEATURE" },
                  ]}
                />
                <Button size="large" icon={<ReloadOutlined />} onClick={fetchMatrix}>
                  Tải lại
                </Button>
                <Button
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsActionModalOpen(true);
                    form.resetFields();
                    setEditingActionId(null);
                  }}
                >
                  Hành động
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={loadingMatrix}
                  disabled={!hasChanges}
                >
                  LƯU THAY ĐỔI
                </Button>
              </Space>
            </div>

            <div style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
              <Spin spinning={loadingMatrix}>
                <Table
                  bordered
                  size="middle"
                  dataSource={matrixRows}
                  columns={columns}
                  pagination={false}
                  rowKey="resourceKey"
                  scroll={{ x: "max-content", y: "calc(100vh - 220px)" }}
                />
              </Spin>
            </div>
          </>
        ) : (
          <Empty style={{ marginTop: 180 }} description="Chọn vai trò để bắt đầu" />
        )}
      </Content>

      <CenteredModalShell
        open={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        width={720}
        header={
          <EnterpriseModalHeader title="Quản lý các loại Quyền (Actions)" moduleTag="iam" />
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePermissionActionSubmit}
          style={{
            background: "#f9f9f9",
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="name"
              label="Tên (Hiển thị)"
              rules={[
                { required: true, message: "Bắt buộc!" },
                { max: 20, message: "Tối đa 20 ký tự!" },
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Ví dụ: Phê duyệt" />
            </Form.Item>
            <Form.Item
              name="code"
              label="Mã (In hoa, không dấu)"
              rules={[
                { required: true, message: "Bắt buộc!" },
                { pattern: /^[A-Z0-9_]+$/, message: "Sai định dạng!" },
                { max: 20, message: "Tối đa 20 ký tự!" },
              ]}
              style={{ flex: 1 }}
            >
              <Input
                placeholder="APPROVE"
                onChange={(e) =>
                  form.setFieldsValue({
                    code: e.target.value.toUpperCase().replace(/\s/g, ""),
                  })
                }
              />
            </Form.Item>
          </div>
          <div style={{ textAlign: "right" }}>
            <Space>
              {editingActionId && (
                <Button
                  onClick={() => {
                    setEditingActionId(null);
                    form.resetFields();
                  }}
                >
                  Hủy
                </Button>
              )}
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingActionId ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </div>
        </Form>
        <Table
          dataSource={actionCatalog}
          size="small"
          rowKey="code"
          columns={[
            { title: "Tên", dataIndex: "name" },
            {
              title: "Code",
              dataIndex: "code",
              render: (code) => <Tag color="blue">{code}</Tag>,
            },
            {
              title: "Thao tác",
              align: "center",
              render: (_, rec) => (
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingActionId(rec.code);
                      form.setFieldsValue(rec);
                    }}
                  />
                  <Popconfirm title="Xóa hành động này?" onConfirm={() => handleDeleteAction(rec.code)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </CenteredModalShell>

      <style>{`
        .role-item-box { padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.2s; border: 1px solid #f0f0f0; }
        .role-item-box:hover { background: #f0f7ff; border-color: #1677ff; }
        .role-item-box.active { background: #e6f7ff; border-color: #1677ff; border-width: 2px; }
        .role-main-name { font-weight: 700; font-size: 15px; }
        .role-sub-code { font-size: 12px; color: #8c8c8c; }
      `}</style>
    </Layout>
  );
}
