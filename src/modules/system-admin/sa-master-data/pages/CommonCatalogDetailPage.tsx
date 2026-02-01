import React from "react";
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tree,
  Typography,
  message,
} from "antd";
import type { DataNode } from "antd/es/tree";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "@/layouts/PageHeader";
import { PermissionGate, usePermissions } from "../../_shared";
import { catalogsRepo, type CatalogRecord, type CatalogStatus } from "../data/catalogs.repo";
import { catalogItemsRepo, type CatalogItemRecord, type CatalogItemStatus } from "../data/catalogItems.repo";

type ItemNode = DataNode & { data: CatalogItemRecord };

type FormMode = "create" | "edit";

type ItemFormValues = {
  code: string;
  name: string;
  description?: string;
  sort_order?: number | null;
  status?: CatalogItemStatus;
  is_default?: boolean;
};

const statusLabel = (status?: CatalogItemStatus | CatalogStatus | null) => {
  if (!status) return "Không xác định";
  const normalized = String(status).toLowerCase();
  return normalized === "active" ? "Hoạt động" : "Ngừng";
};

const normalizeStatusValue = (status?: CatalogItemStatus | CatalogStatus | null) => {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized === "active") return "ACTIVE";
  if (normalized === "inactive") return "INACTIVE";
  return status ?? "ACTIVE";
};

const statusColor = (status?: CatalogItemStatus | CatalogStatus | null) =>
  String(status ?? "").toLowerCase() === "active" ? "green" : "red";

const nextStatus = (status?: CatalogItemStatus | CatalogStatus | null) => {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized === "active") {
    return String(status) === "ACTIVE" ? "INACTIVE" : "inactive";
  }
  return String(status) === "INACTIVE" ? "ACTIVE" : "active";
};

