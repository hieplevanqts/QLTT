import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';

export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }

    // TODO: Call API to change password
    toast.success('Đổi mật khẩu thành công');
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const passwordRequirements = [
    { label: 'Ít nhất 8 ký tự', met: newPassword.length >= 8 },
    { label: 'Có ít nhất 1 chữ hoa', met: /[A-Z]/.test(newPassword) },
    { label: 'Có ít nhất 1 chữ thường', met: /[a-z]/.test(newPassword) },
    { label: 'Có ít nhất 1 số', met: /[0-9]/.test(newPassword) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài khoản', href: '/account/profile' },
          { label: 'Đổi mật khẩu' },
        ]}
        title="Đổi mật khẩu"
      />

      <div style={{ flex: 1, padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} />
              Thay đổi mật khẩu
            </CardTitle>
            <CardDescription>
              Để bảo mật tài khoản, vui lòng sử dụng mật khẩu mạnh và không chia sẻ với người khác.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Current Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="currentPassword"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--foreground)',
                  }}
                >
                  Mật khẩu hiện tại
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 40px 0 12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      background: 'var(--input-background)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="newPassword"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--foreground)',
                  }}
                >
                  Mật khẩu mới
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 40px 0 12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      background: 'var(--input-background)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="confirmPassword"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--foreground)',
                  }}
                >
                  Xác nhận mật khẩu mới
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 40px 0 12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      background: 'var(--input-background)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--muted)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      marginBottom: '8px',
                    }}
                  >
                    Yêu cầu mật khẩu:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '12px',
                          color: req.met ? '#10b981' : 'var(--muted-foreground)',
                        }}
                      >
                        <CheckCircle2 size={14} />
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <Button type="submit" style={{ flex: 1 }}>
                  Đổi mật khẩu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
