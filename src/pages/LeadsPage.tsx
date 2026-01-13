import React, { useState } from 'react';
import { Plus, Download, TrendingUp } from 'lucide-react';
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

export default function LeadsPage() {
  const [riskLevel, setRiskLevel] = useState('');
  const [source, setSource] = useState('');

  return (
    <div className="flex flex-col">
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Nguồn tin / Risk' }]}
        title="Nguồn tin / Risk"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm">
              <Plus size={16} />
              Tạo nguồn tin
            </Button>
          </div>
        }
      />

      <div className="px-6 pt-4">
        <ModernFilterBar
          showDefaultFilters={true}
          showSearch={true}
          searchPlaceholder="Tìm kiếm nguồn tin theo tên, địa chỉ, mã..."
          customFilters={
            <>
              {/* Mức độ rủi ro */}
              <div>
                <Select value={riskLevel} onValueChange={setRiskLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mức độ rủi ro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức độ</SelectItem>
                    <SelectItem value="critical">Nghiêm trọng</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nguồn tiếp nhận */}
              <div>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nguồn tiếp nhận" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả nguồn</SelectItem>
                    <SelectItem value="citizen">Người dân</SelectItem>
                    <SelectItem value="hotline">Đường dây nóng</SelectItem>
                    <SelectItem value="media">Báo chí</SelectItem>
                    <SelectItem value="agency">Cơ quan khác</SelectItem>
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
            <TrendingUp className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nguồn tin / Risk</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Tiếp nhận và quản lý nguồn tin về vi phạm ATTP. Hệ thống đánh giá rủi ro và ưu tiên xử lý các nguồn tin theo mức độ nguy hiểm.
            </p>
            <Button className="mt-6">Bắt đầu sử dụng</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}