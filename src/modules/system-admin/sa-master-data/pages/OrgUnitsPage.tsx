import React from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Tree,
  Typography,
  message,
} from "antd";
import type { DataNode } from "antd/es/tree";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";

import PageHeader from "@/layouts/PageHeader";
import { PermissionGate } from "../../_shared";
import { orgUnitsService, type OrgUnitPayload, type OrgUnitRecord } from "../services/orgUnits.service";

type OrgUnitNode = DataNode & { data: OrgUnitRecord };
type GeocodeResult = {
  latitude: number;
  longitude: number;
  ambiguous: boolean;
  provider: "google" | "osm";
};

const buildTree = (items: OrgUnitRecord[], searchText: string) => {
  const nodeMap = new Map<string, OrgUnitNode>();
  const roots: OrgUnitNode[] = [];
  const query = searchText.trim().toLowerCase();

  items.forEach((item) => {
    nodeMap.set(item.id, {
      key: item.id,
      data: item,
      title: item.name,
      children: [],
    });
  });

  nodeMap.forEach((node) => {
    const parentId = node.data.parent_id;
    if (parentId && nodeMap.has(parentId)) {
      const parent = nodeMap.get(parentId);
      if (parent?.children) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  const compareUnits = (left: OrgUnitRecord, right: OrgUnitRecord) => {
    const leftOrder = left.order_index ?? Number.POSITIVE_INFINITY;
    const rightOrder = right.order_index ?? Number.POSITIVE_INFINITY;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    const leftLabel = left.name || left.code || "";
    const rightLabel = right.name || right.code || "";
    return leftLabel.localeCompare(rightLabel, "vi", { numeric: true, sensitivity: "base" });
  };

  const sortNodes = (nodes: OrgUnitNode[]) => {
    nodes.sort((left, right) => compareUnits(left.data, right.data));
    nodes.forEach((node) => {
      if (node.children) {
        sortNodes(node.children as OrgUnitNode[]);
      }
    });
  };

  sortNodes(roots);

  if (!query) {
    return { treeData: roots, expandedKeys: [] as React.Key[] };
  }

  const expandedKeys = new Set<React.Key>();
  const highlight = (label: string) => {
    const index = label.toLowerCase().indexOf(query);
    if (index === -1) return <span>{label}</span>;
    return (
      <span>
        {label.slice(0, index)}
        <span style={{ backgroundColor: "#ffe58f" }}>{label.slice(index, index + query.length)}</span>
        {label.slice(index + query.length)}
      </span>
    );
  };

  const filterNode = (node: OrgUnitNode): OrgUnitNode | null => {
    const matches =
      node.data.name.toLowerCase().includes(query) ||
      (node.data.code || "").toLowerCase().includes(query);
    const children = (node.children as OrgUnitNode[] | undefined)
      ?.map(filterNode)
      .filter((child): child is OrgUnitNode => Boolean(child));

    if (matches || (children && children.length > 0)) {
      if (children && children.length > 0) {
        expandedKeys.add(node.key);
      }
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
    .filter((node): node is OrgUnitNode => Boolean(node));

  return { treeData: filteredRoots, expandedKeys: Array.from(expandedKeys) };
};

const ORG_UNIT_TYPE_OPTIONS = [
  { value: "central", label: "Cục" },
  { value: "provincial", label: "Chi cục" },
  { value: "team", label: "Đội" },
  { value: "other", label: "Khác" },
];

const getTypeLabel = (type?: string | null) => {
  if (!type) return "-";
  return ORG_UNIT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
};

const levelToType = (level?: number | null) => {
  if (level === 1) return "central";
  if (level === 2) return "provincial";
  if (level === 3) return "team";
  return "other";
};

const findParentLabel = (units: OrgUnitRecord[], parentId?: string | null) => {
  if (!parentId) return "-";
  const parent = units.find((item) => item.id === parentId);
  return parent ? `${parent.name} (${parent.code})` : parentId;
};

const buildChildrenMap = (items: OrgUnitRecord[]) => {
  const map = new Map<string, string[]>();
  items.forEach((item) => {
    if (!item.parent_id) return;
    const children = map.get(item.parent_id) ?? [];
    children.push(item.id);
    map.set(item.parent_id, children);
  });
  return map;
};

const geocodeWithGoogle = async (address: string, apiKey: string): Promise<GeocodeResult> => {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`GOOGLE_HTTP_${response.status}`);
  }

  const payload = await response.json();
  const status = payload?.status;
  if (status !== "OK" || !payload.results || payload.results.length === 0) {
    const errorMessage = payload?.error_message ? `: ${payload.error_message}` : "";
    throw new Error(`GOOGLE_${status ?? "UNKNOWN"}${errorMessage}`);
  }

  const result = payload.results[0];
  const location = result?.geometry?.location;
  if (!location) {
    throw new Error("GOOGLE_NO_LOCATION");
  }

  return {
    latitude: Number(location.lat),
    longitude: Number(location.lng),
    ambiguous: Boolean(result.partial_match) || payload.results.length > 1,
    provider: "google",
  };
};

const geocodeWithOsm = async (address: string, email?: string): Promise<GeocodeResult> => {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", address);
  url.searchParams.set("accept-language", "vi");
  if (email) {
    url.searchParams.set("email", email);
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`OSM_HTTP_${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error("OSM_NO_RESULTS");
  }

  const result = payload[0];
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error("OSM_NO_LOCATION");
  }

  return {
    latitude,
    longitude,
    ambiguous: payload.length > 1,
    provider: "osm",
  };
};

export default function OrgUnitsPage() {
  const [loading, setLoading] = React.useState(false);
  const [geoLoading, setGeoLoading] = React.useState(false);
  const [units, setUnits] = React.useState<OrgUnitRecord[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<"create" | "edit">("create");
  const [parentForCreate, setParentForCreate] = React.useState<OrgUnitRecord | null>(null);

  const [form] = Form.useForm<OrgUnitPayload>();

  const selectedUnit = React.useMemo(
    () => units.find((item) => item.id === selectedId) ?? null,
    [units, selectedId],
  );

  const parentOptions = React.useMemo(() => {
    if (!selectedUnit) {
      return units.map((item) => ({
        label: `${item.name} (${item.code || "-"})`,
        value: item.id,
      }));
    }

    const childrenMap = buildChildrenMap(units);
    const blocked = new Set<string>([selectedUnit.id]);
    const stack = [...(childrenMap.get(selectedUnit.id) ?? [])];
    while (stack.length) {
      const current = stack.pop()!;
      if (blocked.has(current)) continue;
      blocked.add(current);
      const children = childrenMap.get(current);
      if (children) {
        stack.push(...children);
      }
    }

    return units
      .filter((item) => !blocked.has(item.id))
      .map((item) => ({
        label: `${item.name} (${item.code || "-"})`,
        value: item.id,
      }));
  }, [units, selectedUnit]);

  const { treeData, expandedKeys: searchExpandedKeys } = React.useMemo(
    () => buildTree(units, searchText),
    [units, searchText],
  );

  React.useEffect(() => {
    if (searchText.trim()) {
      setExpandedKeys(searchExpandedKeys);
      setAutoExpandParent(true);
    }
  }, [searchExpandedKeys, searchText]);

  const loadUnits = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await orgUnitsService.listUnits();
      setUnits(
        data.map((item) => ({
          ...item,
          is_active: item.is_active ?? true,
        })),
      );
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải đơn vị.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadUnits();
  }, [loadUnits]);

  const openCreateRoot = () => {
    setDrawerMode("create");
    setParentForCreate(null);
    form.resetFields();
    form.setFieldsValue({
      is_active: true,
      level: 1,
      type: "central",
      order_index: undefined,
    });
    setDrawerOpen(true);
  };

  const openCreateChild = () => {
    if (!selectedUnit) return;
    setDrawerMode("create");
    setParentForCreate(selectedUnit);
    form.resetFields();
    const nextLevel = selectedUnit.level ? selectedUnit.level + 1 : 1;
    form.setFieldsValue({
      parent_id: selectedUnit.id,
      is_active: true,
      level: nextLevel,
      type: levelToType(nextLevel),
      order_index: undefined,
    });
    setDrawerOpen(true);
  };

  const openEdit = () => {
    if (!selectedUnit) return;
      setDrawerMode("edit");
      setParentForCreate(null);
      form.resetFields();
      form.setFieldsValue({
        parent_id: selectedUnit.parent_id ?? null,
        name: selectedUnit.name,
        code: selectedUnit.code,
        short_name: selectedUnit.short_name ?? "",
        type: selectedUnit.type ?? levelToType(selectedUnit.level),
        level: selectedUnit.level ?? undefined,
        order_index: selectedUnit.order_index ?? undefined,
        address: selectedUnit.address ?? "",
        latitude: selectedUnit.latitude ?? undefined,
        longitude: selectedUnit.longitude ?? undefined,
        is_active: selectedUnit.is_active ?? true,
      });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (loading) return;
    setDrawerOpen(false);
  };

  const handleUpdateLocation = async () => {
    const provider = (import.meta.env.VITE_GEOCODER_PROVIDER as string | undefined)?.toLowerCase();
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    const useGoogle = provider ? provider === "google" : Boolean(apiKey);
    const useOsm = provider ? provider === "osm" : true;

    if (useGoogle && !apiKey) {
      message.error(
        "Chưa cấu hình Google Maps API Key. Vui lòng set VITE_GOOGLE_MAPS_API_KEY trong .env.local.",
      );
      return;
    }

    const address = (form.getFieldValue("address") || "").trim();
    if (!address) {
      message.warning("Vui lòng nhập địa chỉ trước khi cập nhật vị trí.");
      return;
    }

    setGeoLoading(true);
    message.loading({ content: "Đang tra cứu vị trí...", key: "location" });

    try {
      const errors: string[] = [];
      let result: GeocodeResult | null = null;

      if (useGoogle && apiKey) {
        try {
          result = await geocodeWithGoogle(address, apiKey);
        } catch (err) {
          errors.push(err instanceof Error ? err.message : "GOOGLE_UNKNOWN");
        }
      }

      if (!result && useOsm) {
        try {
          result = await geocodeWithOsm(address, import.meta.env.VITE_NOMINATIM_EMAIL as string | undefined);
        } catch (err) {
          errors.push(err instanceof Error ? err.message : "OSM_UNKNOWN");
        }
      }

      if (!result) {
        const errorText = errors.join(" | ");
        if (errorText.includes("ZERO_RESULTS") || errorText.includes("NO_RESULTS")) {
          message.warning({
            content:
              "Không xác định được vị trí. Hãy bổ sung địa chỉ chi tiết (VD: 123 Trần Hưng Đạo, Hà Nội, Việt Nam).",
            key: "location",
          });
          return;
        }

        if (errorText.includes("REQUEST_DENIED") || errorText.includes("GOOGLE_")) {
          message.error({
            content:
              "Google Geocoding bị từ chối. Hãy kiểm tra API key, bật Geocoding API và thêm referrer 172.16.0.2:5173.",
            key: "location",
          });
          return;
        }

        message.error({ content: "Không thể tra cứu vị trí. Vui lòng thử lại.", key: "location" });
        return;
      }

      form.setFieldsValue({
        latitude: Number(result.latitude.toFixed(6)),
        longitude: Number(result.longitude.toFixed(6)),
      });

      if (result.ambiguous) {
        message.warning({
          content: "Địa chỉ có thể chưa đủ rõ ràng. Vui lòng xác nhận lại.",
          key: "location",
        });
      } else {
        const providerLabel = result.provider === "osm" ? "OpenStreetMap" : "Google";
        message.success({ content: `Đã cập nhật vị trí (${providerLabel}).`, key: "location" });
      }
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tra cứu vị trí.";
      message.error({ content: messageText, key: "location" });
    } finally {
      setGeoLoading(false);
    }
  };

  const buildPath = (code: string, parentId?: string | null) => {
    if (!parentId) return code;
    const parent = units.find((item) => item.id === parentId);
    if (parent?.path) {
      return `${parent.path}.${code}`;
    }
    return code;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const parentId =
        parentForCreate?.id ??
        values.parent_id ??
        (drawerMode === "edit" ? selectedUnit?.parent_id ?? null : null);
      const payload: OrgUnitPayload = {
        parent_id: parentId,
        name: values.name?.trim(),
        code: values.code?.trim(),
        short_name: values.short_name?.trim() || null,
        type: values.type?.trim() || null,
        level: values.level ?? (parentForCreate?.level ? parentForCreate.level + 1 : 1),
        order_index: typeof values.order_index === "number" ? values.order_index : null,
        address: values.address?.trim() || null,
        latitude: values.latitude ?? null,
        longitude: values.longitude ?? null,
        is_active: values.is_active ?? true,
        path: values.code ? buildPath(values.code.trim(), parentId) : null,
      };

      if (!payload.code || !payload.name) {
        return;
      }

      setLoading(true);

      if (drawerMode === "create") {
        const isTaken = await orgUnitsService.isCodeTaken(payload.code);
        if (isTaken) {
          message.error(`Mã đơn vị "${payload.code}" đã tồn tại.`);
          setLoading(false);
          return;
        }
        await orgUnitsService.createUnit(payload);
        message.success("Tạo đơn vị thành công.");
      } else if (selectedUnit) {
        await orgUnitsService.updateUnit(selectedUnit.id, payload);
        message.success("Cập nhật đơn vị thành công.");
      }

      setDrawerOpen(false);
      await loadUnits();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu đơn vị.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUnit) return;
    try {
      setLoading(true);
      await orgUnitsService.toggleStatus(selectedUnit.id, !selectedUnit.is_active);
      message.success(
        selectedUnit.is_active ? "Đã ngừng hoạt động đơn vị." : "Đã kích hoạt đơn vị.",
      );
      await loadUnits();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật trạng thái.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PermissionGate permission="sa.masterdata.orgunit.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "Dữ liệu nền" },
            { label: "Đơn vị tổ chức" },
          ]}
          title="Danh mục Đơn vị tổ chức"
          subtitle="Quản lý cơ cấu tổ chức và phân cấp đơn vị"
        />

        <div className="px-6 pb-8">
          <Row gutter={16}>
            <Col flex="360px">
              <Card
                title="Cây đơn vị"
                extra={
                  <Space>
                    <Button onClick={openCreateRoot} icon={<PlusOutlined />} size="small">
                      Thêm đơn vị
                    </Button>
                    <Button
                      onClick={openCreateChild}
                      icon={<PlusOutlined />}
                      size="small"
                      disabled={!selectedUnit}
                    >
                      Thêm đơn vị con
                    </Button>
                  </Space>
                }
              >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Input
                    placeholder="Tìm đơn vị..."
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                  />
                  <Tree
                    treeData={treeData}
                    selectedKeys={selectedId ? [selectedId] : []}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onExpand={(keys) => {
                      setExpandedKeys(keys as React.Key[]);
                      setAutoExpandParent(false);
                    }}
                    onSelect={(keys) => {
                      setSelectedId(keys.length > 0 ? String(keys[0]) : null);
                    }}
                  />
                </Space>
              </Card>
            </Col>
            <Col flex="auto">
              <Card
                title="Thông tin đơn vị"
                bodyStyle={{ minHeight: 520 }}
                extra={
                  selectedUnit ? (
                    <Space>
                      <Button icon={<EditOutlined />} onClick={openEdit}>
                        Sửa
                      </Button>
                      <Popconfirm
                        title={
                          selectedUnit.is_active
                            ? "Ngừng hoạt động đơn vị này?"
                            : "Kích hoạt lại đơn vị này?"
                        }
                        okText="Xác nhận"
                        cancelText="Hủy"
                        onConfirm={handleToggleStatus}
                      >
                        <Button danger={selectedUnit.is_active} icon={<StopOutlined />}>
                          {selectedUnit.is_active ? "Ngừng" : "Kích hoạt"}
                        </Button>
                      </Popconfirm>
                    </Space>
                  ) : null
                }
              >
                {!selectedUnit ? (
                  <Empty description="Chọn một đơn vị bên trái để xem chi tiết." />
                ) : (
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                      <Typography.Title level={4} style={{ marginBottom: 4 }}>
                        {selectedUnit.name}
                      </Typography.Title>
                      <Space size="middle">
                      <Typography.Text type="secondary">
                        {selectedUnit.code || "-"} • Cấp {selectedUnit.level ?? "-"} •{" "}
                        {getTypeLabel(selectedUnit.type)}
                      </Typography.Text>
                      <Tag color={selectedUnit.is_active ? "green" : "red"}>
                        {selectedUnit.is_active ? "Hoạt động" : "Ngừng"}
                      </Tag>
                      </Space>
                    </div>

                    <Descriptions column={2} bordered size="small">
                      <Descriptions.Item label="Mã đơn vị">
                        {selectedUnit.code || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tên đơn vị">
                        {selectedUnit.name || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tên ngắn">
                        {selectedUnit.short_name || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Cấp">
                        {selectedUnit.level ?? "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Loại">
                        {getTypeLabel(selectedUnit.type)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Thứ tự">
                        {selectedUnit.order_index ?? "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Đơn vị cha">
                        {findParentLabel(units, selectedUnit.parent_id)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ">
                        {selectedUnit.address || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Vĩ độ">
                        {selectedUnit.latitude ?? "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Kinh độ">
                        {selectedUnit.longitude ?? "-"}
                      </Descriptions.Item>
                    </Descriptions>
                  </Space>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Drawer
        title={drawerMode === "create" ? "Thêm đơn vị" : "Chỉnh sửa đơn vị"}
        placement="right"
        width={420}
        open={drawerOpen}
        onClose={closeDrawer}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={closeDrawer}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Lưu
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="parent_id" hidden>
            <Input />
          </Form.Item>
          {parentForCreate && (
            <Form.Item label="Đơn vị cha">
              <Input value={`${parentForCreate.name} (${parentForCreate.code})`} disabled />
            </Form.Item>
          )}
          {!parentForCreate && drawerMode === "edit" && (
            <Form.Item name="parent_id" label="Đơn vị cha">
              <Select
                options={parentOptions}
                placeholder="Chọn đơn vị cha"
                allowClear
              />
            </Form.Item>
          )}
          <Form.Item
            name="code"
            label="Mã đơn vị"
            rules={[{ required: true, message: "Vui lòng nhập mã đơn vị." }]}
          >
            <Input placeholder="VD: DV-001" disabled={drawerMode === "edit"} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên đơn vị"
            rules={[{ required: true, message: "Vui lòng nhập tên đơn vị." }]}
          >
            <Input placeholder="VD: Cục Quản lý thị trường" />
          </Form.Item>
          <Form.Item name="short_name" label="Tên ngắn">
            <Input placeholder="VD: Cục QLTT" />
          </Form.Item>
          <Form.Item name="type" label="Loại đơn vị">
            <Select
              options={ORG_UNIT_TYPE_OPTIONS}
              placeholder="Chọn loại đơn vị"
              allowClear
            />
          </Form.Item>
          <Form.Item name="order_index" label="Thứ tự hiển thị">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="level" label="Cấp">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="VD: 123 Trần Hưng Đạo" />
          </Form.Item>
          <Button
            type="link"
            icon={<EnvironmentOutlined />}
            onClick={handleUpdateLocation}
            loading={geoLoading}
            style={{ padding: 0 }}
          >
            Cập nhật vị trí trên bản đồ
          </Button>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="latitude" label="Vĩ độ">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="longitude" label="Kinh độ">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="is_active" label="Trạng thái" valuePropName="checked">
            <Switch
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren={<CloseCircleOutlined />}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </PermissionGate>
  );
}
