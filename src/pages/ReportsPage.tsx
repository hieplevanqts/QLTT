import React, { useState } from 'react';
import { Download, BarChart3, TrendingUp } from 'lucide-react';
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

export default function ReportsPage() {
  const [reportType, setReportType] = useState('');
  const [kpiCategory, setKpiCategory] = useState('');

  return (
    <div className="flex flex-col">
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Báo cáo & KPI' }]}
        title="Báo cáo & KPI"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={16} />
              Xuất báo cáo
            </Button>
            <Button size="sm">
              <TrendingUp size={16} />
              Tạo báo cáo mới
            </Button>
          </div>
        }
      />

      <div className="px-6 pt-4">
        <ModernFilterBar
          showDefaultFilters={false}
          showSearch={true}
          searchPlaceholder="Tìm kiếm báo cáo..."
          customFilters={
            <>
              {/* Địa bàn */}
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả địa bàn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả địa bàn</SelectItem>
                    <SelectItem value="q1">Quận 1</SelectItem>
                    <SelectItem value="q3">Quận 3</SelectItem>
                    <SelectItem value="q5">Quận 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Thời gian */}
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Khoảng thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                    <SelectItem value="quarter">Quý này</SelectItem>
                    <SelectItem value="year">Năm nay</SelectItem>
                    <SelectItem value="custom">Tùy chọn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loại báo cáo */}
              <div>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="summary">Báo cáo tổng hợp</SelectItem>
                    <SelectItem value="inspection">Kết quả kiểm tra</SelectItem>
                    <SelectItem value="violation">Vi phạm phát hiện</SelectItem>
                    <SelectItem value="performance">Hiệu suất đội</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nhóm KPI */}
              <div>
                <Select value={kpiCategory} onValueChange={setKpiCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nhóm KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả KPI</SelectItem>
                    <SelectItem value="inspection">KPI Kiểm tra</SelectItem>
                    <SelectItem value="violation">KPI Vi phạm</SelectItem>
                    <SelectItem value="resolution">KPI Xử lý</SelectItem>
                    <SelectItem value="time">KPI Thời gian</SelectItem>
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
            <BarChart3 className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Báo cáo & KPI</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Tạo và quản lý các báo cáo thống kê, theo dõi KPI hiệu suất công tác quản lý thị trường.
            </p>
            <Button className="mt-6">Bắt đầu sử dụng</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}