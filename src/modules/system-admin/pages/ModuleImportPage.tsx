import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, History, RefreshCcw, UploadCloud, FileArchive, CircleHelp } from "lucide-react";

import PageHeader from "../../../layouts/PageHeader";
import { Button } from "../../../app/components/ui/button";
import { Badge } from "../../../app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../app/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../app/components/ui/tooltip";
import { ZipUploadBox } from "../components/ZipUploadBox";
import { ValidationResults } from "../components/ValidationResults";
import { ImportJobTimeline } from "../components/ImportJobTimeline";
import { moduleAdminService } from "../services/moduleAdminService";
import { ImportJob, ImportStatus, ModuleManifestOverrides } from "../types";

type ImportStep = "idle" | "uploading" | "processing" | "done" | "error";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const statusLabel: Record<ImportStatus, string> = {
  pending: "Đang chờ",
  validating: "Đang kiểm tra",
  importing: "Đang cài",
  completed: "Hoàn tất",
  failed: "Thất bại",
  rolled_back: "Đã rollback",
};

const statusVariant = (
  status?: ImportStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "secondary";
  if (status === "failed") return "destructive";
  if (status === "completed" || status === "rolled_back") return "default";
  return "secondary";
};

export default function ModuleImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<ImportStep>("idle");
  const [job, setJob] = useState<ImportJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [overrideForm, setOverrideForm] = useState({
    name: "",
    version: "",
    basePath: "",
    entry: "",
    routes: "",
    routeExport: "",
    permissions: "",
    menuLabel: "",
    menuPath: "",
  });

  useEffect(() => {
    let timer: number | undefined;

    if (polling && job?.id) {
      timer = window.setInterval(async () => {
        try {
          const data = await moduleAdminService.getImportJob(job.id);
          setJob(data);
          if (!["pending", "validating", "importing"].includes(data.status)) {
            setPolling(false);
            setStep(data.status === "failed" ? "error" : "done");
          }
        } catch (err) {
          setPolling(false);
          setError(err instanceof Error ? err.message : "Không thể tải trạng thái job.");
        }
      }, 1500);
    }

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [polling, job?.id]);

  const handleSelectFile = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
    setJob(null);
    setStep("idle");
    setPolling(false);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Hãy chọn file ZIP để import.");
      return;
    }

    try {
      setStep("uploading");
      setError(null);
      const overrides = buildOverrides(overrideForm);
      const createdJob = await moduleAdminService.importModule(file, overrides);
      setJob(createdJob);
      if (["pending", "validating", "importing"].includes(createdJob.status)) {
        setStep("processing");
        setPolling(true);
      } else {
        setStep(createdJob.status === "failed" ? "error" : "done");
      }
    } catch (err) {
      setStep("error");
      setError(err instanceof Error ? err.message : "Import thất bại.");
    }
  };

  const validationResults = useMemo(() => job?.validationResults ?? [], [job]);
  const timelineEvents = useMemo(() => job?.timeline ?? [], [job]);
  const isBusy = step === "uploading" || step === "processing";
  const moduleJsonErrors = useMemo(
    () => validationResults.filter((item) => item.type === "error" && /module\\.json/i.test(item.message)),
    [validationResults],
  );

  const updateOverrideField = (key: keyof typeof overrideForm, value: string) => {
    setOverrideForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Quản trị", href: "/admin" },
          { label: "Quản trị Module", href: "/system/modules" },
          { label: "Import mô-đun" },
        ]}
        title="Import mô-đun"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/system/modules/history">
                <History className="h-4 w-4" />
                Lịch sử import
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/system/modules">
                <RefreshCcw className="h-4 w-4" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>
        }
      />

      <div className="px-6 pb-8 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Tải gói mô-đun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ZipUploadBox
                acceptedFile={file ?? undefined}
                onFileSelect={(selectedFile) => handleSelectFile(selectedFile)}
                onRemove={() => handleSelectFile(null)}
                disabled={isBusy}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => void handleImport()} disabled={!file || isBusy}>
                  <FileArchive className="h-4 w-4" />
                  {isBusy ? "Đang xử lý..." : "Bắt đầu import"}
                </Button>
                {job && (
                  <Badge variant={statusVariant(job.status)}>
                    {statusLabel[job.status]}
                  </Badge>
                )}
                {file && <Badge variant="outline">{formatFileSize(file.size)}</Badge>}
              </div>
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bảng hướng dẫn gói mô-đun</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mục</TableHead>
                    <TableHead>Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      module.json
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="ml-2 inline-flex items-center text-muted-foreground">
                            <CircleHelp className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="max-w-xs space-y-1">
                            <div>Trường tối thiểu:</div>
                            <div>id, name, version, basePath</div>
                            <div>entry, routes, permissions</div>
                            <div>ui.menuLabel, ui.menuPath</div>
                            <div>routeExport</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      Bắt buộc ở thư mục gốc của mô-đun.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Cấu trúc thư mục
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="ml-2 inline-flex items-center text-muted-foreground">
                            <CircleHelp className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="max-w-xs space-y-1">
                            <div>Cho phép:</div>
                            <div>&lt;moduleId&gt;/* hoặc</div>
                            <div>src/modules/&lt;moduleId&gt;/*</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      Tên thư mục phải trùng với ID mô-đun.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Định dạng file</TableCell>
                    <TableCell>
                      Chỉ nhận .ts, .tsx, .css, .json, .md và tài nguyên ảnh.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Base path</TableCell>
                    <TableCell>
                      Không được trùng với mô-đun đã cài.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      File bị cấm
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="ml-2 inline-flex items-center text-muted-foreground">
                            <CircleHelp className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="max-w-xs space-y-1">
                            <div>Ví dụ: package.json, App.tsx</div>
                            <div>main.tsx, routes/*, .env*</div>
                            <div>vite.config.ts, tsconfig*.json</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      Không được chạm vào file hệ thống.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Giới hạn</TableCell>
                    <TableCell>
                      Tối đa 5MB và 300 file.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trạng thái job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Job ID</div>
                      <div className="font-medium">{job.id}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Trạng thái</div>
                      <div>
                        <Badge variant={statusVariant(job.status)}>{statusLabel[job.status]}</Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Mô-đun</div>
                      <div className="font-medium">{job.moduleName ?? job.moduleId ?? "-"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Phiên bản</div>
                      <div className="font-medium">{job.version ?? "-"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">File</div>
                      <div className="font-medium">{job.fileName ?? "-"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Dung lượng</div>
                      <div className="font-medium">{formatFileSize(job.fileSize)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tạo lúc</div>
                      <div className="font-medium">{formatDateTime(job.createdAt)}</div>
                    </div>
                  </div>
                  {job.errorMessage && (
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                      {job.errorMessage}
                    </div>
                  )}
                  {timelineEvents.length > 0 && <ImportJobTimeline events={timelineEvents} />}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Chưa có job import nào được tạo.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kết quả validate</CardTitle>
            </CardHeader>
            <CardContent>
              {validationResults.length > 0 ? (
                <ValidationResults results={validationResults} />
              ) : (
                <div className="text-sm text-muted-foreground">Chưa có dữ liệu kiểm tra.</div>
              )}
              {file && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Sửa nhanh module.json</div>
                    <div className="text-xs text-muted-foreground">
                      Điền các trường còn thiếu rồi bấm import lại. Giá trị trống sẽ không ghi đè.
                    </div>
                    {moduleJsonErrors.length > 0 && (
                      <div className="text-xs text-destructive">
                        {moduleJsonErrors.map((item) => item.message).join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="module-route-export-inline">routeExport</Label>
                      <Input
                        id="module-route-export-inline"
                        placeholder="kpiQlttRoute"
                        value={overrideForm.routeExport}
                        onChange={(event) => updateOverrideField("routeExport", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-basepath-inline">basePath</Label>
                      <Input
                        id="module-basepath-inline"
                        placeholder="/kpi"
                        value={overrideForm.basePath}
                        onChange={(event) => updateOverrideField("basePath", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-entry-inline">entry</Label>
                      <Input
                        id="module-entry-inline"
                        placeholder="src/modules/kpi-qltt/index.ts"
                        value={overrideForm.entry}
                        onChange={(event) => updateOverrideField("entry", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-routes-inline">routes</Label>
                      <Input
                        id="module-routes-inline"
                        placeholder="src/modules/kpi-qltt/routes.tsx"
                        value={overrideForm.routes}
                        onChange={(event) => updateOverrideField("routes", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-menu-label-inline">ui.menuLabel</Label>
                      <Input
                        id="module-menu-label-inline"
                        placeholder="KPI QLTT"
                        value={overrideForm.menuLabel}
                        onChange={(event) => updateOverrideField("menuLabel", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-menu-path-inline">ui.menuPath</Label>
                      <Input
                        id="module-menu-path-inline"
                        placeholder="/kpi"
                        value={overrideForm.menuPath}
                        onChange={(event) => updateOverrideField("menuPath", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="module-permissions-inline">permissions (phân tách bằng dấu phẩy)</Label>
                      <Input
                        id="module-permissions-inline"
                        placeholder="reports:read, reports:export"
                        value={overrideForm.permissions}
                        onChange={(event) => updateOverrideField("permissions", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-name-inline">Tên mô-đun</Label>
                      <Input
                        id="module-name-inline"
                        placeholder="KPI & Thống kê QLTT"
                        value={overrideForm.name}
                        onChange={(event) => updateOverrideField("name", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-version-inline">Phiên bản</Label>
                      <Input
                        id="module-version-inline"
                        placeholder="0.1.0"
                        value={overrideForm.version}
                        onChange={(event) => updateOverrideField("version", event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => void handleImport()}
                      disabled={!file || isBusy}
                    >
                      {isBusy ? "Đang xử lý..." : "Import lại với cấu hình này"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const buildOverrides = (form: {
  name: string;
  version: string;
  basePath: string;
  entry: string;
  routes: string;
  routeExport: string;
  permissions: string;
  menuLabel: string;
  menuPath: string;
}): ModuleManifestOverrides | undefined => {
  const overrides: ModuleManifestOverrides = {};
  const name = form.name.trim();
  const version = form.version.trim();
  const basePath = form.basePath.trim();
  const entry = form.entry.trim();
  const routes = form.routes.trim();
  const routeExport = form.routeExport.trim();
  const permissionsRaw = form.permissions.trim();
  const menuLabel = form.menuLabel.trim();
  const menuPath = form.menuPath.trim();

  if (name) overrides.name = name;
  if (version) overrides.version = version;
  if (basePath) overrides.basePath = basePath;
  if (entry) overrides.entry = entry;
  if (routes) overrides.routes = routes;
  if (routeExport) overrides.routeExport = routeExport;
  if (permissionsRaw) {
    overrides.permissions = permissionsRaw
      .split(/[,\\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (menuLabel || menuPath) {
    overrides.ui = {
      ...(menuLabel ? { menuLabel } : {}),
      ...(menuPath ? { menuPath } : {}),
    };
  }

  return Object.keys(overrides).length > 0 ? overrides : undefined;
};
