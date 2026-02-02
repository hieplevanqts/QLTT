import React from "react";
import {
  Badge,
  Button,
  Modal,
  Skeleton,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import { AlertTriangle, CheckCircle, FileText, LayoutGrid, Wrench } from "lucide-react";

import { supabase } from "@/api/supabaseClient";

type ModuleRow = {
  _id: string;
  key: string;
  name: string;
  group: string;
  status: 0 | 1;
  permission_count?: number | null;
  permission_page_count?: number | null;
  permission_feature_count?: number | null;
};

type PermissionRow = {
  _id: string;
  code: string;
  name: string | null;
  category: string | null;
  resource: string | null;
  action: string | null;
  status: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  moduleRow: ModuleRow | null;
  onOpenManagePermissions: () => void;
  onGeneratePermissions?: () => void;
};

const statusLabel = (value?: number | null) => (value === 1 ? "Hoạt động" : "Ngừng");
const statusColor = (value?: number | null) => (value === 1 ? "green" : "orange");

export function ModulePermissionsOverviewModal({
  open,
  onClose,
  moduleRow,
  onOpenManagePermissions,
  onGeneratePermissions,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tabKey, setTabKey] = React.useState("all");
  const [permissions, setPermissions] = React.useState<PermissionRow[]>([]);

  const moduleKey = moduleRow?.key ?? "";
  const permissionTotal = moduleRow?.permission_count ?? 0;
  const permissionPage = moduleRow?.permission_page_count ?? 0;
  const permissionFeature = moduleRow?.permission_feature_count ?? 0;

  React.useEffect(() => {
    if (!open || !moduleKey) return;
    setTabKey("all");
    setLoading(true);
    setError(null);
    supabase
      .from("permissions")
      .select("_id, code, name, category, resource, action, status")
      .eq("module", moduleKey)
      .order("code", { ascending: true })
      .limit(200)
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message);
          setPermissions([]);
          return;
        }
        setPermissions((data as PermissionRow[]) || []);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Không thể tải quyền.";
        setError(msg);
        setPermissions([]);
      })
      .finally(() => setLoading(false));
  }, [moduleKey, open]);

  React.useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  const filteredPermissions = React.useMemo(() => {
    if (tabKey === "page") {
      return permissions.filter(
        (item) => String(item.category ?? "").toUpperCase() === "PAGE",
      );
    }
    if (tabKey === "feature") {
      return permissions.filter(
        (item) => String(item.category ?? "").toUpperCase() === "FEATURE",
      );
    }
    return permissions;
  }, [permissions, tabKey]);

  const healthItems = [
    {
      ok: permissionTotal > 0,
      label:
        permissionTotal > 0
          ? "Đã khai báo quyền"
          : "Chưa khai báo quyền",
    },
    {
      ok: permissionPage > 0,
      label: permissionPage > 0 ? "Có quyền PAGE" : "Chưa có quyền PAGE",
    },
    {
      ok: permissionFeature > 0,
      label:
        permissionFeature > 0 ? "Có quyền FEATURE" : "Chưa có quyền FEATURE",
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      destroyOnHidden
      width={1000}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Đóng</Button>
          <Button onClick={onGeneratePermissions} disabled={!onGeneratePermissions}>
            Sinh quyền
          </Button>
          <Button
            type="primary"
            onClick={onOpenManagePermissions}
            disabled={!moduleRow}
          >
            Quản lý quyền
          </Button>
        </div>
      }
      title={
        <div className="space-y-2">
          <div className="text-lg font-semibold">
            Quyền của phân hệ: {moduleRow?.key ?? "—"} — {moduleRow?.name ?? "—"}
          </div>
          <Space wrap size={6}>
            <Tag>{moduleRow?.group ?? "—"}</Tag>
            <Badge
              status={moduleRow?.status === 1 ? "success" : "default"}
              text={statusLabel(moduleRow?.status)}
            />
            <Typography.Text code copyable={{ text: moduleRow?.key ?? "" }}>
              {moduleRow?.key ?? "—"}
            </Typography.Text>
          </Space>
        </div>
      }
      classNames={{
        body: "max-h-[70vh] overflow-auto",
      }}
      styles={{
        body: { padding: 16 },
      }}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <Typography.Text type="secondary">TOTAL</Typography.Text>
                    <LayoutGrid size={18} />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{permissionTotal}</div>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <Typography.Text type="secondary">PAGE</Typography.Text>
                    <FileText size={18} />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{permissionPage}</div>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <Typography.Text type="secondary">FEATURE</Typography.Text>
                    <Wrench size={18} />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{permissionFeature}</div>
                </div>
              </div>
              <div className="space-y-2">
                {healthItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.ok ? (
                      <CheckCircle size={18} className="text-emerald-500" />
                    ) : (
                      <AlertTriangle size={18} className="text-amber-500" />
                    )}
                    <Typography.Text>{item.label}</Typography.Text>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-3">
          <Tabs
            activeKey={tabKey}
            onChange={setTabKey}
            items={[
              { key: "page", label: "PAGE" },
              { key: "feature", label: "FEATURE" },
              { key: "all", label: "Tất cả" },
            ]}
          />
          <Table
            rowKey="_id"
            size="small"
            loading={loading}
            dataSource={filteredPermissions}
            pagination={false}
            scroll={{ y: 360 }}
            columns={[
              {
                title: "Code",
                dataIndex: "code",
                key: "code",
                width: 320,
                render: (value: string) => (
                  <div className="break-all whitespace-normal">
                    <Typography.Text
                      code
                      copyable={{ text: value }}
                      className="whitespace-normal break-all"
                    >
                      {value}
                    </Typography.Text>
                  </div>
                ),
              },
              {
                title: "Tên",
                dataIndex: "name",
                key: "name",
                width: 180,
                render: (value: string | null) => value || "—",
              },
              {
                title: "Resource",
                dataIndex: "resource",
                key: "resource",
                width: 140,
                render: (value: string | null) => value || "—",
              },
              {
                title: "Action",
                dataIndex: "action",
                key: "action",
                width: 110,
                render: (value: string | null) =>
                  value ? <Tag>{String(value).toUpperCase()}</Tag> : <Tag>—</Tag>,
              },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 120,
                render: (value: number | null) => (
                  <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
                ),
              },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
}
