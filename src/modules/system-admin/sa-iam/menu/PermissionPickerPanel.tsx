import React from "react";
import {
  Alert,
  Button,
  Input,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

import type {
  MenuPermissionListParams,
  MenuPermissionRecord,
} from "./menu.types";
import type { MenuRecord } from "./menu.types";
import { menuRepo } from "./menu.repo";

type ModuleOption = {
  _id: string;
  code: string;
  name: string;
  group?: string | null;
};

type PermissionPickerPanelProps = {
  menu: MenuRecord | null;
  modules: ModuleOption[];
  selectedPermissionId: string | null;
  onSelectionChange: (permissionId: string | null, permission: MenuPermissionRecord | null) => void;
  allowCrossModule: boolean;
  onAllowCrossModuleChange: (value: boolean) => void;
};

const DEFAULT_PAGE_SIZE = 10;

const normalizeRouteResource = (path?: string | null) => {
  if (!path) return null;
  const segments = path.split("?")[0].split("#")[0].split("/").filter(Boolean);
  if (segments.length === 0) return null;
  let index = 0;
  if (segments[index] === "system-admin" || segments[index] === "system") {
    index += 1;
  }
  const current = segments[index] ?? segments[0];
  if (["iam", "master-data", "system-config"].includes(current) && segments[index + 1]) {
    return segments[index + 1];
  }
  return current;
};

const scorePermission = (perm: MenuPermissionRecord, suggested?: string | null) => {
  if (!suggested) return 0;
  const resource = perm.resource?.toLowerCase() ?? "";
  const code = perm.code.toLowerCase();
  const name = perm.name.toLowerCase();
  const target = suggested.toLowerCase();
  if (resource === target) return 3;
  if (resource.includes(target)) return 2;
  if (code.includes(target) || name.includes(target)) return 1;
  return 0;
};

const statusTag = (value?: number | string | null) =>
  Number(value) === 1 || String(value).toLowerCase() === "active" ? (
    <Tag color="green">Hoạt động</Tag>
  ) : (
    <Tag color="red">Ngừng</Tag>
  );

export default function PermissionPickerPanel({
  menu,
  modules,
  selectedPermissionId,
  onSelectionChange,
  allowCrossModule,
  onAllowCrossModuleChange,
}: PermissionPickerPanelProps) {
  const [loading, setLoading] = React.useState(false);
  const [permissions, setPermissions] = React.useState<MenuPermissionRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [moduleId, setModuleId] = React.useState<string | null>(menu?.module_id ?? null);
  const [action, setAction] = React.useState<string | null>("read");
  const [permissionType, setPermissionType] = React.useState<string | null>("PAGE");
  const [resource, setResource] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<MenuPermissionListParams["status"]>("active");
  const [smartRouteOnly, setSmartRouteOnly] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [selectedPermission, setSelectedPermission] = React.useState<MenuPermissionRecord | null>(
    null,
  );

  const isGroupMenu = !menu?.route_path;
  const suggestedResource = React.useMemo(
    () => normalizeRouteResource(menu?.route_path),
    [menu?.route_path],
  );

  React.useEffect(() => {
    setModuleId(menu?.module_id ?? null);
    setResource(null);
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
    setSelectedPermission(null);
  }, [menu?._id]);

  React.useEffect(() => {
    if (!selectedPermissionId) {
      setSelectedPermission(null);
      return;
    }
    const match = permissions.find((perm) => perm._id === selectedPermissionId) ?? null;
    setSelectedPermission(match);
  }, [permissions, selectedPermissionId]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      void (async () => {
        if (isGroupMenu) {
          setPermissions([]);
          setTotal(0);
          return;
        }
        setLoading(true);
        try {
          const result = await menuRepo.listPermissions({
            search,
            moduleId,
            action,
            permissionType,
            resource,
            status,
            page,
            pageSize,
            sortBy: "code",
            sortDir: "asc",
          });
          let data = result.data;
          if (smartRouteOnly) {
            data = data
              .map((item) => ({ ...item, __score: scorePermission(item, suggestedResource) }))
              .filter((item: any) => item.__score >= 2)
              .sort((a: any, b: any) => b.__score - a.__score || a.code.localeCompare(b.code));
          }
          setPermissions(data);
          setTotal(result.total);
        } catch (err) {
          setPermissions([]);
          setTotal(0);
        } finally {
          setLoading(false);
        }
      })();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search,
    moduleId,
    action,
    permissionType,
    resource,
    status,
    page,
    pageSize,
    smartRouteOnly,
    isGroupMenu,
    suggestedResource,
  ]);

  const availableResources = React.useMemo(
    () => Array.from(new Set(permissions.map((perm) => perm.resource).filter(Boolean))) as string[],
    [permissions],
  );

  const selectedChipLabel = selectedPermission?.code ?? selectedPermissionId ?? "Chưa chọn";
  const selectedChip = (
    <Tag color={selectedPermission ? "blue" : undefined}>{selectedChipLabel}</Tag>
  );

  const moduleMismatch =
    menu?.module_id &&
    selectedPermission?.module_id &&
    menu.module_id !== selectedPermission.module_id;

  const columns = [
    {
      title: "Mã quyền",
      dataIndex: "code",
      key: "code",
      width: 200,
      sorter: (a: MenuPermissionRecord, b: MenuPermissionRecord) => a.code.localeCompare(b.code),
    },
    {
      title: "Tên quyền",
      dataIndex: "name",
      key: "name",
      sorter: (a: MenuPermissionRecord, b: MenuPermissionRecord) => a.name.localeCompare(b.name),
    },
    {
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
      width: 140,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 120,
    },
    {
      title: "Phân hệ",
      dataIndex: "module",
      key: "module",
      width: 160,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: number | string | null) => statusTag(value),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={12}>
      {isGroupMenu ? (
        <Alert
          type="info"
          message="Nhóm menu không gắn quyền hiển thị."
          description="Menu nhóm sẽ tự hiển thị khi có ít nhất 1 menu con được phép."
          showIcon
        />
      ) : (
        <>
          {!selectedPermissionId && (
            <Alert
              type="warning"
              message="Menu trang chưa có quyền hiển thị (READ/PAGE)."
              showIcon
            />
          )}
          {moduleMismatch && !allowCrossModule && (
            <Alert
              type="error"
              message="Quyền thuộc phân hệ khác với menu. Bật 'Cho phép ngoại lệ' để lưu."
              showIcon
            />
          )}
        </>
      )}

      <Space wrap>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Tìm theo mã/tên/mô tả..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: 240 }}
          disabled={isGroupMenu}
        />
        <Select
          allowClear
          placeholder="Phân hệ"
          style={{ minWidth: 200 }}
          value={moduleId ?? undefined}
          onChange={(value) => setModuleId(value ?? null)}
          options={modules.map((item) => ({
            label: `${item.name} (${item.code})`,
            value: item._id,
          }))}
          disabled={isGroupMenu}
        />
        <Select
          placeholder="Action"
          style={{ width: 160 }}
          value={action ?? "all"}
          onChange={(value) => setAction(value === "all" ? null : value)}
          options={[
            { label: "Tất cả action", value: "all" },
            { label: "READ", value: "read" },
            { label: "VIEW", value: "view" },
            { label: "CREATE", value: "create" },
            { label: "UPDATE", value: "update" },
            { label: "DELETE", value: "delete" },
            { label: "EXPORT", value: "export" },
          ]}
          disabled={isGroupMenu}
        />
        <Select
          placeholder="Permission type"
          style={{ width: 160 }}
          value={permissionType ?? "all"}
          onChange={(value) => setPermissionType(value === "all" ? null : value)}
          options={[
            { label: "Tất cả type", value: "all" },
            { label: "PAGE", value: "PAGE" },
            { label: "READ", value: "READ" },
            { label: "VIEW", value: "VIEW" },
            { label: "FEATURE", value: "FEATURE" },
            { label: "SYSTEM", value: "SYSTEM" },
          ]}
          disabled={isGroupMenu}
        />
        <Select
          allowClear
          showSearch
          placeholder="Resource"
          style={{ minWidth: 160 }}
          value={resource ?? undefined}
          onChange={(value) => setResource(value ?? null)}
          options={availableResources.map((item) => ({ label: item, value: item }))}
          disabled={isGroupMenu}
        />
        <Select
          placeholder="Trạng thái"
          style={{ width: 140 }}
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { label: "Hoạt động", value: "active" },
            { label: "Ngừng", value: "inactive" },
            { label: "Tất cả", value: "all" },
          ]}
          disabled={isGroupMenu}
        />
        <Tooltip title="Chỉ gợi ý quyền phù hợp route">
          <Space size={6}>
            <Switch
              checked={smartRouteOnly}
              onChange={(value) => setSmartRouteOnly(value)}
              disabled={isGroupMenu}
            />
            <Typography.Text>Gợi ý theo route</Typography.Text>
          </Space>
        </Tooltip>
        <Tooltip title="Cho phép quyền khác phân hệ">
          <Space size={6}>
            <Switch
              checked={allowCrossModule}
              onChange={onAllowCrossModuleChange}
              disabled={isGroupMenu}
            />
            <Typography.Text>Cho phép ngoại lệ</Typography.Text>
          </Space>
        </Tooltip>
        <Button onClick={() => onSelectionChange(null, null)} disabled={isGroupMenu}>
          Clear selection
        </Button>
      </Space>

      <Space>
        <Typography.Text>Quyền đã chọn:</Typography.Text>
        {selectedChip}
      </Space>

      <Table
        bordered
        size="middle"
        rowKey={(row) => row._id}
        columns={columns}
        dataSource={permissions}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize ?? DEFAULT_PAGE_SIZE);
          },
        }}
        rowSelection={{
          type: "radio",
          selectedRowKeys: selectedPermissionId ? [selectedPermissionId] : [],
          onChange: (selectedRowKeys) => {
            const nextId = (selectedRowKeys[0] as string) ?? null;
            const permission = permissions.find((item) => item._id === nextId) ?? null;
            onSelectionChange(nextId, permission);
          },
          getCheckboxProps: () => ({
            disabled: isGroupMenu,
          }),
        }}
      />
    </Space>
  );
}
