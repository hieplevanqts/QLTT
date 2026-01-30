import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalRecords?: number;
  selectedCount?: number;
  onExport?: (options: ExportOptions) => void;
}

export interface ExportOptions {
  format: 'xlsx' | 'csv';
  scope: 'all' | 'filtered' | 'selected';
  includeHeaders: boolean;
  columns: string[];
}

export function ExportDialog({
  open,
  onOpenChange,
  totalRecords = 0,
  selectedCount = 0,
  onExport,
}: ExportDialogProps) {
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [scope, setScope] = useState<'all' | 'filtered' | 'selected'>('all');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const handleExport = () => {
    onExport?.({
      format,
      scope,
      includeHeaders,
      columns: ['name', 'address', 'type', 'jurisdiction', 'status'],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between w-full">
            <div>
              <DialogTitle>Xuất dữ liệu cơ sở</DialogTitle>
              <DialogDescription>
                Chọn định dạng và phạm vi dữ liệu cần xuất
              </DialogDescription>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Định dạng file</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'xlsx' | 'csv')}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="xlsx" id="xlsx" />
                <Label htmlFor="xlsx" className="flex items-center gap-2 cursor-pointer flex-1">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Excel (.xlsx)</div>
                    <div className="text-xs text-muted-foreground">
                      Định dạng bảng tính, hỗ trợ formatting
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer flex-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">CSV (.csv)</div>
                    <div className="text-xs text-muted-foreground">
                      Dữ liệu thuần, dễ import vào hệ thống khác
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Export Scope */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Phạm vi xuất</Label>
            <RadioGroup value={scope} onValueChange={(v) => setScope(v as any)}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer flex-1">
                  <div className="text-sm font-medium">Tất cả ({totalRecords} bản ghi)</div>
                  <div className="text-xs text-muted-foreground">
                    Xuất toàn bộ dữ liệu trong hệ thống
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="filtered" id="filtered" />
                <Label htmlFor="filtered" className="cursor-pointer flex-1">
                  <div className="text-sm font-medium">Dữ liệu đang lọc</div>
                  <div className="text-xs text-muted-foreground">
                    Xuất các bản ghi đang hiển thị sau khi lọc
                  </div>
                </Label>
              </div>
              {selectedCount > 0 && (
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="selected" id="selected" />
                  <Label htmlFor="selected" className="cursor-pointer flex-1">
                    <div className="text-sm font-medium">
                      Các bản ghi đã chọn ({selectedCount})
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Chỉ xuất các dòng đã được tích chọn
                    </div>
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tùy chọn</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="headers"
                checked={includeHeaders}
                onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
              />
              <Label
                htmlFor="headers"
                className="text-sm font-normal cursor-pointer"
              >
                Bao gồm tiêu đề cột
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
