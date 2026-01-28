/**
 * MENUS PAGE - Menu Builder (IAM)
 * Permission: sa.iam.menu.read
 */

import React from "react";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Tree,
  Typography,
} from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import {
  DeleteOutlined,
  MenuOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import PageHeader from "@/layouts/PageHeader";
import { PermissionGate, usePermissions } from "../../_shared";
import { filterRouteRegistry } from "@/route-registry";
import { menuRepo } from "../menu/menu.repo";
import type { MenuPermissionRecord, MenuRecord } from "../menu/menu.types";
import { buildMenuTree, filterMenuTreeByPermissions, isMenuActive, sortMenuNodes, toPermissionCodeSet } from "../menu/menu.utils";
import PermissionPickerPanel from "../menu/PermissionPickerPanel";

type RoleOption = {
  _id: string;
  code: string;
  name: string;
  status?: number | string | null;
};

type ModuleOption = {
  _id: string;
  code: string;
  name: string;
  group?: string | null;
};

type MenuTreeDataNode = DataNode & { menu: MenuRecord };

type MenuFormValues = {
  code: string;
  label: string;
  parent_id?: string | null;
  module_id?: string | null;
  route_path?: string | null;
  icon?: string | null;
  sort_order?: number | null;
  status?: string | number | null;
  is_visible?: boolean;
};

const EMPTY_FORM: MenuFormValues = {
  code: "",
  label: "",
  parent_id: null,
  module_id: null,
  route_path: null,
  icon: null,
  sort_order: 0,
  status: "ACTIVE",
  is_visible: true,
};

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Hoạt động", value: "active" },
  { label: "Ngừng", value: "inactive" },
];

const normalizeStatusLabel = (value?: string | number | null) =>
  isMenuActive(value) ? "Hoạt động" : "Ngừng";

const normalizeStatusTag = (value?: string | number | null) =>
  isMenuActive(value) ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng</Tag>;

const highlightText = (text: string, search: string) => {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: "#ffd666" }}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
};

