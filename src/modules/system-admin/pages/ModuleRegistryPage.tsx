import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, History, RefreshCcw, Upload, Boxes } from "lucide-react";

import PageHeader from "../../../layouts/PageHeader";
import { Button } from "../../../app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Badge } from "../../../app/components/ui/badge";
import { Input } from "../../../app/components/ui/input";
import { InstalledModulesTable } from "../components/InstalledModulesTable";
import ModuleRollbackDialog from "../components/ModuleRollbackDialog";
import ModulePreviewDialog from "../components/ModulePreviewDialog";
import { moduleAdminService } from "../services/moduleAdminService";
import { ModuleInfo } from "../types";

type SortKey = "name" | "version" | "basePath";
type StatusFilter = "all" | "active" | "inactive";

type ModuleManifestJson = {
  id: string;
  name?: string;
  version: string;
  basePath: string;
  entry: string;
  routes: string;
  routeExport?: string;
  permissions?: string[];
  ui?: { menuLabel?: string; menuPath?: string };
};

const localManifestModules = (() => {
  const manifests = import.meta.glob<{ default: ModuleManifestJson }>(
    "../**/module.json",
    { eager: true },
  );
  return Object.values(manifests)
    .map((item) => ("default" in item ? item.default : (item as ModuleManifestJson)))
    .filter((item) => Boolean(item?.id && item?.version && item?.basePath))
    .map((item) => ({
      ...item,
      status: "active",
    })) as ModuleInfo[];
})();

const mergeModules = (remote: ModuleInfo[], local: ModuleInfo[]) => {
  const merged = new Map<string, ModuleInfo>();
  local.forEach((item) => merged.set(item.id, item));
  remote.forEach((item) => merged.set(item.id, item));
  return Array.from(merged.values());
};

export default function ModuleRegistryPage() {
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [rollbackTarget, setRollbackTarget] = useState<ModuleInfo | null>(null);
  const [rollbackOpen, setRollbackOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<ModuleInfo | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const loadModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await moduleAdminService.getModules();
      setModules(mergeModules(data, localManifestModules));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách mô-đun.");
      setModules(localManifestModules);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadModules();
  }, []);

  const filteredModules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return modules.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.id.toLowerCase().includes(normalizedQuery) ||
        (item.name ?? "").toLowerCase().includes(normalizedQuery);
      const statusValue = item.status ?? "active";
      const matchesStatus = statusFilter === "all" || statusValue === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [modules, query, statusFilter]);

  const sortedModules = useMemo(() => {
    return [...filteredModules].sort((left, right) => {
      if (sortKey === "version") {
        return String(left.version).localeCompare(String(right.version));
      }
      if (sortKey === "basePath") {
        return String(left.basePath).localeCompare(String(right.basePath));
      }
      return String(left.name ?? left.id).localeCompare(String(right.name ?? right.id));
    });
  }, [filteredModules, sortKey]);

  const lastInstalledAt = useMemo(() => {
    const dates = modules
      .map((item) => (item.installedAt ? new Date(item.installedAt).getTime() : null))
      .filter((value): value is number => value !== null);
    if (dates.length === 0) return "-";
    const latest = new Date(Math.max(...dates));
    return latest.toLocaleString();
  }, [modules]);

  const activeCount = useMemo(
    () => modules.filter((item) => (item.status ?? "active") === "active").length,
    [modules],
  );

  const handleRollback = (moduleId: string) => {
    const target = modules.find((item) => item.id === moduleId) ?? null;
    setRollbackTarget(target);
    setRollbackOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Quản trị", href: "/admin" },
          { label: "Quản trị Module" },
        ]}
        title="Quản trị Module"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/system/modules/history">
                <History className="h-4 w-4" />
                Lịch sử import
              </Link>
            </Button>
            <Button asChild>
              <Link to="/system/modules/import">
                <Upload className="h-4 w-4" />
                Import mô-đun
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => void loadModules()}>
              <RefreshCcw className="h-4 w-4" />
              Làm mới
            </Button>
          </div>
        }
      />

      <div className="px-6 pb-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Tổng mô-đun</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{modules.length}</div>
              <div className="text-xs text-muted-foreground">Tổng số mô-đun đã cài</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{activeCount}</div>
              <div className="text-xs text-muted-foreground">Mô-đun đang hoạt động</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Cập nhật gần nhất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{lastInstalledAt}</div>
              <div className="text-xs text-muted-foreground">Theo thông tin registry</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Boxes className="h-4 w-4" />
              Danh sách mô-đun
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-[220px] flex-1">
                <Input
                  placeholder="Tìm theo tên hoặc module ID"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
              >
                <option value="name">Sắp xếp: Tên</option>
                <option value="version">Sắp xếp: Phiên bản</option>
                <option value="basePath">Sắp xếp: Base path</option>
              </select>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
              <Badge variant="outline">{sortedModules.length} mô-đun</Badge>
            </div>

            {loading && <div className="text-sm text-muted-foreground">Đang tải mô-đun...</div>}
            {error && <div className="text-sm text-destructive">{error}</div>}

            {!loading && sortedModules.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Chưa có mô-đun nào. Hãy import mô-đun mới để bắt đầu.
              </div>
            ) : (
              <InstalledModulesTable
                modules={sortedModules}
                onRollback={handleRollback}
                onPreview={(module) => {
                  setPreviewTarget(module);
                  setPreviewOpen(true);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <ModuleRollbackDialog
        open={rollbackOpen}
        onOpenChange={(value) => {
          setRollbackOpen(value);
          if (!value) setRollbackTarget(null);
        }}
        moduleId={rollbackTarget?.id}
        moduleName={rollbackTarget?.name}
        onCompleted={() => void loadModules()}
      />

      <ModulePreviewDialog
        open={previewOpen}
        onOpenChange={(value) => {
          setPreviewOpen(value);
          if (!value) setPreviewTarget(null);
        }}
        moduleId={previewTarget?.id}
        moduleName={previewTarget?.name}
        basePath={previewTarget?.basePath}
      />
    </div>
  );
}
