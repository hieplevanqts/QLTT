import React from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Tag,
  Tree,
  Typography,
  message,
} from "antd";
import type { DataNode } from "antd/es/tree";
import { SaveOutlined } from "@ant-design/icons";

import PageHeader from "@/layouts/PageHeader";
import { PermissionGate } from "../../_shared";
import { useAuth } from "../../../../contexts/AuthContext";
import { CenteredModalShell } from "@/components/overlays/CenteredModalShell";
import { EnterpriseModalHeader } from "@/components/overlays/EnterpriseModalHeader";
import {
  adminUnitsService,
  type AdminUnitCoordinates,
  type AdminUnitLevel,
  type ProvinceRecord,
  type WardRecord,
} from "../services/adminUnits.service";
import { adminUnitProfilesService } from "../services/adminUnitProfiles.service";
import {
  adminUnitMetricsService,
  type PeriodGranularity,
  type PeriodRecord,
} from "../services/adminUnitMetrics.service";
import { unitAreaAssignmentsService } from "../services/unitAreaAssignments.service";

type AdminAreaRecord = {
  id: string;
  level: AdminUnitLevel;
  code: string;
  name: string;
  province_id?: string | null;
  area?: string | null;
  officer?: string | null;
};

type AdminAreaNode = DataNode & { data: AdminAreaRecord; level: AdminUnitLevel };

type ScopeState = {
  allowAll: boolean;
  provinceIds: string[];
  wardIds: string[];
};

const buildProvinceNode = (province: ProvinceRecord): AdminAreaNode => ({
  key: `province:${province.id}`,
  title: `${province.name} (${province.code})`,
  isLeaf: false,
  level: "province",
  data: {
    id: province.id,
    level: "province",
    code: province.code,
    name: province.name,
  },
});

const buildWardNode = (ward: WardRecord): AdminAreaNode => ({
  key: `ward:${ward.id}`,
  title: `${ward.name} (${ward.code})`,
  isLeaf: true,
  level: "ward",
  data: {
    id: ward.id,
    level: "ward",
    code: ward.code,
    name: ward.name,
    province_id: ward.province_id,
    area: ward.area ?? null,
    officer: ward.officer ?? null,
  },
});

const updateTreeChildren = (
  nodes: AdminAreaNode[],
  key: React.Key,
  children: AdminAreaNode[],
): AdminAreaNode[] =>
  nodes.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return { ...node, children: updateTreeChildren(node.children as AdminAreaNode[], key, children) };
    }
    return node;
  });

