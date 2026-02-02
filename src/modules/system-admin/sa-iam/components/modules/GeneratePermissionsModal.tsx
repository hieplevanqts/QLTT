import React from "react";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tabs,
  Typography,
  message,
  notification,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/api/supabaseClient";
import { CenteredModalShell } from "@/components/overlays/CenteredModalShell";
import { EnterpriseModalHeader } from "@/components/overlays/EnterpriseModalHeader";
import type { ModuleRecord } from "../../services/modules.service";
import { permissionsService } from "../../services/permissions.service";

type PageRow = {
  name?: string;
  routeKey?: string;
  path?: string;
};

type FormValues = {
  pages?: PageRow[];
};

type GeneratePermissionsModalProps = {
  open: boolean;
  module: ModuleRecord | null;
  onClose: () => void;
  onGenerated: () => void;
};

const ACTION_CANDIDATES = [
  "READ",
  "CREATE",
  "UPDATE",
  "DELETE",
  "EXPORT",
  "ASSIGN",
  "APPROVE",
];

const AREA_OPTIONS = [
  { label: "iam", value: "iam" },
  { label: "masterdata", value: "masterdata" },
  { label: "system_config", value: "system_config" },
];

const isRouteKeyValid = (value: string) =>
  !/\s/.test(value) && !value.endsWith(".");

const isResourceValid = (value: string) =>
  Boolean(value) && !/\s/.test(value) && !value.endsWith(".");

const normalizeKey = (value: string) => value.trim().toLowerCase();

const isPresetTokenValid = (value: string) =>
  Boolean(value) && /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(value) && !value.endsWith(".");

