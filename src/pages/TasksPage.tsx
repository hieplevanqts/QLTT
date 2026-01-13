import React, { useState } from 'react';
import { Plus, Download, MapPin } from 'lucide-react';
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

export default function TasksPage() {
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('');

  return (
    <div className="flex flex-col">
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Nhiệm vụ hiện trường' }]}
        title="Nhiệm vụ hiện trường"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button size="sm">
              <Plus size={16} />
              Tạo nhiệm vụ
            </Button>
          </div>
        }
      />

      <div className="px-6 pt-4">
        <ModernFilterBar
          showDefaultFilters={true}
          showSearch={true}
          searchPlaceholder="Tìm kiếm nhiệm vụ theo tên, mã, địa điểm..."
          customFilters={
            <>
              {/* Người được giao */}
              <div>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Người được giao" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả người dùng</SelectItem>
                    <SelectItem value="me">Nhiệm vụ của tôi</SelectItem>
                    <SelectItem value="team1">Đội 1</SelectItem>
                    <SelectItem value="team2">Đội 2</SelectItem>
                    <SelectItem value="team3">Đội 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Độ ưu tiên */}
              <div>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức độ</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="normal">Bình thường</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
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
            <MapPin className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nhiệm vụ hiện trường</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Quản lý và theo dõi các nhiệm vụ kiểm tra thực tế tại cơ sở. Cập nhật kết quả và ghi nhận vi phạm ngay trên hiện trường.
            </p>
            <Button className="mt-6">Bắt đầu sử dụng</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}