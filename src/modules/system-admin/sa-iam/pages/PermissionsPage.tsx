/**
 * PERMISSIONS PAGE - Danh mục quyền
 * Permission: sa.iam.permission.read
 */

import React from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  TeamOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import PageHeader from "@/layouts/PageHeader";
import { PermissionGate } from "../../_shared";
import {
  permissionsService,
  type PermissionModuleOption,
  type PermissionRecord,
  type PermissionStatusValue,
} from "../services/permissions.service";
import PermissionRolesModal from "./PermissionRolesModal";
import { usePermissionsList } from "../hooks/usePermissionsList";
import { CenteredModalShell } from "@/components/overlays/CenteredModalShell";
import { EnterpriseModalHeader } from "@/components/overlays/EnterpriseModalHeader";

type FormMode = "create" | "edit";

type PermissionFormValues = {
  code: string;
  name: string;
  description?: string;
  module_code: string;
  category?: "PAGE" | "FEATURE" | string;
  resource?: string;
  action?: string;
  sort_order?: number | null;
  status: PermissionStatusValue;
  meta_text?: string;
};

const statusLabel = (status?: PermissionStatusValue | null) =>
  status === 1 ? "Hoạt động" : "Ngừng";
const statusColor = (status?: PermissionStatusValue | null) =>
  status === 1 ? "green" : "red";
const nextStatus = (status?: PermissionStatusValue | null) => (status === 1 ? 0 : 1);

  const parseMetaText = (metaText?: string) => {
    const trimmed = metaText?.trim();
    if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Metadata phải là object JSON.");
    }
    return parsed as Record<string, unknown>;
  } catch (_err) {
    throw new Error("Metadata không hợp lệ. Vui lòng nhập JSON object.");
  }
};

const CATEGORY_TOOLTIP = {
  PAGE: "Dùng để quyết định HIỂN THỊ menu/trang. Chuẩn: <module>.page.read",
  FEATURE: "Dùng cho thao tác trong trang (CRUD/Export/...). Không quyết định hiển thị menu.",
};

const MODULE_TOOLTIP =
  "Phân hệ (namespace) của quyền. Nên khớp modules.code và route prefix.";
const ACTION_TOOLTIP =
  "Hành động thực thi. Không nên đặt READ cho các quyền như Export/Restore.";
const LEGACY_TOOLTIP =
  "Trường legacy để tương thích dữ liệu cũ. UI mới ưu tiên module/category/action/resource.";
const RESOURCE_TOOLTIP = "Đối tượng nghiệp vụ (resource) của quyền.";
const META_TOOLTIP =
  "Metadata cho cấu hình hiển thị/hành vi UI; không phải logic phân quyền lõi.";

const ACTION_OPTIONS = [
  "READ",
  "CREATE",
  "UPDATE",
  "DELETE",
  "EXPORT",
  "IMPORT",
  "RESTORE",
  "ASSIGN",
  "APPROVE",
  "REJECT",
];

const isNormalizedPermission = (
  permission: PermissionRecord,
  moduleOptions?: PermissionModuleOption[],
) => buildExpected(permission, moduleOptions).ok;

const parsePermissionCode = (code?: string | null) => {
  const parts = (code ?? "")
    .split(".")
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return { module: "", resource: "", action: "" };
  }

  if (parts.length === 1) {
    return { module: parts[0], resource: "", action: "" };
  }

  const module = parts[0];
  const action = parts[parts.length - 1].toUpperCase();
  const resource = parts.slice(1, -1).join(".");

  return { module, resource, action };
};

const buildPermissionCode = (moduleCode: string, resource: string, action: string) => {
  const safeModule = moduleCode.trim();
  const safeResource = resource.trim();
  const safeAction = action.trim();

  if (!safeModule || !safeResource || !safeAction) return "";

  return `${safeModule}.${safeResource}.${safeAction.toLowerCase()}`;
};

