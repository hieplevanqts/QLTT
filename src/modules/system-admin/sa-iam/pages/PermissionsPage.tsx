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
  type PermissionModuleOption,
} from "../services/permissions.service";
import PermissionRolesModal from "./PermissionRolesModal";

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

export default function PermissionsPage() {
  const [loading, setLoading] = React.useState(false);
  const [permissions, setPermissions] = React.useState<PermissionRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [moduleFilter, setModuleFilter] = React.useState<string>("all");
  const [moduleOptions, setModuleOptions] = React.useState<PermissionModuleOption[]>([]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<FormMode>("create");
  const [editingPermission, setEditingPermission] = React.useState<PermissionRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm<PermissionFormValues>();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [viewPermission, setViewPermission] = React.useState<PermissionRecord | null>(null);
  const [rolesModalOpen, setRolesModalOpen] = React.useState(false);
  const [rolesPermission, setRolesPermission] = React.useState<PermissionRecord | null>(null);

  const loadModules = React.useCallback(async () => {
    try {
      const options = await permissionsService.listPermissionModules();
      setModuleOptions(options);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải phân hệ.";
      message.error(messageText);
    }
  }, []);

  const loadPermissions = React.useCallback(async () => {
    setLoading(true);
    try {
      const selectedModule =
        moduleOptions.find((item) => item.id === moduleFilter) ??
        moduleOptions.find((item) => item.code === moduleFilter);
      const moduleId = moduleFilter === "all" ? undefined : selectedModule?.id ?? moduleFilter;
      const moduleCode = moduleFilter === "all" ? undefined : selectedModule?.code;
      const result = await permissionsService.listPermissions({
        q: searchText,
        status: statusFilter,
        moduleId,
        moduleCode,
        page,
        pageSize,
      });
      setPermissions(result.data);
      setTotal(result.total);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh mục quyền.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText, statusFilter, moduleFilter, moduleOptions]);

  React.useEffect(() => {
    void loadPermissions();
  }, [loadPermissions]);

  React.useEffect(() => {
    void loadModules();
  }, [loadModules]);

  React.useEffect(() => {
    setPage(1);
  }, [searchText, statusFilter, moduleFilter]);

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
      await loadPermissions();
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
      await loadPermissions();
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
      label: `${option.code} - ${option.name}`,
    })),
  ];

  const moduleLabel = (permission: PermissionRecord) => {
    const option =
      moduleOptions.find((item) => item.id === permission.module_id) ??
      moduleOptions.find((item) => item.code === permission.permission_type);
    return option ? `${option.code} - ${option.name}` : permission.permission_type || "-";
  };

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
              <Button icon={<ReloadOutlined />} onClick={() => loadPermissions()}>
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
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    style={{ width: 160 }}
                    options={[
                      { value: "all", label: "Tất cả trạng thái" },
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Ngừng" },
                    ]}
                  />
                  <Select
                    value={moduleFilter}
                    onChange={(value) => setModuleFilter(value)}
                    style={{ width: 220 }}
                    options={moduleOptionsForFilter}
                  />
                </Space>
                <Typography.Text type="secondary">
                  Tổng: <strong>{total}</strong> quyền
                </Typography.Text>
              </Space>

              <Table
                rowKey="id"
                loading={loading}
                dataSource={permissions}
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
                    width: 180,
                    render: (value: string) => <span style={{ fontWeight: 600 }}>{value}</span>,
                  },
                  {
                    title: "Tên quyền",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "Phân hệ/nhóm",
                    key: "module",
                    width: 220,
                    render: (_: unknown, record: PermissionRecord) => moduleLabel(record),
                  },
                  {
                    title: "Mô tả",
                    dataIndex: "description",
                    key: "description",
                    render: (value?: string) => value || "-",
                    ellipsis: true,
                  },
                  {
                    title: "Số vai trò",
                    dataIndex: "role_count",
                    key: "role_count",
                    width: 110,
                    render: (value?: number | null) => value ?? 0,
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
        width={420}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {viewPermission ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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
