import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/layouts/PageHeader';
import styles from './EvidencePackageListPage.module.css';

export default function EvidencePackageListPage() {
  const navigate = useNavigate();

  const packages = [
    {
      id: 'PKG-2026-042',
      name: 'Gói chứng cứ vụ vi phạm ATTP Quận 1',
      caseId: 'CASE-2026-045',
      itemCount: 24,
      status: 'active',
      createdBy: 'Nguyễn Văn A',
      createdDate: '07/01/2026'
    },
    {
      id: 'PKG-2026-041',
      name: 'Tài liệu kiểm tra an toàn thực phẩm',
      caseId: 'CASE-2026-044',
      itemCount: 15,
      status: 'sealed',
      createdBy: 'Trần Thị B',
      createdDate: '06/01/2026'
    },
    {
      id: 'PKG-2026-040',
      name: 'Báo cáo thanh tra tháng 12/2025',
      caseId: 'RPT-2025-12',
      itemCount: 48,
      status: 'exported',
      createdBy: 'Lê Văn C',
      createdDate: '05/01/2026'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Gói chứng cứ' }
        ]}
        title="Gói chứng cứ"
        description="Quản lý các gói chứng cứ cho vụ việc và báo cáo"
        actions={
          <Button onClick={() => navigate('/evidence/packages/new')}>
            <Plus size={16} />
            Tạo gói mới
          </Button>
        }
      />

      <div className={styles.content}>
        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm gói chứng cứ..."
              className={styles.searchInput}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={16} />
            Bộ lọc
          </Button>
        </div>

        {/* Package List */}
        <div className={styles.packageList}>
          {packages.map(pkg => (
            <div 
              key={pkg.id} 
              className={styles.packageCard}
              onClick={() => navigate(`/evidence/packages/${pkg.id}`)}
            >
              <div className={styles.packageIcon}>
                <Package size={24} />
              </div>
              <div className={styles.packageContent}>
                <div className={styles.packageHeader}>
                  <h3 className={styles.packageId}>{pkg.id}</h3>
                  <Badge 
                    variant="outline"
                    style={{
                      borderColor: pkg.status === 'active' ? '#22c55e' :
                                 pkg.status === 'sealed' ? '#f59e0b' : '#3b82f6',
                      color: pkg.status === 'active' ? '#22c55e' :
                            pkg.status === 'sealed' ? '#f59e0b' : '#3b82f6'
                    }}
                  >
                    {pkg.status === 'active' ? 'Đang hoạt động' :
                     pkg.status === 'sealed' ? 'Đã niêm phong' : 'Đã xuất'}
                  </Badge>
                </div>
                <h4 className={styles.packageName}>{pkg.name}</h4>
                <div className={styles.packageMeta}>
                  <span className={styles.metaItem}>Vụ việc: {pkg.caseId}</span>
                  <span className={styles.metaDot}>•</span>
                  <span className={styles.metaItem}>{pkg.itemCount} chứng cứ</span>
                  <span className={styles.metaDot}>•</span>
                  <span className={styles.metaItem}>{pkg.createdBy}</span>
                  <span className={styles.metaDot}>•</span>
                  <span className={styles.metaItem}>{pkg.createdDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
