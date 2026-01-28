import { Button, Form, Input, InputNumber, Select, Space, Switch, Tabs } from "antd";
import * as React from "react";
import type { MenuRecord, ModuleRecord, PermissionFilter, PermissionRecord } from "../menu.types";
import { AssignedPermissionsTable } from "./AssignedPermissionsTable";
import { PermissionPickerTable } from "./PermissionPickerTable";
import { RolePreviewTree } from "./RolePreviewTree";
import { MenuHistoryTable } from "./MenuHistoryTable";

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
  pickerFilters?: PermissionFilter;
  onPickerFilterChange?: (next: Partial<PermissionFilter>) => void;
  onPickerSelect?: (ids: string[]) => void;
  onPickerPageChange?: (page: number, pageSize: number) => void;
  onAssignSelected?: () => void;
  onRemoveAssigned?: (permissionId: string) => void;
  previewTreeData?: any[];
  previewRoles?: Array<{ _id: string; name: string }>;
  previewRoleId?: string;
  onPreviewRoleChange?: (roleId?: string) => void;
  historyData?: any[];
  historyLoading?: boolean;
  smartRouteOnly?: boolean;
  suggestedResource?: string;
  onToggleSmartRoute?: (checked: boolean) => void;
  onApplySuggested?: () => void;
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
  pickerFilters,
  onPickerFilterChange,
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
  smartRouteOnly,
  suggestedResource,
  onToggleSmartRoute,
  onApplySuggested,
}) => {
  const [form] = Form.useForm();
  const [metaText, setMetaText] = React.useState<string>("{}");
  const [metaError, setMetaError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (menu) {
      form.setFieldsValue({
        code: menu.code,
        label: menu.label,
        route_path: menu.route_path,
        module_id: menu.module_id ?? undefined,
        icon: menu.icon,
        sort_order: menu.sort_order ?? 0,
        is_visible: menu.is_visible ?? true,
      });
      setMetaText(menu.meta ? JSON.stringify(menu.meta, null, 2) : "{}");
      setMetaError(null);
    } else {
      form.resetFields();
      setMetaText("{}");
      setMetaError(null);
    }
  }, [menu, form]);

  const handleSubmit = (values: any) => {
    onSaveMenu?.({
      code: values.code,
      label: values.label,
      route_path: values.route_path,
      module_id: values.module_id ?? null,
      icon: values.icon ?? null,
      sort_order: values.sort_order ?? 0,
      is_visible: values.is_visible ?? true,
    });
  };

  return (
    <Tabs
      items={[
        {
          key: "info",
          label: "Thông tin",
          children: (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <Space style={{ width: "100%" }} size={16} align="start">
                  <Form.Item
                    label="Mã menu"
                    name="code"
                    rules={[{ required: true, message: "Nhập mã menu" }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="vd: admin-users" />
                  </Form.Item>
                  <Form.Item
                    label="Tên hiển thị"
                    name="label"
                    rules={[{ required: true, message: "Nhập tên menu" }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="Tên menu" />
                  </Form.Item>
                </Space>
                <Space style={{ width: "100%" }} size={16} align="start">
                  <Form.Item label="Route/path" name="route_path" style={{ flex: 1 }}>
                    <Input placeholder="/system-admin/iam/users" />
                  </Form.Item>
                  <Form.Item label="Phân hệ" name="module_id" style={{ flex: 1 }}>
                    <Select
                      allowClear
                      placeholder="Chọn phân hệ"
                      options={modules.map((mod) => ({
                        label: `${mod.name} (${mod.code})`,
                        value: mod._id,
                      }))}
                    />
                  </Form.Item>
                </Space>
                <Space style={{ width: "100%" }} size={16} align="start">
                  <Form.Item label="Icon" name="icon" style={{ flex: 1 }}>
                    <Input placeholder="Icon key" />
                  </Form.Item>
                  <Form.Item label="Thứ tự" name="sort_order" style={{ flex: 1 }}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Space>
                <Form.Item label="Hiển thị" name="is_visible" valuePropName="checked">
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
            <div style={{ display: "grid", gap: 16 }}>
              <Space wrap>
                <Input
                  placeholder="Tìm theo mã/tên/mô tả..."
                  value={pickerFilters?.search}
                  onChange={(event) => onPickerFilterChange?.({ search: event.target.value, page: 1 })}
                  style={{ minWidth: 220 }}
                />
                <Select
                  placeholder="Phân hệ"
                  value={pickerFilters?.moduleId}
                  onChange={(value) => onPickerFilterChange?.({ moduleId: value, page: 1 })}
                  allowClear
                  options={modules.map((mod) => ({
                    label: mod.name,
                    value: mod._id,
                  }))}
                  style={{ minWidth: 180 }}
                />
                <Select
                  placeholder="Category"
                  value={pickerFilters?.category}
                  onChange={(value) => onPickerFilterChange?.({ category: value, page: 1 })}
                  options={[
                    { label: "PAGE", value: "PAGE" },
                    { label: "FEATURE", value: "FEATURE" },
                  ]}
                  style={{ minWidth: 140 }}
                />
                <Select
                  placeholder="Action"
                  value={pickerFilters?.action}
                  onChange={(value) => onPickerFilterChange?.({ action: value, page: 1 })}
                  options={[
                    { label: "READ", value: "READ" },
                    { label: "CREATE", value: "CREATE" },
                    { label: "UPDATE", value: "UPDATE" },
                    { label: "DELETE", value: "DELETE" },
                    { label: "EXPORT", value: "EXPORT" },
                    { label: "RESTORE", value: "RESTORE" },
                  ]}
                  style={{ minWidth: 140 }}
                />
                <Select
                  placeholder="Resource"
                  value={pickerFilters?.resource}
                  onChange={(value) => onPickerFilterChange?.({ resource: value, page: 1 })}
                  allowClear
                  options={Array.from(
                    new Set(
                      pickerData
                        .map((perm) => perm.resource)
                        .filter(Boolean)
                        .map((res) => String(res)),
                    ),
                  ).map((res) => ({ label: res, value: res }))}
                  style={{ minWidth: 160 }}
                />
                <Select
                  placeholder="Trạng thái"
                  value={pickerFilters?.status ?? "active"}
                  onChange={(value) => onPickerFilterChange?.({ status: value, page: 1 })}
                  options={[
                    { label: "Hoạt động", value: "active" },
                    { label: "Ngừng", value: "inactive" },
                    { label: "Tất cả", value: "all" },
                  ]}
                  style={{ minWidth: 140 }}
                />
                <Space>
                  <Switch checked={smartRouteOnly} onChange={(checked) => onToggleSmartRoute?.(checked)} />
                  <span>Gợi ý theo route</span>
                </Space>
                <Button onClick={onApplySuggested} disabled={!suggestedResource}>
                  Chọn gợi ý
                </Button>
                {suggestedResource ? (
                  <span style={{ color: "#1677ff" }}>Gợi ý: {suggestedResource}</span>
                ) : null}
              </Space>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                <AssignedPermissionsTable data={assignedPermissions} onRemove={onRemoveAssigned} />
                <PermissionPickerTable
                  data={pickerData}
                  loading={pickerLoading}
                  total={pickerTotal}
                  page={pickerPage}
                  pageSize={pickerPageSize}
                  selectedIds={pickerSelectedIds}
                  onSelectChange={onPickerSelect}
                  onPageChange={onPickerPageChange}
                  onBulkAssign={onAssignSelected}
                />
              </div>
            </div>
          ),
        },
        {
          key: "preview",
          label: "Preview theo vai trò",
          children: (
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
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
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
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
                    onSaveMenu?.({ meta: parsed });
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
  );
};
