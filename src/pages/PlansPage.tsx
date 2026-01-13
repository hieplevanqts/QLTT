import React, { useState } from 'react';
import { Plus, Download, ClipboardList } from 'lucide-react';
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

export default function PlansPage() {
  const [planType, setPlanType] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  return (
    <div className="flex flex-col">
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Kế hoạch tác nghiệp' }]}
        title="Kế hoạch tác nghiệp"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm">
              <Plus size={16} />
              Lập kế hoạch
            </Button>
          </div>
        }
      />

      <div className="px-6 pt-4">
        <ModernFilterBar
          showDefaultFilters={true}
          showSearch={true}
          searchPlaceholder="Tìm kiếm kế hoạch theo tên, mã..."
          customFilters={
            <>
              {/* Loại kế hoạch */}
              <div>
                <Select value={planType} onValueChange={setPlanType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Loại kế hoạch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="scheduled">Kế hoạch định kỳ</SelectItem>
                    <SelectItem value="sudden">Kiểm tra đột xuất</SelectItem>
                    <SelectItem value="followup">Kiểm tra hậu kiểm</SelectItem>
                    <SelectItem value="specialized">Chuyên đề</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trạng thái phê duyệt */}
              <div>
                <Select value={approvalStatus} onValueChange={setApprovalStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái duyệt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
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
            <ClipboardList className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Kế hoạch tác nghiệp</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Lập và quản lý kế hoạch kiểm tra, thanh tra ATTP. Phân công nhiệm vụ và theo dõi tiến độ thực hiện kế hoạch.
            </p>
            <Button className="mt-6">Bắt đầu sử dụng</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}