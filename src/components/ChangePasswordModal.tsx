import React, { useState } from 'react';
import { X, Save, Lock, Eye, EyeOff } from 'lucide-react';
import styles from '../pages/AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';

interface ChangePasswordModalProps {
  userId: string;
  userEmail: string;
  isOwnProfile: boolean; // true nếu user đang đổi password của chính mình
  isAdmin: boolean; // true nếu user là admin
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  userId,
  userEmail,
  isOwnProfile,
  isAdmin,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Password strength validation
  const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Mật khẩu phải có ít nhất 8 ký tự' };
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Mật khẩu phải có ít nhất 1 chữ hoa' };
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Mật khẩu phải có ít nhất 1 chữ thường' };
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Mật khẩu phải có ít nhất 1 số' };
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)' };
    }
    
    return { isValid: true, message: 'Mật khẩu mạnh' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (isOwnProfile && !formData.currentPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!formData.newPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (!formData.confirmPassword.trim()) {
      toast.error('Vui lòng xác nhận mật khẩu mới');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận không khớp');
      return;
    }

    // Validate password strength
    const strengthCheck = validatePasswordStrength(formData.newPassword);
    if (!strengthCheck.isValid) {
      toast.error(strengthCheck.message);
      return;
    }

    try {
      setSaving(true);
      console.log('🔐 Updating password via RPC function...');

      const { data: rpcResult, error: rpcError } = await supabase.rpc('update_user_password', {
        p_user_id: userId,
        p_current_password: isOwnProfile ? formData.currentPassword : null,
        p_new_password: formData.newPassword,
      });

      if (rpcError) {
        console.error('❌ Error calling update_user_password RPC:', rpcError);
        toast.error(`Lỗi đổi mật khẩu: ${rpcError.message}`);
        return;
      }

      // Check if RPC returned success
      if (rpcResult && !rpcResult.success) {
        console.error('❌ RPC returned error:', rpcResult.error);
        toast.error(`Lỗi: ${rpcResult.error}`);
        return;
      }

      console.log('✅ Password updated successfully');
      toast.success('Đã đổi mật khẩu thành công');

      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      toast.error('Lỗi đổi mật khẩu');
    } finally {
      setSaving(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (!password) return { strength: '', color: '', width: '0%' };

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) return { strength: 'Yếu', color: 'var(--destructive, #dc2626)', width: '33%' };
    if (score === 3 || score === 4) return { strength: 'Trung bình', color: 'var(--warning, #f59e0b)', width: '66%' };
    return { strength: 'Mạnh', color: 'var(--success, #10b981)', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <Lock size={20} style={{ color: 'var(--primary, #005cb6)', flexShrink: 0 }} />
          <h3>{isOwnProfile ? 'Đổi mật khẩu' : 'Đặt lại mật khẩu'}</h3>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Info */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md, 8px)',
                marginBottom: '20px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--foreground)' }}>
                <strong>Email:</strong> {userEmail}
              </p>
              {!isOwnProfile && (
                <p
                  style={{
                    margin: '8px 0 0 0',
                    fontSize: '12px',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  💡 Bạn đang đặt lại mật khẩu cho người dùng khác với quyền quản trị viên
                </p>
              )}
            </div>

            {/* Current Password (only for own profile) */}
            {isOwnProfile && (
              <div className={styles.formGroup}>
                <label>
                  Mật khẩu hiện tại <span className={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted-foreground)',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className={styles.input}
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* New Password */}
            <div className={styles.formGroup}>
              <label>
                Mật khẩu mới <span className={styles.required}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-foreground)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className={styles.input}
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Nhập mật khẩu mới"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div style={{ marginTop: '8px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'var(--muted)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: passwordStrength.width,
                        backgroundColor: passwordStrength.color,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                  <small
                    style={{
                      display: 'block',
                      marginTop: '4px',
                      fontSize: '12px',
                      color: passwordStrength.color,
                      fontWeight: 500,
                    }}
                  >
                    Độ mạnh: {passwordStrength.strength}
                  </small>
                </div>
              )}

              <small style={{ color: 'var(--muted-foreground)', fontSize: '12px', display: 'block', marginTop: '8px' }}>
                Yêu cầu: Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
              </small>
            </div>

            {/* Confirm Password */}
            <div className={styles.formGroup}>
              <label>
                Xác nhận mật khẩu mới <span className={styles.required}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-foreground)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={styles.input}
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <small style={{ color: 'var(--destructive, #dc2626)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  ⚠️ Mật khẩu không khớp
                </small>
              )}
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <small style={{ color: 'var(--success, #10b981)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  ✅ Mật khẩu khớp
                </small>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              <Save size={16} />
              {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
