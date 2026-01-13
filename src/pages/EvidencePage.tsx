import React, { useState } from 'react';
import { Plus, Download, FileBox } from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import ModernFilterBar from '../patterns/ModernFilterBar';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';

export default function EvidencePage() {
  const [evidenceType, setEvidenceType] = useState('');
  const [transferStatus, setTransferStatus] = useState('');

  return (
    <div className="flex flex-col">
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Kho chứng cứ' }]}
        title="Kho chứng cứ"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm">
              <Plus size={16} />
              Thêm chứng cứ
            </Button>
          </div>
        }
      />

      <div className="px-6 pt-4">
        <ModernFilterBar
          showDefaultFilters={true}
          showSearch={true}
          searchPlaceholder="Tìm kiếm chứng cứ theo mã, tên gói..."
          customFilters={
            <>
              {/* Loại chứng cứ */}
              <div>
                <Select value={evidenceType} onValueChange={setEvidenceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Loại chứng cứ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="photo">Hình ảnh</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Tài liệu</SelectItem>
                    <SelectItem value="sample">Mẫu vật</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trạng thái chuyển hồ sơ */}
              <div>
                <Select value={transferStatus} onValueChange={setTransferStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái chuyển" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="storing">Đang lưu trữ</SelectItem>
                    <SelectItem value="ready">Sẵn sàng chuyển</SelectItem>
                    <SelectItem value="transferred">Đã chuyển hồ sơ</SelectItem>
                    <SelectItem value="overdue">Quá hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          }
        />
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FileBox className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Kho chứng cứ</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Lưu trữ và quản lý chứng cứ vi phạm bao gồm hình ảnh, video, tài liệu. Đảm bảo tính toàn vẹn và truy xuất nguồn gốc chứng cứ.
            </p>
            <Button className="mt-6">Bắt đầu sử dụng</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}