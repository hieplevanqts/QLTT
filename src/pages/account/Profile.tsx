import React from 'react';
import { User, Mail, Phone, Building2, Shield, KeyRound } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../ui-kit/Card/Card';
import { Button } from '../../app/components/ui/button';
import PageHeader from '../../layouts/PageHeader';

const userInfo = {
  name: 'Nguyễn Văn A',
  email: 'nguyen.van.a@mappa.vn',
  phone: '+84 90 123 4567',
  unit: 'Chi cục QLTT Quận 1',
  role: 'Đội trưởng',
  jurisdiction: 'Quận 1, TP. Hồ Chí Minh',
};

export default function Profile() {
  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Tài khoản' },
          { label: 'Hồ sơ cá nhân' },
        ]}
        title="Hồ sơ cá nhân"
      />

      <div className="p-6" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader title="Thông tin cá nhân" />
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7F56D9 0%, #9E77ED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <User size={40} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                      {userInfo.name}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                      {userInfo.role} - {userInfo.unit}
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <InfoRow icon={<Mail size={18} />} label="Email" value={userInfo.email} />
                    <InfoRow icon={<Phone size={18} />} label="Số điện thoại" value={userInfo.phone} />
                    <InfoRow icon={<Building2 size={18} />} label="Đơn vị" value={userInfo.unit} />
                    <InfoRow icon={<Shield size={18} />} label="Vai trò" value={userInfo.role} />
                    <InfoRow icon={<Building2 size={18} />} label="Địa bàn quản lý" value={userInfo.jurisdiction} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Bảo mật" />
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <KeyRound size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                      Mật khẩu
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                      Thay đổi lần cuối: 15/12/2024
                    </p>
                  </div>
                </div>
                <Button variant="outline">Đổi mật khẩu</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ color: 'var(--muted-foreground)', marginTop: '2px' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
          {label}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
          {value}
        </p>
      </div>
    </div>
  );
}