const buildTree = (items: CatalogItemRecord[], query: string) => {
  const nodeMap = new Map<string, ItemNode>();
  const roots: ItemNode[] = [];
  const search = query.trim().toLowerCase();

  items.forEach((item) => {
    nodeMap.set(item.id, {
      key: item.id,
      title: item.name,
      children: [],
      data: item,
    });
  });

  nodeMap.forEach((node) => {
    const parentId = node.data.parent_id;
    if (parentId && nodeMap.has(parentId)) {
      const parent = nodeMap.get(parentId);
      parent?.children?.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes: ItemNode[]) => {
    nodes.sort((left, right) => {
      const leftOrder = left.data.sort_order ?? Number.POSITIVE_INFINITY;
      const rightOrder = right.data.sort_order ?? Number.POSITIVE_INFINITY;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return (left.data.name || left.data.code).localeCompare(right.data.name || right.data.code, "vi");
    });
    nodes.forEach((node) => {
      if (node.children) sortNodes(node.children as ItemNode[]);
    });
  };

  sortNodes(roots);

  if (!search) {
    return { treeData: roots, expandedKeys: [] as React.Key[] };
  }

  const expandedKeys = new Set<React.Key>();
  const highlight = (label: string) => {
    const index = label.toLowerCase().indexOf(search);
    if (index === -1) return <span>{label}</span>;
    return (
      <span>
        {label.slice(0, index)}
        <span style={{ backgroundColor: "#ffe58f" }}>{label.slice(index, index + search.length)}</span>
        {label.slice(index + search.length)}
      </span>
    );
  };

  const filterNode = (node: ItemNode): ItemNode | null => {
    const matches =
      node.data.name.toLowerCase().includes(search) ||
      (node.data.code || "").toLowerCase().includes(search);
    const children = (node.children as ItemNode[] | undefined)
      ?.map(filterNode)
      .filter((child): child is ItemNode => Boolean(child));

    if (matches || (children && children.length > 0)) {
      if (children && children.length > 0) expandedKeys.add(node.key);
      return {
        ...node,
        title: highlight(node.data.name),
        children,
      };
    }
    return null;
  };

  const filteredRoots = roots
    .map(filterNode)
    .filter((node): node is ItemNode => Boolean(node));

  return { treeData: filteredRoots, expandedKeys: Array.from(expandedKeys) };
};

export default function CommonCatalogDetailPage() {
  const { catalogId } = useParams<{ catalogId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = React.useState(false);
  const [catalog, setCatalog] = React.useState<CatalogRecord | null>(null);
  const [items, setItems] = React.useState<CatalogItemRecord[]>([]);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<FormMode>("create");
  const [parentForCreate, setParentForCreate] = React.useState<CatalogItemRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [form] = Form.useForm<ItemFormValues>();

  const canCreate = hasPermission("sa.masterdata.catalog.create");
  const canUpdate = hasPermission("sa.masterdata.catalog.update");
  const canDelete = hasPermission("sa.masterdata.catalog.delete");

  const selectedItem = React.useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  const isHierarchical = Boolean(catalog?.is_hierarchical);

  const { treeData, expandedKeys: searchExpandedKeys } = React.useMemo(
    () => buildTree(items, searchText),
    [items, searchText],
  );

  React.useEffect(() => {
    if (searchText.trim()) {
      setExpandedKeys(searchExpandedKeys);
      setAutoExpandParent(true);
    }
  }, [searchExpandedKeys, searchText]);

  const loadCatalog = React.useCallback(async () => {
    if (!catalogId) return;
    setLoading(true);
    try {
      const data = await catalogsRepo.getCatalogById(catalogId);
      setCatalog(data);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh mục.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [catalogId]);

  const loadItems = React.useCallback(async () => {
    if (!catalogId) return;
    setLoading(true);
    try {
      const data = await catalogItemsRepo.listItemsByCatalog(catalogId);
      setItems(data);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh sách mục.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [catalogId]);

  React.useEffect(() => {
    void loadCatalog();
    void loadItems();
  }, [loadCatalog, loadItems]);

  const openCreate = () => {
    setDrawerMode("create");
    setParentForCreate(null);
    form.resetFields();
    form.setFieldsValue({ status: "ACTIVE", sort_order: 0 });
    setDrawerOpen(true);
  };

  const openCreateChild = () => {
    if (!selectedItem) return;
    setDrawerMode("create");
    setParentForCreate(selectedItem);
    form.resetFields();
    form.setFieldsValue({ status: "ACTIVE", sort_order: 0 });
    setDrawerOpen(true);
  };

  const openEdit = () => {
    if (!selectedItem) return;
    setDrawerMode("edit");
    setParentForCreate(null);
    form.resetFields();
    form.setFieldsValue({
      code: selectedItem.code,
      name: selectedItem.name,
      description: selectedItem.description ?? "",
      sort_order: selectedItem.sort_order ?? 0,
      status: normalizeStatusValue(selectedItem.status),
      is_default: selectedItem.is_default ?? false,
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (submitting) return;
    setDrawerOpen(false);
  };

  const handleSubmit = async () => {
    if (!catalogId) return;
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      if (drawerMode === "create") {
        await catalogItemsRepo.createItem({
          catalog_id: catalogId,
          parent_id: parentForCreate?.id ?? null,
          code: values.code.trim(),
          name: values.name.trim(),
          description: values.description?.trim() || null,
          sort_order: values.sort_order ?? 0,
          status: values.status ?? "ACTIVE",
          is_default: Boolean(values.is_default),
        });
        message.success("Đã thêm mục.");
      } else if (selectedItem) {
        await catalogItemsRepo.updateItem(selectedItem.id, {
          code: values.code.trim(),
          name: values.name.trim(),
          description: values.description?.trim() || null,
          sort_order: values.sort_order ?? 0,
          status: values.status ?? selectedItem.status ?? "ACTIVE",
          is_default: Boolean(values.is_default),
        });
        message.success("Đã cập nhật mục.");
      }
      setDrawerOpen(false);
      await loadItems();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu mục.";
      message.error(messageText);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedItem) return;
    try {
      const next = nextStatus(selectedItem.status);
      await catalogItemsRepo.setItemStatus(selectedItem.id, next);
      message.success("Đã cập nhật trạng thái.");
      await loadItems();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật trạng thái.";
      message.error(messageText);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await catalogItemsRepo.softDeleteItem(selectedItem.id);
      message.success("Đã ngừng mục.");
      setSelectedItemId(null);
      await loadItems();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể ngừng mục.";
      message.error(messageText);
    }
  };

  const renderLeftPanel = () => {
    if (!catalog) {
      return <Empty description="Không tìm thấy danh mục." />;
    }

    if (!isHierarchical) {
      const filtered = items.filter((item) => {
        const query = searchText.trim().toLowerCase();
        if (!query) return true;
        return (
          item.name.toLowerCase().includes(query) ||
          (item.code || "").toLowerCase().includes(query)
        );
      });

      return (
        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
          <Input
            placeholder="Tìm mục..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            allowClear
          />
          <Table
            rowKey="id"
            dataSource={filtered}
            pagination={false}
            size="small"
            columns={[
              {
                title: "Mã",
                dataIndex: "code",
                key: "code",
                width: 140,
              },
              {
                title: "Tên mục",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 120,
                render: (value: CatalogItemStatus) => (
                  <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
                ),
              },
            ]}
            onRow={(record) => ({
              onClick: () => setSelectedItemId(record.id),
            })}
          />
        </Space>
      );
    }

    return (
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          placeholder="Tìm mục..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          allowClear
        />
        <Tree
          treeData={treeData}
          selectedKeys={selectedItemId ? [selectedItemId] : []}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onExpand={(keys) => {
            setExpandedKeys(keys as React.Key[]);
            setAutoExpandParent(false);
          }}
          onSelect={(keys) => setSelectedItemId(keys.length > 0 ? String(keys[0]) : null)}
        />
      </Space>
    );
  };

  return (
    <PermissionGate permission="sa.masterdata.catalog.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "Danh mục dùng chung", href: "/system-admin/master-data/common-catalogs" },
            { label: catalog?.name || "Chi tiết danh mục" },
          ]}
          title={catalog?.name || "Chi tiết danh mục"}
          subtitle={catalog?.key || ""}
          actions={
            <Space>
              <Button onClick={() => navigate("/system-admin/master-data/common-catalogs")}>
                Quay lại
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} disabled={!canCreate}>
                Thêm mục
              </Button>
              {isHierarchical && (
                <Button onClick={openCreateChild} disabled={!selectedItem || !canCreate}>
                  Thêm mục con
                </Button>
              )}
            </Space>
          }
        />

        <div className="px-6 pb-8">
          <Card>
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Khóa">{catalog?.key || "-"}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusColor(catalog?.status)}>{statusLabel(catalog?.status)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                  {catalog?.description || "-"}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 360 }}>
                  <Card title="Danh sách mục">{renderLeftPanel()}</Card>
                </div>
                <div style={{ flex: 1 }}>
                  <Card title="Chi tiết mục">
                    {!selectedItem ? (
                      <Empty description="Chọn một mục bên trái để xem chi tiết." />
                    ) : (
                      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                        <Descriptions bordered size="small" column={2}>
                          <Descriptions.Item label="Mã">{selectedItem.code}</Descriptions.Item>
                          <Descriptions.Item label="Tên">{selectedItem.name}</Descriptions.Item>
                          <Descriptions.Item label="Mô tả" span={2}>
                            {selectedItem.description || "-"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Thứ tự">
                            {selectedItem.sort_order ?? "-"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Mặc định">
                            {selectedItem.is_default ? "Có" : "Không"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Trạng thái">
                            <Tag color={statusColor(selectedItem.status)}>{statusLabel(selectedItem.status)}</Tag>
                          </Descriptions.Item>
                        </Descriptions>

                        <Space>
                          <Button onClick={openEdit} disabled={!canUpdate}>
                            Sửa
                          </Button>
                          <Popconfirm
                            title={
                              statusLabel(selectedItem.status) === "Hoạt động"
                                ? "Ngừng mục này?"
                                : "Kích hoạt mục này?"
                            }
                            okText="Xác nhận"
                            cancelText="Hủy"
                            onConfirm={handleToggleStatus}
                            disabled={!canUpdate}
                          >
                            <Button danger disabled={!canUpdate}>
                              {statusLabel(selectedItem.status) === "Hoạt động" ? "Ngừng" : "Kích hoạt"}
                            </Button>
                          </Popconfirm>
                          <Popconfirm
                            title="Xóa mục này?"
                            okText="Xác nhận"
                            cancelText="Hủy"
                            onConfirm={handleDelete}
                            disabled={!canDelete}
                          >
                            <Button danger disabled={!canDelete}>
                              Xóa
                            </Button>
                          </Popconfirm>
                        </Space>
                      </Space>
                    )}
                  </Card>
                </div>
              </div>
            </Space>
          </Card>
        </div>
      </div>

      <Drawer
        title={drawerMode === "create" ? "Thêm mục" : "Chỉnh sửa mục"}
        placement="right"
        size={420}
        open={drawerOpen}
        onClose={closeDrawer}
        destroyOnHidden
        extra={
          <Space>
            <Button onClick={closeDrawer}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              Lưu
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          {parentForCreate && (
            <Form.Item label="Mục cha">
              <Input value={`${parentForCreate.name} (${parentForCreate.code})`} disabled />
            </Form.Item>
          )}
          <Form.Item
            name="code"
            label="Mã mục"
            rules={[{ required: true, message: "Vui lòng nhập mã mục." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên mục"
            rules={[{ required: true, message: "Vui lòng nhập tên mục." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="sort_order" label="Thứ tự">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="is_default" label="Mặc định" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select
              options={[
                { value: "ACTIVE", label: "Hoạt động" },
                { value: "INACTIVE", label: "Ngừng" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </PermissionGate>
  );
}
