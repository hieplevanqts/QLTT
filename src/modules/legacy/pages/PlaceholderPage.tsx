import React from 'react';
import PageHeader from '@/layouts/PageHeader';
import ModernFilterBar from '@/components/patterns/ModernFilterBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PlaceholderPage({ title, description, breadcrumbs }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col">
      <PageHeader
        breadcrumbs={breadcrumbs || [{ label: 'Trang chủ', href: '/' }, { label: title }]}
        title={title}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline">Xuất dữ liệu</Button>
            <Button>Tạo mới</Button>
          </div>
        }
      />

      <div className="px-6 pt-4">
        <ModernFilterBar
          showDefaultFilters={true}
          showSearch={true}
          searchPlaceholder={`Tìm kiếm ${title.toLowerCase()}...`}
        />
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FileQuestion className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {description}
            </p>
            <Button className="mt-6">Bắt đầu sử dụng</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
