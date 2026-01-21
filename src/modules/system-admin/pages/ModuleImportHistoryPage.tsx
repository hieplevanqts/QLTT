import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { History, RefreshCcw, Trash2, Upload } from "lucide-react";

import PageHeader from "../../../layouts/PageHeader";
import { Button } from "../../../app/components/ui/button";
import { Badge } from "../../../app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../app/components/ui/table";
import { moduleAdminService } from "../services/moduleAdminService";
import { ImportJob, ImportStatus } from "../types";

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
  status: ImportStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  if (status === "failed") return "destructive";
  if (status === "completed" || status === "rolled_back") return "default";
  return "secondary";
};

export default function ModuleImportHistoryPage() {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingZip, setDeletingZip] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await moduleAdminService.getImportJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải lịch sử import.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, []);

  const handleDeleteZip = async (jobId: string) => {
    const confirmed = window.confirm("Xóa file ZIP lưu trữ của job này?");
    if (!confirmed) return;
    try {
      setDeletingZip(jobId);
      await moduleAdminService.deleteJobZip(jobId);
      await loadJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa ZIP lưu trữ.");
    } finally {
      setDeletingZip(null);
    }
  };

  const completedCount = useMemo(
    () => jobs.filter((job) => job.status === "completed").length,
    [jobs],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Quản trị", href: "/admin" },
          { label: "Quản trị Module", href: "/system/modules" },
          { label: "Lịch sử import" },
        ]}
        title="Lịch sử import mô-đun"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/system/modules/import">
                <Upload className="h-4 w-4" />
                Import mới
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => void loadJobs()}>
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
              <CardTitle className="text-sm font-medium">Tổng job</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{jobs.length}</div>
              <div className="text-xs text-muted-foreground">Tất cả job import</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Hoàn tất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{completedCount}</div>
              <div className="text-xs text-muted-foreground">Job import thành công</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <History className="h-4 w-4" />
                Cập nhật gần nhất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {jobs[0]?.createdAt ? formatDateTime(jobs[0].createdAt) : "-"}
              </div>
              <div className="text-xs text-muted-foreground">Theo job mới nhất</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Danh sách job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <div className="text-sm text-muted-foreground">Đang tải lịch sử...</div>}
            {error && <div className="text-sm text-destructive">{error}</div>}
            {!loading && jobs.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Chưa có job import nào.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead>Mô-đun</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>ZIP lưu</TableHead>
                    <TableHead>Dung lượng</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Thông báo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.id}</TableCell>
                      <TableCell>{job.moduleName ?? job.moduleId ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(job.status)}>{statusLabel[job.status]}</Badge>
                      </TableCell>
                      <TableCell>{job.fileName ?? "-"}</TableCell>
                      <TableCell>
                        {job.storedZipName ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{job.storedZipName}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Xóa ZIP lưu trữ"
                              onClick={() => void handleDeleteZip(job.id)}
                              disabled={deletingZip === job.id}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{formatFileSize(job.storedZipSize ?? job.fileSize)}</TableCell>
                      <TableCell>{formatDateTime(job.createdAt)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {job.errorMessage ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
