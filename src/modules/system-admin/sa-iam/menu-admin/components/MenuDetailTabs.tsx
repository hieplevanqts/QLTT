import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Tabs,
  Tooltip,
  message,
} from "antd";
import * as React from "react";
import type { MenuRecord, ModuleRecord, PermissionRecord } from "../menu.types";
import { AssignedPermissionsTable } from "./AssignedPermissionsTable";
import { RolePreviewTree } from "./RolePreviewTree";
import { MenuHistoryTable } from "./MenuHistoryTable";
import { IconPickerModal } from "../../components/IconPickerModal";
import { getIconComponent } from "../../components/iconRegistry";
import { supabase } from "@/api/supabaseClient";

export interface MenuDetailTabsProps {
  menu?: MenuRecord | null;
  modules: ModuleRecord[];
  saving?: boolean;
  onSaveMenu?: (payload: Partial<MenuRecord>) => void;
  assignedPermissions: PermissionRecord[];
  onAssignSelected?: (ids?: string[]) => void;
  onRemoveAssigned?: (permissionId: string) => void;
  previewTreeData?: any[];
  previewRoles?: Array<{ _id: string; name: string }>;
  previewRoleId?: string;
  onPreviewRoleChange?: (roleId?: string) => void;
  historyData?: any[];
  historyLoading?: boolean;
}

