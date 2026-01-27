import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, GitBranch, RotateCcw } from "lucide-react";

import PageHeader from "../../../layouts/PageHeader";
import { Button } from "../../../app/components/ui/button";
import { Badge } from "../../../app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../app/components/ui/tabs";
import { moduleAdminService } from "../services/moduleAdminService";
import { ModuleDetail } from "../types";
import ModuleRollbackDialog from "../components/ModuleRollbackDialog";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const statusLabel = (status?: ModuleDetail["status"]) => {
  if (status === "inactive") return "Tạm dừng";
  return "Hoạt động";
};

const renderFileList = (
  files: string[],
  label: string,
  badgeVariant: "default" | "secondary" | "destructive" | "outline",
  code: "A" | "M" | "D",
) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm font-medium">
      <Badge variant={badgeVariant}>{label}</Badge>
      <span className="text-muted-foreground">{files.length} file</span>
    </div>
    {files.length === 0 ? (
      <div className="text-xs text-muted-foreground">Không có thay đổi.</div>
    ) : (
      <ul className="space-y-1 text-xs text-muted-foreground">
        {files.map((file) => (
          <li key={file} className="flex items-center gap-2">
            <span className="font-medium text-foreground">{code}</span>
            <span>{file}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const statusBadge = (status: "added" | "modified" | "unchanged") => {
  if (status === "added") return <Badge variant="secondary">Thêm</Badge>;
  if (status === "modified") return <Badge variant="outline">Sửa</Badge>;
  return <Badge variant="default">Ổn định</Badge>;
};

const schemaStatusBadge = (status: "exists" | "missing" | "unknown") => {
  if (status === "exists") return <Badge variant="secondary">Đã có</Badge>;
  if (status === "missing") return <Badge variant="destructive">Thiếu</Badge>;
  return <Badge variant="outline">Chưa xác định</Badge>;
};

const relationMockBadge = (existsInMock: boolean) => (
  <Badge variant={existsInMock ? "secondary" : "destructive"}>
    Mock {existsInMock ? "có" : "thiếu"}
  </Badge>
);

const menuStatusBadge = (enabled?: boolean) => (
  <Badge variant={enabled === false ? "outline" : "secondary"}>
    {enabled === false ? "Tắt" : "Bật"}
  </Badge>
);

export default function ModuleDetailPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState<ModuleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rollbackOpen, setRollbackOpen] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) {
        setError("Thiếu module ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await moduleAdminService.getModule(id);
        setDetail(data);
      } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải chi tiết mô-đun.");
      } finally {
        setLoading(false);
      }
    };

    void loadDetail();
  }, [id]);

  const handleRollbackCompleted = async () => {
    if (!detail?.id) return;
    try {
      const refreshed = await moduleAdminService.getModule(detail.id);
      setDetail(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải lại mô-đun sau rollback.");
    }
  };

  const dataModelTables = detail?.dataModel?.tables ?? [];
  const dataModelSummary = dataModelTables.reduce(
    (acc, table) => {
      if (table.dbStatus === "exists") acc.exists += 1;
      else if (table.dbStatus === "missing") acc.missing += 1;
      else acc.unknown += 1;
      return acc;
    },
    { exists: 0, missing: 0, unknown: 0 },
  );
  const linkedMenus = detail?.linkedMenus ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Quản trị", href: "/admin" },
          { label: "Quản trị Module", href: "/system/modules" },
          { label: detail?.name ?? id ?? "Chi tiết mô-đun" },
        ]}
        title={detail?.name ?? "Chi tiết mô-đun"}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/system/modules">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            {detail?.id && (
              <Button variant="outline" asChild>
                <Link to={`/system/modules/${detail.id}/update`}>
                  Cập nhật mô-đun
                </Link>
              </Button>
            )}
            <Button variant="destructive" onClick={() => setRollbackOpen(true)} disabled={!detail}>
              <RotateCcw className="h-4 w-4" />
              Rollback
            </Button>
          </div>
        }
      />

      <div className="px-6 pb-8 space-y-6">
        {loading && <div className="text-sm text-muted-foreground">Đang tải mô-đun...</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}

        {!loading && detail && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan file</TabsTrigger>
              <TabsTrigger value="data-model">Lược đồ dữ liệu</TabsTrigger>
              <TabsTrigger value="menus">Liên kết menu</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Thông tin mô-đun</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <div className="text-muted-foreground">ID mô-đun</div>
                        <div className="font-medium">{detail.id}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Trạng thái</div>
                        <Badge variant={detail.status === "inactive" ? "outline" : "secondary"}>
                          {statusLabel(detail.status)}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Phiên bản</div>
                        <div className="font-medium">v{detail.version}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Base path</div>
                        <div className="font-medium">{detail.basePath}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Entry</div>
                        <div className="font-medium">{detail.entry}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Routes</div>
                        <div className="font-medium">{detail.routes}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Route export</div>
                        <div className="font-medium">{detail.routeExport ?? "-"}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Cài đặt lúc</div>
                        <div className="font-medium">{formatDateTime(detail.installedAt)}</div>
                      </div>
                    </div>
                    {detail.permissions?.length ? (
                      <div>
                        <div className="text-muted-foreground mb-2">Permissions</div>
                        <div className="flex flex-wrap gap-2">
                          {detail.permissions.map((permission) => (
                            <Badge key={permission} variant="outline">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Danh sách file</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {detail.files && detail.files.length > 0 ? (
                      <div className="max-h-[360px] overflow-auto rounded-md border p-3 text-sm">
                        <ul className="space-y-1">
                          {detail.files.map((file) => (
                            <li key={file} className="text-muted-foreground">
                              {file}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Chưa có file nào.</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">File CSS trong mô-đun</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    {detail.cssAudit && detail.cssAudit.length > 0 ? (
                      <div className="max-h-[240px] overflow-auto rounded-md border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted text-muted-foreground">
                            <tr>
                              <th className="p-2 text-left">File</th>
                              <th className="p-2 text-left">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detail.cssAudit.map((item) => (
                              <tr key={item.path} className="border-t">
                                <td className="p-2 text-muted-foreground">{item.path}</td>
                                <td className="p-2">{statusBadge(item.status)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Không tìm thấy file CSS.</div>
                    )}

                    {detail.missingCssImports && detail.missingCssImports.length > 0 ? (
                      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        <div className="font-medium">Import CSS bị thiếu</div>
                        <ul className="mt-2 space-y-1 text-xs">
                          {detail.missingCssImports.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Không phát hiện lỗi import CSS.</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tình trạng file hệ thống</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Entry file</span>
                      <Badge variant={detail.fileHealth?.entryExists ? "secondary" : "destructive"}>
                        {detail.fileHealth?.entryExists ? "Tồn tại" : "Thiếu file"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Routes file</span>
                      <Badge variant={detail.fileHealth?.routesExists ? "secondary" : "destructive"}>
                        {detail.fileHealth?.routesExists ? "Tồn tại" : "Thiếu file"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Kiểm tra các file mà module.json đang trỏ tới để đảm bảo module hoạt động.
                    </div>
                  </CardContent>
                </Card>
              </div>

              {detail.fileChanges && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      Thay đổi file so với bản trước
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>So với phiên bản: {detail.fileChanges.baseVersion ?? "-"}</span>
                      {detail.fileChanges.baseAt && (
                        <span>Thời điểm: {formatDateTime(detail.fileChanges.baseAt)}</span>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {renderFileList(detail.fileChanges.added ?? [], "Thêm", "secondary", "A")}
                      {renderFileList(detail.fileChanges.modified ?? [], "Sửa", "outline", "M")}
                      {renderFileList(detail.fileChanges.removed ?? [], "Xóa", "destructive", "D")}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="data-model" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lược đồ dữ liệu cần có</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span>Prefix: {detail.dataModel?.prefix ?? "-"}</span>
                    <span>Nguồn schema: {detail.dataModel?.schemaSource ?? "Chưa có snapshot"}</span>
                    <span>Tổng bảng: {dataModelTables.length}</span>
                    <span>
                      Đã có: {dataModelSummary.exists} | Thiếu: {dataModelSummary.missing} | Chưa xác định: {dataModelSummary.unknown}
                    </span>
                  </div>

                  {dataModelTables.length > 0 ? (
                    <div className="space-y-4">
                      {dataModelTables.map((table) => (
                        <div key={table.table} className="rounded-md border p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="font-medium">{table.table}</div>
                            {schemaStatusBadge(table.dbStatus)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Nguồn mock: {table.source?.length ? table.source.join(", ") : "Chưa có dữ liệu"}
                          </div>
                          {table.fields?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {table.fields.map((field) => (
                                <Badge key={field} variant="outline">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">Chưa suy diễn được cột từ mock data.</div>
                          )}

                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">Liên kết bảng</div>
                            {table.relations?.length ? (
                              <div className="space-y-2 text-xs">
                                {table.relations.map((relation) => (
                                  <div key={`${table.table}-${relation.column}`} className="flex flex-wrap items-center gap-2 rounded-md border px-3 py-2">
                                    <span className="font-medium">{relation.column}</span>
                                    <span className="text-muted-foreground">→ {relation.targetTable}</span>
                                    {schemaStatusBadge(relation.status)}
                                    {relationMockBadge(relation.existsInMock)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">Không phát hiện cột liên kết.</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                      Chưa tìm thấy mock data trong thư mục <code>data/</code> của mô-đun.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="menus" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">Menu đang liên kết</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      Các menu hiện đang trỏ tới mô-đun này.
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/system/menus">Quản trị menu</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {linkedMenus.length > 0 ? (
                    <div className="max-h-[360px] overflow-auto rounded-md border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                          <tr>
                            <th className="p-2 text-left">Nhãn</th>
                            <th className="p-2 text-left">Đường dẫn</th>
                            <th className="p-2 text-left">Trạng thái</th>
                            <th className="p-2 text-left">Menu ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {linkedMenus.map((menu) => (
                            <tr key={menu.id} className="border-t">
                              <td className="p-2 font-medium">{menu.label}</td>
                              <td className="p-2 text-muted-foreground">{menu.path ?? "-"}</td>
                              <td className="p-2">{menuStatusBadge(menu.isEnabled)}</td>
                              <td className="p-2 text-muted-foreground">{menu.id}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground space-y-2">
                      <div className="font-medium text-foreground">Chưa có menu liên kết</div>
                      <div>Hãy tạo menu hoặc liên kết mô-đun tại phân hệ quản trị menu.</div>
                      {detail.ui?.menuLabel || detail.ui?.menuPath ? (
                        <div className="text-xs text-muted-foreground">
                          Gợi ý từ manifest: {detail.ui?.menuLabel ?? "-"} ({detail.ui?.menuPath ?? "-"})
                        </div>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <ModuleRollbackDialog
        open={rollbackOpen}
        onOpenChange={setRollbackOpen}
        moduleId={detail?.id}
        moduleName={detail?.name}
        onCompleted={handleRollbackCompleted}
      />
    </div>
  );
}
