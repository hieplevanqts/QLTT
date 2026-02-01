import React from "react";
import {
  Button,
  Card,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Col,
  Select,
  Space,
  Tag,
  Typography,
  message,
  Tooltip,
  type InputRef,
  type MenuProps,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

import PageHeader from "@/layouts/PageHeader";
import AppTable from "@/components/data-table/AppTable";
import { getColumnSearchProps } from "@/components/data-table/columnSearch";
import { PermissionGate, usePermissions } from "../../_shared";
import { catalogsRepo, type CatalogRecord, type CatalogStatus } from "../data/catalogs.repo";
import {
  catalogItemsRepo,
  type CatalogItemRecord,
  type CatalogItemStatus,
} from "../data/catalogItems.repo";

type FormMode = "create" | "edit";

type CatalogFormValues = {
  key: string;
  name: string;
  description?: string;
  sort_order?: number | null;
  status: CatalogStatus;
};

type ItemFormValues = {
  code: string;
  name: string;
  value?: string;
  sort_order?: number | null;
  status: CatalogItemStatus;
  badge_color?: string;
  meta_text?: string;
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

const parseMetaText = (metaText?: string) => {
  const trimmed = metaText?.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Metadata phải là object JSON.");
    }
    return parsed as Record<string, unknown>;
  } catch (err) {
    throw new Error("Metadata không hợp lệ. Vui lòng nhập JSON object.");
  }
};

type CatalogGroup = "COMMON" | "DMS" | "SYSTEM";

type CatalogsManagerPageProps = {
  group: CatalogGroup;
  title: string;
  description: string;
};

