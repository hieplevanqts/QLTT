import React from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";

import type { ModulePayload, ModuleRecord, ModuleStatusValue } from "../../services/modules.service";
import { CenteredModalShell } from "@/components/overlays/CenteredModalShell";
import { EnterpriseModalHeader } from "@/components/overlays/EnterpriseModalHeader";

type ModuleFormModalProps = {
  open: boolean;
  loading?: boolean;
  initialValues?: ModuleRecord | null;
  onCancel: () => void;
  onSubmit: (values: ModulePayload) => Promise<void> | void;
};

type ModuleFormValues = {
  key: string;
  code?: string;
  name: string;
  group: string;
  description?: string | null;
  icon?: string | null;
  status?: ModuleStatusValue;
  sort_order?: number;
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
    .replace(/[\s._]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const KEBAB_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function ModuleFormModal({
  open,
  loading,
  initialValues,
  onCancel,
  onSubmit,
}: ModuleFormModalProps) {
  const [form] = Form.useForm<ModuleFormValues>();
  const [keyTouched, setKeyTouched] = React.useState(false);
  const keyValue = Form.useWatch("key", form);

  React.useEffect(() => {
    if (!open) return;
    if (initialValues) {
      setKeyTouched(true);
      form.setFieldsValue({
        key: initialValues.key,
        code: initialValues.key,
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
    setKeyTouched(false);
    form.setFieldsValue({
      group: "SYSTEM",
      status: 1,
      sort_order: 0,
    });
  }, [form, initialValues, open]);

  React.useEffect(() => {
    if (!open) return;
    const nextKey = String(keyValue ?? "");
    if (form.getFieldValue("code") !== nextKey) {
      form.setFieldValue("code", nextKey);
    }
  }, [form, keyValue, open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const initialKey = initialValues?.key ?? "";
    const rawKey = String(values.key ?? "").trim();
    const normalizedKey =
      !initialValues || rawKey !== initialKey ? toKeySlug(rawKey) : rawKey;

    const payload: ModulePayload = {
      key: normalizedKey,
      name: values.name?.trim() ?? "",
      group: values.group,
      description: values.description?.trim() || null,
      icon: values.icon?.trim() || null,
      sort_order: values.sort_order ?? 0,
      status: (values.status ?? 1) as 0 | 1,
    };

    await onSubmit(payload);
  };

  const isEditing = Boolean(initialValues);
  const initialKey = initialValues?.key ?? "";
  const validateGroup = async (_: unknown, value?: string) => {
    if (!value) throw new Error("Vui lòng chọn nhóm.");
    const valid = GROUP_OPTIONS.some((option) => option.value === value);
    if (!valid) throw new Error("Nhóm không hợp lệ.");
  };
  const validateKey = async (_: unknown, value?: string) => {
    const trimmed = String(value ?? "").trim();
    if (!trimmed) {
      throw new Error("Vui lòng nhập mã phân hệ.");
    }
    if (!KEBAB_PATTERN.test(trimmed)) {
      throw new Error("Mã phân hệ phải ở dạng kebab-case.");
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value ?? "";
    if (!keyTouched) {
      form.setFieldValue("key", toKeySlug(nextName));
    }
  };

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
            { min: 2, message: "Mã phân hệ quá ngắn." },
            { validator: validateKey },
          ]}
          tooltip="Nên dùng dạng slug: iam, user-management, reports..."
        >
          <Input
            placeholder="vd: user-management"
            onChange={() => setKeyTouched(true)}
            onBlur={(e) => {
              const nextValue = e.target.value ?? "";
              if (!isEditing || nextValue !== initialKey) {
                form.setFieldValue("key", toKeySlug(nextValue));
              }
            }}
            autoFocus
          />
        </Form.Item>

        <Form.Item label="Code (readonly)" name="code" tooltip="Code luôn = key">
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label="Tên phân hệ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phân hệ." }]}
        >
          <Input placeholder="vd: Quản trị Người dùng & Phân quyền" onChange={handleNameChange} />
        </Form.Item>

        <Form.Item
          label="Nhóm"
          name="group"
          rules={[{ validator: validateGroup }]}
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

