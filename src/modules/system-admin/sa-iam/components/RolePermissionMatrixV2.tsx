import React from "react";
import {
  Button,
  Checkbox,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
  message,
} from "antd";
import { Copy } from "lucide-react";

import {
  rolePermissionsMatrixService,
  type MatrixActionCatalogItem,
  type MatrixCategory,
  type MatrixModuleOption,
  type MatrixViewRow,
} from "../services/rolePermissionsMatrix.service";

const { Text } = Typography;

type MatrixAction = {
  code: string;
  label: string;
};

type MatrixCell = {
  permissionId: string;
  permissionCode: string;
  permissionName: string;
  action: string;
  actionLabel: string;
  actionOrder: number;
  isGranted: boolean;
};

type MatrixRow = {
  key: string;
  resourceKey: string;
  resourceGroup: string;
  category: string;
  cells: Map<string, MatrixCell>;
  primaryCode?: string;
  searchText: string;
};

type Props = {
  roleId?: string | null;
  roleName?: string | null;
  roleCode?: string | null;
};

const normalizeBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    return trimmed === "true" || trimmed === "1" || trimmed === "yes";
  }
  return false;
};

const normalizeActionCode = (value: unknown) => String(value ?? "").trim().toUpperCase();

const ACTION_PRIORITY = [
  "READ",
  "CREATE",
  "UPDATE",
  "DELETE",
  "EXPORT",
  "RESTORE",
  "ASSIGN",
  "APPROVE",
  "IMPORT",
];

const ACTION_PRIORITY_INDEX = new Map(
  ACTION_PRIORITY.map((code, index) => [code, index]),
);

const buildActionLabel = (action?: string | null, label?: string | null) => {
  const fallback = normalizeActionCode(action);
  const cleaned = String(label ?? "").trim();
  return cleaned || fallback || "N/A";
};

const formatResourceLabel = (resourceKey: string, category: string, tabKey: MatrixCategory) => {
  const raw = resourceKey || "—";
  if (tabKey === "PAGE" || (tabKey === "ALL" && category === "PAGE")) {
    return raw.startsWith("page.") ? raw.slice(5) : raw;
  }
  return raw;
};

const buildMatrix = (rows: MatrixViewRow[], tabKey: MatrixCategory) => {
  const rowMap = new Map<string, MatrixRow>();
  const rowOrder: string[] = [];
  const baseline = new Set<string>();

  rows.forEach((raw) => {
    const action = normalizeActionCode(raw.action);
    if (!action) return;
    const actionLabel = buildActionLabel(raw.action, raw.action_label);
    const actionOrder = Number(raw.action_order ?? 0);

    const resourceKey = String(raw.resource_key ?? raw.permission_code ?? "").trim();
    if (!resourceKey) return;
    const resourceGroup = String(raw.resource_group ?? "").trim();
    const category = String(raw.category ?? "").toUpperCase() || "UNKNOWN";
    const rowKey = tabKey === "ALL" ? `${category}::${resourceKey}` : resourceKey;

    let row = rowMap.get(rowKey);
    if (!row) {
      row = {
        key: rowKey,
        resourceKey,
        resourceGroup,
        category,
        cells: new Map(),
        searchText: "",
      };
      rowMap.set(rowKey, row);
      rowOrder.push(rowKey);
    }

    const permissionId = String(raw.permission_id ?? "").trim();
    if (!permissionId) return;
    const permissionCode = String(raw.permission_code ?? "").trim();
    const permissionName = String(raw.permission_name ?? "").trim();
    const isGranted = normalizeBoolean(raw.is_granted);

    row.cells.set(action, {
      permissionId,
      permissionCode,
      permissionName,
      action,
      actionLabel,
      actionOrder: Number.isNaN(actionOrder) ? 0 : actionOrder,
      isGranted,
    });

    if (isGranted) baseline.add(permissionId);
  });

  const orderedRows = rowOrder
    .map((key) => rowMap.get(key))
    .filter(Boolean)
    .map((row) => {
      const cells = Array.from(row!.cells.values()).sort(
        (a, b) => a.actionOrder - b.actionOrder || a.action.localeCompare(b.action, "vi"),
      );
      const primary = row!.cells.get("READ") ?? cells[0];
      const searchText = [
        row!.resourceKey,
        row!.resourceGroup,
        row!.category,
        ...cells.map((cell) => `${cell.permissionCode} ${cell.permissionName}`),
      ]
        .join(" ")
        .toLowerCase();
      return {
        ...row!,
        primaryCode: primary?.permissionCode,
        searchText,
      };
    });

  return { rows: orderedRows, baseline };
};

