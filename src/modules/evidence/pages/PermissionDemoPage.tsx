import React from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import { RootState } from '../../../store/rootReducer';
import PageHeader from '@/layouts/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserSwitcher } from '@/components/UserSwitcher';
import { Shield, Check, X, Eye, Edit, Trash2, Upload, Download, Lock } from 'lucide-react';

/**
 * Permission Demo Page
 * Hiển thị quyền hạn của user hiện tại theo RBAC matrix
 */

interface PermissionRule {
  action: string;
  icon: React.ReactNode;
  cuc: boolean;
  chicuc: boolean;
  doi: boolean;
  description: string;
}

const PERMISSION_RULES: PermissionRule[] = [
  {
    action: 'Xem chứng cứ',
    icon: <Eye size={16} />,
    cuc: true,
    chicuc: true,
    doi: true,
    description: 'Xem danh sách và chi tiết chứng cứ trong phạm vi'
  },
  {
    action: 'Tải lên chứng cứ',
    icon: <Upload size={16} />,
    cuc: false,
    chicuc: true,
    doi: true,
    description: 'Upload chứng cứ mới vào hệ thống'
  },
  {
    action: 'Chỉnh sửa chứng cứ',
    icon: <Edit size={16} />,
    cuc: false,
    chicuc: true,
    doi: true,
    description: 'Chỉnh sửa metadata và thông tin chứng cứ'
  },
  {
    action: 'Xóa chứng cứ',
    icon: <Trash2 size={16} />,
    cuc: false,
    chicuc: true,
    doi: false,
    description: 'Xóa chứng cứ khỏi hệ thống'
  },
  {
    action: 'Duyệt chứng cứ',
    icon: <Check size={16} />,
    cuc: true,
    chicuc: true,
    doi: false,
    description: 'Xét duyệt và phê duyệt chứng cứ'
  },
  {
    action: 'Xuất dữ liệu',
    icon: <Download size={16} />,
    cuc: true,
    chicuc: true,
    doi: true,
    description: 'Xuất chứng cứ ra file Excel/PDF'
  },
  {
    action: 'Niêm phong chứng cứ',
    icon: <Lock size={16} />,
    cuc: true,
    chicuc: true,
    doi: false,
    description: 'Niêm phong chứng cứ không cho chỉnh sửa'
  },
];

export default function PermissionDemoPage() {
  // Get user from Redux instead of AuthContext
  const { user } = useAppSelector((state: RootState) => state.auth);

  if (!user) {
    return <div>Loading...</div>;
  }

  const getUserPermissions = () => {
    switch (user.level) {
      case 'cuc':
        return PERMISSION_RULES.map(rule => ({ ...rule, allowed: rule.cuc }));
      case 'chicuc':
        return PERMISSION_RULES.map(rule => ({ ...rule, allowed: rule.chicuc }));
      case 'doi':
        return PERMISSION_RULES.map(rule => ({ ...rule, allowed: rule.doi }));
      default:
        return PERMISSION_RULES.map(rule => ({ ...rule, allowed: false }));
    }
  };

  const userPermissions = getUserPermissions();
  const allowedCount = userPermissions.filter(p => p.allowed).length;
  const deniedCount = userPermissions.filter(p => !p.allowed).length;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Chứng cứ', href: '/evidence' },
          { label: 'Permission Demo' }
        ]}
        title="Demo Phân quyền RBAC"
      />

      {/* User Info Card */}
      <Card style={{ marginBottom: '24px' }}>
        <CardContent style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
            }}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '4px' }}>
                {user.fullName}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {user.department}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Badge variant="outline" style={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  background: 'var(--color-primary)10',
                }}>
                  {user.roleDisplay}
                </Badge>
                <Badge variant="outline">
                  {user.position}
                </Badge>
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              textAlign: 'right',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={20} style={{ color: 'var(--color-success)' }} />
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                  {allowedCount} quyền
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={20} style={{ color: 'var(--color-danger)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {deniedCount} hạn chế
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
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
            <Shield size={24} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
              Ma trận phân quyền
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {userPermissions.map((permission, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: permission.allowed ? 'var(--color-success)05' : 'var(--color-danger)05',
                  border: `1px solid ${permission.allowed ? 'var(--color-success)30' : 'var(--color-danger)30'}`,
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: permission.allowed ? 'var(--color-success)15' : 'var(--color-danger)15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: permission.allowed ? 'var(--color-success)' : 'var(--color-danger)',
                  flexShrink: 0,
                }}>
                  {permission.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 'var(--text-md)',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}>
                    {permission.action}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}>
                    {permission.description}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: permission.allowed ? 'var(--color-success)' : 'var(--color-danger)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                }}>
                  {permission.allowed ? (
                    <>
                      <Check size={16} />
                      Cho phép
                    </>
                  ) : (
                    <>
                      <X size={16} />
                      Từ chối
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
          }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              marginBottom: '12px',
            }}>
              <strong>Chú thích:</strong>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}>
              <div style={{
                padding: '12px',
                background: 'var(--color-info)10',
                border: '1px solid var(--color-info)30',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>
                  Cấp Cục
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Xem toàn quốc, duyệt, niêm phong
                </div>
              </div>
              <div style={{
                padding: '12px',
                background: 'var(--color-warning)10',
                border: '1px solid var(--color-warning)30',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>
                  Cấp Chi cục
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Xem tỉnh/TP, upload, chỉnh sửa, duyệt
                </div>
              </div>
              <div style={{
                padding: '12px',
                background: 'var(--color-success)10',
                border: '1px solid var(--color-success)30',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>
                  Cấp Đội
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Xem quận/huyện, upload, chỉnh sửa
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserSwitcher />
    </div>
  );
}

