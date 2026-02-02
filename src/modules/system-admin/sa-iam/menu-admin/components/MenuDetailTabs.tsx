import {
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
  Typography,
  message,
} from "antd";
import * as React from "react";
import type { MenuRecord, ModuleRecord, PermissionRecord } from "../menu.types";
import { AssignedPermissionsTable } from "./AssignedPermissionsTable";
import { PermissionPickerTable } from "./PermissionPickerTable";
import { RolePreviewTree } from "./RolePreviewTree";
import { MenuHistoryTable } from "./MenuHistoryTable";
import { IconPickerModal } from "../../components/IconPickerModal";
import { getIconComponent } from "../../components/iconRegistry";
import { supabase } from "@/api/supabaseClient";
import { useNavigate } from "react-router-dom";

export interface MenuDetailTabsProps {
  menu?: MenuRecord | null;
  modules: ModuleRecord[];
  saving?: boolean;
  onSaveMenu?: (payload: Partial<MenuRecord>) => void;
  assignedPermissions: PermissionRecord[];
  pickerData: PermissionRecord[];
  pickerLoading?: boolean;
  pickerTotal?: number;
  pickerPage?: number;
  pickerPageSize?: number;
  pickerSelectedIds?: string[];
  onPickerSelect?: (ids: string[]) => void;
  onPickerPageChange?: (page: number, pageSize: number) => void;
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
  pickerData,
  pickerLoading,
  pickerTotal,
  pickerPage,
  pickerPageSize,
  pickerSelectedIds,
  onPickerSelect,
  onPickerPageChange,
  onAssignSelected,
  onRemoveAssigned,
  previewTreeData,
  previewRoles,
  previewRoleId,
  onPreviewRoleChange,
  historyData,
  historyLoading,
}) => {
  const { Text } = Typography;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [metaText, setMetaText] = React.useState<string>("{}");
  const [metaError, setMetaError] = React.useState<string | null>(null);
  const [componentValue, setComponentValue] = React.useState<string>("");
  const [layoutValue, setLayoutValue] = React.useState<string>("");
  const [iconPickerOpen, setIconPickerOpen] = React.useState(false);
  const [advancedMode, setAdvancedMode] = React.useState(false);
  const [codeManual, setCodeManual] = React.useState(false);
  const [codeError, setCodeError] = React.useState<string | null>(null);
  const [availableSearch, setAvailableSearch] = React.useState("");
  const [suggestOpen, setSuggestOpen] = React.useState(false);
  const [suggestLoading, setSuggestLoading] = React.useState(false);
  const [suggestedPermission, setSuggestedPermission] = React.useState<PermissionRecord | null>(null);
  const [activeTab, setActiveTab] = React.useState("info");
  const openedSuggestRef = React.useRef<string | null>(null);
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

  const normalizeRouteSegment = React.useCallback((value: string) => {
    const normalized = value
      .toLowerCase()
      .replace(/-/g, "_")
      .replace(/[^a-z0-9_.]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/\.{2,}/g, ".");
    return normalized.replace(/^[_\.]+|[_\.]+$/g, "");
  }, []);

  const buildRouteKey = React.useCallback(
    (path?: string | null, moduleKeyInput?: string | null) => {
      if (!path) return "";
      const cleaned = String(path).trim().split("?")[0].split("#")[0];
      const segments = cleaned.replace(/^\/+/, "").split("/").filter(Boolean);
      if (segments.length === 0) return "";
      const normalized = segments.map((segment) => normalizeRouteSegment(segment)).filter(Boolean);
      const moduleKeyLower = String(moduleKeyInput ?? "").toLowerCase();
      if (moduleKeyLower && normalized[0] === moduleKeyLower) {
        normalized.shift();
      }
      return normalized.join(".");
    },
    [normalizeRouteSegment],
  );

  const suggestedRouteKey = React.useMemo(() => {
    if (!moduleKey) return "";
    return buildRouteKey(menu?.path ?? "", moduleKey);
  }, [buildRouteKey, menu?.path, moduleKey]);

  const suggestedResource = React.useMemo(() => {
    if (!moduleKey) return "";
    return suggestedRouteKey ? `page.${suggestedRouteKey}` : "page";
  }, [moduleKey, suggestedRouteKey]);

  const suggestedCode = React.useMemo(() => {
    if (!moduleKey) return "";
    return `${moduleKey.toLowerCase()}.${suggestedResource}.read`;
  }, [moduleKey, suggestedResource]);

  const filteredAvailable = React.useMemo(() => {
    const keyword = availableSearch.trim().toLowerCase();
    const pageOnly = pickerData.filter(
      (perm) => String(perm.category ?? "").toUpperCase() === "PAGE",
    );
    if (!keyword) return pageOnly;
    const matches = pageOnly.filter((perm) => {
      const code = String(perm.code ?? "").toLowerCase();
      const name = String(perm.name ?? "").toLowerCase();
      const resource = String(perm.resource ?? "").toLowerCase();
      return code.includes(keyword) || name.includes(keyword) || resource.includes(keyword);
    });
    const exact = matches.filter((perm) => perm.code?.toLowerCase() === suggestedCode);
    const rest = matches.filter((perm) => perm.code?.toLowerCase() !== suggestedCode);
    return [...exact, ...rest];
  }, [availableSearch, pickerData, suggestedCode]);

  const availableTotal = React.useMemo(() => {
    if (availableSearch.trim()) return filteredAvailable.length;
    return pickerTotal ?? filteredAvailable.length;
  }, [availableSearch, filteredAvailable.length, pickerTotal]);

  React.useEffect(() => {
    if (!menu?._id) return;
    if (!moduleKey) {
      setAvailableSearch("");
      return;
    }
    const nextSearch = suggestedCode || suggestedResource || suggestedRouteKey;
    if (nextSearch) {
      setAvailableSearch(nextSearch);
      if (onPickerPageChange) {
        onPickerPageChange(1, pickerPageSize ?? 20);
      }
    }
  }, [
    buildRouteKey,
    menu?._id,
    menu?.path,
    moduleKey,
    onPickerPageChange,
    pickerPageSize,
    suggestedCode,
    suggestedResource,
  ]);

  React.useEffect(() => {
    if (!menu?._id) return;
    const hasMenuPermissions =
      (menu.permission_ids?.length ?? 0) > 0 || (menu.permission_codes?.length ?? 0) > 0;
    const shouldOpen = !hasMenuPermissions && assignedPage.length === 0 && menu.path;
    if (shouldOpen && openedSuggestRef.current !== menu._id) {
      setActiveTab("permissions");
      setSuggestOpen(true);
      openedSuggestRef.current = menu._id;
    }
  }, [assignedPage.length, menu?._id, menu?.path]);

  React.useEffect(() => {
    if (!suggestOpen) {
      setSuggestedPermission(null);
      return;
    }
    if (!suggestedCode) {
      setSuggestedPermission(null);
      return;
    }
    let isActive = true;
    void (async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select("_id, code, name, resource, action, category, status")
        .eq("code", suggestedCode)
        .eq("category", "PAGE")
        .maybeSingle();
      if (!isActive) return;
      if (error || !data?._id) {
        setSuggestedPermission(null);
        return;
      }
      setSuggestedPermission({
        _id: data._id ?? "",
        code: data.code ?? "",
        name: data.name ?? data.code ?? "",
        resource: data.resource ?? null,
        action: data.action ?? null,
        category: data.category ?? null,
        status: data.status ?? null,
      });
    })();
    return () => {
      isActive = false;
    };
  }, [suggestOpen, suggestedCode]);

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
      setAvailableSearch("");
      setSuggestOpen(false);
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
      setAvailableSearch("");
      setSuggestOpen(false);
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

  const handleAssignSuggested = React.useCallback(async () => {
    if (!menu?._id) return;
    if (!moduleReady) {
      message.warning("Chọn phân hệ trước.");
      return;
    }
    if (!suggestedPermission?._id) {
      message.warning("Chưa có permission PAGE cho route");
      return;
    }
    setSuggestLoading(true);
    try {
      const { error } = await supabase
        .from("menu_permissions")
        .upsert(
          [{ menu_id: menu._id, permission_id: suggestedPermission._id }],
          { onConflict: "menu_id,permission_id" },
        );
      if (error) {
        throw error;
      }
      await Promise.resolve(onAssignSelected?.([suggestedPermission._id]));
      setSuggestOpen(false);
    } catch {
      message.error("Không thể gợi ý quyền theo route.");
    } finally {
      setSuggestLoading(false);
    }
  }, [menu?._id, message, moduleReady, onAssignSelected, suggestedPermission]);

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
                  <Button onClick={() => setSuggestOpen(true)}>Gợi ý theo route</Button>
                  <Input
                    allowClear
                    placeholder="Tìm theo mã/tên..."
                    value={availableSearch}
                    onChange={(event) => {
                      setAvailableSearch(event.target.value);
                      if (onPickerPageChange) {
                        onPickerPageChange(1, pickerPageSize ?? 20);
                      }
                    }}
                    className="min-w-[220px]"
                    disabled={!moduleReady}
                  />
                  <Button
                    type="primary"
                    disabled={!moduleReady || !pickerSelectedIds?.length}
                    onClick={() => onAssignSelected?.(pickerSelectedIds)}
                  >
                    Gán đã chọn
                  </Button>
                </div>
              </div>
              {!moduleReady ? (
                <div className="text-sm text-amber-600">Chọn phân hệ trước.</div>
              ) : null}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-600">Đã gán</div>
                  <AssignedPermissionsTable data={assignedPage} onRemove={onRemoveAssigned} />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-600">Quyền khả dụng</div>
                <PermissionPickerTable
                  data={moduleReady ? filteredAvailable : []}
                  loading={pickerLoading}
                  total={moduleReady ? availableTotal : 0}
                  page={pickerPage}
                  pageSize={pickerPageSize}
                  selectedIds={pickerSelectedIds}
                  onSelectChange={onPickerSelect}
                  onPageChange={onPickerPageChange}
                  disabled={!moduleReady}
                  emptyText={moduleReady ? undefined : "Chọn phân hệ trước"}
                  highlight={availableSearch.trim()}
                  />
                </div>
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
      <Modal
        centered
        open={suggestOpen}
        onCancel={() => setSuggestOpen(false)}
        title="Gợi ý theo route"
        width={520}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setSuggestOpen(false)}>Đóng</Button>
            <Button
              type="primary"
              onClick={handleAssignSuggested}
              loading={suggestLoading}
              disabled={!suggestedPermission?._id}
            >
              Gán quyền gợi ý
            </Button>
          </div>
        }
        destroyOnHidden
        maskClosable
        keyboard
      >
        <div className="space-y-3">
          <div>
            <div className="text-xs text-slate-500">Route</div>
            <Text code>{menu?.path ?? "—"}</Text>
          </div>
          <div>
            <div className="text-xs text-slate-500">Phân hệ</div>
            <Text code>{moduleKey ?? "—"}</Text>
          </div>
          <div>
            <div className="text-xs text-slate-500">Resource gợi ý</div>
            {moduleKey ? (
              <Text code>{suggestedResource}</Text>
            ) : (
              <Text type="secondary">Chưa chọn phân hệ.</Text>
            )}
          </div>
          <div>
            <div className="text-xs text-slate-500">Mã quyền gợi ý</div>
            {suggestedCode ? (
              <Text code copyable={{ text: suggestedCode }}>
                {suggestedCode}
              </Text>
            ) : (
              <Text type="secondary">Chưa có dữ liệu để gợi ý.</Text>
            )}
          </div>
          <div>
            <div className="text-xs text-slate-500">Trạng thái</div>
            {!moduleKey ? (
              <Text type="secondary">CHƯA CHỌN PHÂN HỆ</Text>
            ) : suggestedPermission ? (
              <Text type="success">FOUND</Text>
            ) : (
              <Text type="warning">NOT FOUND</Text>
            )}
          </div>
          {suggestedPermission ? (
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Permission tìm thấy</div>
              <div className="mt-2 space-y-1 text-sm">
                <div>
                  <Text strong>{suggestedPermission.name}</Text>
                </div>
                <div>
                  <Text code copyable={{ text: suggestedPermission.code }}>
                    {suggestedPermission.code}
                  </Text>
                </div>
                <div className="text-slate-600">
                  Resource: {suggestedPermission.resource ?? "—"} · Action:{" "}
                  {String(suggestedPermission.action ?? "READ").toUpperCase()}
                </div>
              </div>
            </div>
          ) : (
            <Text type="secondary">
              {moduleKey ? "Chưa có permission PAGE cho route." : "Chưa chọn phân hệ."}
            </Text>
          )}
          {!suggestedPermission && moduleKey ? (
            <div>
              <Button
                type="link"
                onClick={() => {
                  const search = suggestedRouteKey || "";
                  const params = new URLSearchParams();
                  params.set("module", moduleKey);
                  if (search) params.set("search", search);
                  navigate(`/system-admin/iam/permissions?${params.toString()}`);
                }}
              >
                Mở trang Permissions
              </Button>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
};
