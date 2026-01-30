import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, FileArchive, RefreshCcw, UploadCloud } from "lucide-react";

import PageHeader from "../../../layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ZipUploadBox } from "../components/ZipUploadBox";
import { ValidationResults } from "../components/ValidationResults";
import { ImportJobTimeline } from "../components/ImportJobTimeline";
import { moduleAdminService } from "../services/moduleAdminService";
import { ImportJob, ModuleDetail, ModuleUpdateAnalysis, ReleaseType } from "../types";
import { useAuth } from "../../../contexts/AuthContext";

type UpdateTypeOption = {
  value: ReleaseType;
  label: string;
  description: string;
};

const UPDATE_TYPE_OPTIONS: UpdateTypeOption[] = [
  { value: "patch", label: "PATCH", description: "Chỉnh UI, fix bug, không đổi contract" },
  { value: "minor", label: "MINOR", description: "Thêm màn, thêm filter/field" },
  { value: "major", label: "MAJOR", description: "Đổi route/basePath hoặc đổi contract" },
];

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const diffRow = (label: string, current?: string, next?: string) => ({
  label,
  current: current ?? "-",
  next: next ?? "-",
  changed: Boolean(current && next && current !== next),
});

export default function ModuleUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [detail, setDetail] = useState<ModuleDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ModuleUpdateAnalysis | null>(null);
  const [selectedType, setSelectedType] = useState<ReleaseType | "">("");
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [job, setJob] = useState<ImportJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) {
        setDetailError("Thiếu module ID.");
        setLoadingDetail(false);
        return;
      }

      try {
        setLoadingDetail(true);
        setDetailError(null);
        const data = await moduleAdminService.getModule(id);
        setDetail(data);
      } catch (err) {
        setDetailError(err instanceof Error ? err.message : "Không thể tải chi tiết mô-đun.");
      } finally {
        setLoadingDetail(false);
      }
    };

    void loadDetail();
  }, [id]);

  const handleSelectFile = (selectedFile: File | null) => {
    setFile(selectedFile);
    setAnalysis(null);
    setSelectedType("");
    setSelectedMenuIds([]);
    setJob(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file || !id) {
      setError("Hãy chọn file ZIP để kiểm tra.");
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      const data = await moduleAdminService.inspectUpdate(id, file);
      setAnalysis(data);
      setSelectedMenuIds(data.newMenus?.map((menu) => menu.id) ?? []);
      setSelectedType("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể phân tích gói cập nhật.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpdate = async () => {
    if (!file || !id || !analysis) {
      setError("Chưa đủ dữ liệu để cập nhật.");
      return;
    }

    if (!selectedType) {
      setError("Hãy chọn loại cập nhật.");
      return;
    }

    if (analysis.releaseType && selectedType !== analysis.releaseType) {
      setError("Loại cập nhật đã chọn không khớp release.type trong module.json.");
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setProgressOpen(true);
      const createdJob = await moduleAdminService.updateModule(id, {
        file,
        updateType: selectedType,
        selectedMenuIds,
        updatedBy: user?.username,
        updatedByName: user?.fullName,
      });
      setJob(createdJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật mô-đun thất bại.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (!job) return;
    if (job.status === "completed") {
      const timer = setTimeout(() => {
        navigate("/system/modules");
      }, 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [job, navigate]);

  const validationResults = useMemo(() => analysis?.validationResults ?? [], [analysis]);
  const hasValidationErrors = validationResults.some((item) => item.type === "error");
  const updateMismatch = Boolean(selectedType && analysis?.releaseType && selectedType !== analysis.releaseType);

  const diffRows = useMemo(() => {
    if (!detail || !analysis) return [];
    return [
      diffRow("Phiên bản", detail.version, analysis.manifest.version),
      diffRow("Base path", detail.basePath, analysis.manifest.basePath),
      diffRow("Routes", detail.routes, analysis.manifest.routes),
      diffRow("Entry", detail.entry, analysis.manifest.entry),
      diffRow("Route export", detail.routeExport ?? "-", analysis.manifest.routeExport ?? "-"),
    ];
  }, [detail, analysis]);

  const toggleMenuSelection = (menuId: string, checked: boolean) => {
    setSelectedMenuIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, menuId]));
      }
      return prev.filter((id) => id !== menuId);
    });
  };

  const toggleSelectAllMenus = (checked: boolean) => {
    if (!analysis?.newMenus) return;
    setSelectedMenuIds(checked ? analysis.newMenus.map((menu) => menu.id) : []);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Quản trị", href: "/admin" },
          { label: "Quản trị Module", href: "/system/modules" },
          { label: detail?.name ?? id ?? "Cập nhật mô-đun" },
        ]}
        title="Cập nhật mô-đun"
        actions={
          <Button variant="outline" asChild>
            <Link to={id ? `/system/modules/${id}` : "/system/modules"}>
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        }
      />

      <div className="px-6 pb-8 space-y-6">
        {loadingDetail && <div className="text-sm text-muted-foreground">Đang tải mô-đun...</div>}
        {detailError && <div className="text-sm text-destructive">{detailError}</div>}

        {!loadingDetail && detail && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" />
                  Tải gói cập nhật
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ZipUploadBox
                  acceptedFile={file ?? undefined}
                  onFileSelect={(selectedFile) => handleSelectFile(selectedFile)}
                  onRemove={() => handleSelectFile(null)}
                  disabled={analyzing || updating}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => void handleAnalyze()} disabled={!file || analyzing || updating}>
                    <FileArchive className="h-4 w-4" />
                    {analyzing ? "Đang phân tích..." : "Phân tích gói cập nhật"}
                  </Button>
                  {analysis?.detectedType && (
                    <Badge variant="outline">Detect: {analysis.detectedType.toUpperCase()}</Badge>
                  )}
                  {analysis?.releaseType && (
                    <Badge variant="secondary">release.type: {analysis.releaseType.toUpperCase()}</Badge>
                  )}
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
                <CardTitle className="text-base">Thông tin hiện tại</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phiên bản</span>
                  <span className="font-medium">v{detail.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Base path</span>
                  <span className="font-medium">{detail.basePath}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Routes</span>
                  <span className="font-medium">{detail.routes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cài đặt lúc</span>
                  <span className="font-medium">{formatDateTime(detail.installedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {analysis && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">So sánh manifest</CardTitle>
              </CardHeader>
              <CardContent>
                {diffRows.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thuộc tính</TableHead>
                        <TableHead>Hiện tại</TableHead>
                        <TableHead>Bản cập nhật</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {diffRows.map((row) => (
                        <TableRow key={row.label}>
                          <TableCell className="font-medium">{row.label}</TableCell>
                          <TableCell>{row.current}</TableCell>
                          <TableCell className={row.changed ? "text-destructive" : undefined}>{row.next}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-sm text-muted-foreground">Chưa có dữ liệu so sánh.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chọn loại cập nhật</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Hệ thống đã detect loại cập nhật nhưng vẫn yêu cầu bạn xác nhận.
                </div>
                <RadioGroup value={selectedType} onValueChange={(value) => setSelectedType(value as ReleaseType)}>
                  <div className="space-y-3">
                    {UPDATE_TYPE_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-start gap-3 rounded-md border p-3">
                        <RadioGroupItem value={option.value} id={`update-${option.value}`} />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
                {updateMismatch && (
                  <div className="text-xs text-destructive">
                    Loại cập nhật bạn chọn không khớp release.type trong module.json.
                  </div>
                )}
                {analysis.releaseType && analysis.detectedType && analysis.releaseType !== analysis.detectedType && (
                  <div className="text-xs text-muted-foreground">
                    Detect khác release.type, vui lòng kiểm tra lại nội dung gói cập nhật.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {analysis && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kết quả kiểm tra</CardTitle>
              </CardHeader>
              <CardContent>
                {validationResults.length > 0 ? (
                  <ValidationResults results={validationResults} />
                ) : (
                  <div className="text-sm text-muted-foreground">Không có cảnh báo nào.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Menu mới (nếu có)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.newMenus.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Không có menu mới.</div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Chọn menu cần thêm</span>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedMenuIds.length === analysis.newMenus.length}
                          onCheckedChange={(checked) => toggleSelectAllMenus(Boolean(checked))}
                        />
                        <span>Chọn tất cả</span>
                      </label>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead />
                          <TableHead>Label</TableHead>
                          <TableHead>Path</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysis.newMenus.map((menu) => (
                          <TableRow key={menu.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedMenuIds.includes(menu.id)}
                                onCheckedChange={(checked) => toggleMenuSelection(menu.id, Boolean(checked))}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{menu.label}</TableCell>
                            <TableCell>{menu.path}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thực hiện cập nhật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => void handleUpdate()}
                  disabled={!file || !analysis || !selectedType || updating || analyzing || hasValidationErrors || updateMismatch}
                >
                  {updating ? "Đang cập nhật..." : "Cập nhật mô-đun"}
                </Button>
                {hasValidationErrors && (
                  <Badge variant="destructive">Có lỗi validate</Badge>
                )}
                {!selectedType && (
                  <Badge variant="outline">Chưa chọn loại cập nhật</Badge>
                )}
                {job?.status && (
                  <Badge variant={job.status === "failed" ? "destructive" : "secondary"}>
                    {job.status === "failed" ? "Thất bại" : "Đang xử lý"}
                  </Badge>
                )}
              </div>
              {job?.timeline && job.timeline.length > 0 && <ImportJobTimeline events={job.timeline} />}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Đang cập nhật mô-đun</DialogTitle>
            <DialogDescription>
              Hệ thống đang xử lý gói cập nhật. Vui lòng không tắt tab trong lúc chạy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {updating && !job && (
              <div className="text-sm text-muted-foreground">Đang gửi gói cập nhật...</div>
            )}
            {job?.timeline && job.timeline.length > 0 && (
              <ImportJobTimeline events={job.timeline} />
            )}
            {job?.status === "completed" && (
              <Badge variant="secondary">Hoàn tất. Đang chuyển về danh sách mô-đun...</Badge>
            )}
            {job?.status === "failed" && (
              <Badge variant="destructive">Cập nhật thất bại</Badge>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressOpen(false)}>
              Đóng
            </Button>
            <Button onClick={() => navigate("/system/modules")}>Về danh sách mô-đun</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

