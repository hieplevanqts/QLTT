import { Button, Col, Row, Space, Typography, message } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import * as React from "react";
import { MenuDetailTabs } from "../components/MenuDetailTabs";
import { MenuTree } from "../components/MenuTree";
import { useMenuDetail } from "../hooks/useMenuDetail";
import { useMenuTree } from "../hooks/useMenuTree";
import { usePermissionPicker } from "../hooks/usePermissionPicker";
import { menuService } from "../services/supabase/menu.service";
import type { MenuRecord } from "../menu.types";

const { Title, Text } = Typography;

const toTreeData = (nodes: MenuRecord[]): DataNode[] =>
  nodes.map((node: any) => ({
    key: node._id,
    title: (
      <span>
        {node.label}
        {node.route_path ? <span style={{ marginLeft: 8, color: "#1677ff" }}>{node.route_path}</span> : null}
      </span>
    ),
    children: node.children ? toTreeData(node.children) : undefined,
  }));

const buildPreviewTree = (nodes: any[], rolePermIds: Set<string>) => {
  const walk = (node: any): any | null => {
    const children = (node.children ?? []).map(walk).filter(Boolean);
    const permissionIds: string[] = node.permission_ids ?? [];
    const hasPermission = permissionIds.length === 0 || permissionIds.some((id) => rolePermIds.has(id));
    const visible = node.is_visible !== false && hasPermission;
    if (node.route_path) {
      return visible ? { ...node, children } : null;
    }
    if (children.length > 0) {
      return { ...node, children };
    }
    return null;
  };

  return nodes.map(walk).filter(Boolean);
};

const getSuggestedResource = (routePath?: string | null) => {
  if (!routePath) return "";
  const cleaned = routePath.split("?")[0].split("#")[0];
  const segments = cleaned.split("/").filter(Boolean);
  if (segments.length === 0) return "";
  return segments[segments.length - 1] ?? "";
};

