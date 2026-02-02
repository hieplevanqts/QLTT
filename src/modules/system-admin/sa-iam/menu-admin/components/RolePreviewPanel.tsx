import {
  Alert,
  Button,
  Empty,
  Input,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tabs,
  Tag,
  Tree,
} from "antd";
import type { DataNode } from "antd/es/tree";
import * as React from "react";

export type PreviewReason =
  | "MENU_INACTIVE"
  | "MENU_NO_PERMISSION"
  | "MISSING_PAGE_PERMISSION";

export interface PreviewListItem {
  menuId: string;
  name: string;
  path?: string | null;
  moduleKey?: string | null;
  moduleName?: string | null;
  requiredPermission?: string | null;
  visible: boolean;
  reason?: PreviewReason;
}

export interface PreviewTreeNode extends DataNode {
  menuId: string;
  name: string;
  path?: string | null;
  moduleKey?: string | null;
  moduleName?: string | null;
  requiredPermission?: string | null;
  visible: boolean;
  reason?: PreviewReason;
  children?: PreviewTreeNode[];
}

export interface RolePreviewPanelProps {
  roleOptions: Array<{ label: string; value: string }>;
  roleId?: string;
  onRoleChange?: (roleId?: string) => void;
  loading?: boolean;
  stats: { seen: number; hidden: number; noPermission: number };
  treeData: PreviewTreeNode[];
  listData: PreviewListItem[];
  onFocusMenu?: (menuId: string) => void;
  onOpenRolePermissions?: (roleId: string, moduleKey?: string | null) => void;
}

const reasonLabels: Record<PreviewReason, string> = {
  MENU_INACTIVE: "Menu đang tắt",
  MENU_NO_PERMISSION: "Chưa gán quyền cho menu",
  MISSING_PAGE_PERMISSION: "Thiếu quyền PAGE",
};

const reasonColors: Record<PreviewReason, string> = {
  MENU_INACTIVE: "default",
  MENU_NO_PERMISSION: "orange",
  MISSING_PAGE_PERMISSION: "red",
};

