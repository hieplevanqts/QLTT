import { useEffect, useMemo, useState } from "react";
import { ExternalLink, MonitorPlay } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { moduleAdminService } from "../services/moduleAdminService";
import type { ModuleDetail } from "../types";

interface ModulePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId?: string;
  moduleName?: string;
  basePath?: string;
}

export default function ModulePreviewDialog({
  open,
  onOpenChange,
  moduleId,
  moduleName,
  basePath,
}: ModulePreviewDialogProps) {
  const [detail, setDetail] = useState<ModuleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!basePath) return "";
    return `${window.location.origin}${basePath}`;
  }, [basePath]);

  useEffect(() => {
    if (!open || !moduleId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await moduleAdminService.getModule(moduleId);
        setDetail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải thông tin mô-đun.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [open, moduleId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MonitorPlay className="h-4 w-4" />
            Xem trước mô-đun
          </DialogTitle>
          <DialogDescription>
            {moduleName ?? moduleId ?? "Chọn mô-đun để xem trước"}
          </DialogDescription>
        </DialogHeader>

        {loading && <div className="text-sm text-muted-foreground">Đang tải thông tin...</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}

        {detail && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="outline">v{detail.version}</Badge>
            <span className="text-muted-foreground">Base path:</span>
            <span className="font-medium">{detail.basePath}</span>
            {detail.fileHealth && (
              <Badge variant={detail.fileHealth.entryExists && detail.fileHealth.routesExists ? "secondary" : "destructive"}>
                {detail.fileHealth.entryExists && detail.fileHealth.routesExists ? "File OK" : "File lỗi"}
              </Badge>
            )}
          </div>
        )}

        {previewUrl ? (
          <div className="rounded-md border overflow-hidden">
            <iframe title="Module preview" src={previewUrl} className="h-[60vh] w-full bg-white" />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Chưa có đường dẫn preview.</div>
        )}

        <DialogFooter>
          {previewUrl && (
            <Button variant="outline" asChild>
              <a href={previewUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Mở tab mới
              </a>
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

