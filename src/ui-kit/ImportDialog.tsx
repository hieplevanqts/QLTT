import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../app/components/ui/dialog';
import { Button } from '../app/components/ui/button';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (file: File) => Promise<void>;
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === 'application/vnd.ms-excel' ||
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setUploading(true);
    try {
      await onImport?.(file);
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    onOpenChange(false);
  };

  const handleDownloadSample = () => {
    // In production, this would download actual sample file
    console.log('Download sample file');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[544px]">
        <DialogHeader>
          <div className="flex items-start justify-between w-full">
            <DialogTitle className="text-xl font-semibold text-[#101828]">
              Nhập excel
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between">
              <label className="text-sm font-normal text-[#101828]">
                Tài liệu đính kèm <span className="text-[#f04438] font-medium">*</span>
              </label>
              <button
                onClick={handleDownloadSample}
                className="text-sm font-normal text-primary hover:underline"
              >
                Tải về tài liệu mẫu
              </button>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-[#d0d5dd] hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />

              {!file ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-6 w-6 text-[#101828] mb-2" />
                  <label
                    htmlFor="file-upload"
                    className="text-sm font-semibold text-[#101828] cursor-pointer"
                  >
                    Tải hoặc kéo thả file
                  </label>
                  <p className="text-xs font-normal text-[#667085] mt-1">
                    Hỗ trợ file: .xls, .xlsx. Tối đa 10MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel} disabled={uploading}>
            Hủy bỏ
          </Button>
          <Button onClick={handleImport} disabled={!file || uploading}>
            {uploading ? 'Đang tải lên...' : 'Tải lên'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}