const buildSearchable = (item: PreviewListItem) =>
  [
    item.name,
    item.path,
    item.moduleKey,
    item.moduleName,
    item.requiredPermission,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const RolePreviewPanel: React.FC<RolePreviewPanelProps> = ({
  roleOptions,
  roleId,
  onRoleChange,
  loading,
  stats,
  treeData,
  listData,
  onFocusMenu,
  onOpenRolePermissions,
}) => {
  const [showVisibleOnly, setShowVisibleOnly] = React.useState(false);
  const [showReasons, setShowReasons] = React.useState(false);
  const [activeInnerTab, setActiveInnerTab] = React.useState("tree");
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const [searchText, setSearchText] = React.useState("");

  const previewMap = React.useMemo(
    () => new Map(listData.map((item) => [item.menuId, item])),
    [listData],
  );

  React.useEffect(() => {
    if (selectedKey && !previewMap.has(selectedKey)) {
      setSelectedKey(null);
    }
  }, [previewMap, selectedKey]);

  const filteredListData = React.useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return listData.filter((item) => {
      if (showVisibleOnly && !item.visible) return false;
      if (!keyword) return true;
      return buildSearchable(item).includes(keyword);
    });
  }, [listData, searchText, showVisibleOnly]);

  const filterTree = React.useCallback(
    (nodes: PreviewTreeNode[]): PreviewTreeNode[] => {
      return nodes
        .map((node) => {
          const children = node.children ? filterTree(node.children) : [];
          const keep = node.visible || children.length > 0;
          if (!showVisibleOnly || keep) {
            return { ...node, children: children.length ? children : undefined };
          }
          return null;
        })
        .filter(Boolean) as PreviewTreeNode[];
    },
    [showVisibleOnly],
  );

  const filteredTreeData = React.useMemo(
    () => (showVisibleOnly ? filterTree(treeData) : treeData),
    [filterTree, showVisibleOnly, treeData],
  );

  const selectedItem = selectedKey ? previewMap.get(selectedKey) : null;
  const showActions = Boolean(selectedItem && !selectedItem.visible);

  const columns = React.useMemo(() => {
    const baseColumns: Array<any> = [
      {
        title: "Menu",
        dataIndex: "name",
        key: "menu",
        render: (_: unknown, record: PreviewListItem) => (
          <div className="flex flex-col">
            <span className="font-medium">{record.name}</span>
            {record.path ? <span className="text-xs text-slate-500">{record.path}</span> : null}
          </div>
        ),
      },
      {
        title: "Module",
        dataIndex: "module",
        key: "module",
        render: (_: unknown, record: PreviewListItem) =>
          record.moduleKey ? (
            <span>
              {record.moduleKey}
              {record.moduleName ? ` — ${record.moduleName}` : ""}
            </span>
          ) : (
            "—"
          ),
      },
      {
        title: "PAGE permission",
        dataIndex: "requiredPermission",
        key: "permission",
        render: (value: string | null | undefined) => (value ? <Tag>{value}</Tag> : "—"),
      },
      {
        title: "Kết quả",
        dataIndex: "visible",
        key: "result",
        render: (value: boolean) => (
          <Tag color={value ? "green" : "red"}>{value ? "✅ Thấy" : "❌ Ẩn"}</Tag>
        ),
      },
    ];
    if (showReasons) {
      baseColumns.push({
        title: "Lý do",
        dataIndex: "reason",
        key: "reason",
        render: (value: PreviewReason | undefined) =>
          value ? <Tag color={reasonColors[value]}>{reasonLabels[value]}</Tag> : "—",
      });
    }
    return baseColumns;
  }, [showReasons]);

  const renderTreeTitle = (node: PreviewTreeNode) => {
    const reason = node.reason;
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{node.name}</span>
        {node.path ? <span className="text-xs text-blue-600">{node.path}</span> : null}
        <Tag color={node.visible ? "green" : "red"}>{node.visible ? "✅ Thấy" : "❌ Ẩn"}</Tag>
        {showReasons && !node.visible && reason ? (
          <Tag color={reasonColors[reason]}>{reasonLabels[reason]}</Tag>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-base font-semibold">Xem menu theo vai trò</div>
        <div className="text-sm text-slate-500">
          Vai trò sẽ nhìn thấy menu nào theo menu_permissions (PAGE) và role_permissions
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Space wrap>
          <Select
            placeholder="Chọn vai trò"
            value={roleId}
            onChange={(value) => onRoleChange?.(value)}
            allowClear
            showSearch
            optionFilterProp="label"
            options={roleOptions}
            style={{ minWidth: 240 }}
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
          <Tag color="green">Thấy: {stats.seen}</Tag>
          <Tag color="red">Ẩn: {stats.hidden}</Tag>
          <Tag color="orange">Chưa gán quyền: {stats.noPermission}</Tag>
        </Space>
        <Space wrap>
          <Space size={6}>
            <Switch checked={showVisibleOnly} onChange={setShowVisibleOnly} />
            <span>Chỉ hiện menu thấy được</span>
          </Space>
          <Space size={6}>
            <Switch checked={showReasons} onChange={setShowReasons} />
            <span>Hiện lý do bị ẩn</span>
          </Space>
        </Space>
      </div>

      <Spin spinning={Boolean(loading)}>
        {!roleId ? (
          <Empty description="Chọn vai trò để xem preview" />
        ) : (
          <Tabs
            activeKey={activeInnerTab}
            onChange={setActiveInnerTab}
            items={[
              {
                key: "tree",
                label: "Cây menu",
                children: (
                  <div className="space-y-3">
                    {filteredTreeData.length ? (
                      <Tree
                        showLine
                        blockNode
                        treeData={filteredTreeData}
                        titleRender={(node) => renderTreeTitle(node as PreviewTreeNode)}
                        onSelect={(keys) => {
                          const key = keys[0];
                          setSelectedKey(typeof key === "string" ? key : null);
                        }}
                      />
                    ) : (
                      <Empty description="Không có menu phù hợp" />
                    )}
                    {showActions && selectedItem ? (
                      <Alert
                        type="warning"
                        showIcon
                        message={`Menu "${selectedItem.name}" đang bị ẩn`}
                        description={
                          selectedItem.reason ? reasonLabels[selectedItem.reason] : undefined
                        }
                        action={
                          <Space>
                            <Button size="small" onClick={() => onFocusMenu?.(selectedItem.menuId)}>
                              Gán quyền cho menu này
                            </Button>
                            <Button
                              size="small"
                              onClick={() =>
                                roleId
                                  ? onOpenRolePermissions?.(roleId, selectedItem.moduleKey ?? null)
                                  : null
                              }
                            >
                              Gán quyền cho vai trò
                            </Button>
                          </Space>
                        }
                      />
                    ) : null}
                  </div>
                ),
              },
              {
                key: "list",
                label: "Danh sách",
                children: (
                  <div className="space-y-3">
                    <Input.Search
                      allowClear
                      placeholder="Tìm theo tên/path/permission"
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      style={{ maxWidth: 320 }}
                    />
                    <Table
                      size="small"
                      rowKey="menuId"
                      columns={columns}
                      dataSource={filteredListData}
                      pagination={{ pageSize: 20 }}
                    />
                  </div>
                ),
              },
            ]}
          />
        )}
      </Spin>
    </div>
  );
};