export function RolePermissionMatrixV2({ roleId, roleName, roleCode }: Props) {
  const [modules, setModules] = React.useState<MatrixModuleOption[]>([]);
  const [moduleKey, setModuleKey] = React.useState<string | null>(null);
  const [tabKey, setTabKey] = React.useState<MatrixCategory>("PAGE");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [actionCatalog, setActionCatalog] = React.useState<MatrixActionCatalogItem[]>([]);
  const [matrixRows, setMatrixRows] = React.useState<MatrixRow[]>([]);
  const [baselineIds, setBaselineIds] = React.useState<Set<string>>(new Set());
  const [currentIds, setCurrentIds] = React.useState<Set<string>>(new Set());

  const loadModules = React.useCallback(async () => {
    try {
      const data = await rolePermissionsMatrixService.listModules();
      setModules(data);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tải danh sách phân hệ.");
      setModules([]);
    }
  }, []);

  const loadActions = React.useCallback(async () => {
    try {
      const data = await rolePermissionsMatrixService.listActions();
      setActionCatalog(data);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tải danh sách hành động.");
      setActionCatalog([]);
    }
  }, []);

  React.useEffect(() => {
    void loadModules();
  }, [loadModules]);

  React.useEffect(() => {
    void loadActions();
  }, [loadActions]);

  React.useEffect(() => {
    if (!modules.length) return;
    const valid = moduleKey && modules.some((mod) => mod.key === moduleKey);
    if (!valid) {
      setModuleKey(modules[0].key);
    }
  }, [modules, moduleKey]);

  const fetchMatrix = React.useCallback(async () => {
    if (!roleId || !moduleKey) {
      setMatrixRows([]);
      setBaselineIds(new Set());
      setCurrentIds(new Set());
      return;
    }

    setLoading(true);
    try {
      const data = await rolePermissionsMatrixService.fetchMatrix({
        roleId,
        moduleKey,
        category: tabKey,
      });

      const { rows, baseline } = buildMatrix(data, tabKey);
      setMatrixRows(rows);
      setBaselineIds(new Set(baseline));
      setCurrentIds(new Set(baseline));
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể tải ma trận quyền.");
      setMatrixRows([]);
      setBaselineIds(new Set());
      setCurrentIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [roleId, moduleKey, tabKey]);

  React.useEffect(() => {
    void fetchMatrix();
  }, [fetchMatrix]);

  const displayActions = React.useMemo<MatrixAction[]>(() => {
    let filtered = actionCatalog;
    if (tabKey === "PAGE") {
      filtered = actionCatalog.filter((action) => action.code === "READ");
    }

    const sorted = [...filtered].sort((a, b) => {
      const priorityA = ACTION_PRIORITY_INDEX.get(a.code) ?? Number.MAX_SAFE_INTEGER;
      const priorityB = ACTION_PRIORITY_INDEX.get(b.code) ?? Number.MAX_SAFE_INTEGER;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.code.localeCompare(b.code, "vi");
    });

    return sorted.map((action) => ({
      code: action.code,
      label: buildActionLabel(action.code, action.name),
    }));
  }, [actionCatalog, tabKey]);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return matrixRows;
    return matrixRows.filter((row) => row.searchText.includes(query));
  }, [matrixRows, search]);

  const hasChanges = React.useMemo(() => {
    if (baselineIds.size !== currentIds.size) return true;
    for (const id of baselineIds) {
      if (!currentIds.has(id)) return true;
    }
    return false;
  }, [baselineIds, currentIds]);

  const diffCounts = React.useMemo(() => {
    let added = 0;
    let removed = 0;
    currentIds.forEach((id) => {
      if (!baselineIds.has(id)) added += 1;
    });
    baselineIds.forEach((id) => {
      if (!currentIds.has(id)) removed += 1;
    });
    return { added, removed };
  }, [baselineIds, currentIds]);

  const handleToggle = (permissionId: string, checked: boolean) => {
    setCurrentIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(permissionId);
      else next.delete(permissionId);
      return next;
    });
  };

  const handleUndo = () => {
    setCurrentIds(new Set(baselineIds));
  };

  const handleSave = async () => {
    if (!roleId) return;
    const toAdd = Array.from(currentIds).filter((id) => !baselineIds.has(id));
    const toRemove = Array.from(baselineIds).filter((id) => !currentIds.has(id));
    if (!toAdd.length && !toRemove.length) {
      message.info("Không có thay đổi để lưu.");
      return;
    }

    setLoading(true);
    try {
      await rolePermissionsMatrixService.saveChanges(roleId, toAdd, toRemove);
      message.success("Đã lưu thay đổi.");
      await fetchMatrix();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể lưu thay đổi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      message.success("Đã sao chép.");
    } catch {
      message.error("Không thể sao chép.");
    }
  };

  const columns = React.useMemo(() => {
    const baseColumn = {
      title: "RESOURCE",
      dataIndex: "resourceKey",
      key: "resource",
      width: 320,
      fixed: "left" as const,
      render: (_: string, row: MatrixRow) => {
        const displayResource = formatResourceLabel(row.resourceKey, row.category, tabKey);
        return (
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <Button
                type="text"
                size="small"
                className="mt-0.5"
                icon={<Copy size={14} />}
                onClick={() => handleCopy(row.resourceKey)}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900">{displayResource}</span>
                  {tabKey === "ALL" ? (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {row.category}
                    </span>
                  ) : null}
                </div>
                {row.resourceGroup ? (
                  <div className="text-xs text-slate-500">{row.resourceGroup}</div>
                ) : null}
              </div>
            </div>
            {row.primaryCode ? (
              <Text type="secondary" className="text-xs" code copyable={{ text: row.primaryCode }}>
                {row.primaryCode}
              </Text>
            ) : null}
          </div>
        );
      },
    };

    const actionColumns = displayActions.map((action) => ({
      title: (
        <Tooltip title={action.code}>
          <span className="text-xs font-semibold">{action.label}</span>
        </Tooltip>
      ),
      key: action.code,
      dataIndex: action.code,
      align: "center" as const,
      width: 110,
      render: (_: unknown, row: MatrixRow) => {
        const cell = row.cells.get(action.code);
        if (!cell) {
          return <span className="text-xs text-slate-300">—</span>;
        }
        const checked = currentIds.has(cell.permissionId);
        return (
          <Tooltip
            title={
              <div className="space-y-1">
                {cell.permissionCode ? (
                  <Text code copyable={{ text: cell.permissionCode }}>
                    {cell.permissionCode}
                  </Text>
                ) : null}
                <div className="text-xs text-slate-200">{cell.permissionName || "—"}</div>
                <div className="text-xs text-slate-300">{cell.actionLabel}</div>
              </div>
            }
          >
            <Checkbox
              checked={checked}
              onChange={(event) => handleToggle(cell.permissionId, event.target.checked)}
            />
          </Tooltip>
        );
      },
    }));

    return [baseColumn, ...actionColumns];
  }, [displayActions, currentIds, tabKey]);

  if (!roleId) {
    return (
      <div className="flex h-full items-center justify-center rounded border border-dashed border-slate-200 bg-white p-6">
        <Empty description="Chọn vai trò để bắt đầu phân quyền." />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">Ma trận phân quyền</div>
          <div className="text-sm text-slate-500">
            Vai trò: <span className="font-medium text-slate-700">{roleName || "—"}</span>
            {roleCode ? <span className="ml-2 text-xs text-slate-400">({roleCode})</span> : null}
          </div>
        </div>
        <Space wrap>
          <Select
            value={moduleKey ?? undefined}
            onChange={(value) => setModuleKey(value)}
            placeholder="Chọn phân hệ"
            style={{ minWidth: 220 }}
            options={modules.map((mod) => ({
              label: `${mod.key} — ${mod.name}`,
              value: mod.key,
            }))}
          />
          <Tabs
            activeKey={tabKey}
            onChange={(key) => setTabKey(key as MatrixCategory)}
            items={[
              { key: "PAGE", label: "PAGE" },
              { key: "FEATURE", label: "FEATURE" },
              { key: "ALL", label: "Tất cả" },
            ]}
          />
          <Input
            allowClear
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo code / tên / resource"
            style={{ minWidth: 240 }}
          />
        </Space>
      </div>

      <div className="sticky top-0 z-10 flex items-center justify-between rounded border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <div className="text-sm text-slate-600">
          Thay đổi: <span className="font-semibold text-emerald-600">+{diffCounts.added}</span>{" "}
          / <span className="font-semibold text-rose-600">-{diffCounts.removed}</span>
        </div>
        <Space>
          <Button onClick={handleUndo} disabled={!hasChanges}>
            Hoàn tác
          </Button>
          <Button type="primary" onClick={handleSave} disabled={!hasChanges} loading={loading}>
            Lưu thay đổi
          </Button>
        </Space>
      </div>

      <div className="flex-1 overflow-auto">
        <Table
          size="small"
          rowKey="key"
          loading={loading}
          dataSource={filteredRows}
          columns={columns}
          pagination={false}
          tableLayout="fixed"
          scroll={{ x: "max-content", y: 520 }}
        />
      </div>
    </div>
  );
}
