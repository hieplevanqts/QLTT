import React from 'react';
import PageHeader from '../layouts/PageHeader';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../app/components/ui/card';
import { Layers, MapPin } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bản đồ điều hành' }]}
        title="Bản đồ điều hành"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline">Xuất bản đồ</Button>
            <Button>Thêm điểm</Button>
          </div>
        }
      />

      <div className="flex-1 flex gap-4 p-6">
        {/* Map Canvas */}
        <div className="flex-1 bg-muted rounded-xl border border-border flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Khu vực bản đồ</p>
            <p className="text-sm text-muted-foreground mt-2">
              Tích hợp với các dịch vụ bản đồ sẽ được hiển thị tại đây
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Lớp bản đồ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Cơ sở ATTP</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Điểm nóng</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Kế hoạch kiểm tra</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Nhiệm vụ hiện trường</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}