const buildExpected = (record: PermissionRecord, moduleOptions?: PermissionModuleOption[]) => {
  const parsed = parsePermissionCode(record.code);
  const moduleFromRecord = (record.module ?? "").trim();
  const moduleFromId =
    record.module_id && moduleOptions?.length
      ? moduleOptions.find((item) => item.id === record.module_id)?.code ?? ""
      : "";
  const moduleCode = parsed.module || moduleFromRecord || moduleFromId;

  const resourceFromRecord = (record.resource ?? "").trim();
  const actionFromRecord = String(record.action ?? "").trim().toUpperCase();
  const permissionTypeFromRecord = String(record.permission_type ?? "")
    .trim()
    .toUpperCase();
  const categoryFromRecord = String(record.category ?? "").trim().toUpperCase();

  const resource = (resourceFromRecord || parsed.resource).trim();
  const action = String(actionFromRecord || permissionTypeFromRecord || parsed.action || "")
    .trim()
    .toUpperCase();
  const permissionType = String(permissionTypeFromRecord || action || "")
    .trim()
    .toUpperCase();
  const category =
    categoryFromRecord ||
    (resource
      ? resource.toLowerCase().startsWith("page")
        ? "PAGE"
        : "FEATURE"
      : action
        ? "FEATURE"
        : "");
  const code = String(record.code ?? "");

  const hasModule = Boolean(moduleCode);
  const missing = {
    module: !hasModule,
    category: !category,
    resource: !resource,
    action: !action,
    permissionType: !permissionType,
  };
  const hasMissing = Object.values(missing).some(Boolean);

  if (!moduleCode || !resource || !category || !action) {
    return { ok: false, expectedCode: "", category, action, permissionType, missing };
  }

  if (category === "PAGE") {
    const expectedCode = `${moduleCode}.${resource}.read`.toLowerCase();
    const resOk = resource.toLowerCase().startsWith("page");
    const actOk = action === "READ";
    const permOk = permissionType === "READ";
    const codeOk = code.toLowerCase() === expectedCode;
    const ok = !hasMissing && resOk && actOk && permOk && codeOk;
    return { ok, expectedCode, category, action, permissionType, missing };
  }

  if (category === "FEATURE") {
    const expectedCode = `${moduleCode}.${resource}.${action.toLowerCase()}`.toLowerCase();
    const permOk = permissionType === action;
    const codeOk = code.toLowerCase() === expectedCode;
    const ok = !hasMissing && permOk && codeOk;
    return { ok, expectedCode, category, action, permissionType, missing };
  }

  return { ok: false, expectedCode: "", category, action, permissionType, missing };
};