export function GeneratePermissionsModal({
  open,
  module,
  onClose,
  onGenerated,
}: GeneratePermissionsModalProps) {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("pages");
  const [hasLanding, setHasLanding] = React.useState(true);
  const [generateCrud, setGenerateCrud] = React.useState(false);
  const [featureResources, setFeatureResources] = React.useState<string[]>([]);
  const [featureActions, setFeatureActions] = React.useState<string[]>([]);
  const [actionOptions, setActionOptions] = React.useState<string[]>([]);
  const [presetArea, setPresetArea] = React.useState("iam");
  const [presetEntities, setPresetEntities] = React.useState<string[]>([]);
  const [presetActions, setPresetActions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const pagesValue = Form.useWatch("pages", form) ?? [];
  const moduleKey = module?.key ?? "";

  React.useEffect(() => {
    if (!open) return;
    form.resetFields();
    setHasLanding(true);
    setGenerateCrud(false);
    setFeatureResources([]);
    setFeatureActions([]);
    setPresetArea("iam");
    setPresetEntities([]);
    setPresetActions([]);
    setActiveTab("pages");
    const loadActions = async () => {
      try {
        const actions = await permissionsService.listPermissionActionCatalog();
        const allowed = actions.map((item) => item.code.toUpperCase()).filter(Boolean);
        if (allowed.length) {
          setActionOptions(Array.from(new Set(allowed)));
        } else {
          setActionOptions(ACTION_CANDIDATES);
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Không thể tải danh sách action.";
        message.error(msg);
        setActionOptions(ACTION_CANDIDATES);
      }
    };
    void loadActions();
  }, [form, open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!module?.id || !moduleKey) {
      message.error("Thiếu thông tin phân hệ.");
      return;
    }

    try {
      setLoading(true);
      const values = await form.validateFields();
      const pages = (values.pages ?? []).filter(
        (row) => row?.name || row?.routeKey || row?.path,
      );

      const rows: Record<string, unknown>[] = [];
      const codes = new Set<string>();

      if (hasLanding) {
        const code = `${moduleKey}.page.read`.toLowerCase();
        if (!codes.has(code)) {
          rows.push({
            module_id: module.id,
            module: moduleKey,
            code,
            name: `Trang ${module.name || moduleKey}`,
            resource: "page",
            action: "READ",
            permission_type: "READ",
            category: "PAGE",
            status: 1,
          });
          codes.add(code);
        }
      }

      for (const page of pages) {
        const pageName = String(page?.name ?? "").trim();
        const routeKey = String(page?.routeKey ?? "").trim();
        const pathValue = String(page?.path ?? "").trim();

        if (!pageName || !routeKey) {
          throw new Error("Vui lòng nhập đầy đủ tên + routeKey cho trang.");
        }
        if (!isRouteKeyValid(routeKey)) {
          throw new Error("routeKey không hợp lệ (không có khoảng trắng, không kết thúc bằng '.').");
        }

        const resource = `page.${routeKey}`;
        const code = `${moduleKey}.page.${routeKey}.read`.toLowerCase();
        if (codes.has(code)) continue;

        rows.push({
          module_id: module.id,
          module: moduleKey,
          code,
          name: pageName,
          resource,
          action: "READ",
          permission_type: "READ",
          category: "PAGE",
          status: 1,
          ...(pathValue
            ? {
                meta: {
                  route: { path: pathValue },
                },
              }
            : {}),
        });
        codes.add(code);
      }

      if (generateCrud) {
        if (!featureResources.length) {
          throw new Error("Vui lòng nhập resource cho FEATURE.");
        }
        if (!featureActions.length) {
          throw new Error("Vui lòng chọn action cho FEATURE.");
        }

        const allowedActions = new Set(actionOptions);
        for (const action of featureActions) {
          if (!allowedActions.has(action)) {
            throw new Error(`Action ${action} không hợp lệ.`);
          }
        }

        for (const rawResource of featureResources) {
          const resource = rawResource.trim();
          if (!isResourceValid(resource)) {
            throw new Error(
              "Resource FEATURE không hợp lệ (không có khoảng trắng, không kết thúc bằng '.').",
            );
          }
          for (const action of featureActions) {
            const code = `${moduleKey}.${resource}.${action.toLowerCase()}`.toLowerCase();
            if (codes.has(code)) continue;
            rows.push({
              module_id: module.id,
              module: moduleKey,
              code,
              name: `${resource} ${action}`,
              resource,
              action,
              permission_type: action,
              category: "FEATURE",
              status: 1,
            });
            codes.add(code);
          }
        }
      }

      if (!rows.length) {
        message.warning("Không có quyền nào để sinh.");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("permissions")
        .upsert(rows, { onConflict: "code" });

      if (error) {
        throw new Error(error.message || "Không thể sinh quyền.");
      }

      notification.success({
        message: "Đã sinh quyền",
        description: `Đã tạo/cập nhật ${rows.length} quyền cho ${moduleKey}.`,
        btn: (
          <Button
            type="link"
            onClick={() =>
              navigate(`/system-admin/iam/permissions?module=${encodeURIComponent(moduleKey)}`)
            }
          >
            Xem quyền
          </Button>
        ),
      });

      onGenerated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể sinh quyền.";
      message.error(msg);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const handlePresetSubmit = async () => {
    if (!module?.id || !moduleKey) {
      message.error("Thiếu thông tin phân hệ.");
      return;
    }

    try {
      setLoading(true);
      const areaValue = normalizeKey(presetArea);
      if (!isPresetTokenValid(areaValue)) {
        throw new Error("Area không hợp lệ (chỉ lowercase, không khoảng trắng, không kết thúc bằng '.').");
      }

      if (!presetEntities.length) {
        throw new Error("Vui lòng nhập entity.");
      }

      if (!presetActions.length) {
        throw new Error("Vui lòng chọn action.");
      }

      const allowedActions = new Set(actionOptions);
      for (const action of presetActions) {
        if (!allowedActions.has(action)) {
          throw new Error(`Action ${action} không hợp lệ.`);
        }
      }

      const rows: Record<string, unknown>[] = [];
      const codes = new Set<string>();
      const normalizedEntities = presetEntities
        .map((entity) => normalizeKey(entity))
        .filter(Boolean);

      for (const entity of normalizedEntities) {
        if (!isPresetTokenValid(entity)) {
          throw new Error(
            "Entity không hợp lệ (chỉ lowercase, không khoảng trắng, không kết thúc bằng '.').",
          );
        }
        const resource = `${areaValue}.${entity}`;
        for (const action of presetActions) {
          const code = `${moduleKey}.${resource}.${action.toLowerCase()}`.toLowerCase();
          if (codes.has(code)) continue;
          rows.push({
            module_id: module.id,
            module: moduleKey,
            code,
            name: `${resource} ${action}`,
            category: "FEATURE",
            resource,
            action,
            permission_type: action,
            status: 1,
          });
          codes.add(code);
        }
      }

      if (!rows.length) {
        message.warning("Không có quyền nào để tạo.");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("permissions")
        .upsert(rows, { onConflict: "code" });

      if (error) {
        throw new Error(error.message || "Không thể tạo quyền.");
      }

      notification.success({
        message: "Đã tạo quyền FEATURE",
        description: `Đã tạo/cập nhật ${rows.length} quyền cho ${moduleKey}.`,
        btn: (
          <Button
            type="link"
            onClick={() =>
              navigate(`/system-admin/iam/permissions?module=${encodeURIComponent(moduleKey)}`)
            }
          >
            Xem quyền
          </Button>
        ),
      });

      onGenerated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể tạo quyền.";
      message.error(msg);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const landingPreview = hasLanding && moduleKey
    ? `${moduleKey}.page.read`
    : "";

  const pagePreviews = pagesValue
    .filter((row) => row?.routeKey)
    .map((row) => {
      const routeKey = String(row?.routeKey ?? "").trim();
      if (!routeKey || !isRouteKeyValid(routeKey)) return null;
      return `${moduleKey}.page.${routeKey}.read`;
    })
    .filter(Boolean) as string[];

  const featurePreviews =
    generateCrud && moduleKey
      ? featureResources.flatMap((resource) => {
          const trimmed = resource.trim();
          if (!isResourceValid(trimmed)) return [];
          return featureActions.map(
            (action) => `${moduleKey}.${trimmed}.${action.toLowerCase()}`,
          );
        })
      : [];

  const presetRows = React.useMemo(() => {
    if (!moduleKey) return [];
    const areaValue = normalizeKey(presetArea);
    if (!isPresetTokenValid(areaValue)) return [];
    if (!presetEntities.length || !presetActions.length) return [];
    const normalizedEntities = presetEntities.map((entity) => normalizeKey(entity));
    const allowedActions = new Set(actionOptions);
    const rows = [];
    for (const entity of normalizedEntities) {
      if (!isPresetTokenValid(entity)) continue;
      const resource = `${areaValue}.${entity}`;
      for (const action of presetActions) {
        if (!allowedActions.has(action)) continue;
        rows.push({
          code: `${moduleKey}.${resource}.${action.toLowerCase()}`.toLowerCase(),
          category: "FEATURE",
          resource,
          action,
          permission_type: action,
          module: moduleKey,
        });
      }
    }
    return rows;
  }, [actionOptions, moduleKey, presetActions, presetArea, presetEntities]);

  return (
    <CenteredModalShell
      open={open}
      onClose={handleClose}
      width={900}
      header={
        <EnterpriseModalHeader
          title="Sinh quyền từ phân hệ"
          code={module?.key ?? undefined}
          moduleTag="system-admin"
        />
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} disabled={loading}>
            Đóng
          </Button>
          {activeTab === "preset" ? (
            <Button type="primary" onClick={handlePresetSubmit} loading={loading}>
              Tạo quyền
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Sinh quyền
            </Button>
          )}
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "pages",
            label: "Pages & Features",
            children: (
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div>
                  <Typography.Title level={5}>A) Pages</Typography.Title>
                  <Space align="center">
                    <Switch checked={hasLanding} onChange={setHasLanding} />
                    <Typography.Text>Landing page</Typography.Text>
                  </Space>
                  {hasLanding && landingPreview && (
                    <div className="mt-2 rounded border border-dashed border-slate-200 p-2">
                      <Typography.Text type="secondary" className="text-xs">
                        {landingPreview}
                      </Typography.Text>
                      <Tag className="ml-2" color="blue">
                        resource: page
                      </Tag>
                    </div>
                  )}
                  <Form form={form} layout="vertical">
                    <Form.List name="pages">
                      {(fields, { add, remove }) => (
                        <Space direction="vertical" size="small" style={{ width: "100%" }}>
                          {fields.map((field) => (
                            <div key={field.key} className="rounded border border-slate-200 p-3">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "name"]}
                                  label="Tên trang"
                                  rules={[{ required: true, message: "Nhập tên trang." }]}
                                >
                                  <Input placeholder="vd: Danh sách quyền" />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "routeKey"]}
                                  label="routeKey"
                                  rules={[
                                    { required: true, message: "Nhập routeKey." },
                                    {
                                      validator: (_: unknown, value?: string) => {
                                        const trimmed = String(value ?? "").trim();
                                        if (!trimmed) return Promise.resolve();
                                        if (!isRouteKeyValid(trimmed)) {
                                          return Promise.reject(
                                            new Error("routeKey không hợp lệ."),
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <Input placeholder="iam.permissions" />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "path"]}
                                  label="Path (optional)"
                                >
                                  <Input placeholder="/system-admin/iam/permissions" />
                                </Form.Item>
                              </div>
                              <Button
                                type="link"
                                icon={<DeleteOutlined />}
                                onClick={() => remove(field.name)}
                              >
                                Xóa dòng
                              </Button>
                            </div>
                          ))}
                          <Button icon={<PlusOutlined />} onClick={() => add()}>
                            Thêm trang con
                          </Button>
                        </Space>
                      )}
                    </Form.List>
                  </Form>
                  {pagePreviews.length > 0 && (
                    <div className="mt-3 rounded border border-dashed border-slate-200 p-3">
                      <Typography.Text type="secondary">Preview:</Typography.Text>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {pagePreviews.map((code) => (
                          <Tag key={code} color="blue">
                            {code}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Typography.Title level={5}>B) Features (optional)</Typography.Title>
                  <Space align="center">
                    <Switch checked={generateCrud} onChange={setGenerateCrud} />
                    <Typography.Text>Generate CRUD/Feature</Typography.Text>
                  </Space>
                  {generateCrud && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <Typography.Text strong>Resources</Typography.Text>
                        <Select
                          mode="tags"
                          value={featureResources}
                          onChange={setFeatureResources}
                          placeholder="permissions, roles, users"
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div>
                        <Typography.Text strong>Actions</Typography.Text>
                        {actionOptions.length === 0 ? (
                          <Alert
                            type="warning"
                            showIcon
                            message="Chưa có action trong permission_actions."
                          />
                        ) : (
                          <Checkbox.Group
                            options={actionOptions.map((action) => ({
                              label: action,
                              value: action,
                            }))}
                            value={featureActions}
                            onChange={(values) =>
                              setFeatureActions(values.map((v) => String(v)))
                            }
                          />
                        )}
                      </div>
                      {featurePreviews.length > 0 && (
                        <div className="rounded border border-dashed border-slate-200 p-3">
                          <Typography.Text type="secondary">Preview:</Typography.Text>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {featurePreviews.map((code) => (
                              <Tag key={code} color="gold">
                                {code}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Space>
            ),
          },
          {
            key: "preset",
            label: "FEATURE (Preset)",
            children: (
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Typography.Text strong>Area</Typography.Text>
                    <Select
                      mode="tags"
                      value={presetArea ? [presetArea] : []}
                      onChange={(values) => {
                        const last = values[values.length - 1] ?? "";
                        setPresetArea(normalizeKey(String(last)));
                      }}
                      options={AREA_OPTIONS}
                      placeholder="iam"
                      style={{ width: "100%" }}
                    />
                    <Typography.Text type="secondary" className="text-xs">
                      lowercase, không có khoảng trắng
                    </Typography.Text>
                  </div>
                  <div className="md:col-span-2">
                    <Typography.Text strong>Entities</Typography.Text>
                    <Select
                      mode="tags"
                      value={presetEntities}
                      onChange={(values) =>
                        setPresetEntities(values.map((v) => normalizeKey(String(v))))
                      }
                      placeholder="user, role, catalog"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div>
                  <Typography.Text strong>Actions</Typography.Text>
                  {actionOptions.length === 0 ? (
                    <Alert
                      type="warning"
                      showIcon
                      message="Chưa có action trong permission_actions."
                    />
                  ) : (
                    <Checkbox.Group
                      options={actionOptions.map((action) => ({
                        label: action,
                        value: action,
                      }))}
                      value={presetActions}
                      onChange={(values) =>
                        setPresetActions(values.map((v) => String(v)))
                      }
                    />
                  )}
                </div>

                <div>
                  <Typography.Text strong>Preview</Typography.Text>
                  <Table
                    rowKey="code"
                    size="small"
                    pagination={false}
                    scroll={{ y: 240 }}
                    columns={[
                      { title: "Code", dataIndex: "code", key: "code" },
                      { title: "Category", dataIndex: "category", key: "category" },
                      { title: "Resource", dataIndex: "resource", key: "resource" },
                      { title: "Action", dataIndex: "action", key: "action" },
                      {
                        title: "Permission type",
                        dataIndex: "permission_type",
                        key: "permission_type",
                      },
                      { title: "Module", dataIndex: "module", key: "module" },
                    ]}
                    dataSource={presetRows}
                  />
                </div>
              </Space>
            ),
          },
        ]}
      />
    </CenteredModalShell>
  );
}
