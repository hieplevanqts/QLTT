import React, { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../store/rootReducer';
import PageHeader from '../../../layouts/PageHeader';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { UserSwitcher } from '../../components/UserSwitcher';
import DataTable, { Column } from '../../../ui-kit/DataTable';
import { MapPin, Eye, EyeOff, Filter, CheckCircle } from 'lucide-react';
import { EvidenceItem, getStatusLabel, getStatusColor } from '../../types/evidence.types';
import { generateMockEvidenceItems } from '../../data/evidence-mock-data';

/**
 * Scope Filtering Demo Page
 * Hiển thị cách hệ thống lọc chứng cứ theo địa bàn quản lý
 */

// Generate diverse mock evidence across different provinces
function generateDiverseMockEvidence(): EvidenceItem[] {
  const baseItems = generateMockEvidenceItems(6);
  
  // Manually create more diverse items
  const additionalItems: Partial<EvidenceItem>[] = [
    {
      evidenceId: 'EVD-2026-1254',
      file: { filename: 'evidence_hanoi_badinhh.jpg', storageKey: 'storage/1', mimeType: 'image/jpeg', sizeBytes: 1000000 },
      scope: { province: 'Hà Nội', district: 'Ba Đình', unitId: 'UNIT-HN-01' },
      status: 'Approved',
      location: { lat: 21.0285, lng: 105.8542, addressText: 'Ba Đình, Hà Nội' },
    },
    {
      evidenceId: 'EVD-2026-1255',
      file: { filename: 'evidence_hanoi_hoankiem.jpg', storageKey: 'storage/2', mimeType: 'image/jpeg', sizeBytes: 1200000 },
      scope: { province: 'Hà Nội', district: 'Hoàn Kiếm', unitId: 'UNIT-HN-02' },
      status: 'InReview',
      location: { lat: 21.0285, lng: 105.8542, addressText: 'Hoàn Kiếm, Hà Nội' },
    },
    {
      evidenceId: 'EVD-2026-1256',
      file: { filename: 'evidence_hcm_quan1.jpg', storageKey: 'storage/3', mimeType: 'image/jpeg', sizeBytes: 1500000 },
      scope: { province: 'TP. Hồ Chí Minh', district: 'Quận 1', unitId: 'UNIT-HCM-01' },
      status: 'Approved',
      location: { lat: 10.7769, lng: 106.7009, addressText: 'Quận 1, TP.HCM' },
    },
  ];

  return [
    ...baseItems,
    ...additionalItems.map((item, idx) => ({
      ...baseItems[0],
      ...item,
      type: 'PHOTO' as const,
      source: 'MobileCapture' as const,
      capturedAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      hashes: [],
      sensitivityLabel: 'Internal' as const,
      submitter: { userId: 'USER-001', unitId: 'UNIT-001' },
      review: {},
      links: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  ] as EvidenceItem[];
}

export default function ScopeFilteringDemoPage() {
  // Get user from Redux instead of AuthContext
  const { user } = useAppSelector((state: RootState) => state.auth);
  const allEvidence = useMemo(() => generateDiverseMockEvidence(), []);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Filter evidence based on user scope
  const filteredEvidence = useMemo(() => {
    if (user.level === 'cuc') {
      // Cấp cục - xem tất cả
      return allEvidence;
    } else if (user.level === 'chicuc') {
      // Cấp chi cục - chỉ xem tỉnh/TP của mình
      return allEvidence.filter(e => e.scope.province === user.provinceName);
    } else if (user.level === 'doi') {
      // Cấp đội - chỉ xem quận/huyện của mình
      return allEvidence.filter(e => 
        e.scope.province === user.provinceName && 
        e.scope.district === user.teamName?.replace('Đội 1', 'Ba Đình')
          .replace('Đội 2', 'Hoàn Kiếm')
          .replace('Đội 1', 'Quận 1')
          .replace('Đội 2', 'Quận 3')
      );
    }
    return [];
  }, [allEvidence, user]);

  const hiddenEvidence = allEvidence.filter(e => !filteredEvidence.includes(e));

  const columns: Column<EvidenceItem>[] = [
    {
      key: 'evidenceId',
      label: 'Mã',
      sortable: true,
      render: (evidence) => evidence.evidenceId,
    },
    {
      key: 'file',
      label: 'Tên file',
      render: (evidence) => evidence.files?.[0]?.filename || 'Chưa có file',
    },
    {
      key: 'scope',
      label: 'Địa bàn',
      render: (evidence) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={14} style={{ color: 'var(--text-secondary)' }} />
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              {evidence.scope.district || 'N/A'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              {evidence.scope.province}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (evidence) => {
        const config = getStatusColor(evidence.status);
        return (
          <Badge
            variant="outline"
            style={{
              borderColor: config.color,
              color: config.color,
              background: config.bg,
            }}
          >
            {getStatusLabel(evidence.status)}
          </Badge>
        );
      },
    },
    {
      key: 'visible',
      label: 'Quyền truy cập',
      render: (evidence) => {
        const isVisible = filteredEvidence.includes(evidence);
        return (
          <Badge
            variant="outline"
            style={{
              borderColor: isVisible ? 'var(--color-success)' : 'var(--color-danger)',
              color: isVisible ? 'var(--color-success)' : 'var(--color-danger)',
              background: isVisible ? 'var(--color-success)10' : 'var(--color-danger)10',
            }}
          >
            {isVisible ? (
              <>
                <Eye size={12} style={{ marginRight: '4px' }} />
                Có quyền
              </>
            ) : (
              <>
                <EyeOff size={12} style={{ marginRight: '4px' }} />
                Không có quyền
              </>
            )}
          </Badge>
        );
      },
    },
  ];

  const getScopeDescription = () => {
    if (user.level === 'cuc') {
      return 'Bạn có quyền xem chứng cứ từ tất cả các tỉnh/thành phố trên toàn quốc';
    } else if (user.level === 'chicuc') {
      return `Bạn chỉ có quyền xem chứng cứ từ ${user.provinceName}`;
    } else if (user.level === 'doi') {
      return `Bạn chỉ có quyền xem chứng cứ từ ${user.teamName}, ${user.provinceName}`;
    }
    return '';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Chứng cứ', href: '/evidence' },
          { label: 'Scope Filtering Demo' }
        ]}
        title="Demo Lọc theo Địa bàn (Scope Filtering)"
      />

      {/* User Scope Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <CardContent style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-info)15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-info)',
              }}>
                <Filter size={20} />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Phạm vi quản lý
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '8px' }}>
              {user.level === 'cuc' ? 'Toàn quốc' : user.level === 'chicuc' ? user.provinceName : `${user.teamName}`}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {getScopeDescription()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-success)15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-success)',
              }}>
                <Eye size={20} />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Chứng cứ có quyền xem
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '8px' }}>
              {filteredEvidence.length}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Trong tổng số {allEvidence.length} chứng cứ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-danger)15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-danger)',
              }}>
                <EyeOff size={20} />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Chứng cứ bị ẩn
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '8px' }}>
              {hiddenEvidence.length}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Ngoài phạm vi quản lý
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Table - Showing ALL evidence with visibility indicator */}
      <Card>
        <CardContent style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border)',
          }}>
            <CheckCircle size={24} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
                Tất cả chứng cứ trong hệ thống
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                Hiển thị tất cả chứng cứ với trạng thái quyền truy cập của bạn
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={allEvidence}
            getRowId={(evidence) => evidence.evidenceId}
          />

          {/* Legend */}
          <div style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
          }}>
            <div style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              fontSize: 'var(--text-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: 'var(--color-success)',
                    color: 'var(--color-success)',
                    background: 'var(--color-success)10',
                  }}
                >
                  <Eye size={12} style={{ marginRight: '4px' }} />
                  Có quyền
                </Badge>
                <span style={{ color: 'var(--text-secondary)' }}>
                  - Bạn có thể xem và thao tác với chứng cứ này
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: 'var(--color-danger)',
                    color: 'var(--color-danger)',
                    background: 'var(--color-danger)10',
                  }}
                >
                  <EyeOff size={12} style={{ marginRight: '4px' }} />
                  Không có quyền
                </Badge>
                <span style={{ color: 'var(--text-secondary)' }}>
                  - Chứng cứ này sẽ bị ẩn trong danh sách thực tế
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Filtering Example */}
      <Card style={{ marginTop: '24px' }}>
        <CardContent style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <MapPin size={24} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
                Minh họa Scope Filtering
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                Hệ thống tự động lọc chứng cứ theo địa bàn quản lý của bạn
              </p>
            </div>
          </div>

          <div style={{
            background: 'var(--color-info)05',
            border: '1px solid var(--color-info)30',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
          }}>
            <div style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
              <strong>Cơ chế hoạt động:</strong>
              <ul style={{ marginTop: '12px', marginBottom: 0, paddingLeft: '20px' }}>
                <li>User <strong>cấp Cục</strong>: Xem tất cả chứng cứ từ mọi tỉnh/thành phố</li>
                <li>User <strong>cấp Chi cục</strong>: Chỉ xem chứng cứ từ tỉnh/thành phố quản lý</li>
                <li>User <strong>cấp Đội</strong>: Chỉ xem chứng cứ từ quận/huyện quản lý</li>
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'var(--color-warning)05',
            border: '1px solid var(--color-warning)30',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
          }}>
            💡 <strong>Tip:</strong> Sử dụng User Switcher ở góc dưới bên phải để chuyển đổi giữa các users và xem sự thay đổi trong quyền truy cập!
          </div>
        </CardContent>
      </Card>

      <UserSwitcher />
    </div>
  );
}
