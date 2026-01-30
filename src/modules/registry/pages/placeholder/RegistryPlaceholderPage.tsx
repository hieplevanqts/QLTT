import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import PageHeader from '@/layouts/PageHeader';
import EmptyState from '@/components/ui-kit/EmptyState';
import { Button } from '@/components/ui/button';
import styles from './RegistryPlaceholderPage.module.css';

interface RegistryPlaceholderPageProps {
  title: string;
  description?: string;
  breadcrumbLabel: string;
}

export default function RegistryPlaceholderPage({
  title,
  description,
  breadcrumbLabel,
}: RegistryPlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hệ thống đăng ký', href: '/registry' },
          { label: breadcrumbLabel },
        ]}
        title={title}
        description={description}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/registry')}>
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        }
      />

      <div className={styles.content}>
        <EmptyState
          type="empty"
          title="Tính năng đang phát triển"
          description="Chức năng này đang được xây dựng và sẽ sớm ra mắt"
          icon={<Construction size={48} />}
          action={{
            label: 'Về trang chủ Registry',
            onClick: () => navigate('/registry'),
          }}
        />
      </div>
    </div>
  );
}