const MenuAdminPage: React.FC = () => {
  const [treeSearch, setTreeSearch] = React.useState<string>("");
  const [treeStatus, setTreeStatus] = React.useState<string>("all");
  const [treeGroup, setTreeGroup] = React.useState<string>("all");
  const [treeModule, setTreeModule] = React.useState<string>("all");
  const [selectedMenu, setSelectedMenu] = React.useState<MenuRecord | null>(null);
  const [roles, setRoles] = React.useState<Array<{ _id: string; name: string }>>([]);
  const [previewRoleId, setPreviewRoleId] = React.useState<string | undefined>(undefined);
  const [previewPermissionIds, setPreviewPermissionIds] = React.useState<string[]>([]);
  const [historyRows, setHistoryRows] = React.useState<Array<any>>([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [smartRouteOnly, setSmartRouteOnly] = React.useState(true);

  const { flatMenus, treeMenus, modules, loading, selectedMenuId, setSelectedMenuId, refreshMenus } =
    useMenuTree();
  const {
    assignedPermissions,
    saving,
    saveMenu,
    savePermissions,
  } = useMenuDetail(selectedMenuId);
  const {
    data: pickerData,
    total: pickerTotal,
    loading: pickerLoading,
    filters,
    setFilters,
    selectedIds,
    setSelectedIds,
  } = usePermissionPicker();

  React.useEffect(() => {
    const current = flatMenus.find((menu) => menu._id === selectedMenuId) ?? null;
    setSelectedMenu(current);
    if (current?.module_id) {
      setFilters((prev) => ({ ...prev, moduleId: current.module_id }));
    }
    if (current?.route_path && smartRouteOnly) {
      const suggested = getSuggestedResource(current.route_path);
      if (suggested) {
        setFilters((prev) => ({
          ...prev,
          resource: suggested,
          search: prev.search || suggested,
          page: 1,
        }));
      }
    }
    if (!selectedMenuId && flatMenus.length > 0) {
      setSelectedMenuId(flatMenus[0]._id);
    }
  }, [flatMenus, selectedMenuId, setFilters, smartRouteOnly]);

  React.useEffect(() => {
    void (async () => {
      try {
        const rows = await menuService.listRoles();
        setRoles(rows.map((row) => ({ _id: row._id, name: row.name })));
      } catch {
        setRoles([]);
      }
    })();
  }, []);

  React.useEffect(() => {
    void (async () => {
      setHistoryLoading(true);
      try {
        const rows = await menuService.listMenuHistory(20);
        setHistoryRows(rows);
      } catch {
        setHistoryRows([]);
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (!previewRoleId) {
      setPreviewPermissionIds([]);
      return;
    }
    void (async () => {
      try {
        const ids = await menuService.listRolePermissions(previewRoleId);
        setPreviewPermissionIds(ids);
      } catch {
        setPreviewPermissionIds([]);
      }
    })();
  }, [previewRoleId]);

  const handleTreeSelect = (keys: React.Key[]) => {
    const key = keys[0];
    if (typeof key === "string") {
      setSelectedMenuId(key);
    }
  };

  const notifyMenuUpdated = () => {
    window.dispatchEvent(new Event("mappa:menu-refresh"));
  };

  const isDescendant = React.useCallback(
    (parentId: string | null, dragId: string) => {
      if (!parentId) return false;
      const map = new Map(flatMenus.map((menu) => [menu._id, menu]));
      let current: string | null = parentId;
      while (current) {
        if (current === dragId) return true;
        const next = map.get(current)?.parent_id ?? null;
        current = next;
      }
      return false;
    },
    [flatMenus],
  );

  const handleDrop: TreeProps["onDrop"] = async (info) => {
    const dragNode = info.dragNode as any;
    const dropNode = info.node as any;
    const dragId = dragNode.key as string;
    const dropId = dropNode.key as string;

    if (dragId === dropId) return;

    const menuMap = new Map(flatMenus.map((menu) => [menu._id, menu]));
    const dropMenu = menuMap.get(dropId);
    const dropParentId = info.dropToGap ? dropMenu?.parent_id ?? null : dropId;
    if (isDescendant(dropParentId, dragId)) {
      message.warning("Không thể chuyển menu vào chính nhánh con của nó.");
      return;
    }

    const siblings = flatMenus
      .filter((menu) => (menu.parent_id ?? null) === dropParentId && menu._id !== dragId)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    let targetIndex = siblings.findIndex((menu) => menu._id === dropId);
    if (targetIndex === -1) {
      targetIndex = siblings.length;
    } else if (info.dropToGap && info.dropPosition > 0) {
      targetIndex += 1;
    }

    try {
      await menuService.moveMenu(dragId, dropParentId, targetIndex);
      await handleRefresh();
      notifyMenuUpdated();
      message.success("Đã cập nhật vị trí menu.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể cập nhật menu.");
    }
  };

  const handleAssignSelected = async () => {
    if (!selectedMenuId) return;
    const existing = assignedPermissions.map((perm) => perm._id);
    const merged = Array.from(new Set([...existing, ...selectedIds]));
    await savePermissions(merged);
    await refreshMenus({
      search: treeSearch || undefined,
      status: treeStatus !== "all" ? treeStatus : undefined,
      moduleGroup: treeGroup !== "all" ? treeGroup : undefined,
      moduleId: treeModule !== "all" ? treeModule : undefined,
    });
    notifyMenuUpdated();
    setSelectedIds([]);
    message.success("Đã cập nhật quyền hiển thị.");
  };

  const handleRemoveAssigned = async (permissionId: string) => {
    if (!selectedMenuId) return;
    const remaining = assignedPermissions.filter((perm) => perm._id !== permissionId).map((perm) => perm._id);
    await savePermissions(remaining);
    await refreshMenus({
      search: treeSearch || undefined,
      status: treeStatus !== "all" ? treeStatus : undefined,
      moduleGroup: treeGroup !== "all" ? treeGroup : undefined,
      moduleId: treeModule !== "all" ? treeModule : undefined,
    });
    notifyMenuUpdated();
  };

  const handleRefresh = async () => {
    await refreshMenus({
      search: treeSearch || undefined,
      status: treeStatus !== "all" ? treeStatus : undefined,
      moduleGroup: treeGroup !== "all" ? treeGroup : undefined,
      moduleId: treeModule !== "all" ? treeModule : undefined,
    });
  };

  React.useEffect(() => {
    void handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeSearch, treeStatus, treeGroup, treeModule]);

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            Quản lý Menu
          </Title>
          <Text type="secondary">Quản trị cây menu, quyền hiển thị và preview theo vai trò</Text>
        </div>
        <Space>
          <Button onClick={handleRefresh}>Làm mới</Button>
          <Button type="primary">Thêm menu</Button>
        </Space>
      </Space>

      <Row gutter={16}>
        <Col span={7}>
          <MenuTree
            treeData={toTreeData(treeMenus)}
            loading={loading}
            selectedKeys={selectedMenuId ? [selectedMenuId] : []}
            moduleOptions={modules.map((mod) => ({ label: mod.name, value: mod._id }))}
            moduleGroupOptions={Array.from(new Set(modules.map((mod) => mod.group).filter(Boolean))).map(
              (group) => ({ label: String(group), value: String(group) }),
            )}
            onSelect={handleTreeSelect}
            onSearch={setTreeSearch}
            onFilterStatus={setTreeStatus}
            onFilterGroup={setTreeGroup}
            onFilterModule={setTreeModule}
            onDrop={handleDrop}
          />
        </Col>
        <Col span={17}>
          <MenuDetailTabs
            menu={selectedMenu}
            modules={modules}
            saving={saving}
            onSaveMenu={async (payload) => {
              await saveMenu(payload);
              await refreshMenus({
                search: treeSearch || undefined,
                status: treeStatus !== "all" ? treeStatus : undefined,
                moduleGroup: treeGroup !== "all" ? treeGroup : undefined,
                moduleId: treeModule !== "all" ? treeModule : undefined,
              });
              notifyMenuUpdated();
            }}
            assignedPermissions={assignedPermissions}
            pickerData={pickerData}
            pickerLoading={pickerLoading}
            pickerTotal={pickerTotal}
            pickerPage={filters.page}
            pickerPageSize={filters.pageSize}
            pickerSelectedIds={selectedIds}
            pickerFilters={filters}
            onPickerFilterChange={(next) =>
              setFilters((prev) => ({
                ...prev,
                ...next,
              }))
            }
            onPickerSelect={setSelectedIds}
            onPickerPageChange={(page, pageSize) =>
              setFilters((prev) => ({ ...prev, page, pageSize }))
            }
            onAssignSelected={handleAssignSelected}
            onRemoveAssigned={handleRemoveAssigned}
            previewTreeData={toTreeData(buildPreviewTree(treeMenus, new Set(previewPermissionIds)))}
            previewRoles={roles}
            previewRoleId={previewRoleId}
            onPreviewRoleChange={setPreviewRoleId}
            historyData={historyRows}
            historyLoading={historyLoading}
            smartRouteOnly={smartRouteOnly}
            suggestedResource={getSuggestedResource(selectedMenu?.route_path)}
            onToggleSmartRoute={(value) => {
              setSmartRouteOnly(value);
              if (value && selectedMenu?.route_path) {
                const suggested = getSuggestedResource(selectedMenu.route_path);
                setFilters((prev) => ({
                  ...prev,
                  resource: suggested || prev.resource,
                  search: prev.search || suggested,
                  page: 1,
                }));
              }
              if (!value) {
                setFilters((prev) => ({
                  ...prev,
                  resource: undefined,
                  page: 1,
                }));
              }
            }}
            onApplySuggested={() => {
              const suggested = getSuggestedResource(selectedMenu?.route_path);
              if (!suggested) return;
              setFilters((prev) => ({
                ...prev,
                resource: suggested,
                search: prev.search || suggested,
                page: 1,
              }));
            }}
          />
        </Col>
      </Row>
    </Space>
  );
};

export default MenuAdminPage;