export default function PermissionsPage() {
  const {
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    rawPermissions,
    total,
    modules,
    legacyTypes,
    actions,
    refreshPermissions,
  } = usePermissionsList();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<FormMode>("create");
  const [editingPermission, setEditingPermission] = React.useState<PermissionRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [advancedMode, setAdvancedMode] = React.useState(false);
  const [normalizingId, setNormalizingId] = React.useState<string | null>(null);
  const [form] = Form.useForm<PermissionFormValues>();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [viewPermission, setViewPermission] = React.useState<PermissionRecord | null>(null);
  const [rolesModalOpen, setRolesModalOpen] = React.useState(false);
  const [rolesPermission, setRolesPermission] = React.useState<PermissionRecord | null>(null);
  const codeValue = Form.useWatch("code", form);
  const moduleCodeValue = Form.useWatch("module_code", form);
  const resourceValue = Form.useWatch("resource", form);
  const actionValue = Form.useWatch("action", form);

  const moduleOptions = modules;

  React.useEffect(() => {
    if (advancedMode) return;
    if (!codeValue) {
      form.setFieldsValue({
        resource: undefined,
        action: undefined,
      });
      return;
    }
    const derived = parsePermissionCode(codeValue);
    form.setFieldsValue({
      resource: derived.resource || undefined,
      action: derived.action || undefined,
    });
  }, [advancedMode, codeValue, form]);

  React.useEffect(() => {
    if (!advancedMode) return;
    const moduleCode = String(moduleCodeValue ?? "").trim();
    const resource = String(resourceValue ?? "").trim();
    const action = String(actionValue ?? "").trim().toUpperCase();
    if (!moduleCode || !resource || !action) return;
    const nextCode = buildPermissionCode(moduleCode, resource, action);
    if (!nextCode) return;
    if (form.getFieldValue("code") !== nextCode) {
      form.setFieldsValue({ code: nextCode });
    }
  }, [actionValue, advancedMode, form, moduleCodeValue, resourceValue]);

  const openCreate = () => {
    setFormMode("create");
    setEditingPermission(null);
    setAdvancedMode(false);
    form.resetFields();
    form.setFieldsValue({
      status: 1,
      sort_order: 0,
      category: filters.category !== "all" ? filters.category : "FEATURE",
    });
    setModalOpen(true);
  };

  const findModuleByCode = (code?: string | null) =>
    moduleOptions.find((item) => item.code === code);

  const openEdit = (permission: PermissionRecord) => {
    setFormMode("edit");
    setEditingPermission(permission);
    setAdvancedMode(false);
    const moduleOption =
      findModuleByCode(permission.module ?? "") ??
      moduleOptions.find((item) => item.id === permission.module_id);
    const derived = parsePermissionCode(permission.code);
    const resourceValue = (permission.resource ?? "").trim() || derived.resource;
    const actionValue = ((permission.action ?? "").trim() || derived.action).toUpperCase();
    const categoryValue =
      permission.category != null ? String(permission.category).toUpperCase() : undefined;

    form.resetFields();
    form.setFieldsValue({
      code: permission.code,
      name: permission.name,
      description: permission.description ?? "",
      module_code: moduleOption?.code ?? permission.module ?? "",
      category: categoryValue,
      resource: resourceValue || undefined,
      action: actionValue || undefined,
      status: permission.status ?? 1,
      sort_order: permission.sort_order ?? 0,
      meta_text: permission.meta ? JSON.stringify(permission.meta, null, 2) : "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleFormatMeta = () => {
    const current = form.getFieldValue("meta_text");
    if (!current || !String(current).trim()) {
      form.setFieldsValue({ meta_text: "{}" });
      return;
    }
    try {
      const parsed = parseMetaText(String(current));
      form.setFieldsValue({ meta_text: JSON.stringify(parsed ?? {}, null, 2) });
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Metadata không hợp lệ.";
      message.error(messageText);
    }
  };

  const validateMetaText = async (_: unknown, value?: string) => {
    if (!value || !value.trim()) return;
    parseMetaText(value);
  };

  const validateResource = async (_: unknown, value?: string) => {
    if (!advancedMode) return;
    const trimmed = String(value ?? "").trim();
    if (!trimmed) {
      throw new Error("Vui lòng nhập resource.");
    }
    if (trimmed.endsWith(".")) {
      throw new Error("Resource không được kết thúc bằng '.'.");
    }
  };

  const validateCategory = async (_: unknown, value?: string) => {
    if (!advancedMode) return;
    if (!value) {
      throw new Error("Vui lòng chọn loại quyền.");
    }
  };

  const validateActionForCategory = async (_: unknown, value?: string) => {
    if (!advancedMode) return;
    const trimmed = String(value ?? "").trim();
    if (!trimmed) {
      throw new Error("Vui lòng nhập action.");
    }
    const category = form.getFieldValue("category");
    if (String(category).toUpperCase() === "PAGE" && trimmed.toUpperCase() !== "READ") {
      throw new Error("Loại PAGE chỉ dùng action READ.");
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const moduleOption = findModuleByCode(values.module_code);
      if (!moduleOption) {
        message.error("Vui lòng chọn phân hệ hợp lệ.");
        setSubmitting(false);
        return;
      }

      const metaValue = parseMetaText(values.meta_text);
      const parsed = parsePermissionCode(values.code);
      let resourceValue = (values.resource ?? "").trim() || parsed.resource;
      let actionValueRaw = (values.action ?? "").trim() || parsed.action;
      let actionValue = actionValueRaw ? actionValueRaw.toUpperCase() : "";
      const categoryValue = values.category ? String(values.category).toUpperCase() : undefined;

      if (categoryValue === "PAGE") {
        if (!resourceValue) resourceValue = "page";
        if (!resourceValue.toLowerCase().startsWith("page")) {
          resourceValue = `page.${resourceValue}`;
        }
        actionValue = "READ";
      }

      const nextCode = buildPermissionCode(moduleOption.code, resourceValue, actionValue);
      const finalCode = advancedMode ? nextCode : values.code.trim();

      if (!finalCode) {
        message.error("Vui lòng nhập đủ module/resource/action để tạo mã quyền.");
        setSubmitting(false);
        return;
      }

      if (formMode === "create") {
        const existing = await permissionsService.getPermissionByCode(finalCode);
        if (existing) {
          message.error("Mã quyền đã tồn tại.");
          setSubmitting(false);
          return;
        }
        await permissionsService.createPermission({
          code: finalCode,
          name: values.name.trim(),
          description: values.description?.trim() || null,
          module_id: moduleOption.id,
          module: moduleOption.code,
          permission_type: actionValue,
          category: categoryValue ?? null,
          resource: resourceValue || null,
          action: actionValue || null,
          status: values.status ?? 1,
          sort_order: values.sort_order ?? 0,
          meta: metaValue ?? {},
        });
        message.success("Đã tạo quyền.");
      } else if (editingPermission) {
        await permissionsService.updatePermission(editingPermission.id, {
          ...(advancedMode ? { code: finalCode } : {}),
          name: values.name.trim(),
          description: values.description?.trim() || null,
          module_id: moduleOption.id,
          module: moduleOption.code,
          permission_type: actionValue,
          category: categoryValue ?? editingPermission.category ?? null,
          resource: resourceValue || null,
          action: actionValue || null,
          status: values.status ?? editingPermission.status ?? 1,
          sort_order: values.sort_order ?? editingPermission.sort_order ?? 0,
          meta: metaValue ?? editingPermission.meta ?? {},
        });
        message.success("Đã cập nhật quyền.");
      }
      setModalOpen(false);
      await refreshPermissions();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu quyền.";
      message.error(messageText);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (permission: PermissionRecord) => {
    try {
      await permissionsService.togglePermissionStatus(permission.id, nextStatus(permission.status));
      message.success("Đã cập nhật trạng thái.");
      await refreshPermissions();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật trạng thái.";
      message.error(messageText);
    }
  };

  const openView = (permission: PermissionRecord) => {
    setViewPermission(permission);
    setDrawerOpen(true);
  };

  const openRolesModal = (permission: PermissionRecord) => {
    setRolesPermission(permission);
    setRolesModalOpen(true);
  };

  const handleNormalizePermission = async (permission: PermissionRecord) => {
    const parsed = parsePermissionCode(permission.code);
    let moduleCode = (permission.module ?? "").trim();
    if (!moduleCode && permission.module_id) {
      moduleCode =
        moduleOptions.find((item) => item.id === permission.module_id)?.code ?? "";
    }
    if (!moduleCode) {
      moduleCode = parsed.module;
    }
    if (!moduleCode) {
      message.error("Thiếu module.");
      return;
    }

    let resourceValue = (permission.resource ?? "").trim();
    if (!resourceValue) {
      resourceValue = parsed.resource;
    }
    let actionValue = String(
      permission.action ?? permission.permission_type ?? parsed.action ?? "READ",
    ).toUpperCase();
    let categoryValue = String(permission.category ?? "").toUpperCase();

    if (!categoryValue) {
      if (resourceValue.toLowerCase().startsWith("page")) {
        categoryValue = "PAGE";
      } else if (resourceValue || actionValue) {
        categoryValue = "FEATURE";
      } else {
        message.error("Thiếu Loại (category).");
        return;
      }
    }

    let codeValue = "";
    if (categoryValue === "PAGE") {
      if (!resourceValue) resourceValue = "page";
      if (!resourceValue.toLowerCase().startsWith("page")) {
        resourceValue = `page.${resourceValue}`;
      }
      actionValue = "READ";
      codeValue = `${moduleCode}.${resourceValue}.read`.toLowerCase();
    } else {
      if (!resourceValue) {
        message.error("Thiếu resource.");
        return;
      }
      codeValue = `${moduleCode}.${resourceValue}.${actionValue.toLowerCase()}`.toLowerCase();
    }

    const patch = {
      category: categoryValue,
      module: moduleCode,
      resource: resourceValue,
      action: actionValue,
      permission_type: actionValue,
      code: codeValue,
    };

    if (!patch.category) {
      message.error("Thiếu Loại (category).");
      return;
    }
    try {
      setNormalizingId(permission.id);
      await permissionsService.updatePermission(permission.id, patch);
      message.success("Đã chuẩn hoá quyền.");
      await refreshPermissions();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể chuẩn hoá quyền.";
      message.error(messageText);
    } finally {
      setNormalizingId(null);
    }
  };

  const moduleOptionsForFilter = [
    { value: "all", label: "Tất cả phân hệ" },
    ...moduleOptions.map((option) => ({
      value: option.id,
      label: `${option.code} - ${option.name}${option.group ? ` (${option.group})` : ""}`,
    })),
  ];

  const legacyTypeOptions = [
    { value: "all", label: "Tất cả legacy" },
    ...legacyTypes.map((item) => ({ value: item.code, label: item.code })),
  ];

  const actionOptions = [
    { value: "all", label: "Tất cả hành động" },
    ...Array.from(
      new Set([
        ...ACTION_OPTIONS,
        ...actions.map((item) => item.code).filter(Boolean),
      ]),
    ).map((action) => ({ value: action, label: action })),
  ];

  const moduleLabel = (permission: PermissionRecord) => {
    const option =
      moduleOptions.find((item) => item.id === permission.module_id) ??
      moduleOptions.find((item) => item.code === permission.module);
    if (option) return `${option.code} - ${option.name}`;
    return permission.module ?? "-";
  };

  const filteredPermissions = React.useMemo(() => {
    if (!filters.unnormalizedOnly) return rawPermissions;
    return rawPermissions.filter((perm) => !isNormalizedPermission(perm, moduleOptions));
  }, [rawPermissions, filters.unnormalizedOnly, moduleOptions]);

  const filteredCount = filteredPermissions.length;

  return (
    <PermissionGate permission="sa.iam.permission.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "IAM", href: "/system-admin/iam" },
            { label: "Danh mục quyền" },
          ]}
          title="Quản lý Danh mục quyền"
          subtitle="Quản lý danh mục quyền và phân quyền trong hệ thống"
          actions={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refreshPermissions()}>
                Làm mới
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Thêm quyền
              </Button>
            </Space>
          }
        />

        <div className="px-6 pb-8">
          <Card>
              <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
              <Space wrap>
                <Tag.CheckableTag
                  checked={filters.category === "PAGE"}
                  onChange={(checked) =>
                    setFilters((prev) => ({ ...prev, category: checked ? "PAGE" : "all" }))
                  }
                >
                  PAGE
                </Tag.CheckableTag>
                <Tag.CheckableTag
                  checked={filters.category === "FEATURE"}
                  onChange={(checked) =>
                    setFilters((prev) => ({ ...prev, category: checked ? "FEATURE" : "all" }))
                  }
                >
                  FEATURE
                </Tag.CheckableTag>
                <Tag.CheckableTag
                  checked={filters.unnormalizedOnly}
                  onChange={(checked) =>
                    setFilters((prev) => ({ ...prev, unnormalizedOnly: checked }))
                  }
                >
                  Chưa chuẩn
                </Tag.CheckableTag>
              </Space>
              <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                <Space wrap>
                  <Input.Search
                    placeholder="Tìm theo mã quyền, tên quyền, resource, action..."
                    value={filters.search}
                    onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                    allowClear
                    style={{ width: 300 }}
                  />
                  <Select
                    value={filters.status}
                    onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                    style={{ width: 160 }}
                    options={[
                      { value: "all", label: "Tất cả trạng thái" },
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Ngừng" },
                    ]}
                  />
                  <Tooltip title={CATEGORY_TOOLTIP.PAGE + " / " + CATEGORY_TOOLTIP.FEATURE}>
                    <Select
                      value={filters.category}
                      onChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                      style={{ width: 200 }}
                      options={[
                        { value: "all", label: "Tất cả loại" },
                        { value: "PAGE", label: "PAGE (Hiển thị menu)" },
                        { value: "FEATURE", label: "FEATURE (Tính năng)" },
                      ]}
                    />
                  </Tooltip>
                  <Tooltip title={ACTION_TOOLTIP}>
                    <Select
                      value={filters.action}
                      onChange={(value) => setFilters((prev) => ({ ...prev, action: value }))}
                      style={{ width: 160 }}
                      options={actionOptions}
                      showSearch
                    />
                  </Tooltip>
                  <Tooltip title={MODULE_TOOLTIP}>
                    <Select
                      value={filters.moduleId}
                      onChange={(value) => setFilters((prev) => ({ ...prev, moduleId: value }))}
                      style={{ width: 240 }}
                      options={moduleOptionsForFilter}
                      showSearch
                    />
                  </Tooltip>
                  <Tooltip title={LEGACY_TOOLTIP}>
                    <Select
                      value={filters.permissionType}
                      onChange={(value) => setFilters((prev) => ({ ...prev, permissionType: value }))}
                      style={{ width: 180 }}
                      options={legacyTypeOptions}
                      showSearch
                      placeholder="Loại legacy"
                    />
                  </Tooltip>
                  <Tooltip title="Chỉ hiển thị các quyền chưa có module/resource/action chuẩn hoặc code chưa khớp mẫu.">
                    <Switch
                      checked={filters.unnormalizedOnly}
                      onChange={(checked) => setFilters((prev) => ({ ...prev, unnormalizedOnly: checked }))}
                      checkedChildren="Chưa chuẩn"
                      unCheckedChildren="Đã chuẩn"
                    />
                  </Tooltip>
                  <Button
                    onClick={() =>
                      setFilters({
                        search: "",
                        status: "all",
                        category: "all",
                        action: "all",
                        moduleId: "all",
                        permissionType: "all",
                        unnormalizedOnly: false,
                      })
                    }
                  >
                    Đặt lại lọc
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={() => refreshPermissions()}>
                    Làm mới
                  </Button>
                </Space>
                <Typography.Text type="secondary">
                  Đang lọc: <strong>{filteredCount}</strong> / Tổng: <strong>{total}</strong>
                </Typography.Text>
              </Space>

              <Table
                rowKey="id"
                loading={loading}
                dataSource={filteredPermissions}
                bordered
                rowClassName={(record: PermissionRecord) => (record.status === 0 ? "opacity-70" : "")}
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
                    title: "Mã quyền",
                    dataIndex: "code",
                    key: "code",
                    width: 200,
                    render: (value: string) => (
                      <Typography.Text code copyable={{ text: value }}>
                        {value}
                      </Typography.Text>
                    ),
                  },
                  {
                    title: "Tên quyền",
                    dataIndex: "name",
                    key: "name",
                    render: (value: string, record: PermissionRecord) =>
                      record.description ? (
                        <Tooltip title={record.description}>
                          <span>{value}</span>
                        </Tooltip>
                      ) : (
                        value
                      ),
                  },
                  {
                    title: (
                      <Tooltip title={MODULE_TOOLTIP}>
                        <span>Phân hệ</span>
                      </Tooltip>
                    ),
                    key: "module",
                    width: 220,
                    render: (_: unknown, record: PermissionRecord) => moduleLabel(record),
                  },
                  {
                    title: (
                      <Tooltip title={`${CATEGORY_TOOLTIP.PAGE} ${CATEGORY_TOOLTIP.FEATURE}`}>
                        <span>Loại</span>
                      </Tooltip>
                    ),
                    key: "category",
                    width: 140,
                    render: (_: unknown, record: PermissionRecord) => {
                      const directCategory = String(record.category ?? "").toUpperCase();
                      const resourceValue = (record.resource ?? "").trim();
                      const actionValue = String(
                        record.action ?? record.permission_type ?? "",
                      )
                        .trim()
                        .toUpperCase();
                      const derived = parsePermissionCode(record.code);
                      const inferredResource = resourceValue || derived.resource;
                      const inferredCategory = inferredResource
                        ? inferredResource.toLowerCase().startsWith("page")
                          ? "PAGE"
                          : "FEATURE"
                        : actionValue || derived.action
                          ? "FEATURE"
                          : "";
                      const displayCategory = directCategory || inferredCategory;
                      if (!displayCategory) {
                        return <Tag>—</Tag>;
                      }
                      const color = displayCategory === "PAGE" ? "blue" : "gold";
                      return (
                        <Tooltip title={CATEGORY_TOOLTIP[displayCategory as "PAGE" | "FEATURE"] ?? ""}>
                          <Tag color={color}>{displayCategory}</Tag>
                        </Tooltip>
                      );
                    },
                  },
                  {
                    title: (
                      <Tooltip title={RESOURCE_TOOLTIP}>
                        <span>Resource</span>
                      </Tooltip>
                    ),
                    dataIndex: "resource",
                    key: "resource",
                    width: 200,
                    render: (value: string | null, record: PermissionRecord) => {
                      const expected = buildExpected(record, moduleOptions);
                      const resourceValue = (value ?? "").trim();
                      const derived = parsePermissionCode(record.code);
                      const displayResource = resourceValue || derived.resource;

                      return (
                        <Space size={6} wrap>
                          <span>{displayResource || "—"}</span>
                          {!expected.ok && (
                            <Button
                              type="link"
                              size="small"
                              onClick={() => handleNormalizePermission(record)}
                              loading={normalizingId === record.id}
                            >
                              Chuẩn hoá
                            </Button>
                          )}
                        </Space>
                      );
                    },
                  },
                  {
                    title: (
                      <Tooltip title={ACTION_TOOLTIP}>
                        <span>Action</span>
                      </Tooltip>
                    ),
                    dataIndex: "action",
                    key: "action",
                    width: 120,
                    render: (value?: string | null, record?: PermissionRecord) => {
                      const actionValue = String(value ?? "").trim();
                      const fallback = String(record?.permission_type ?? "").trim();
                      const derived = record ? parsePermissionCode(record.code) : { action: "" };
                      const displayAction = actionValue || fallback || derived.action;

                      if (!displayAction) {
                        return <Tag>—</Tag>;
                      }

                      return <Tag>{displayAction.toUpperCase()}</Tag>;
                    },
                  },
                  {
                    title: (
                      <Tooltip title={LEGACY_TOOLTIP}>
                        <span>Legacy</span>
                      </Tooltip>
                    ),
                    dataIndex: "permission_type",
                    key: "permission_type",
                    width: 140,
                    render: (value?: string | null) => (value ? <Tag>{value}</Tag> : <Tag>—</Tag>),
                  },
                  {
                    title: "Mặc định",
                    dataIndex: "is_default",
                    key: "is_default",
                    width: 110,
                    render: (value?: boolean | null) =>
                      value ? <Tag color="geekblue">Có</Tag> : <Tag>—</Tag>,
                  },
                  {
                    title: "Trạng thái",
                    dataIndex: "status",
                    key: "status",
                    width: 120,
                    render: (value: PermissionStatusValue) => (
                      <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
                    ),
                  },
                  {
                    title: "Thao tác",
                    key: "actions",
                    width: 220,
                    render: (_: unknown, record: PermissionRecord) => (
                      <Space>
                        <Tooltip title="Xem">
                          <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => openView(record)}
                          />
                        </Tooltip>
                        <Tooltip title="Sửa">
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(record)}
                          />
                        </Tooltip>
                        <Tooltip title="Danh sách vai trò">
                          <Button
                            type="text"
                            size="small"
                            icon={<TeamOutlined />}
                            onClick={() => openRolesModal(record)}
                          />
                        </Tooltip>
                        <Tooltip title={record.status === 1 ? "Ngừng" : "Kích hoạt"}>
                          <Popconfirm
                            title={record.status === 1 ? "Ngừng quyền này?" : "Kích hoạt quyền này?"}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            onConfirm={() => handleToggleStatus(record)}
                          >
                            <Button
                              type="text"
                              size="small"
                              danger={record.status === 1}
                              icon={record.status === 1 ? <StopOutlined /> : <CheckCircleOutlined />}
                            />
                          </Popconfirm>
                        </Tooltip>
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
        width={860}
        header={
          <EnterpriseModalHeader
            title={formMode === "create" ? "Thêm quyền" : "Chỉnh sửa quyền"}
            badgeStatus={
              formMode === "edit"
                ? editingPermission?.status === 1
                  ? "success"
                  : "default"
                : "default"
            }
            statusLabel={
              formMode === "edit" && editingPermission
                ? statusLabel(editingPermission.status)
                : undefined
            }
            code={formMode === "edit" ? editingPermission?.code ?? undefined : undefined}
            moduleTag={
              formMode === "edit" ? editingPermission?.module ?? undefined : undefined
            }
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
            label="Mã quyền"
            rules={[
              { required: true, message: "Vui lòng nhập mã quyền." },
              {
                pattern: /^[a-zA-Z0-9_.:-]+$/,
                message: "Mã chỉ gồm chữ, số và ký tự . _ : -",
              },
            ]}
          >
            <Input disabled={formMode === "edit"} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên quyền"
            rules={[{ required: true, message: "Vui lòng nhập tên quyền." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="module_code"
            label="Phân hệ/nhóm"
            rules={[{ required: true, message: "Vui lòng chọn phân hệ." }]}
          >
            <Select
              showSearch
              placeholder="Chọn phân hệ"
              options={moduleOptions.map((option) => ({
                value: option.code,
                label: `${option.code} - ${option.name}`,
              }))}
            />
          </Form.Item>
          <Form.Item label="Chế độ nâng cao">
            <Switch checked={advancedMode} onChange={setAdvancedMode} />
          </Form.Item>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item
              name="category"
              label={
                <Tooltip title={`${CATEGORY_TOOLTIP.PAGE} ${CATEGORY_TOOLTIP.FEATURE}`}>
                  <span>Loại</span>
                </Tooltip>
              }
              validateTrigger="onBlur"
              rules={[{ validator: validateCategory }]}
            >
              <Select
                disabled={!advancedMode}
                options={[
                  { value: "PAGE", label: "PAGE (Hiển thị menu)" },
                  { value: "FEATURE", label: "FEATURE (Tính năng)" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="resource"
              label={
                <Tooltip title={RESOURCE_TOOLTIP}>
                  <span>Resource</span>
                </Tooltip>
              }
              validateTrigger="onBlur"
              rules={[{ validator: validateResource }]}
            >
              <Input readOnly={!advancedMode} placeholder="vd: user-management.user" />
            </Form.Item>
            <Form.Item
              name="action"
              label={
                <Tooltip title={ACTION_TOOLTIP}>
                  <span>Action</span>
                </Tooltip>
              }
              dependencies={["category"]}
              validateTrigger="onBlur"
              rules={[{ validator: validateActionForCategory }]}
            >
              <Input readOnly={!advancedMode} placeholder="READ" />
            </Form.Item>
          </div>
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
          <Form.Item
            name="meta_text"
            label={
              <Space size={6}>
                <Tooltip title={META_TOOLTIP}>
                  <span>Metadata (JSON)</span>
                </Tooltip>
                <Button type="link" size="small" onClick={handleFormatMeta}>
                  Format JSON
                </Button>
              </Space>
            }
            validateTrigger="onBlur"
            rules={[{ validator: validateMetaText }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="{}"
              className="font-mono"
            />
          </Form.Item>
        </Form>
      </CenteredModalShell>

      <CenteredModalShell
        header={
          <EnterpriseModalHeader
            title="Chi tiết quyền"
            badgeStatus={viewPermission?.status === 1 ? "success" : "default"}
            statusLabel={viewPermission ? statusLabel(viewPermission.status) : undefined}
            code={viewPermission?.code}
            moduleTag={viewPermission ? moduleLabel(viewPermission) : undefined}
          />
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        afterClose={() => setViewPermission(null)}
        width={720}
      >
        {viewPermission ? (
          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {viewPermission.name}
            </Typography.Title>
            <Tag>{viewPermission.code}</Tag>
            <Tag color={statusColor(viewPermission.status)}>
              {statusLabel(viewPermission.status)}
            </Tag>
            <Typography.Paragraph>
              {viewPermission.description || "Chưa có mô tả."}
            </Typography.Paragraph>
            <Typography.Text>
              Phân hệ: <strong>{moduleLabel(viewPermission)}</strong>
            </Typography.Text>
            <Typography.Text>
              Số vai trò: <strong>{viewPermission.role_count ?? 0}</strong>
            </Typography.Text>
          </Space>
        ) : (
          <Typography.Text>Không có dữ liệu.</Typography.Text>
        )}
      </CenteredModalShell>

      <PermissionRolesModal
        open={rolesModalOpen}
        permission={rolesPermission}
        onClose={() => {
          setRolesModalOpen(false);
          setRolesPermission(null);
        }}
      />
    </PermissionGate>
  );
}
