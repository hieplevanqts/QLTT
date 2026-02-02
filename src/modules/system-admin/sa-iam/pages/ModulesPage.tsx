/**
 * MODULES PAGE - Quản lý phân hệ
 * Permission: sa.iam.module.read
 */

import React from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Tooltip,
  message,
  type TablePaginationConfig,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/layouts/PageHeader";
import { PermissionGate, usePermissions } from "../../_shared";
import { ModuleFormModal } from "../components/modules/ModuleFormModal";
import { GeneratePermissionsModal } from "../components/modules/GeneratePermissionsModal";
import { ModulePermissionsOverviewModal } from "../components/ModulePermissionsOverviewModal";
import { ModulesTable } from "../components/modules/ModulesTable";
import {
  modulesService,
  type ModulePayload,
  type ModuleRecord,
} from "../services/modules.service";

const GROUP_OPTIONS = [
  { label: "Tất cả nhóm", value: "all" },
  { label: "IAM", value: "IAM" },
  { label: "DMS", value: "DMS" },
  { label: "OPS", value: "OPS" },
  { label: "SYSTEM", value: "SYSTEM" },
];

export default function ModulesPage() {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  const canCreate = hasPermission("sa.iam.module.create");
  const canUpdate = hasPermission("sa.iam.module.update");
  const canDelete = hasPermission("sa.iam.module.delete");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [groupFilter, setGroupFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [noPermissionOnly, setNoPermissionOnly] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortField, setSortField] = React.useState<string>("sort_order");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const [loading, setLoading] = React.useState(false);
  const [modules, setModules] = React.useState<ModuleRecord[]>([]);
  const [total, setTotal] = React.useState(0);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingModule, setEditingModule] = React.useState<ModuleRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [generateModule, setGenerateModule] = React.useState<ModuleRecord | null>(null);
  const [overviewOpen, setOverviewOpen] = React.useState(false);
  const [overviewModule, setOverviewModule] = React.useState<ModuleRecord | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, groupFilter, statusFilter, noPermissionOnly]);

  const loadModules = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await modulesService.listModules({
        q: debouncedSearch || undefined,
        group: groupFilter === "all" ? undefined : groupFilter,
        status: statusFilter,
        noPermissionOnly,
        page,
        pageSize,
        sortBy: sortField,
        sortDir: sortOrder,
      });
      setModules(result.data);
      setTotal(result.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể tải danh sách phân hệ.";
      Modal.error({ title: "Lỗi tải dữ liệu", content: msg });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, groupFilter, noPermissionOnly, page, pageSize, sortField, sortOrder, statusFilter]);

  React.useEffect(() => {
    void loadModules();
  }, [loadModules]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ModuleRecord> | SorterResult<ModuleRecord>[],
  ) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);

    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    if (singleSorter?.field && singleSorter.order) {
      setSortField(String(singleSorter.field));
      setSortOrder(singleSorter.order === "ascend" ? "asc" : "desc");
    }
  };

  const openCreate = () => {
    if (!canCreate) return;
    setEditingModule(null);
    setModalOpen(true);
  };

  const openEdit = (record: ModuleRecord) => {
    if (!canUpdate) return;
    setEditingModule(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (values: ModulePayload) => {
    try {
      setSubmitting(true);
      const keyValue = values.key.trim();
      if (keyValue) {
        const existing = await modulesService.getModuleByKey(keyValue);
        if (existing && (!editingModule || existing.id !== editingModule.id)) {
          message.error("Mã phân hệ đã tồn tại.");
          setSubmitting(false);
          return;
        }
      }

      let saved: ModuleRecord;
      if (editingModule) {
        saved = await modulesService.updateModule(editingModule.id, values);
        message.success("Đã cập nhật phân hệ.");
      } else {
        saved = await modulesService.createModule(values);
        message.success("Đã tạo phân hệ.");
      }

      setModalOpen(false);
      await loadModules();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể lưu phân hệ.";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (record: ModuleRecord) => {
    if (!canUpdate) return;
    try {
      const nextStatus = record.status === 1 ? 0 : 1;
      await modulesService.setModuleStatus(record.id, nextStatus);
      message.success("Đã cập nhật trạng thái phân hệ.");
      await loadModules();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể cập nhật trạng thái.";
      message.error(msg);
    }
  };

  const handleDelete = async (record: ModuleRecord) => {
    if (!canDelete) return;
    try {
      const permTotal = record.permission_count ?? 0;
      const menuTotal = record.menu_count ?? 0;
      if (permTotal > 0 || menuTotal > 0) {
        Modal.warning({
          title: "Không thể xóa phân hệ",
          content:
            "Không thể xoá vì phân hệ đang có quyền/menu. Vui lòng Disable hoặc xoá quyền/menu trước.",
        });
        return;
      }
      await modulesService.deleteModule(record.id);
      message.success("Đã xóa phân hệ.");
      await loadModules();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể xóa phân hệ.";
      message.error(msg);
    }
  };

  const handleViewPermissions = (record: ModuleRecord) => {
    setOverviewModule(record);
    setOverviewOpen(true);
  };

  const handleGeneratePermissions = (record: ModuleRecord) => {
    setGenerateModule(record);
    setGenerateOpen(true);
  };

  return (
    <PermissionGate permission="sa.iam.module.read">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Quản trị hệ thống", href: "/system-admin" },
            { label: "IAM", href: "/system-admin/iam" },
            { label: "Phân hệ" },
          ]}
          title="Quản lý Phân hệ"
          subtitle="Quản lý registry phân hệ và routing theo module"
          actions={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => loadModules()}>
                Làm mới
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} disabled={!canCreate}>
                Thêm phân hệ
              </Button>
            </Space>
          }
        />

        <Card>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Space wrap>
              <Input
                allowClear
                placeholder="Tìm theo key hoặc tên phân hệ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 280 }}
              />
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: 180 }}
                options={[
                  { label: "Tất cả trạng thái", value: "all" },
                  { label: "Hoạt động", value: "active" },
                  { label: "Ngừng", value: "inactive" },
                ]}
              />
              <Select
                value={groupFilter}
                onChange={(value) => setGroupFilter(value)}
                style={{ width: 180 }}
                options={GROUP_OPTIONS}
              />
              <Tooltip title="Chỉ hiển thị phân hệ chưa có quyền (TOTAL = 0)">
                <Space size={6}>
                  <span className="text-sm text-gray-500">Chưa có quyền</span>
                  <Switch checked={noPermissionOnly} onChange={setNoPermissionOnly} />
                </Space>
              </Tooltip>
            </Space>
            <div className="text-sm text-gray-500">Tổng: {total} phân hệ</div>
          </div>

          <ModulesTable
            data={modules}
            loading={loading}
            total={total}
            page={page}
            pageSize={pageSize}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onChange={handleTableChange}
            onEdit={openEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onViewPermissions={handleViewPermissions}
            onGeneratePermissions={handleGeneratePermissions}
          />
        </Card>

        <ModuleFormModal
          open={modalOpen}
          loading={submitting}
          initialValues={editingModule}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />

        <GeneratePermissionsModal
          open={generateOpen}
          module={generateModule}
          onClose={() => setGenerateOpen(false)}
          onGenerated={async () => {
            setGenerateOpen(false);
            await loadModules();
          }}
        />

        <ModulePermissionsOverviewModal
          open={overviewOpen}
          moduleRow={
            overviewModule
              ? {
                  _id: overviewModule.id,
                  key: overviewModule.key,
                  name: overviewModule.name,
                  group: overviewModule.group,
                  status: overviewModule.status,
                  permission_count: overviewModule.permission_count ?? 0,
                  permission_page_count: overviewModule.permission_page_count ?? 0,
                  permission_feature_count: overviewModule.permission_feature_count ?? 0,
                }
              : null
          }
          onClose={() => setOverviewOpen(false)}
          onGeneratePermissions={() => {
            if (!overviewModule) return;
            setOverviewOpen(false);
            handleGeneratePermissions(overviewModule);
          }}
          onOpenManagePermissions={() => {
            if (!overviewModule) return;
            const moduleKey = overviewModule.key;
            navigate(`/system-admin/iam/permissions?module=${encodeURIComponent(moduleKey)}`);
          }}
        />
      </div>
    </PermissionGate>
  );
}
