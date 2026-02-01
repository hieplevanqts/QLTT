import React from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";

import type { ModulePayload, ModuleRecord } from "../../services/modules.service";
import { CenteredModalShell } from "@/components/overlays/CenteredModalShell";
import { EnterpriseModalHeader } from "@/components/overlays/EnterpriseModalHeader";

type ModuleFormModalProps = {
  open: boolean;
  loading?: boolean;
  initialValues?: ModuleRecord | null;
  onCancel: () => void;
  onSubmit: (values: ModulePayload) => Promise<void> | void;
};

const GROUP_OPTIONS = [
  { label: "IAM", value: "IAM" },
  { label: "DMS", value: "DMS" },
  { label: "OPS", value: "OPS" },
  { label: "SYSTEM", value: "SYSTEM" },
];

const STATUS_OPTIONS = [
  { label: "Hoạt động", value: 1 },
  { label: "Ngừng", value: 0 },
];

const toKeySlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

export function ModuleFormModal({
  open,
  loading,
  initialValues,
  onCancel,
  onSubmit,
}: ModuleFormModalProps) {
  const [form] = Form.useForm<ModulePayload>();

  React.useEffect(() => {
    if (!open) return;
    if (initialValues) {
      form.setFieldsValue({
        key: initialValues.key,
        name: initialValues.name,
        group: initialValues.group || "SYSTEM",
        description: initialValues.description ?? null,
        icon: initialValues.icon ?? null,
        status: initialValues.status ?? 1,
        sort_order: initialValues.sort_order ?? 0,
      });
      return;
    }
    form.resetFields();
    form.setFieldsValue({
      group: "SYSTEM",
      status: 1,
      sort_order: 0,
    });
  }, [form, initialValues, open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit({
      ...values,
      key: toKeySlug(values.key),
      sort_order: values.sort_order ?? 0,
      status: (values.status ?? 1) as 0 | 1,
    });
  };

  const isEditing = Boolean(initialValues);

  return (
    <CenteredModalShell
      open={open}
      onClose={onCancel}
      width={760}
      header={
        <EnterpriseModalHeader
          title={isEditing ? "Cập nhật phân hệ" : "Thêm phân hệ"}
          badgeStatus={
            isEditing
              ? initialValues?.status === 1
                ? "success"
                : "default"
              : "default"
          }
          statusLabel={
            isEditing
              ? initialValues?.status === 1
                ? "Hoạt động"
                : "Ngừng"
              : undefined
          }
          code={isEditing ? initialValues?.key ?? undefined : undefined}
          moduleTag="system-admin"
        />
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} disabled={loading}>
            Đóng
          </Button>
          <Button type="primary" onClick={handleOk} loading={loading}>
            {isEditing ? "Lưu" : "Tạo"}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" disabled={loading}>
        <Form.Item
          label="Mã phân hệ (key)"
          name="key"
          rules={[
            { required: true, message: "Vui lòng nhập mã phân hệ." },
            { min: 2, message: "Mã phân hệ quá ngắn." },
          ]}
          tooltip="Nên dùng dạng slug: iam, user-management, reports..."
        >
          <Input
            placeholder="vd: user-management"
            onBlur={(e) => form.setFieldValue("key", toKeySlug(e.target.value))}
            autoFocus
          />
        </Form.Item>

        <Form.Item
          label="Tên phân hệ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phân hệ." }]}
        >
          <Input placeholder="vd: Quản trị Người dùng & Phân quyền" />
        </Form.Item>

        <Form.Item
          label="Nhóm"
          name="group"
          rules={[{ required: true, message: "Vui lòng chọn nhóm." }]}
        >
          <Select options={GROUP_OPTIONS} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Mô tả ngắn về phân hệ..." />
        </Form.Item>

        <Form.Item label="Icon" name="icon">
          <Input placeholder="vd: UserOutlined" />
        </Form.Item>

        <Form.Item label="Thứ tự hiển thị" name="sort_order">
          <InputNumber min={0} step={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select options={STATUS_OPTIONS} />
        </Form.Item>
      </Form>
    </CenteredModalShell>
  );
}