export const MenuDetailTabs: React.FC<MenuDetailTabsProps> = ({
  menu,
  modules,
  saving,
  onSaveMenu,
  assignedPermissions,
  onAssignSelected,
  onRemoveAssigned,
  previewTreeData,
  previewRoles,
  previewRoleId,
  onPreviewRoleChange,
  historyData,
  historyLoading,
}) => {
  const [form] = Form.useForm();
  const [metaText, setMetaText] = React.useState<string>("{}");
  const [metaError, setMetaError] = React.useState<string | null>(null);
  const [componentValue, setComponentValue] = React.useState<string>("");
  const [layoutValue, setLayoutValue] = React.useState<string>("");
  const [iconPickerOpen, setIconPickerOpen] = React.useState(false);
  const [advancedMode, setAdvancedMode] = React.useState(false);
  const [codeManual, setCodeManual] = React.useState(false);
  const [codeError, setCodeError] = React.useState<string | null>(null);
  const [autoAssignLoading, setAutoAssignLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("info");
  const iconValue = Form.useWatch("icon", form) as string | null | undefined;
  const pathValue = Form.useWatch("path", form) as string | undefined;
  const moduleIdValue = Form.useWatch("module_id", form) as string | undefined;
  const codeValue = Form.useWatch("code", form) as string | undefined;
  const IconPreview = getIconComponent(iconValue ?? null);
  const lastAutoRef = React.useRef<{ path?: string; moduleId?: string | null } | null>(null);
  const initialRef = React.useRef<{ path?: string; moduleId?: string | null } | null>(null);
  const prevAdvancedRef = React.useRef(advancedMode);

  const normalizePathDots = React.useCallback((value?: string | null) => {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const normalized = raw.replace(/^\/+|\/+$/g, "");
    if (!normalized) return "";
    return normalized
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        segment
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "_"),
      )
      .filter(Boolean)
      .join(".");
  }, []);

  const buildCodeFromPath = React.useCallback(
    (path: string | undefined, moduleKey?: string | null) => {
      const pathDots = normalizePathDots(path);
      const safeModuleKey = String(moduleKey ?? "").trim().toLowerCase();
      if (safeModuleKey) {
        if (pathDots.startsWith(`${safeModuleKey}.`)) {
          const suffix = pathDots.slice(safeModuleKey.length + 1);
          return `${safeModuleKey}.${suffix || "root"}`;
        }
        if (pathDots === safeModuleKey) {
          return `${safeModuleKey}.root`;
        }
        return `${safeModuleKey}.${pathDots || "root"}`;
      }
      return pathDots || "root";
    },
    [normalizePathDots],
  );

  const moduleKey = React.useMemo(() => {
    const module = modules.find((mod) => mod._id === moduleIdValue);
    return module?.key ?? null;
  }, [modules, moduleIdValue]);

  const moduleReady = Boolean(menu?.module_id && moduleKey);

  const assignedPage = React.useMemo(
    () =>
      assignedPermissions.filter(
        (perm) => String(perm.category ?? "").toUpperCase() === "PAGE",
      ),
    [assignedPermissions],
  );

  const buildRouteKey = React.useCallback((path?: string | null, moduleKeyInput?: string | null) => {
    if (!path) return "";
    const trimmed = String(path).trim();
    if (!trimmed) return "";
    const cleaned = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    const rawSegments = cleaned.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    if (rawSegments.length === 0) return "";
    const moduleKey = String(moduleKeyInput ?? "").trim();
    let segments = rawSegments;
    if (moduleKey && rawSegments[0] === moduleKey) {
      segments = rawSegments.slice(1);
    }
    return segments.join(".");
  }, []);


  React.useEffect(() => {
    if (menu) {
      form.setFieldsValue({
        code: menu.code,
        name: menu.name,
        path: menu.path,
        module_id: menu.module_id ?? undefined,
        icon: menu.icon,
        order_index: menu.order_index ?? 0,
        is_active: menu.is_active ?? true,
      });
      setMetaText(menu.meta ? JSON.stringify(menu.meta, null, 2) : "{}");
      const meta = menu.meta ?? {};
      setComponentValue(typeof meta.component === "string" ? meta.component : "");
      setLayoutValue(typeof meta.layout === "string" ? meta.layout : "");
      setMetaError(null);
      setAdvancedMode(false);
      setCodeManual(false);
      setCodeError(null);
      const initial = { path: menu.path ?? "", moduleId: menu.module_id ?? null };
      initialRef.current = initial;
      lastAutoRef.current = initial;
    } else {
      form.resetFields();
      setMetaText("{}");
      setComponentValue("");
      setLayoutValue("");
      setMetaError(null);
      setAdvancedMode(false);
      setCodeManual(false);
      setCodeError(null);
      initialRef.current = { path: "", moduleId: null };
      lastAutoRef.current = null;
    }
  }, [menu, form]);

  React.useEffect(() => {
    if (advancedMode && codeManual) {
      prevAdvancedRef.current = advancedMode;
      return;
    }

    const currentPath = pathValue ?? "";
    const currentModuleId = moduleIdValue ?? null;
    const initial = initialRef.current;
    const nextCode = buildCodeFromPath(pathValue, moduleKey);
    if (!nextCode) {
      prevAdvancedRef.current = advancedMode;
      return;
    }

    const advancedJustDisabled = prevAdvancedRef.current && !advancedMode;

    if (
      !advancedJustDisabled &&
      initial &&
      currentPath === (initial.path ?? "") &&
      currentModuleId === (initial.moduleId ?? null)
    ) {
      prevAdvancedRef.current = advancedMode;
      return;
    }

    const current = { path: currentPath, moduleId: currentModuleId };
    const previous = lastAutoRef.current;

    if (!advancedJustDisabled && previous) {
      const samePath = previous.path === current.path;
      const sameModule = previous.moduleId === current.moduleId;
      if (samePath && sameModule) {
        prevAdvancedRef.current = advancedMode;
        return;
      }
    }

    lastAutoRef.current = current;
    if (form.getFieldValue("code") !== nextCode) {
      form.setFieldsValue({ code: nextCode });
    }
    prevAdvancedRef.current = advancedMode;
  }, [advancedMode, buildCodeFromPath, codeManual, form, moduleKey, moduleIdValue, pathValue]);

  React.useEffect(() => {
    if (!codeValue) {
      setCodeError(null);
      form.setFields([{ name: "code", errors: [] }]);
      return;
    }
    const currentCode = codeValue.trim();
    if (!currentCode) {
      setCodeError("Vui lòng nhập mã menu.");
      form.setFields([{ name: "code", errors: ["Vui lòng nhập mã menu."] }]);
      return;
    }

    const timer = window.setTimeout(async () => {
      const currentId = menu?._id ?? "";
      const { data, error } = await supabase
        .from("menus")
        .select("_id")
        .eq("code", currentCode)
        .neq("_id", currentId)
        .limit(1);

      if (error) {
        setCodeError(null);
        form.setFields([{ name: "code", errors: [] }]);
        return;
      }

      if ((data ?? []).length > 0) {
        setCodeError("Mã menu đã tồn tại.");
        form.setFields([{ name: "code", errors: ["Mã menu đã tồn tại."] }]);
      } else {
        setCodeError(null);
        form.setFields([{ name: "code", errors: [] }]);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [codeValue, form, menu?._id]);

  const handleSubmit = (values: any) => {
    if (codeError) {
      return;
    }
    onSaveMenu?.({
      code: values.code,
      name: values.name,
      path: values.path,
      module_id: values.module_id ?? null,
      icon: values.icon ?? null,
      order_index: values.order_index ?? 0,
      is_active: values.is_active ?? true,
    });
  };

  const normalizePath = React.useCallback((value?: string | null) => {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
    return withSlash.replace(/\/+$/g, "");
  }, []);

  const deriveResourceFromPath = React.useCallback(
    (
      path: string | null | undefined,
      moduleKeyInput: string | null,
      moduleMeta?: Record<string, unknown> | string | null,
    ) => {
      const normalizedPath = normalizePath(path);
      let metaValue: Record<string, unknown> | null | undefined = moduleMeta;
      if (typeof moduleMeta === "string") {
        try {
          metaValue = JSON.parse(moduleMeta) as Record<string, unknown>;
        } catch {
          metaValue = null;
        }
      }
      const areas = Array.isArray((metaValue as any)?.areas) ? (metaValue as any).areas : [];
      let bestMatch: { route_prefix?: string; resource_prefix?: string } | null = null;
      let bestLength = -1;

      areas.forEach((area: { route_prefix?: string; resource_prefix?: string }) => {
        const prefix = normalizePath(area?.route_prefix);
        if (!prefix) return;
        const isMatch = normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
        if (!isMatch) return;
        if (prefix.length > bestLength) {
          bestLength = prefix.length;
          bestMatch = area;
        }
      });

      if (bestMatch && bestMatch.resource_prefix) {
        const prefix = normalizePath(bestMatch.route_prefix);
        const remainder = normalizedPath === prefix ? "" : normalizedPath.slice(prefix.length + 1);
        const routeKey = remainder
          .split("/")
          .filter(Boolean)
          .join(".");
        const base = String(bestMatch.resource_prefix).replace(/\.+$/g, "");
        return routeKey ? `${base}.${routeKey}` : base;
      }

      const fallbackRouteKey = buildRouteKey(path, moduleKeyInput);
      return fallbackRouteKey ? `page.${fallbackRouteKey}` : "page";
    },
    [buildRouteKey, normalizePath],
  );

  const handleAutoAssignPermission = React.useCallback(async () => {
    if (!menu?._id) return;
    if (!moduleReady || !moduleKey) {
      message.warning("Chọn phân hệ trước.");
      return;
    }
    setAutoAssignLoading(true);
    try {
      const moduleMeta =
        modules.find((mod) => mod._id === menu.module_id)?.meta ?? null;
      const resource = deriveResourceFromPath(menu.path ?? "", moduleKey, moduleMeta);
      const suggested = `${moduleKey}.${resource}.read`.toLowerCase();
      if (!suggested) {
        message.error("Không thể suy ra quyền theo route.");
        return;
      }

      const { data, error } = await supabase
        .from("permissions")
        .select("_id, code, name, category, resource, action, status")
        .eq("code", suggested)
        .maybeSingle();
      if (error) {
        throw error;
      }

      if (data?._id) {
        const isPage = String(data.category ?? "").toUpperCase() === "PAGE";
        const isActive = Number(data.status) === 1;
        if (!isPage || !isActive) {
          message.error("Permission tìm thấy nhưng không hợp lệ (category/status).");
          return;
        }
        await Promise.resolve(onAssignSelected?.([data._id]));
        message.success("Đã gán quyền theo route.");
        return;
      }

      Modal.confirm({
        title: "Chưa có PAGE permission cho route này",
        content: "Tạo mới và gán luôn?",
        okText: "Tạo & gán",
        cancelText: "Hủy",
        onOk: async () => {
          const payload = {
            code: suggested,
            name: menu.name ?? suggested,
            module_id: menu.module_id,
            module: moduleKey,
            category: "PAGE",
            resource,
            action: "READ",
            permission_type: "READ",
            status: 1,
          };
          const { data: created, error: createError } = await supabase
            .from("permissions")
            .insert([payload])
            .select("_id")
            .single();
          if (createError) {
            throw createError;
          }
          if (created?._id) {
            await Promise.resolve(onAssignSelected?.([created._id]));
            message.success("Đã tạo và gán quyền.");
          }
        },
      });
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể gán quyền theo route.");
    } finally {
      setAutoAssignLoading(false);
    }
  }, [menu, moduleKey, moduleReady, modules, onAssignSelected, deriveResourceFromPath]);

  return (
    <>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
        {
          key: "info",
          label: "Thông tin",
          children: (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                <Space style={{ width: "100%" }} size={16} align="start">
                  <Form.Item
                    label="Mã menu"
                    name="code"
                    rules={[{ required: true, message: "Nhập mã menu" }]}
                    validateStatus={codeError ? "error" : undefined}
                    help={codeError ?? undefined}
                    style={{ flex: 1 }}
                  >
                    <Input
                      placeholder="vd: admin-users"
                      readOnly={!advancedMode}
                      onChange={() => {
                        if (advancedMode) setCodeManual(true);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Tên hiển thị"
                    name="name"
                    rules={[{ required: true, message: "Nhập tên menu" }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="Tên menu" />
                  </Form.Item>
                </Space>
                <Form.Item label="Nâng cao">
                  <Switch
                    checked={advancedMode}
                    onChange={(checked) => {
                      setAdvancedMode(checked);
                      if (!checked) {
                        setCodeManual(false);
                      }
                    }}
                  />
                </Form.Item>
                <Space style={{ width: "100%" }} size={16} align="start">
                  <Form.Item
                    label="Route/path"
                    name="path"
                    rules={[
                      { required: true, message: "Nhập route/path." },
                      {
                        validator: async (_: unknown, value?: string) => {
                          if (!value) return;
                          if (!String(value).startsWith("/")) {
                            throw new Error("Path phải bắt đầu bằng '/'.");
                          }
                        },
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="/system-admin/iam/users" />
                  </Form.Item>
                  <Form.Item
                    label={
                      <Tooltip title="Phân hệ dùng để nhóm menu và mapping quyền PAGE">
                        <span>Phân hệ</span>
                      </Tooltip>
                    }
                    name="module_id"
                    style={{ flex: 1 }}
                  >
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      placeholder="Chọn phân hệ"
                      popupMatchSelectWidth={false}
                      dropdownStyle={{ minWidth: 360 }}
                      filterOption={(input, option) =>
                        String(option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={modules.map((mod) => ({
                        label: `${mod.key ?? mod.code} — ${mod.name}`,
                        value: mod._id,
                      }))}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Space>
                <Space style={{ width: "100%" }} size={16} align="start">
                  <Form.Item label="Icon" style={{ flex: 1 }}>
                    <Space>
                      <div className="flex h-9 w-9 items-center justify-center rounded border">
                        {IconPreview ? <IconPreview size={18} /> : null}
                      </div>
                      <Form.Item name="icon" noStyle>
                        <Input
                          readOnly
                          placeholder="Chưa chọn icon"
                          style={{ minWidth: 220 }}
                        />
                      </Form.Item>
                      <Button onClick={() => setIconPickerOpen(true)}>Chọn icon</Button>
                      <Button onClick={() => form.setFieldsValue({ icon: null })}>Xóa</Button>
                    </Space>
                  </Form.Item>
                  <Form.Item label="Thứ tự" name="order_index" style={{ flex: 1 }}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Space>
                <Form.Item label="Trạng thái" name="is_active" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={saving} disabled={!menu}>
                  Lưu thay đổi
                </Button>
              </Space>
            </Form>
          ),
        },
        {
          key: "permissions",
          label: "Quyền hiển thị",
          children: (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-slate-500">Đã gán: {assignedPage.length}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="primary"
                    onClick={handleAutoAssignPermission}
                    disabled={!moduleReady}
                    loading={autoAssignLoading}
                  >
                    Tự gán quyền theo route
                  </Button>
                  <Button
                    danger
                    disabled={!assignedPage.length}
                    onClick={() => {
                      const first = assignedPage[0];
                      if (first?._id) {
                        onRemoveAssigned?.(first._id);
                      }
                    }}
                  >
                    Bỏ gán
                  </Button>
                </div>
              </div>
              {!moduleReady ? (
                <Alert
                  type="warning"
                  showIcon
                  message="Chưa chọn phân hệ"
                  description="Menu này chưa chọn phân hệ. Vui lòng chọn phân hệ để gán quyền PAGE."
                />
              ) : null}
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-600">Đã gán</div>
                <AssignedPermissionsTable data={assignedPage} onRemove={onRemoveAssigned} />
              </div>
            </div>
          ),
        },
        {
          key: "preview",
          label: "Preview theo vai trò",
          children: (
            <Space orientation="vertical" style={{ width: "100%" }} size={12}>
              <Select
                placeholder="Chọn vai trò để preview"
                value={previewRoleId}
                onChange={(value) => onPreviewRoleChange?.(value)}
                allowClear
                options={(previewRoles ?? []).map((role) => ({
                  label: role.name,
                  value: role._id,
                }))}
                style={{ maxWidth: 360 }}
              />
              <RolePreviewTree treeData={previewTreeData ?? []} />
            </Space>
          ),
        },
        {
          key: "advanced",
          label: "Nâng cao",
          children: (
            <Space orientation="vertical" style={{ width: "100%" }} size={12}>
              <Space style={{ width: "100%" }} size={16} align="start">
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Tooltip title="Cấu hình layout FE, không ảnh hưởng phân quyền">
                      <span>Component</span>
                    </Tooltip>
                  </div>
                  <Input
                    placeholder="Component name"
                    value={componentValue}
                    onChange={(event) => setComponentValue(event.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Tooltip title="Cấu hình layout FE, không ảnh hưởng phân quyền">
                      <span>LayoutDashboard</span>
                    </Tooltip>
                  </div>
                  <Input
                    placeholder="LayoutDashboard"
                    value={layoutValue}
                    onChange={(event) => setLayoutValue(event.target.value)}
                  />
                </div>
              </Space>
              <Input.TextArea
                value={metaText}
                onChange={(event) => setMetaText(event.target.value)}
                autoSize={{ minRows: 6, maxRows: 12 }}
                placeholder='{"badge": "new"}'
              />
              {metaError ? <span style={{ color: "#ff4d4f" }}>{metaError}</span> : null}
              <Button
                onClick={() => {
                  try {
                    setMetaError(null);
                    const parsed = metaText ? JSON.parse(metaText) : {};
                    const nextMeta = { ...parsed } as Record<string, unknown>;
                    if (componentValue.trim()) {
                      nextMeta.component = componentValue.trim();
                    } else {
                      delete nextMeta.component;
                    }
                    if (layoutValue.trim()) {
                      nextMeta.layout = layoutValue.trim();
                    } else {
                      delete nextMeta.layout;
                    }
                    setMetaText(JSON.stringify(nextMeta, null, 2));
                    onSaveMenu?.({ meta: nextMeta });
                  } catch {
                    setMetaError("JSON không hợp lệ. Vui lòng kiểm tra lại.");
                  }
                }}
              >
                Lưu meta
              </Button>
            </Space>
          ),
        },
        {
          key: "history",
          label: "Lịch sử",
          children: (
            <MenuHistoryTable
              data={historyData ?? []}
              loading={historyLoading}
              highlightId={menu?._id}
            />
          ),
        },
        ]}
      />
      <IconPickerModal
        open={iconPickerOpen}
        value={iconValue ?? null}
        onClose={() => setIconPickerOpen(false)}
        onSelect={(iconName) => {
          form.setFieldsValue({ icon: iconName });
        }}
      />
    </>
  );
};