export default function MenusPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [menus, setMenus] = React.useState<MenuRecord[]>([]);
  const [selectedMenuId, setSelectedMenuId] = React.useState<string | null>(null);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("edit");
  const [form] = Form.useForm<MenuFormValues>();
  const selectedModuleId = Form.useWatch("module_id", form);
  const routePathValue = Form.useWatch("route_path", form);

  const [treeSearch, setTreeSearch] = React.useState("");
  const [treeStatusFilter, setTreeStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [treeModuleFilter, setTreeModuleFilter] = React.useState<string | null>(null);

  const [modules, setModules] = React.useState<ModuleOption[]>([]);
  const [selectedPermissionId, setSelectedPermissionId] = React.useState<string | null>(null);
  const [selectedPermission, setSelectedPermission] = React.useState<MenuPermissionRecord | null>(null);
  const [allowCrossModule, setAllowCrossModule] = React.useState(false);

  const [roles, setRoles] = React.useState<RoleOption[]>([]);
  const [previewRoleId, setPreviewRoleId] = React.useState<string | null>(null);
  const [previewPermissionCodes, setPreviewPermissionCodes] = React.useState<Set<string>>(new Set());
  const [previewLoading, setPreviewLoading] = React.useState(false);

  const canCreate = hasPermission("sa.iam.menu.create");
  const canUpdate = hasPermission("sa.iam.menu.update");
  const canDelete = hasPermission("sa.iam.menu.delete");

  const selectedMenu = React.useMemo(
    () => menus.find((menu) => menu._id === selectedMenuId) ?? null,
    [menus, selectedMenuId],
  );

  const loadMenus = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuRepo.listMenus({ status: "all" });
      setMenus(data);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tải menu.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadModules = React.useCallback(async () => {
    try {
      const data = await menuRepo.listModules();
      setModules(data.map((row) => ({
        _id: row._id,
        code: row.code,
        name: row.name,
        group: row.group ?? null,
      })));
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tải phân hệ.");
    }
  }, []);

  const loadRoles = React.useCallback(async () => {
    try {
      const data = await menuRepo.listRoles();
      setRoles(
        data.map((row) => ({
          _id: row._id,
          code: row.code,
          name: row.name,
          status: row.status ?? null,
        })),
      );
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tải danh sách vai trò.");
    }
  }, []);

  React.useEffect(() => {
    void loadMenus();
    void loadModules();
    void loadRoles();
  }, [loadMenus, loadModules, loadRoles]);

  React.useEffect(() => {
    if (!selectedMenu) {
      form.resetFields();
      form.setFieldsValue(EMPTY_FORM);
      setSelectedPermissionId(null);
      setSelectedPermission(null);
      setAllowCrossModule(false);
      setFormMode("create");
      return;
    }
    form.setFieldsValue({
      code: selectedMenu.code,
      label: selectedMenu.label,
      parent_id: selectedMenu.parent_id ?? null,
      module_id: selectedMenu.module_id ?? null,
      route_path: selectedMenu.route_path ?? null,
      icon: selectedMenu.icon ?? null,
      sort_order: selectedMenu.sort_order ?? 0,
      status: selectedMenu.status ?? "ACTIVE",
      is_visible: selectedMenu.is_visible ?? true,
    });
    setSelectedPermissionId(selectedMenu.permission_ids?.[0] ?? null);
    setSelectedPermission(null);
    setAllowCrossModule(false);
    setFormMode("edit");
  }, [selectedMenu, form]);

  const filteredTreeData = React.useMemo(() => {
    const tree = buildMenuTree(menus);
    const search = treeSearch.trim().toLowerCase();
    const statusFilter = treeStatusFilter;
    const moduleFilter = treeModuleFilter;

    const filterNode = (node: typeof tree[number]): typeof node | null => {
      const matchesSearch =
        !search ||
        node.code.toLowerCase().includes(search) ||
        node.label.toLowerCase().includes(search) ||
        (node.route_path ?? "").toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isMenuActive(node.status)) ||
        (statusFilter === "inactive" && !isMenuActive(node.status));

      const matchesModule = !moduleFilter || node.module_id === moduleFilter;

      const filteredChildren = node.children
        .map(filterNode)
        .filter((child): child is typeof node => Boolean(child));

      if ((matchesSearch && matchesStatus && matchesModule) || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };

    return tree.map(filterNode).filter((node): node is typeof tree[number] => Boolean(node));
  }, [menus, treeSearch, treeStatusFilter, treeModuleFilter]);

  const toTreeDataNodes = React.useCallback(
    (nodes: typeof filteredTreeData): MenuTreeDataNode[] =>
      nodes.map((node) => ({
        key: node._id,
        title: (
          <Space size={6}>
            <MenuOutlined />
            <span>{node.label}</span>
            {node.route_path && <Tag color="blue">{node.route_path}</Tag>}
          </Space>
        ),
        menu: node,
        children: toTreeDataNodes(node.children),
      })),
    [],
  );

  const treeData = React.useMemo<MenuTreeDataNode[]>(
    () => toTreeDataNodes(filteredTreeData),
    [filteredTreeData, toTreeDataNodes],
  );

  const parentTreeOptions = React.useMemo<MenuTreeDataNode[]>(
    () => {
      const build = (nodes: ReturnType<typeof buildMenuTree>): MenuTreeDataNode[] =>
        nodes
          .filter((node) => node._id !== selectedMenuId)
          .map((node) => ({
            key: node._id,
            value: node._id,
            title: node.label,
            menu: node,
            children: build(node.children),
          }));
      return build(buildMenuTree(menus));
    },
    [menus, selectedMenuId],
  );

  const handlePermissionSelection = (permissionId: string | null, permission: MenuPermissionRecord | null) => {
    setSelectedPermissionId(permissionId);
    setSelectedPermission(permission);
  };

  const handleSelectMenu = (selectedKeys: React.Key[]) => {
    const nextId = selectedKeys[0] as string | undefined;
    if (!nextId) {
      setSelectedMenuId(null);
      return;
    }
    setSelectedMenuId(nextId);
  };

  const isDescendant = React.useCallback(
    (parentId: string | null, dragId: string) => {
      if (!parentId) return false;
      const map = new Map(menus.map((menu) => [menu._id, menu]));
      let current: string | null = parentId;
      while (current) {
        if (current === dragId) return true;
        const next = map.get(current)?.parent_id ?? null;
        current = next;
      }
      return false;
    },
    [menus],
  );

  const handleDrop: TreeProps["onDrop"] = async (info) => {
    const dragNode = info.dragNode as MenuTreeDataNode;
    const dropNode = info.node as MenuTreeDataNode;
    const dragId = dragNode.key as string;
    const dropId = dropNode.key as string;

    if (dragId === dropId) return;

    const dropParentId = info.dropToGap ? dropNode.menu.parent_id ?? null : dropNode.menu._id;
    if (isDescendant(dropParentId, dragId)) {
      message.warning("Không thể chuyển menu vào chính nhánh con của nó.");
      return;
    }

    const siblings = menus
      .filter((menu) => (menu.parent_id ?? null) === dropParentId && menu._id !== dragId)
      .sort(sortMenuNodes);

    let targetIndex = siblings.findIndex((menu) => menu._id === dropId);
    if (targetIndex === -1) {
      targetIndex = siblings.length;
    } else if (info.dropToGap && info.dropPosition > 0) {
      targetIndex += 1;
    }

    try {
      await menuRepo.moveMenu({ dragId, dropParentId, targetIndex });
      await loadMenus();
      message.success("Đã cập nhật vị trí menu.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể cập nhật menu.");
    }
  };

  const handleCreate = (mode: "root" | "child" | "sibling") => {
    if (mode !== "root" && !selectedMenu) {
      message.info("Vui lòng chọn menu trước.");
      return;
    }
    const parentId =
      mode === "child"
        ? selectedMenu?._id ?? null
        : mode === "sibling"
          ? selectedMenu?.parent_id ?? null
          : null;
    form.resetFields();
    form.setFieldsValue({
      ...EMPTY_FORM,
      parent_id: parentId,
      sort_order: 0,
    });
    setPermissionSelection([]);
    setSelectedMenuId(null);
    setFormMode("create");
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const isPageMenu = Boolean(values.route_path?.trim());

      if (!isPageMenu && selectedPermissionId) {
        message.error("Menu nhóm không được gán quyền hiển thị.");
        return;
      }

      if (isPageMenu && selectedPermission) {
        const category = String(selectedPermission.category ?? "").toUpperCase();
        const action = String(selectedPermission.action ?? "").toUpperCase();
        const code = selectedPermission.code?.toLowerCase() ?? "";
        const codeAction = code.split(".").pop() ?? code.split(":").pop() ?? "";
        const actionKey = action || codeAction.toUpperCase();
        if (category && category !== "PAGE") {
          message.error("Quyền hiển thị phải có category = PAGE.");
          return;
        }
        if (actionKey && !["READ", "VIEW"].includes(actionKey)) {
          message.error("Quyền hiển thị phải là READ/VIEW.");
          return;
        }
      }

      if (
        isPageMenu &&
        selectedPermissionId &&
        selectedPermission?.module_id &&
        values.module_id &&
        selectedPermission.module_id !== values.module_id &&
        !allowCrossModule
      ) {
        message.error("Quyền thuộc phân hệ khác menu. Bật 'Cho phép ngoại lệ' để lưu.");
        return;
      }

      setSaving(true);
      let saved: MenuRecord | null = null;
      if (formMode === "create") {
        saved = await menuRepo.createMenu(values);
      } else if (selectedMenuId) {
        saved = await menuRepo.updateMenu(selectedMenuId, values);
      }

      if (saved) {
        const permissionIds = isPageMenu && selectedPermissionId ? [selectedPermissionId] : [];
        await menuRepo.setMenuPermissions(saved._id, permissionIds);
        await loadMenus();
        window.dispatchEvent(new Event("mappa:menu-refresh"));
        setSelectedMenuId(saved._id);
        setFormMode("edit");
        message.success("Đã lưu menu.");
      }
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMenuId) return;
    try {
      await menuRepo.softDeleteMenu(selectedMenuId);
      setSelectedMenuId(null);
      await loadMenus();
      window.dispatchEvent(new Event("mappa:menu-refresh"));
      message.success("Đã xóa menu.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể xóa menu.");
    }
  };

  const handlePreviewRoleChange = async (roleId: string | null) => {
    setPreviewRoleId(roleId);
    if (!roleId) {
      setPreviewPermissionCodes(new Set());
      return;
    }
    setPreviewLoading(true);
    try {
      const codes = await menuRepo.listRolePermissionCodes(roleId);
      setPreviewPermissionCodes(toPermissionCodeSet(codes));
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tải quyền vai trò.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const previewTree = React.useMemo(() => {
    if (!previewRoleId) return [];
    const tree = buildMenuTree(menus);
    return filterMenuTreeByPermissions(tree, previewPermissionCodes);
  }, [menus, previewRoleId, previewPermissionCodes]);

  const routeOptions = React.useMemo(() => {
    const moduleKey = modules.find((item) => item._id === selectedModuleId)?.code;
    return filterRouteRegistry({
      moduleKey: moduleKey || undefined,
      search: routePathValue ?? undefined,
    }).map((route) => ({
      value: route.path,
      label: `${route.label} (${route.path})`,
    }));
  }, [modules, selectedModuleId, routePathValue]);

  return (
    <PermissionGate permission="sa.iam.menu.read">
      <PageHeader
        title="Quản lý Menu"
        description="Quản lý cấu trúc menu, phân hệ, route và phân quyền hiển thị"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Quản trị hệ thống", href: "/system-admin" },
          { label: "IAM", href: "/system-admin/iam" },
          { label: "Menu" },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => void loadMenus()}>
              Làm mới
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleCreate("root")} disabled={!canCreate}>
              Thêm menu
            </Button>
          </Space>
        }
      />

      <Row gutter={16}>
        <Col span={8}>
          <Card
            title="Cây Menu"
            extra={
              <Space>
                <Button size="small" onClick={() => handleCreate("child")} disabled={!canCreate}>
                  Thêm con
                </Button>
                <Button size="small" onClick={() => handleCreate("sibling")} disabled={!canCreate}>
                  Thêm ngang
                </Button>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <Input.Search
                placeholder="Tìm theo mã/nhãn/route..."
                value={treeSearch}
                onChange={(e) => setTreeSearch(e.target.value)}
                allowClear
              />
              <Space>
                <Select
                  style={{ flex: 1 }}
                  value={treeStatusFilter}
                  options={statusOptions}
                  onChange={(value) => setTreeStatusFilter(value)}
                />
                <Select
                  style={{ flex: 1 }}
                  placeholder="Tất cả phân hệ"
                  allowClear
                  value={treeModuleFilter ?? undefined}
                  onChange={(value) => setTreeModuleFilter(value ?? null)}
                  options={modules.map((item) => ({
                    label: `${item.name} (${item.code})`,
                    value: item._id,
                  }))}
                />
              </Space>
              <Tree
                blockNode
                draggable
                onDrop={handleDrop}
                onSelect={handleSelectMenu}
                selectedKeys={selectedMenuId ? [selectedMenuId] : []}
                treeData={treeData}
                height={520}
              />
            </Space>
          </Card>
        </Col>

        <Col span={16}>
          <Card
            title="Chi tiết menu"
            extra={
              <Space>
                {selectedMenu && (
                  <Tooltip title="Xóa menu">
                    <Popconfirm
                      title="Xóa menu này?"
                      okText="Xóa"
                      cancelText="Hủy"
                      onConfirm={handleDelete}
                      disabled={!canDelete}
                    >
                      <Button danger icon={<DeleteOutlined />} disabled={!canDelete}>
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                )}
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saving}
                  onClick={handleSave}
                  disabled={!canUpdate && formMode === "edit"}
                >
                  {formMode === "create" ? "Tạo menu" : "Lưu thay đổi"}
                </Button>
              </Space>
            }
          >
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Mã menu"
                    name="code"
                    rules={[{ required: true, message: "Nhập mã menu." }]}
                  >
                    <Input disabled={formMode === "edit"} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tên hiển thị"
                    name="label"
                    rules={[{ required: true, message: "Nhập tên hiển thị." }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Menu cha" name="parent_id">
                    <Select
                      allowClear
                      placeholder="Menu gốc"
                      options={parentTreeOptions.map((node) => ({
                        value: node.key as string,
                        label: node.menu.label,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phân hệ" name="module_id">
                    <Select
                      allowClear
                      placeholder="Chọn phân hệ"
                      options={modules.map((item) => ({
                        label: `${item.name} (${item.code})`,
                        value: item._id,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Route/path" name="route_path">
                    <AutoComplete options={routeOptions} placeholder="/system-admin/iam/users">
                      <Input />
                    </AutoComplete>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Icon" name="icon">
                    <Input placeholder="Icon key (lucide/antd)" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Thứ tự" name="sort_order">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Trạng thái" name="status">
                    <Select
                      options={[
                        { label: "Hoạt động", value: "ACTIVE" },
                        { label: "Ngừng", value: "INACTIVE" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Hiển thị" name="is_visible" valuePropName="checked">
                    <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card
            title="Quyền hiển thị"
            style={{ marginTop: 16 }}
          >
            <PermissionPickerPanel
              menu={selectedMenu}
              modules={modules}
              selectedPermissionId={selectedPermissionId}
              onSelectionChange={handlePermissionSelection}
              allowCrossModule={allowCrossModule}
              onAllowCrossModuleChange={setAllowCrossModule}
            />
          </Card>

          <Card
            title="Preview theo vai trò"
            extra={
              <Select
                allowClear
                placeholder="Chọn vai trò"
                style={{ minWidth: 240 }}
                loading={previewLoading}
                value={previewRoleId ?? undefined}
                onChange={(value) => void handlePreviewRoleChange(value ?? null)}
                options={roles.map((role) => ({
                  value: role._id,
                  label: `${role.name} (${role.code})`,
                }))}
              />
            }
            style={{ marginTop: 16 }}
          >
            {!previewRoleId ? (
              <Typography.Text type="secondary">Chọn vai trò để xem menu tương ứng.</Typography.Text>
            ) : (
              <Tree blockNode treeData={toTreeDataNodes(previewTree)} height={260} />
            )}
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }} title="Danh sách menu (bảng)">
        <Table
          bordered
          size="middle"
          rowKey={(row) => row._id}
          dataSource={menus}
          columns={[
            {
              title: "Mã",
              dataIndex: "code",
              key: "code",
              sorter: (a: MenuRecord, b: MenuRecord) => a.code.localeCompare(b.code),
            },
            {
              title: "Tên menu",
              dataIndex: "label",
              key: "label",
              sorter: (a: MenuRecord, b: MenuRecord) => a.label.localeCompare(b.label),
              render: (text: string) => highlightText(text, treeSearch),
            },
            {
              title: "Route",
              dataIndex: "route_path",
              key: "route_path",
              width: 200,
              ellipsis: true,
            },
            {
              title: "Phân hệ",
              dataIndex: "module_name",
              key: "module_name",
              width: 160,
            },
            {
              title: "Thứ tự",
              dataIndex: "sort_order",
              key: "sort_order",
              sorter: (a: MenuRecord, b: MenuRecord) => a.sort_order - b.sort_order,
              width: 100,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              width: 120,
              filters: [
                { text: "Hoạt động", value: "active" },
                { text: "Ngừng", value: "inactive" },
              ],
              onFilter: (value: string | number | boolean, record: MenuRecord) =>
                value === "active" ? isMenuActive(record.status) : !isMenuActive(record.status),
              render: (_, record: MenuRecord) => normalizeStatusTag(record.status),
            },
          ]}
          pagination={{ pageSize: 8 }}
          loading={loading}
        />
      </Card>
    </PermissionGate>
  );
}
