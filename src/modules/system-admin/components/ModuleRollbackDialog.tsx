import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, UploadCloud } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../app/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../app/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../../../app/components/ui/radio-group";
import { Button } from "../../../app/components/ui/button";
import { Badge } from "../../../app/components/ui/badge";
import { Input } from "../../../app/components/ui/input";
import { moduleAdminService } from "../services/moduleAdminService";
import { ImportJob } from "../types";
import { useAuth } from "../../../contexts/AuthContext";

type RollbackMode = "history" | "upload";

interface ModuleRollbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId?: string;
  moduleName?: string;
  onCompleted?: (job: ImportJob) => void;
}

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const MAX_HISTORY = 5;

export default function ModuleRollbackDialog({
  open,
  onOpenChange,
  moduleId,
  moduleName,
  onCompleted,
}: ModuleRollbackDialogProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<RollbackMode>("history");
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !moduleId) return;
    const load = async () => {
      try {
        setLoadingHistory(true);
        setError(null);
        const data = await moduleAdminService.getImportJobs();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải lịch sử rollback.");
      } finally {
        setLoadingHistory(false);
      }
    };
    void load();
  }, [open, moduleId]);

  useEffect(() => {
    if (!open) {
      setMode("history");
      setSelectedJobId("");
      setFile(null);
      setError(null);
    }
  }, [open]);

  const historyOptions = useMemo(() => {
    return jobs
      .filter(job => job.moduleId === moduleId && job.backupPath)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, MAX_HISTORY);
  }, [jobs, moduleId]);

  const handleRollback = async () => {
    if (!moduleId) return;
    if (mode === "history") {
      if (!selectedJobId) {
        setError("Hãy chọn một phiên bản để rollback.");
        return;
      }
    }

    if (mode === "upload" && !file) {
      setError("Hãy chọn file ZIP để rollback.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      const job = await moduleAdminService.rollbackModule(moduleId, {
        jobId: mode === "history" ? selectedJobId : undefined,
        file: mode === "upload" ? file ?? undefined : undefined,
        requestedBy: user?.username,
        requestedByName: user?.fullName,
      });
      onCompleted?.(job);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rollback thất bại.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rollback mô-đun</DialogTitle>
          <DialogDescription>
            {moduleName ? `Mô-đun: ${moduleName}` : "Chọn nguồn rollback cho mô-đun."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => setMode(value as RollbackMode)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Theo lịch sử</TabsTrigger>
            <TabsTrigger value="upload">Tải ZIP thủ công</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              Lưu tối đa 5 phiên bản gần nhất. Ưu tiên rollback theo lịch sử để đảm bảo đồng bộ.
            </div>
            {loadingHistory && <div className="text-sm text-muted-foreground">Đang tải lịch sử...</div>}
            {!loadingHistory && historyOptions.length === 0 && (
              <div className="text-sm text-muted-foreground">Chưa có phiên bản backup để rollback.</div>
            )}
            {!loadingHistory && historyOptions.length > 0 && (
              <RadioGroup value={selectedJobId} onValueChange={setSelectedJobId} className="space-y-3">
                {historyOptions.map((job) => {
                  const targetVersion = job.backupVersion ?? job.previousVersion ?? "-";
                  return (
                    <label
                      key={job.id}
                      className="flex items-start gap-3 rounded-md border p-3 hover:bg-muted/30"
                    >
                      <RadioGroupItem value={job.id} id={`rollback-${job.id}`} />
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">Rollback về v{targetVersion}</div>
                        <div className="text-xs text-muted-foreground">
                          Job {job.id} · {formatDateTime(job.createdAt)}
                        </div>
                        {job.version && (
                          <div className="text-xs text-muted-foreground">
                            Phiên bản đã cài: v{job.version}
                          </div>
                        )}
                      </div>
                      {job.operation && <Badge variant="outline">{job.operation}</Badge>}
                    </label>
                  );
                })}
              </RadioGroup>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              ZIP phải có module.json đúng chuẩn và tên file trùng với module ID.
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept=".zip"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                disabled={processing}
              />
              <UploadCloud className="h-5 w-5 text-muted-foreground" />
            </div>
            {file && (
              <div className="text-xs text-muted-foreground">
                Đã chọn: <span className="font-medium text-foreground">{file.name}</span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => void handleRollback()}
            disabled={processing || !moduleId}
          >
            {processing ? "Đang rollback..." : "Rollback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
