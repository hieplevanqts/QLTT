import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  KeyRound, 
  MapPin,
  Calendar,
  BadgeCheck,
  Edit2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui-kit/Card/Card';
import { Button } from '@/components/ui/button';
import PageHeader from '@/layouts/PageHeader';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { RootState } from '@/store/rootReducer';
import { fetchUserInfoRequest } from '@/store/slices/authSlice';
import styles from './Profile.module.css';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Get user from Redux instead of AuthContext
  const { user, token } = useAppSelector((state: RootState) => state.auth);
  const [showAllPermissions, setShowAllPermissions] = useState(false);

  React.useEffect(() => {
    if (token) {
      dispatch(fetchUserInfoRequest(token));
      return;
    }
    dispatch(fetchUserInfoRequest());
  }, [dispatch, token]);

  const getLevelFromCode = (code?: string | null) => {
    if (!code) return null;
    const trimmed = code.trim();
    if (trimmed.length < 2 || trimmed.length % 2 !== 0) return null;
    return trimmed.length / 2;
  };

  // Fallback to mock data if user not loaded
  const getLevelLabel = (
    level?: string | number | null,
    departmentName?: string | null,
    departmentCode?: string | null
  ) => {
    if (typeof level === 'string') {
      if (level === 'cuc') return 'Cục';
      if (level === 'chicuc') return 'Chi cục';
      if (level === 'doi') return 'Đội';
    }
    if (typeof level === 'number') {
      if (level === 1) return 'Cục';
      if (level === 2) return 'Chi cục';
      if (level === 3) return 'Đội';
    }
    if (!level) {
      const inferredLevel = getLevelFromCode(departmentCode);
      if (inferredLevel === 1) return 'Cục';
      if (inferredLevel === 2) return 'Chi cục';
      if (inferredLevel === 3) return 'Đội';
    }
    if (departmentName) {
      const lower = departmentName.toLowerCase();
      if (lower.includes('cục')) return 'Cục';
      if (lower.includes('chi cục')) return 'Chi cục';
      if (lower.includes('đội')) return 'Đội';
    }
    return 'Chưa xác định';
  };

  const normalizeArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const permissionPalette = [
    { bg: '#EAF2FF', border: '#CFE0FF', text: '#1D4ED8' },
    { bg: '#ECFDF3', border: '#C7F0D8', text: '#15803D' },
    { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
    { bg: '#FDF2F8', border: '#FBCFE8', text: '#BE185D' },
    { bg: '#F0F9FF', border: '#CFE8FF', text: '#0369A1' },
    { bg: '#F4F3FF', border: '#E0E7FF', text: '#4F46E5' },
    { bg: '#F1F5F9', border: '#CBD5E1', text: '#334155' },
    { bg: '#FEEFF5', border: '#FACFE0', text: '#9F1239' },
    { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
    { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
    { bg: '#F5F3FF', border: '#DDD6FE', text: '#5B21B6' },
    { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
  ];

  const hashString = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return hash;
  };

  const getPermissionTone = (value: string, index: number) => {
    const paletteIndex = (hashString(value) + index) % permissionPalette.length;
    return permissionPalette[paletteIndex];
  };

  const userPermissions = normalizeArray(
    (user as any)?.permission_codes ?? (user as any)?.permissions ?? (user as any)?.permissionCodes
  );
  const userRoleCodes = normalizeArray(
    (user as any)?.role_codes ?? (user as any)?.roleCodes ?? (user as any)?.roles
  );
  const primaryRoleCodeRaw =
    (user as any)?.roleCode ??
    (user as any)?.primary_role_code ??
    userRoleCodes[0] ??
    '';
  const primaryRoleCode = String(primaryRoleCodeRaw).toLowerCase();

  const roleClassMap: Record<string, string> = {
    'super-admin': styles.roleSuperAdmin,
    admin: styles.roleAdmin,
    manager: styles.roleManager,
    leader: styles.roleLeader,
    header: styles.roleHeader,
    head: styles.roleHeader,
    user: styles.roleUser,
    viewer: styles.roleViewer,
    merchant: styles.roleMerchant,
  };
  const roleHeaderClass = roleClassMap[primaryRoleCode] || styles.roleDefault;

  const userInfo = user
    ? {
        username: user.username || user.email || '',
        email: user.email || '',
        fullName: user.full_name || user.name || user.email || '',
        roleDisplay:
          (Array.isArray(user.role_names) ? user.role_names.join(', ') : user.role_names) ||
          user.roleDisplay ||
          user.primary_role_name ||
          user.position ||
          (user.is_super_admin ? 'Quản trị hệ thống' : '') ||
          'Người dùng',
        department:
          user.department_name ||
          (normalizeArray(user.don_vi_cong_tac_departments).join(', ') || '') ||
          user.department ||
          'Chưa cập nhật',
        departmentLevel: user.department_level ?? user.level ?? null,
        departmentCode: (user.department_code ?? user.departmentCode ?? user.department_path) || null,
        managementLevel: user.cap_quan_ly || null,
        phone: user.phone || '',
        provinceName: user.provinceName || '',
        teamName: user.teamName || '',
        isSuperAdmin: Boolean(user.is_super_admin),
        permissions: userPermissions,
        roleCodes: userRoleCodes,
      }
    : {
        username: 'demo.user',
        email: '',
        fullName: 'Nguyễn Văn A',
        roleDisplay: 'Thanh tra viên',
        department: 'Chi cục QLTT Phường 1',
        departmentLevel: null,
        departmentCode: null,
        managementLevel: null,
        phone: '',
        provinceName: 'TP. Hồ Chí Minh',
        teamName: 'Đội 1',
        isSuperAdmin: false,
        permissions: [],
        roleCodes: [],
      };

  // Get initials for avatar
  const getInitials = (name: string = "") => {
    if (!name) return "N/A";
    return name
        .split(' ')
        .filter(Boolean) // Loại bỏ các khoảng trắng thừa
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
  };

  // Format role display
  const formatRoleDisplay = () => {
    if (userInfo.roleDisplay) {
      return userInfo.roleDisplay;
    }
    return userInfo.position || 'Người dùng';
  };

  // Format jurisdiction
  const formatJurisdiction = () => {
    const parts = [];
    if (userInfo.provinceName) parts.push(userInfo.provinceName);
    if (userInfo.teamName) parts.push(userInfo.teamName);
    return parts.join(' - ') || 'Chưa xác định';
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Tài khoản' },
          { label: 'Hồ sơ cá nhân' },
        ]}
        title="Hồ sơ cá nhân"
      />

      <div className={styles.contentContainer}>
        {/* Profile Header Card */}
        <Card className={`${styles.profileHeaderCard} ${roleHeaderClass}`}>
          <CardContent>
            <div className={styles.profileHeader}>
              {/* Avatar Section */}
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  <span className={styles.avatarText}>
                    {getInitials(userInfo.fullName)}
                  </span>
                </div>
                <div className={styles.avatarBadge}>
                  <BadgeCheck size={20} />
                </div>
              </div>

              {/* User Info Section */}
              <div className={styles.userInfoSection}>
                <div className={styles.userNameRow}>
                  <h2 className={styles.userName}>{userInfo.fullName}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/account/profile/edit')}
                    className={styles.editButton}
                  >
                    <Edit2 size={16} />
                    Chỉnh sửa
                  </Button>
                </div>
                <p className={styles.userRole}>{formatRoleDisplay()}</p>
                <p className={styles.userDepartment}>{userInfo.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Grid */}
        <div className={styles.infoGrid}>
          {/* Personal Information Card */}
          <Card className={styles.infoCard}>
            <CardHeader 
              title="Thông tin cá nhân"
              description="Thông tin cơ bản về tài khoản của bạn"
            />
            <CardContent>
              <div className={styles.infoList}>
                <InfoRow 
                  icon={<Mail size={18} />} 
                  label="Email" 
                  value={userInfo.email || userInfo.username || 'Chưa có email'} 
                />
                <InfoRow 
                  icon={<Phone size={18} />} 
                  label="Số điện thoại" 
                  value={userInfo.phone || 'Chưa cập nhật'}
                  editable
                />
                <InfoRow 
                  icon={<Building2 size={18} />} 
                  label="Đơn vị công tác" 
                  value={userInfo.department} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions Card */}
          <Card className={styles.infoCard}>
            <CardHeader 
              title="Vai trò & Quyền hạn"
              description="Thông tin về vai trò và quyền truy cập"
            />
            <CardContent>
              <div className={styles.infoList}>
                <InfoRow 
                  icon={<Shield size={18} />} 
                  label="Vai trò" 
                  value={formatRoleDisplay()} 
                />
                <InfoRow 
                  icon={<Building2 size={18} />} 
                  label="Cấp quản lý" 
                  value={
                    (userInfo.managementLevel &&
                    !/^(member|staff|user)$/i.test(String(userInfo.managementLevel))
                      ? String(userInfo.managementLevel)
                      : getLevelLabel(userInfo.departmentLevel, userInfo.department, userInfo.departmentCode))
                  } 
                />
                <InfoRow 
                  icon={<BadgeCheck size={18} />} 
                  label="Trạng thái" 
                  value="Đang hoạt động"
                  valueClassName={styles.statusActive}
                />
                {userInfo.permissions && userInfo.permissions.length > 0 && (
                  <div className={styles.permissionsSection}>
                    <div className={styles.permissionsLabel}>
                      <Shield size={16} />
                      Quyền truy cập
                    </div>
                    <div className={styles.permissionsList}>
                      {(showAllPermissions ? userInfo.permissions : userInfo.permissions.slice(0, 5)).map((perm, index) => {
                        const tone = getPermissionTone(perm, index);
                        return (
                          <span
                            key={perm}
                            className={styles.permissionBadge}
                            style={{
                              backgroundColor: tone.bg,
                              borderColor: tone.border,
                              color: tone.text,
                            }}
                          >
                            {perm}
                          </span>
                        );
                      })}
                    </div>
                    {userInfo.permissions.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllPermissions(!showAllPermissions)}
                        className={styles.seeMoreButton}
                      >
                        {showAllPermissions ? (
                          <>
                            <ChevronUp size={16} />
                            Thu gọn
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            Xem thêm ({userInfo.permissions.length - 5} quyền khác)
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Card */}
        <Card className={styles.securityCard}>
          <CardHeader 
            title="Bảo mật tài khoản"
            description="Quản lý mật khẩu và cài đặt bảo mật"
          />
          <CardContent>
            <div className={styles.securityItem}>
              <div className={styles.securityItemLeft}>
                <div className={styles.securityIcon}>
                  <KeyRound size={20} />
                </div>
                <div className={styles.securityInfo}>
                  <p className={styles.securityLabel}>Mật khẩu</p>
                  <p className={styles.securityDescription}>
                    Đã thay đổi lần cuối: 15/12/2024
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/account/change-password')}
              >
                Đổi mật khẩu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
  valueClassName?: string;
}

function InfoRow({ icon, label, value, editable, valueClassName }: InfoRowProps) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon}>
        {icon}
      </div>
      <div className={styles.infoContent}>
        <p className={styles.infoLabel}>{label}</p>
        <p className={`${styles.infoValue} ${valueClassName || ''}`}>
          {value}
          {editable && (
            <Button
              variant="ghost"
              size="sm"
              className={styles.editInlineButton}
            >
              <Edit2 size={14} />
            </Button>
          )}
        </p>
      </div>
    </div>
  );
}