export function CatalogsManagerPage({ group, title, description }: CatalogsManagerPageProps) {
  const { hasPermission } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCatalogId = searchParams.get("catalogId");

  const [catalogsLoading, setCatalogsLoading] = React.useState(false);
  const [catalogs, setCatalogs] = React.useState<CatalogRecord[]>([]);
  const catalogSearchInput = React.useRef<InputRef>(null);
  const [catalogColumnSearchText, setCatalogColumnSearchText] = React.useState("");
  const [catalogSearchedColumn, setCatalogSearchedColumn] = React.useState("");
  const [catalogSearch, setCatalogSearch] = React.useState("");
  const [catalogStatusFilter, setCatalogStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [selectedCatalogId, setSelectedCatalogId] = React.useState<string | null>(urlCatalogId);
  const [selectedCatalog, setSelectedCatalog] = React.useState<CatalogRecord | null>(null);

  const [catalogModalOpen, setCatalogModalOpen] = React.useState(false);
  const [catalogFormMode, setCatalogFormMode] = React.useState<FormMode>("create");
  const [editingCatalog, setEditingCatalog] = React.useState<CatalogRecord | null>(null);
  const [catalogSubmitting, setCatalogSubmitting] = React.useState(false);
  const [catalogForm] = Form.useForm<CatalogFormValues>();

  const [itemsLoading, setItemsLoading] = React.useState(false);
  const [items, setItems] = React.useState<CatalogItemRecord[]>([]);
  const [itemsTotal, setItemsTotal] = React.useState(0);
  const itemSearchInput = React.useRef<InputRef>(null);
  const [itemColumnSearchText, setItemColumnSearchText] = React.useState("");
  const [itemSearchedColumn, setItemSearchedColumn] = React.useState("");
  const [itemsSearch, setItemsSearch] = React.useState("");
  const [itemsStatusFilter, setItemsStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [itemsPage, setItemsPage] = React.useState(1);
  const [itemsPageSize, setItemsPageSize] = React.useState(10);

  const [itemDrawerOpen, setItemDrawerOpen] = React.useState(false);
  const [itemFormMode, setItemFormMode] = React.useState<FormMode>("create");
  const [editingItem, setEditingItem] = React.useState<CatalogItemRecord | null>(null);
  const [itemSubmitting, setItemSubmitting] = React.useState(false);
  const [itemForm] = Form.useForm<ItemFormValues>();

  const canCreate = hasPermission("sa.masterdata.catalog.create");
  const canUpdate = hasPermission("sa.masterdata.catalog.update");
  const canDelete = hasPermission("sa.masterdata.catalog.delete");

  React.useEffect(() => {
    setSelectedCatalogId(urlCatalogId);
  }, [urlCatalogId]);

  const loadCatalogs = React.useCallback(async () => {
    setCatalogsLoading(true);
    try {
      const data = await catalogsRepo.listCatalogsByGroup({
        group,
        search: catalogSearch,
        status: catalogStatusFilter,
      });
      setCatalogs(data);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh mục.";
      message.error(messageText);
    } finally {
      setCatalogsLoading(false);
    }
  }, [catalogSearch, catalogStatusFilter, group]);

  React.useEffect(() => {
    void loadCatalogs();
  }, [loadCatalogs]);

  const loadSelectedCatalog = React.useCallback(async () => {
    if (!selectedCatalogId) {
      setSelectedCatalog(null);
      return;
    }
    const cached = catalogs.find((item) => item.id === selectedCatalogId);
    if (cached) {
      setSelectedCatalog(cached);
    }
    try {
      const data = await catalogsRepo.getCatalogById(selectedCatalogId);
      if (data && String(data.group || "").toUpperCase() !== group) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("catalogId");
        setSearchParams(nextParams);
        setSelectedCatalog(null);
        message.warning("Danh mục không thuộc nhóm hiện tại.");
        return;
      }
      setSelectedCatalog(data);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải danh mục đã chọn.";
      message.error(messageText);
    }
  }, [catalogs, selectedCatalogId, group, searchParams, setSearchParams]);

  React.useEffect(() => {
    void loadSelectedCatalog();
  }, [loadSelectedCatalog]);

  const loadItems = React.useCallback(async () => {
    if (!selectedCatalogId) {
      setItems([]);
      setItemsTotal(0);
      return;
    }
    setItemsLoading(true);
    try {
      const result = await catalogItemsRepo.listItems({
        catalogId: selectedCatalogId,
        search: itemsSearch,
        status: itemsStatusFilter,
        page: itemsPage,
        pageSize: itemsPageSize,
      });
      setItems(result.data);
      setItemsTotal(result.total);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải mục danh mục.";
      message.error(messageText);
    } finally {
      setItemsLoading(false);
    }
  }, [itemsPage, itemsPageSize, itemsSearch, itemsStatusFilter, selectedCatalogId]);

  React.useEffect(() => {
    void loadItems();
  }, [loadItems]);

  React.useEffect(() => {
    setItemsPage(1);
  }, [itemsSearch, itemsStatusFilter, selectedCatalogId]);

  const handleSelectCatalog = (catalogId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("catalogId", catalogId);
    setSearchParams(nextParams);
  };

  const openCreateCatalog = () => {
    setCatalogFormMode("create");
    setEditingCatalog(null);
    catalogForm.resetFields();
    catalogForm.setFieldsValue({
      status: "ACTIVE",
      sort_order: 0,
    });
    setCatalogModalOpen(true);
  };

  const openEditCatalog = (record: CatalogRecord) => {
    setCatalogFormMode("edit");
    setEditingCatalog(record);
    catalogForm.resetFields();
    catalogForm.setFieldsValue({
      key: record.key,
      name: record.name,
      description: record.description ?? "",
      status: normalizeStatusValue(record.status),
      sort_order: record.sort_order ?? 0,
    });
    setCatalogModalOpen(true);
  };

  const closeCatalogModal = () => {
    if (catalogSubmitting) return;
    setCatalogModalOpen(false);
  };

  const handleSubmitCatalog = async () => {
    try {
      setCatalogSubmitting(true);
      const values = await catalogForm.validateFields();
      if (catalogFormMode === "create") {
        const existing = await catalogsRepo.getCatalogByKey(values.key.trim());
        if (existing) {
          message.error("Khóa danh mục đã tồn tại.");
          setCatalogSubmitting(false);
          return;
        }
        await catalogsRepo.createCatalog({
          key: values.key.trim(),
          name: values.name.trim(),
          description: values.description?.trim() || null,
          group,
          status: values.status ?? "ACTIVE",
          sort_order: values.sort_order ?? 0,
          is_hierarchical: false,
          editable_scope: group.toLowerCase(),
        });
        message.success("Đã tạo danh mục.");
      } else if (editingCatalog) {
        await catalogsRepo.updateCatalog(editingCatalog.id, {
          name: values.name.trim(),
          description: values.description?.trim() || null,
          status: values.status ?? editingCatalog.status ?? "ACTIVE",
          sort_order: values.sort_order ?? editingCatalog.sort_order ?? 0,
          is_hierarchical: editingCatalog.is_hierarchical ?? false,
          editable_scope: group.toLowerCase(),
        });
        message.success("Đã cập nhật danh mục.");
      }
      setCatalogModalOpen(false);
      await loadCatalogs();
      await loadSelectedCatalog();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu danh mục.";
      message.error(messageText);
    } finally {
      setCatalogSubmitting(false);
    }
  };

  const handleToggleCatalogStatus = async (record: CatalogRecord) => {
    try {
      const next = nextStatus(record.status);
      await catalogsRepo.setCatalogStatus(record.id, next);
      message.success("Đã cập nhật trạng thái danh mục.");
      await loadCatalogs();
      await loadSelectedCatalog();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật trạng thái danh mục.";
      message.error(messageText);
    }
  };

  const getCatalogMoreActions = (record: CatalogRecord): MenuProps => ({
    items: [
      {
        key: "edit",
        label: "Sửa danh mục",
        onClick: () => openEditCatalog(record),
      },
    ],
  });

  const openCreateItem = () => {
    setItemFormMode("create");
    setEditingItem(null);
    itemForm.resetFields();
    itemForm.setFieldsValue({
      status: "ACTIVE",
      sort_order: 0,
    });
    setItemDrawerOpen(true);
  };

  const openEditItem = (record: CatalogItemRecord) => {
    setItemFormMode("edit");
    setEditingItem(record);
    itemForm.resetFields();
    itemForm.setFieldsValue({
      code: record.code,
      name: record.name,
      value: typeof record.meta?.value === "string" ? (record.meta.value as string) : "",
      sort_order: record.sort_order ?? 0,
      status: normalizeStatusValue(record.status),
      badge_color: record.badge_color ?? (record.meta?.badge_color as string | undefined) ?? "",
    });
    setItemDrawerOpen(true);
  };

  const closeItemDrawer = () => {
    if (itemSubmitting) return;
    setItemDrawerOpen(false);
  };

  const handleSubmitItem = async () => {
    if (!selectedCatalogId) return;
    try {
      setItemSubmitting(true);
      const values = await itemForm.validateFields();
      const parsedMeta = parseMetaText(values.meta_text);
      const baseMeta: Record<string, unknown> = {
        ...(editingItem?.meta ?? {}),
        ...(parsedMeta ?? {}),
      };

      const trimmedValue = values.value?.trim() ?? "";
      if (trimmedValue) {
        baseMeta.value = trimmedValue;
      } else {
        delete baseMeta.value;
      }

      const badgeColor = values.badge_color?.trim() ?? "";
      if (badgeColor) {
        baseMeta.badge_color = badgeColor;
      } else {
        delete baseMeta.badge_color;
      }

      if (itemFormMode === "create") {
        await catalogItemsRepo.createItem({
          catalog_id: selectedCatalogId,
          code: values.code.trim(),
          name: values.name.trim(),
          sort_order: values.sort_order ?? 0,
          status: values.status ?? "ACTIVE",
          badge_color: badgeColor || null,
          meta: baseMeta,
        });
        message.success("Đã thêm mục.");
      } else if (editingItem) {
        await catalogItemsRepo.updateItem(editingItem.id, {
          code: values.code.trim(),
          name: values.name.trim(),
          sort_order: values.sort_order ?? editingItem.sort_order ?? 0,
          status: values.status ?? editingItem.status ?? "ACTIVE",
          badge_color: badgeColor || null,
          meta: baseMeta,
        });
        message.success("Đã cập nhật mục.");
      }
      setItemDrawerOpen(false);
      await loadItems();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu mục.";
      message.error(messageText);
    } finally {
      setItemSubmitting(false);
    }
  };

  const handleToggleItemStatus = async (record: CatalogItemRecord) => {
    try {
      const next = nextStatus(record.status);
      await catalogItemsRepo.setItemStatus(record.id, next);
      message.success("Đã cập nhật trạng thái mục.");
      await loadItems();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật trạng thái mục.";
      message.error(messageText);
    }
  };

  const handleDeleteItem = async (record: CatalogItemRecord) => {
    try {
      await catalogItemsRepo.softDeleteItem(record.id);
      message.success("Đã ngừng mục.");
      await loadItems();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể ngừng mục.";
      message.error(messageText);
    }
  };

  const getItemMoreActions = (record: CatalogItemRecord): MenuProps => ({
    items: [
      {
        key: "edit",
        label: "Sửa mục",
        onClick: () => openEditItem(record),
      },
    ],
  });

  const renderBadgePreview = (record: CatalogItemRecord) => {
    const meta = record.meta ?? {};
    const color =
      record.badge_color ??
      (typeof meta.badge_color === "string" ? meta.badge_color : undefined) ??
      (typeof meta.badgeColor === "string" ? meta.badgeColor : undefined);
    if (!color) return "-";
    const text =
      (typeof meta.badge_text === "string" ? meta.badge_text : undefined) ??
      (typeof meta.badgeLabel === "string" ? meta.badgeLabel : undefined) ??
      "Badge";
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <PermissionGate permission="sa.masterdata.catalog.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "Dữ liệu nền" },
            { label: title },
          ]}
          title={title}
          subtitle={description}
        />

        <div className="px-6 pb-8">
          <Row gutter={16}>
            <Col xs={24} xl={10} xxl={9}>
              <Card
                title="Danh sách danh mục"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openCreateCatalog}
                    disabled={!canCreate}
                  >
                    Thêm danh mục
                  </Button>
                }
              >
                <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                  <Space wrap>
                    <Input
                      placeholder="Tìm theo khóa, tên danh mục..."
                      value={catalogSearch}
                      onChange={(event) => setCatalogSearch(event.target.value)}
                      allowClear
                      style={{ width: 240 }}
                    />
                    <Select
                      value={catalogStatusFilter}
                      onChange={(value) => setCatalogStatusFilter(value)}
                      style={{ width: 160 }}
                      options={[
                        { value: "all", label: "Tất cả trạng thái" },
                        { value: "active", label: "Hoạt động" },
                        { value: "inactive", label: "Ngừng" },
                      ]}
                    />
                  </Space>

                  <AppTable
                    rowKey="id"
                    loading={catalogsLoading}
                    dataSource={catalogs}
                    pagination={false}
                    size="small"
                    tableLayout="fixed"
                    scroll={{ x: 900, y: 520 }}
                    rowClassName={(record) =>
                      record.id === selectedCatalogId ? "ant-table-row-selected" : ""
                    }
                    onRow={(record) => ({
                      onClick: () => handleSelectCatalog(record.id),
                      style: { cursor: "pointer" },
                    })}
                    columns={[
                      {
                        title: "Khóa",
                        dataIndex: "key",
                        key: "key",
                        width: 160,
                        render: (value: string) => <span style={{ fontWeight: 600 }}>{value}</span>,
                        sorter: (a: CatalogRecord, b: CatalogRecord) =>
                          a.key.localeCompare(b.key, "vi"),
                        ellipsis: true,
                        ...getColumnSearchProps<CatalogRecord>(
                          "key",
                          {
                            searchText: catalogColumnSearchText,
                            searchedColumn: catalogSearchedColumn,
                            setSearchText: setCatalogColumnSearchText,
                            setSearchedColumn: setCatalogSearchedColumn,
                            inputRef: catalogSearchInput,
                          },
                          { placeholder: "Tìm khóa" },
                        ),
                      },
                      {
                        title: "Tên danh mục",
                        dataIndex: "name",
                        key: "name",
                        width: 200,
                        ellipsis: true,
                        sorter: (a: CatalogRecord, b: CatalogRecord) =>
                          a.name.localeCompare(b.name, "vi"),
                        ...getColumnSearchProps<CatalogRecord>(
                          "name",
                          {
                            searchText: catalogColumnSearchText,
                            searchedColumn: catalogSearchedColumn,
                            setSearchText: setCatalogColumnSearchText,
                            setSearchedColumn: setCatalogSearchedColumn,
                            inputRef: catalogSearchInput,
                          },
                          { placeholder: "Tìm tên danh mục" },
                        ),
                      },
                      {
                        title: "Mô tả",
                        dataIndex: "description",
                        key: "description",
                        render: (value?: string) => value || "-",
                        width: 220,
                        ellipsis: true,
                        ...getColumnSearchProps<CatalogRecord>(
                          "description",
                          {
                            searchText: catalogColumnSearchText,
                            searchedColumn: catalogSearchedColumn,
                            setSearchText: setCatalogColumnSearchText,
                            setSearchedColumn: setCatalogSearchedColumn,
                            inputRef: catalogSearchInput,
                          },
                          { placeholder: "Tìm mô tả" },
                        ),
                      },
                      {
                        title: "Số mục",
                        dataIndex: "item_count",
                        key: "item_count",
                        width: 90,
                        render: (value?: number) => (value == null ? "—" : value),
                        sorter: (a: CatalogRecord, b: CatalogRecord) =>
                          (a.item_count ?? 0) - (b.item_count ?? 0),
                        align: "center",
                      },
                      {
                        title: "Trạng thái",
                        dataIndex: "status",
                        key: "status",
                        width: 120,
                        render: (value: CatalogStatus) => (
                          <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
                        ),
                        align: "center",
                      },
                      {
                        title: "Thao tác",
                        key: "actions",
                        width: 150,
                        fixed: "right",
                        render: (_: unknown, record: CatalogRecord) => (
                          <Space>
                            <Tooltip title="Sửa">
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => openEditCatalog(record)}
                                disabled={!canUpdate}
                              />
                            </Tooltip>
                            <Tooltip
                              title={statusLabel(record.status) === "Hoạt động" ? "Ngừng" : "Kích hoạt"}
                            >
                              <Popconfirm
                                title={
                                  statusLabel(record.status) === "Hoạt động"
                                    ? "Ngừng danh mục này?"
                                    : "Kích hoạt danh mục này?"
                                }
                                okText="Xác nhận"
                                cancelText="Hủy"
                                onConfirm={() => handleToggleCatalogStatus(record)}
                                disabled={!canDelete}
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  danger={statusLabel(record.status) === "Hoạt động"}
                                  icon={
                                    statusLabel(record.status) === "Hoạt động" ? (
                                      <StopOutlined />
                                    ) : (
                                      <CheckCircleOutlined />
                                    )
                                  }
                                  disabled={!canDelete}
                                />
                              </Popconfirm>
                            </Tooltip>
                            <Dropdown menu={getCatalogMoreActions(record)}>
                              <Button type="text" size="small" icon={<MoreOutlined />} />
                            </Dropdown>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </Space>
              </Card>
            </Col>

            <Col xs={24} xl={14} xxl={15}>
              <Card
                title="Chi tiết danh mục"
                extra={
                  <Space>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => loadItems()}
                      disabled={!selectedCatalogId}
                    >
                      Làm mới
                    </Button>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={openCreateItem}
                      disabled={!selectedCatalogId || !canCreate}
                    >
                      Thêm mục
                    </Button>
                  </Space>
                }
              >
                {!selectedCatalog ? (
                  <Empty description="Chọn một danh mục bên trái để xem chi tiết." />
                ) : (
                  <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                      <Space align="center" wrap>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                          {selectedCatalog.name}
                        </Typography.Title>
                        <Tag>{selectedCatalog.key}</Tag>
                        <Tag color={statusColor(selectedCatalog.status)}>
                          {statusLabel(selectedCatalog.status)}
                        </Tag>
                      </Space>
                      <Typography.Text type="secondary">
                        {selectedCatalog.description || "Chưa có mô tả."}
                      </Typography.Text>
                    </div>

                    <Space wrap>
                      <Input
                        placeholder="Tìm mục theo mã, tên..."
                        value={itemsSearch}
                        onChange={(event) => setItemsSearch(event.target.value)}
                        allowClear
                        style={{ width: 240 }}
                      />
                      <Select
                        value={itemsStatusFilter}
                        onChange={(value) => setItemsStatusFilter(value)}
                        style={{ width: 160 }}
                        options={[
                          { value: "all", label: "Tất cả trạng thái" },
                          { value: "active", label: "Hoạt động" },
                          { value: "inactive", label: "Ngừng" },
                        ]}
                      />
                    </Space>

                    <AppTable
                      rowKey="id"
                      loading={itemsLoading}
                      dataSource={items}
                      pagination={{
                        current: itemsPage,
                        pageSize: itemsPageSize,
                        total: itemsTotal,
                        onChange: (page, pageSize) => {
                          setItemsPage(page);
                          setItemsPageSize(pageSize);
                        },
                      }}
                      tableLayout="fixed"
                      columns={[
                        {
                          title: "Mã",
                          dataIndex: "code",
                          key: "code",
                          width: 140,
                          sorter: (a: CatalogItemRecord, b: CatalogItemRecord) =>
                            a.code.localeCompare(b.code, "vi"),
                          ellipsis: true,
                          ...getColumnSearchProps<CatalogItemRecord>(
                            "code",
                            {
                              searchText: itemColumnSearchText,
                              searchedColumn: itemSearchedColumn,
                              setSearchText: setItemColumnSearchText,
                              setSearchedColumn: setItemSearchedColumn,
                              inputRef: itemSearchInput,
                            },
                            { placeholder: "Tìm mã mục" },
                          ),
                        },
                        {
                          title: "Tên mục",
                          dataIndex: "name",
                          key: "name",
                          ellipsis: true,
                          sorter: (a: CatalogItemRecord, b: CatalogItemRecord) =>
                            a.name.localeCompare(b.name, "vi"),
                          ...getColumnSearchProps<CatalogItemRecord>(
                            "name",
                            {
                              searchText: itemColumnSearchText,
                              searchedColumn: itemSearchedColumn,
                              setSearchText: setItemColumnSearchText,
                              setSearchedColumn: setItemSearchedColumn,
                              inputRef: itemSearchInput,
                            },
                            { placeholder: "Tìm tên mục" },
                          ),
                        },
                        {
                          title: "Giá trị",
                          key: "value",
                          ellipsis: true,
                          render: (_: unknown, record: CatalogItemRecord) =>
                            typeof record.meta?.value === "string" ? record.meta.value : "-",
                        },
                        {
                          title: "Thứ tự",
                          dataIndex: "sort_order",
                          key: "sort_order",
                          width: 90,
                          sorter: (a: CatalogItemRecord, b: CatalogItemRecord) =>
                            (a.sort_order ?? 0) - (b.sort_order ?? 0),
                          align: "center",
                        },
                        {
                          title: "Badge",
                          key: "badge",
                          width: 120,
                          render: (_: unknown, record: CatalogItemRecord) => renderBadgePreview(record),
                        },
                        {
                          title: "Trạng thái",
                          dataIndex: "status",
                          key: "status",
                          width: 120,
                          render: (value: CatalogItemStatus) => (
                            <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
                          ),
                          align: "center",
                        },
                        {
                          title: "Thao tác",
                          key: "actions",
                          width: 200,
                          fixed: "right",
                          render: (_: unknown, record: CatalogItemRecord) => (
                            <Space>
                              <Tooltip title="Sửa">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => openEditItem(record)}
                                  disabled={!canUpdate}
                                />
                              </Tooltip>
                              <Tooltip
                                title={
                                  statusLabel(record.status) === "Hoạt động" ? "Ngừng" : "Kích hoạt"
                                }
                              >
                                <Popconfirm
                                  title={
                                    statusLabel(record.status) === "Hoạt động"
                                      ? "Ngừng mục này?"
                                      : "Kích hoạt mục này?"
                                  }
                                  okText="Xác nhận"
                                  cancelText="Hủy"
                                  onConfirm={() => handleToggleItemStatus(record)}
                                  disabled={!canUpdate}
                                >
                                  <Button
                                    type="text"
                                    size="small"
                                    danger={statusLabel(record.status) === "Hoạt động"}
                                    icon={
                                      statusLabel(record.status) === "Hoạt động" ? (
                                        <StopOutlined />
                                      ) : (
                                        <CheckCircleOutlined />
                                      )
                                    }
                                    disabled={!canUpdate}
                                  />
                                </Popconfirm>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <Popconfirm
                                  title="Xóa mục này?"
                                  okText="Xác nhận"
                                  cancelText="Hủy"
                                  onConfirm={() => handleDeleteItem(record)}
                                  disabled={!canDelete}
                                >
                                  <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    disabled={!canDelete}
                                  />
                                </Popconfirm>
                              </Tooltip>
                              <Dropdown menu={getItemMoreActions(record)}>
                                <Button type="text" size="small" icon={<MoreOutlined />} />
                              </Dropdown>
                            </Space>
                          ),
                        },
                      ]}
                    />
                  </Space>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Modal
        open={catalogModalOpen}
        title={catalogFormMode === "create" ? "Thêm danh mục" : "Chỉnh sửa danh mục"}
        onCancel={closeCatalogModal}
        onOk={handleSubmitCatalog}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={catalogSubmitting}
        destroyOnClose
      >
        <Form layout="vertical" form={catalogForm}>
          <Form.Item
            name="key"
            label="Khóa"
            rules={[{ required: true, message: "Vui lòng nhập khóa." }]}
          >
            <Input disabled={catalogFormMode === "edit"} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="sort_order" label="Thứ tự">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="ACTIVE">
            <Select
              options={[
                { value: "ACTIVE", label: "Hoạt động" },
                { value: "INACTIVE", label: "Ngừng" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={itemFormMode === "create" ? "Thêm mục" : "Chỉnh sửa mục"}
        placement="right"
        size={420}
        open={itemDrawerOpen}
        onClose={closeItemDrawer}
        destroyOnHidden
        extra={
          <Space>
            <Button onClick={closeItemDrawer}>Hủy</Button>
            <Button type="primary" onClick={handleSubmitItem} loading={itemSubmitting}>
              Lưu
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={itemForm}>
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
          <Form.Item name="value" label="Giá trị">
            <Input />
          </Form.Item>
          <Form.Item name="sort_order" label="Thứ tự">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="badge_color" label="Màu badge">
            <Input placeholder="#22c55e" />
          </Form.Item>
          <Form.Item name="meta_text" label="Metadata (JSON)">
            <Input.TextArea rows={4} placeholder='VD: {"badge_text":"Ưu tiên","note":"..."}' />
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

export default function CommonCatalogsPage() {
  return (
    <CatalogsManagerPage
      group="COMMON"
      title="Danh mục dùng chung"
      description="Quản lý danh mục và mục dùng chung trong hệ thống"
    />
  );
}
