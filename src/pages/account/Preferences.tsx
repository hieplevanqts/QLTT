import React, { useState } from 'react';
import { Globe, Moon, Table2, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../ui-kit/Card/Card';
import { Button } from '../../app/components/ui/button';
import PageHeader from '../../layouts/PageHeader';

export default function Preferences() {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [tableDensity, setTableDensity] = useState<'compact' | 'normal'>('normal');
  const [notifications, setNotifications] = useState(true);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Tài khoản' },
          { label: 'Tuỳ chọn' },
        ]}
        title="Tuỳ chọn"
      />

      <div className="p-6" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader title="Ngôn ngữ" description="Chọn ngôn ngữ hiển thị" />
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Globe size={20} color="var(--muted-foreground)" />
                  <span style={{ fontSize: 'var(--text-sm)' }}>Ngôn ngữ mặc định</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant={language === 'vi' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('vi')}
                  >
                    Tiếng Việt
                  </Button>
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Giao diện" description="Tùy chỉnh giao diện hiển thị" />
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Moon size={20} color="var(--muted-foreground)" />
                    <span style={{ fontSize: 'var(--text-sm)' }}>Chế độ hiển thị</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                    >
                      Sáng
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      Tối
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                    >
                      Hệ thống
                    </Button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Table2 size={20} color="var(--muted-foreground)" />
                    <span style={{ fontSize: 'var(--text-sm)' }}>Độ rộng bảng</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant={tableDensity === 'compact' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTableDensity('compact')}
                    >
                      Gọn
                    </Button>
                    <Button
                      variant={tableDensity === 'normal' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTableDensity('normal')}
                    >
                      Bình thường
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Thông báo" description="Cài đặt thông báo" />
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={20} color="var(--muted-foreground)" />
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                      Thông báo trong ứng dụng
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                      Nhận thông báo về nguồn tin, kế hoạch và nhiệm vụ mới
                    </p>
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: notifications ? 'var(--primary)' : 'var(--muted)',
                      transition: '0.3s',
                      borderRadius: '24px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: notifications ? '23px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.3s',
                        borderRadius: '50%',
                      }}
                    />
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