const granularityOptions = [
  { value: "month", label: "Tháng" },
  { value: "quarter", label: "Quý" },
  { value: "year", label: "Năm" },
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export default function AdminAreasPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [treeData, setTreeData] = React.useState<AdminAreaNode[]>([]);
  const [provinceList, setProvinceList] = React.useState<ProvinceRecord[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchWards, setSearchWards] = React.useState<WardRecord[]>([]);
  const searchTimer = React.useRef<number | null>(null);
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);
  const loadedProvinceIds = React.useRef<Set<string>>(new Set());

  const [selectedNode, setSelectedNode] = React.useState<AdminAreaNode | null>(null);
  const [selectedProvince, setSelectedProvince] = React.useState<ProvinceRecord | null>(null);

  const [scope, setScope] = React.useState<ScopeState>({
    allowAll: true,
    provinceIds: [],
    wardIds: [],
  });

  const [profileLoading, setProfileLoading] = React.useState(false);
  const [metricsLoading, setMetricsLoading] = React.useState(false);
  const [coordsLoading, setCoordsLoading] = React.useState(false);

  const [coordinates, setCoordinates] = React.useState<AdminUnitCoordinates | null>(null);
  const [period, setPeriod] = React.useState<PeriodRecord | null>(null);
  const [granularity, setGranularity] = React.useState<PeriodGranularity>("month");
  const [year, setYear] = React.useState<number>(currentYear);
  const [month, setMonth] = React.useState<number>(currentMonth);
  const [quarter, setQuarter] = React.useState<number>(1);

  const [basicForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [metricsForm] = Form.useForm();
  const [coordForm] = Form.useForm();
  const [coordModalOpen, setCoordModalOpen] = React.useState(false);
  const [coordSaving, setCoordSaving] = React.useState(false);

  const userDepartmentId = user?.departmentInfo?.id ?? null;
  const userLevel = user?.departmentInfo?.level ?? null;

  const canManageSelected = React.useMemo(() => {
    if (!selectedNode) return false;
    if (scope.allowAll) return true;
    if (selectedNode.level === "province") {
      return scope.provinceIds.includes(selectedNode.data.id);
    }
    if (scope.wardIds.length > 0) {
      return scope.wardIds.includes(selectedNode.data.id);
    }
    const provinceId = selectedNode.data.province_id;
    return Boolean(provinceId && scope.provinceIds.includes(provinceId));
  }, [scope, selectedNode]);

  const loadScope = React.useCallback(async () => {
    if (!userDepartmentId || !userLevel || userLevel === 1) {
      setScope({ allowAll: true, provinceIds: [], wardIds: [] });
      return;
    }

    try {
      const assignments = await unitAreaAssignmentsService.listDepartmentAreas(userDepartmentId);
      const provinceAssignment = assignments.find((item) => item.area?.ward_id == null);
      if (provinceAssignment?.area?.province_id) {
        setScope({
          allowAll: false,
          provinceIds: [provinceAssignment.area.province_id],
          wardIds: [],
        });
        return;
      }

      const wardIds = assignments
        .map((item) => item.area?.ward_id)
        .filter((wardId): wardId is string => Boolean(wardId));

      if (wardIds.length === 0) {
        setScope({ allowAll: false, provinceIds: [], wardIds: [] });
        return;
      }

      const wards = await unitAreaAssignmentsService.getWardsByIds(wardIds);
      const provinceIds = Array.from(new Set(wards.map((ward) => ward.province_id)));
      setScope({ allowAll: false, provinceIds, wardIds });
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải phạm vi địa bàn.";
      message.error(messageText);
    }
  }, [userDepartmentId, userLevel]);

  const loadProvinces = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminUnitsService.listProvinces();
      const filtered = scope.allowAll
        ? data
        : data.filter((province) => scope.provinceIds.includes(province.id));

      setProvinceList(filtered);
      setTreeData(filtered.map(buildProvinceNode));
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải tỉnh/TP.";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  React.useEffect(() => {
    void loadScope();
  }, [loadScope]);

  React.useEffect(() => {
    void loadProvinces();
  }, [loadProvinces]);

  React.useEffect(() => {
    const query = searchText.trim();
    if (!query) {
      setSearchWards([]);
      setSearchLoading(false);
      return;
    }

    if (searchTimer.current) {
      window.clearTimeout(searchTimer.current);
    }

    searchTimer.current = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const wards = await adminUnitsService.searchWards(query, {
          provinceIds: scope.allowAll ? undefined : scope.provinceIds,
          wardIds: scope.allowAll ? undefined : scope.wardIds.length > 0 ? scope.wardIds : undefined,
          limit: 200,
        });
        setSearchWards(wards);
      } catch (err) {
        const messageText = err instanceof Error ? err.message : "Không thể tìm phường/xã.";
        message.error(messageText);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimer.current) {
        window.clearTimeout(searchTimer.current);
      }
    };
  }, [scope, searchText]);

  const filteredTreeData = React.useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return treeData;
    }

    const wardMap = new Map<string, WardRecord[]>();
    searchWards.forEach((ward) => {
      const list = wardMap.get(ward.province_id) ?? [];
      list.push(ward);
      wardMap.set(ward.province_id, list);
    });

    const nodes = provinceList
      .filter((province) => {
        const matches =
          province.name.toLowerCase().includes(query) ||
          province.code.toLowerCase().includes(query);
        return matches || wardMap.has(province.id);
      })
      .map((province) => {
        const wards = wardMap.get(province.id) ?? [];
        return {
          ...buildProvinceNode(province),
          children: wards.map(buildWardNode),
        };
      });

    return nodes;
  }, [provinceList, searchText, searchWards, treeData]);

  React.useEffect(() => {
    const query = searchText.trim();
    if (!query) {
      setExpandedKeys([]);
      setAutoExpandParent(true);
      return;
    }

    const keys = filteredTreeData.map((node) => node.key);
    setExpandedKeys(keys);
    setAutoExpandParent(true);
  }, [filteredTreeData, searchText]);

  const loadWards = async (provinceId: string) => {
    const wards = await adminUnitsService.listWardsByProvince(provinceId);
    if (scope.allowAll || scope.wardIds.length === 0) {
      return wards;
    }
    return wards.filter((ward) => scope.wardIds.includes(ward.id));
  };

  const handleLoadData = async (node: AdminAreaNode) => {
    if (node.level !== "province") return;
    const provinceId = node.data.id;
    if (loadedProvinceIds.current.has(provinceId)) return;
    const wards = await loadWards(provinceId);
    loadedProvinceIds.current.add(provinceId);
    const wardNodes = wards.map(buildWardNode);
    setTreeData((prev) => updateTreeChildren(prev, node.key, wardNodes));
  };

  const handleSelectNode = (node: AdminAreaNode) => {
    setSelectedNode(node);
    if (node.level === "province") {
      setSelectedProvince({
        id: node.data.id,
        code: node.data.code,
        name: node.data.name,
      });
    } else {
      const provinceId = node.data.province_id;
      if (provinceId && scope.provinceIds.includes(provinceId)) {
        const provinceNode = treeData.find((item) => item.data.id === provinceId);
        if (provinceNode) {
          setSelectedProvince({
            id: provinceNode.data.id,
            code: provinceNode.data.code,
            name: provinceNode.data.name,
          });
        }
      }
    }
  };

  const resetDetailForms = () => {
    basicForm.resetFields();
    profileForm.resetFields();
    metricsForm.resetFields();
    setCoordinates(null);
    setPeriod(null);
  };

  const loadDetails = React.useCallback(async () => {
    if (!selectedNode) {
      resetDetailForms();
      return;
    }

    const data = selectedNode.data;
    basicForm.setFieldsValue({
      code: data.code,
      name: data.name,
      area: data.area ?? null,
      officer: data.officer ?? null,
    });

    setProfileLoading(true);
    setCoordsLoading(true);

    try {
      const profile = await adminUnitProfilesService.getProfile(data.level, data.id);
      profileForm.setFieldsValue({
        headline: profile?.headline ?? "",
        summary: profile?.summary ?? "",
        homepage_url: profile?.homepage_url ?? "",
        banner_url: profile?.banner_url ?? "",
        thumbnail_url: profile?.thumbnail_url ?? "",
        news_config: profile?.news_config ? JSON.stringify(profile.news_config, null, 2) : "",
        seo_title: profile?.seo_title ?? "",
        seo_description: profile?.seo_description ?? "",
        tags: profile?.tags ?? [],
        status: profile?.status ?? "active",
      });
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải profile.";
      message.error(messageText);
    } finally {
      setProfileLoading(false);
    }

    try {
      const coords = await adminUnitsService.getCoordinates(data.level, data.id);
      setCoordinates(coords);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải tọa độ.";
      message.error(messageText);
    } finally {
      setCoordsLoading(false);
    }
  }, [basicForm, profileForm, selectedNode]);

  React.useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  const loadMetrics = React.useCallback(async () => {
    if (!selectedNode) return;
    setMetricsLoading(true);
    try {
      const found = await adminUnitMetricsService.findPeriod(granularity, year, quarter, month);
      setPeriod(found);
      if (!found) {
        metricsForm.resetFields();
        return;
      }
      const metric = await adminUnitMetricsService.getMetric(selectedNode.data.level, selectedNode.data.id, found.id);
      metricsForm.setFieldsValue({
        population: metric?.population ?? null,
        area_km2: metric?.area_km2 ?? null,
        grdp: metric?.grdp ?? null,
        total_revenue: metric?.total_revenue ?? null,
      });
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể tải số liệu.";
      message.error(messageText);
    } finally {
      setMetricsLoading(false);
    }
  }, [granularity, month, quarter, year, metricsForm, selectedNode]);

  React.useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  const handleSaveBasic = async () => {
    if (!selectedNode) return;
    if (!canManageSelected) {
      message.warning("Bạn không có quyền cập nhật mục này.");
      return;
    }

    try {
      const values = await basicForm.validateFields();
      if (selectedNode.level === "province") {
        const updated = await adminUnitsService.updateProvince(selectedNode.data.id, {
          code: values.code?.trim(),
          name: values.name?.trim(),
        });
        const nextNode: AdminAreaNode = {
          ...selectedNode,
          title: `${updated.name} (${updated.code})`,
          data: { ...selectedNode.data, code: updated.code, name: updated.name },
        };
        setSelectedNode(nextNode);
      } else {
        const updated = await adminUnitsService.updateWard(selectedNode.data.id, {
          code: values.code?.trim(),
          name: values.name?.trim(),
          area: values.area?.trim() || null,
          officer: values.officer?.trim() || null,
        });
        const nextNode: AdminAreaNode = {
          ...selectedNode,
          title: `${updated.name} (${updated.code})`,
          data: {
            ...selectedNode.data,
            code: updated.code,
            name: updated.name,
            area: updated.area ?? null,
            officer: updated.officer ?? null,
          },
        };
        setSelectedNode(nextNode);
      }
      message.success("Đã cập nhật dữ liệu hành chính.");
      await loadProvinces();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật.";
      message.error(messageText);
    }
  };

  const handleSaveProfile = async () => {
    if (!selectedNode) return;
    if (!canManageSelected) {
      message.warning("Bạn không có quyền cập nhật profile.");
      return;
    }
    try {
      const values = await profileForm.validateFields();
      let newsConfig: Record<string, unknown> | null = null;
      if (values.news_config?.trim()) {
        try {
          newsConfig = JSON.parse(values.news_config);
        } catch (err) {
          message.error("Cấu hình tin tức phải là JSON hợp lệ.");
          return;
        }
      }

      await adminUnitProfilesService.upsertProfile(selectedNode.data.level, selectedNode.data.id, {
        headline: values.headline?.trim() || null,
        summary: values.summary?.trim() || null,
        homepage_url: values.homepage_url?.trim() || null,
        banner_url: values.banner_url?.trim() || null,
        thumbnail_url: values.thumbnail_url?.trim() || null,
        news_config: newsConfig,
        seo_title: values.seo_title?.trim() || null,
        seo_description: values.seo_description?.trim() || null,
        tags: values.tags ?? [],
        status: values.status ?? "active",
      });
      message.success("Đã lưu profile.");
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu profile.";
      message.error(messageText);
    }
  };

  const handleSaveMetrics = async () => {
    if (!selectedNode) return;
    if (!canManageSelected) {
      message.warning("Bạn không có quyền cập nhật số liệu.");
      return;
    }
    try {
      const values = await metricsForm.validateFields();
      const ensured = await adminUnitMetricsService.ensurePeriod(granularity, year, quarter, month);
      setPeriod(ensured);
      await adminUnitMetricsService.upsertMetric(
        selectedNode.data.level,
        selectedNode.data.id,
        ensured.id,
        {
          population: values.population ?? null,
          area_km2: values.area_km2 ?? null,
          grdp: values.grdp ?? null,
          total_revenue: values.total_revenue ?? null,
        },
      );
      message.success("Đã lưu số liệu.");
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể lưu số liệu.";
      message.error(messageText);
    }
  };

  const getLatLng = (coords: AdminUnitCoordinates | null) => {
    if (!coords) return null;
    const lat = coords.center_lat;
    const lng = coords.center_lng;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return { lat, lng };
  };

  const parseBounds = (raw: unknown) => {
    if (!raw) return null;
    let value: any = raw;
    if (typeof raw === "string") {
      try {
        value = JSON.parse(raw);
      } catch {
        return null;
      }
    }
    if (typeof value === "object" && value) {
      if ("west" in value && "east" in value && "south" in value && "north" in value) {
        return {
          west: Number(value.west),
          east: Number(value.east),
          south: Number(value.south),
          north: Number(value.north),
        };
      }
    }
    return null;
  };

  const buildOsmEmbedUrl = (lat: number, lng: number, bounds?: { west: number; east: number; south: number; north: number } | null) => {
    const delta = 0.02;
    const west = bounds?.west ?? lng - delta;
    const east = bounds?.east ?? lng + delta;
    const south = bounds?.south ?? lat - delta;
    const north = bounds?.north ?? lat + delta;
    const bbox = [west, south, east, north].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  };

  const openCoordModal = () => {
    if (!selectedNode) return;
    coordForm.setFieldsValue({
      lat: coordinates?.center_lat ?? null,
      lng: coordinates?.center_lng ?? null,
    });
    setCoordModalOpen(true);
  };

  const handleSaveCoordinates = async () => {
    if (!selectedNode) return;
    if (!canManageSelected) {
      message.warning("Bạn không có quyền cập nhật tọa độ.");
      return;
    }
    try {
      const values = await coordForm.validateFields();
      setCoordSaving(true);
      await adminUnitsService.upsertCoordinates(
        selectedNode.data.level,
        selectedNode.data.id,
        Number(values.lat),
        Number(values.lng),
      );
      message.success("Đã cập nhật tọa độ.");
      setCoordModalOpen(false);
      await loadDetails();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Không thể cập nhật tọa độ.";
      message.error(messageText);
    } finally {
      setCoordSaving(false);
    }
  };

  return (
    <PermissionGate permission="sa.masterdata.jurisdiction.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "Dữ liệu nền" },
            { label: "Danh mục hành chính" },
          ]}
          title="Danh mục hành chính"
          subtitle="Quản lý tỉnh/TP và phường/xã theo mô hình 2 cấp"
        />

        <div className="px-6 pb-8">
          <Row gutter={16}>
            <Col flex="360px">
              <Card title="Cây địa bàn" styles={{ body: { minHeight: 520 } }}>
                {loading ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                    <Spin />
                  </div>
                ) : treeData.length === 0 ? (
                  <Empty description="Không có dữ liệu địa bàn trong phạm vi." />
                ) : (
                  <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                    <Input
                      placeholder="Tìm tỉnh/TP hoặc phường/xã..."
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      loading={searchLoading}
                    />
                    <Tree
                      treeData={filteredTreeData}
                      loadData={(node) => handleLoadData(node as AdminAreaNode)}
                      selectedKeys={selectedNode ? [selectedNode.key] : []}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onExpand={(keys) => {
                        setExpandedKeys(keys as React.Key[]);
                        setAutoExpandParent(false);
                      }}
                      onSelect={(_, info) => handleSelectNode(info.node as AdminAreaNode)}
                    />
                  </Space>
                )}
              </Card>
            </Col>
            <Col flex="auto">
              <Card title="Chi tiết địa bàn" styles={{ body: { minHeight: 520 } }}>
                {!selectedNode ? (
                  <Empty description="Chọn một địa bàn bên trái để xem chi tiết." />
                ) : (
                  <Tabs
                    items={[
                      {
                        key: "admin",
                        label: "Hành chính",
                        children: (
                          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                            {!canManageSelected && (
                              <Alert
                                type="warning"
                                showIcon
                                title="Bạn không có quyền chỉnh sửa mục này."
                              />
                            )}
                            <Descriptions bordered size="small" column={2}>
                              <Descriptions.Item label="Cấp">
                                <Tag color={selectedNode.level === "province" ? "blue" : "green"}>
                                  {selectedNode.level === "province" ? "Tỉnh/TP" : "Phường/Xã"}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Mã">
                                {selectedNode.data.code}
                              </Descriptions.Item>
                              <Descriptions.Item label="Tên">
                                {selectedNode.data.name}
                              </Descriptions.Item>
                              <Descriptions.Item label="Tỉnh/TP">
                                {selectedNode.level === "ward"
                                  ? selectedProvince?.name || selectedNode.data.province_id || "-"
                                  : "-"}
                              </Descriptions.Item>
                            </Descriptions>

                            <Form layout="vertical" form={basicForm}>
                              <Form.Item
                                name="code"
                                label="Mã địa bàn"
                                rules={[{ required: true, message: "Vui lòng nhập mã." }]}
                              >
                                <Input disabled={!canManageSelected} />
                              </Form.Item>
                              <Form.Item
                                name="name"
                                label="Tên địa bàn"
                                rules={[{ required: true, message: "Vui lòng nhập tên." }]}
                              >
                                <Input disabled={!canManageSelected} />
                              </Form.Item>
                              {selectedNode.level === "ward" && (
                                <>
                                  <Form.Item name="area" label="Khu vực">
                                    <Input disabled={!canManageSelected} />
                                  </Form.Item>
                                  <Form.Item name="officer" label="Cán bộ phụ trách">
                                    <Input disabled={!canManageSelected} />
                                  </Form.Item>
                                </>
                              )}
                              <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSaveBasic}
                                disabled={!canManageSelected}
                              >
                                Lưu thông tin
                              </Button>
                            </Form>
                          </Space>
                        ),
                      },
                      {
                        key: "profile",
                        label: "Profile/Nội dung",
                        children: (
                          <Form layout="vertical" form={profileForm}>
                            {profileLoading ? (
                              <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                                <Spin />
                              </div>
                            ) : (
                              <>
                                <Form.Item name="headline" label="Tiêu đề">
                                  <Input disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="summary" label="Tóm tắt">
                                  <Input.TextArea rows={3} disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="homepage_url" label="Trang chủ">
                                  <Input disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="banner_url" label="Banner">
                                  <Input disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="thumbnail_url" label="Thumbnail">
                                  <Input disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="news_config" label="Cấu hình tin tức (JSON)">
                                  <Input.TextArea rows={4} disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="seo_title" label="SEO Title">
                                  <Input disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="seo_description" label="SEO Description">
                                  <Input.TextArea rows={3} disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="tags" label="Tags">
                                  <Select mode="tags" disabled={!canManageSelected} />
                                </Form.Item>
                                <Form.Item name="status" label="Trạng thái">
                                  <Select
                                    options={[
                                      { value: "active", label: "Hoạt động" },
                                      { value: "inactive", label: "Ngừng" },
                                    ]}
                                    disabled={!canManageSelected}
                                  />
                                </Form.Item>
                                <Button
                                  type="primary"
                                  icon={<SaveOutlined />}
                                  onClick={handleSaveProfile}
                                  disabled={!canManageSelected}
                                >
                                  Lưu profile
                                </Button>
                              </>
                            )}
                          </Form>
                        ),
                      },
                      {
                        key: "metrics",
                        label: "Số liệu",
                        children: (
                          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                            <Space wrap>
                              <Select
                                value={granularity}
                                options={granularityOptions}
                                onChange={(value) => setGranularity(value as PeriodGranularity)}
                              />
                              <InputNumber
                                min={2000}
                                max={2100}
                                value={year}
                                onChange={(value) => setYear(value ?? currentYear)}
                                placeholder="Năm"
                              />
                              {granularity === "month" && (
                                <InputNumber
                                  min={1}
                                  max={12}
                                  value={month}
                                  onChange={(value) => setMonth(value ?? 1)}
                                  placeholder="Tháng"
                                />
                              )}
                              {granularity === "quarter" && (
                                <InputNumber
                                  min={1}
                                  max={4}
                                  value={quarter}
                                  onChange={(value) => setQuarter(value ?? 1)}
                                  placeholder="Quý"
                                />
                              )}
                            </Space>

                            {period && (
                              <Alert
                                type="info"
                                showIcon
                                title={`Đang nhập dữ liệu cho: ${period.label}`}
                              />
                            )}

                            {metricsLoading ? (
                              <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                                <Spin />
                              </div>
                            ) : (
                              <Form layout="vertical" form={metricsForm}>
                                <Form.Item name="population" label="Dân số">
                                  <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                                <Form.Item name="area_km2" label="Diện tích (km²)">
                                  <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                                <Form.Item name="grdp" label="GRDP">
                                  <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                                <Form.Item name="total_revenue" label="Tổng doanh thu">
                                  <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                                <Button
                                  type="primary"
                                  icon={<SaveOutlined />}
                                  onClick={handleSaveMetrics}
                                  disabled={!canManageSelected}
                                >
                                  Lưu số liệu
                                </Button>
                              </Form>
                            )}

                            <Alert
                              type="warning"
                              showIcon
                              title="Số liệu theo ngành hàng sẽ triển khai ở sprint sau."
                            />
                          </Space>
                        ),
                      },
                      {
                        key: "map",
                        label: "Map Preview",
                        children: coordsLoading ? (
                          <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                            <Spin />
                          </div>
                        ) : coordinates ? (
                          <Space orientation="vertical" size="small" style={{ width: "100%" }}>
                            <Typography.Text>
                              Trung tâm: {coordinates.center_lat ?? "-"}, {coordinates.center_lng ?? "-"}
                            </Typography.Text>
                            <Typography.Text>
                              Bounds: {coordinates.bounds ? JSON.stringify(coordinates.bounds) : "-"}
                            </Typography.Text>
                            <Typography.Text>
                              Diện tích: {coordinates.area ?? "-"}
                            </Typography.Text>
                            <Typography.Text>
                              Cán bộ phụ trách: {coordinates.officer ?? "-"}
                            </Typography.Text>
                            {getLatLng(coordinates) ? (
                              <div
                                style={{
                                  width: "100%",
                                  height: 360,
                                  borderRadius: 8,
                                  overflow: "hidden",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <iframe
                                  title="OpenStreetMap"
                                  width="100%"
                                  height="100%"
                                  style={{ border: 0 }}
                                  loading="lazy"
                                  src={buildOsmEmbedUrl(
                                    getLatLng(coordinates)!.lat,
                                    getLatLng(coordinates)!.lng,
                                    parseBounds(coordinates.bounds),
                                  )}
                                />
                              </div>
                            ) : (
                              <Alert
                                type="warning"
                                showIcon
                                title="Chưa có tọa độ để hiển thị bản đồ."
                              />
                            )}
                            <Button type="link" onClick={openCoordModal}>
                              {getLatLng(coordinates) ? "Cập nhật tọa độ" : "Nhập tọa độ"}
                            </Button>
                          </Space>
                        ) : (
                          <Empty description="Chưa có dữ liệu tọa độ." />
                        ),
                      },
                    ]}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <CenteredModalShell
        header={<EnterpriseModalHeader title="Cập nhật tọa độ" moduleTag="master-data" />}
        open={coordModalOpen}
        onClose={() => setCoordModalOpen(false)}
        width={520}
        footer={
          <Space>
            <Button onClick={() => setCoordModalOpen(false)} disabled={coordSaving}>
              Đóng
            </Button>
            <Button type="primary" onClick={handleSaveCoordinates} loading={coordSaving}>
              Lưu
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={coordForm}>
          <Form.Item
            name="lat"
            label="Vĩ độ"
            rules={[{ required: true, message: "Vui lòng nhập vĩ độ." }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="lng"
            label="Kinh độ"
            rules={[{ required: true, message: "Vui lòng nhập kinh độ." }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </CenteredModalShell>
    </PermissionGate>
  );
}
