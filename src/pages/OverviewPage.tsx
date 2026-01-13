import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  FileText,
  CircleCheck,
  TriangleAlert,
  Clock,
  Users,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import OperationalContext from '../patterns/OperationalContext';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';

export default function OverviewPage() {
  const statsCards = [
    {
      title: 'Điểm nóng địa bàn',
      value: '12',
      change: '+3',
      trend: 'up',
      description: 'Địa điểm cần ưu tiên',
      icon: MapPin,
      color: 'text-destructive',
    },
    {
      title: 'Nguồn tin mới',
      value: '48',
      change: '+12',
      trend: 'up',
      description: 'Trong 7 ngày qua',
      icon: FileText,
      color: 'text-primary',
    },
    {
      title: 'Kế hoạch đang triển khai',
      value: '8',
      change: '-2',
      trend: 'down',
      description: 'Đang trong tiến trình',
      icon: CircleCheck,
      color: 'text-chart-4',
    },
    {
      title: 'Nhiệm vụ quá hạn/SLA',
      value: '5',
      change: '+1',
      trend: 'up',
      description: 'Cần xử lý ngay',
      icon: TriangleAlert,
      color: 'text-chart-1',
    },
    {
      title: 'Chứng cứ chờ duyệt',
      value: '23',
      change: '+7',
      trend: 'up',
      description: 'Đang chờ xác thực',
      icon: Clock,
      color: 'text-chart-5',
    },
    {
      title: 'Nhân sự tham gia',
      value: '156',
      change: '+8',
      trend: 'up',
      description: 'Đội ngũ hoạt động',
      icon: Users,
      color: 'text-chart-2',
    },
  ];

  const recentActivities = [
    {
      title: 'Nguồn tin mới được thêm',
      description: 'Cơ sở ATTP tại quận 1 - Nguy cơ cao',
      time: '5 phút trước',
      status: 'new',
    },
    {
      title: 'Kế hoạch kiểm tra hoàn thành',
      description: 'KH-2026-001 - Kiểm tra ATTP quý 1',
      time: '1 giờ trước',
      status: 'completed',
    },
    {
      title: 'Nhiệm vụ được giao',
      description: 'NV-2026-045 - Kiểm tra cơ sở sản xuất',
      time: '2 giờ trước',
      status: 'pending',
    },
    {
      title: 'Báo cáo được tạo',
      description: 'BC-2026-012 - Tổng hợp tháng 12/2025',
      time: '3 giờ trước',
      status: 'completed',
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Tổng quan' }]}
        title="Tổng quan"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw size={16} />
              Làm mới
            </Button>
            <Button variant="outline" size="sm">Xuất báo cáo</Button>
          </div>
        }
      />

      <div className="px-6 py-4 space-y-4">
        {/* Operational Context */}
        <OperationalContext
          unit="Chi cục QLTT Quận 1"
          jurisdiction="Quận 1, TP. Hồ Chí Minh"
          onEdit={() => window.location.href = '/auth/select-jurisdiction'}
        />
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-semibold">{stat.value}</div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.trend === 'up' ? 'text-chart-4' : 'text-chart-1'
                      }`}
                    >
                      <TrendIcon className="h-4 w-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{activity.title}</p>
                        <Badge
                          variant={
                            activity.status === 'new'
                              ? 'default'
                              : activity.status === 'completed'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {activity.status === 'new'
                            ? 'Mới'
                            : activity.status === 'completed'
                            ? 'Hoàn thành'
                            : 'Đang xử lý'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
              <CardDescription>Các chức năng thường dùng</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start">
                Tạo nguồn tin mới
              </Button>
              <Button variant="outline" className="justify-start">
                Lập kế hoạch kiểm tra
              </Button>
              <Button variant="outline" className="justify-start">
                Mở bản đồ điều hành
              </Button>
              <Button variant="outline" className="justify-start">
                Xem báo cáo tổng hợp
              </Button>
              <Button variant="outline" className="justify-start">
                Quản lý nhiệm vụ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}