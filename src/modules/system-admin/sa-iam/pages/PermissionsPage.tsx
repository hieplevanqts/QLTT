/**
 * PERMISSIONS PAGE - Danh mục quyền
 * Permission: sa.iam.permission.read
 */

import React from "react";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
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
  type PermissionRecord,
  type PermissionStatusValue,
} from "../services/permissions.service";
import PermissionRolesModal from "./PermissionRolesModal";
import { usePermissionsList } from "../hooks/usePermissionsList";

type FormMode = "create" | "edit";

type PermissionFormValues = {
  code: string;
  name: string;
  description?: string;
  module_code: string;
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

const isNormalizedPermission = (permission: PermissionRecord) => {
  const module = (permission.module ?? "").trim();
  const resource = (permission.resource ?? "").trim();
  const action = (permission.action ?? "").trim();
  const code = (permission.code ?? "").trim();

  if (!permission.module_id || !module || !resource || !action) return false;
  if (resource.endsWith(".")) return false;
  if (module && resource.startsWith(`${module}.`)) return false;

  const regex = /^[a-z0-9-]+(\.[a-z0-9_.-]+)+\.[a-z]+$/;
  if (!regex.test(code)) return false;
  if (code !== code.toLowerCase()) return false;

  return true;
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
  const [form] = Form.useForm<PermissionFormValues>();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [viewPermission, setViewPermission] = React.useState<PermissionRecord | null>(null);
  const [rolesModalOpen, setRolesModalOpen] = React.useState(false);
  const [rolesPermission, setRolesPermission] = React.useState<PermissionRecord | null>(null);

  const moduleOptions = modules;

  const openCreate = () => {
    setFormMode("create");
    setEditingPermission(null);
    form.resetFields();
    form.setFieldsValue({
      status: 1,
      sort_order: 0,
    });
    setModalOpen(true);
  };

  const findModuleByCode = (code?: string | null) =>
    moduleOptions.find((item) => item.code === code);

  const openEdit = (permission: PermissionRecord) => {
    setFormMode("edit");
    setEditingPermission(permission);
    const moduleOption =
      findModuleByCode(permission.permission_type ?? "") ??
      moduleOptions.find((item) => item.id === permission.module_id);

    form.resetFields();
    form.setFieldsValue({
      code: permission.code,
      name: permission.name,
      description: permission.description ?? "",
      module_code: moduleOption?.code ?? permission.permission_type ?? "",
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
      if (formMode === "create") {
        const existing = await permissionsService.getPermissionByCode(values.code.trim());
        if (existing) {
          message.error("Mã quyền đã tồn tại.");
          setSubmitting(false);
          return;
        }
        await permissionsService.createPermission({
          code: values.code.trim(),
          name: values.name.trim(),
          description: values.description?.trim() || null,
          module_id: moduleOption.id,
          permission_type: moduleOption.code,
          status: values.status ?? 1,
          sort_order: values.sort_order ?? 0,
          meta: metaValue ?? {},
        });
        message.success("Đã tạo quyền.");
      } else if (editingPermission) {
        await permissionsService.updatePermission(editingPermission.id, {
          name: values.name.trim(),
          description: values.description?.trim() || null,
          module_id: moduleOption.id,
          permission_type: moduleOption.code,
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
    return permission.module ?? permission.permission_type ?? "-";
  };

  const filteredPermissions = React.useMemo(() => {
    if (!filters.unnormalizedOnly) return rawPermissions;
    return rawPermissions.filter((perm) => !isNormalizedPermission(perm));
  }, [rawPermissions, filters.unnormalizedOnly]);

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
                      const category = String(record.category ?? "").toUpperCase();
                      if (!category) return <Tag>—</Tag>;
                      const color = category === "PAGE" ? "blue" : "gold";
                      return (
                        <Tooltip title={CATEGORY_TOOLTIP[category as "PAGE" | "FEATURE"] ?? ""}>
                          <Tag color={color}>{category}</Tag>
                        </Tooltip>
                      );
                    },
                  },
                  {
                    title: "Resource",
                    dataIndex: "resource",
                    key: "resource",
                    width: 200,
                    render: (value: string | null, record: PermissionRecord) =>
                      value ? (
                        value
                      ) : (
                        <Space size={4}>
                          <span>—</span>
                          {!isNormalizedPermission(record) && <Tag color="orange">Chưa chuẩn</Tag>}
                        </Space>
                      ),
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
                    render: (value?: string | null) => (value ? <Tag>{value}</Tag> : <Tag>—</Tag>),
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

      <Modal
        open={modalOpen}
        title={formMode === "create" ? "Thêm quyền" : "Chỉnh sửa quyền"}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={submitting}
        destroyOnClose
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
          <Form.Item name="meta_text" label="Metadata (JSON)">
            <Input.TextArea rows={4} placeholder='VD: {"scope":"iam"}' />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Chi tiết quyền"
        placement="right"
        size={420}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
      </Drawer>

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
