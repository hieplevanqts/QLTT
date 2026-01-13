/**
 * User Modal - MAPPA Portal
 * Modal for CREATE/EDIT/VIEW user with role assignment
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Shield, Lock, AtSign, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import styles from '../pages/AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';
import { validateUsername, quickValidateUsernameFormat } from '../utils/usernameValidator';

// Default password for all new users
const DEFAULT_PASSWORD = 'Couppa@123';

interface User {
  id: string;
  email: string;
  username?: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  status: number; // 1 = kích hoạt, 0 = hủy kích hoạt
  created_at: string;
  updated_at: string;
  last_login?: string;
  user_roles?: {
    roles: {
      id: string;
      code: string;
      name: string;
    };
  }[];
}

interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface UserModalProps {
  mode: 'add' | 'edit' | 'view';
  user: User | null;
  roles: Role[];
  onClose: () => void;
  onSave: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  mode,
  user,
  roles,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    phone: '',
    status: 1 as number, // 1 = kích hoạt, 0 = hủy kích hoạt
    password: DEFAULT_PASSWORD, // Mặc định là Couppa@123
  });
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState<{
    isValidating: boolean;
    isValid: boolean;
    error?: string;
  }>({
    isValidating: false,
    isValid: true,
  });
  const [usernameDebounceTimer, setUsernameDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        full_name: user.full_name || '',
        phone: user.phone || '',
        status: user.status || 1,
        password: DEFAULT_PASSWORD,
      });

      // Set selected roles
      const roleIds = user.user_roles?.map((ur) => ur.roles.id) || [];
      setSelectedRoleIds(roleIds);
    }
  }, [user]);

  const handleRoleToggle = (roleId: string) => {
    if (selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId));
    } else {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  };

  // Handle username change with debounced validation
  const handleUsernameChange = (newUsername: string) => {
    setFormData({ ...formData, username: newUsername });

    // Clear previous timer
    if (usernameDebounceTimer) {
      clearTimeout(usernameDebounceTimer);
    }

    // Quick format check (client-side only)
    const quickCheck = quickValidateUsernameFormat(newUsername);
    if (!quickCheck.isValid) {
      setUsernameValidation({
        isValidating: false,
        isValid: false,
        error: quickCheck.error,
      });
      return;
    }

    // Set validating state
    setUsernameValidation({
      isValidating: true,
      isValid: false,
    });

    // Debounce database validation (800ms delay)
    const timer = setTimeout(async () => {
      console.log('🔍 Validating username:', newUsername);
      const result = await validateUsername(newUsername);
      
      setUsernameValidation({
        isValidating: false,
        isValid: result.isValid,
        error: result.error,
      });

      if (result.isValid) {
        console.log('✅ Username valid:', result.details);
      } else {
        console.log('❌ Username invalid:', result.error);
      }
    }, 800);

    setUsernameDebounceTimer(timer);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (usernameDebounceTimer) {
        clearTimeout(usernameDebounceTimer);
      }
    };
  }, [usernameDebounceTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.username.trim() || !formData.full_name.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate username before submission
    if (!isViewMode) {
      console.log('🔍 Final username validation before submit...');
      const finalValidation = await validateUsername(formData.username.trim());
      
      if (!finalValidation.isValid) {
        toast.error(finalValidation.error || 'Tên đăng nhập không hợp lệ');
        setUsernameValidation({
          isValidating: false,
          isValid: false,
          error: finalValidation.error,
        });
        return;
      }
      
      console.log('✅ Username validation passed');
    }

    if (mode === 'add' && !formData.password) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    if (!formData.phone?.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }

    if (selectedRoleIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 vai trò');
      return;
    }

    try {
      setSaving(true);
      console.log(`💾 ${mode === 'add' ? 'Creating' : 'Updating'} user...`);

      const userData = {
        email: formData.email.trim(),
        username: formData.username.trim(),
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        status: formData.status,
        updated_at: new Date().toISOString(),
      };

      let userId: string;

      if (mode === 'add') {
        // Insert new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([userData])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating user:', insertError);
          toast.error(`Lỗi tạo người dùng: ${insertError.message}`);
          return;
        }

        userId = newUser.id;
        console.log('✅ User created:', userId);
      } else if (mode === 'edit' && user) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('users')
          .update(userData)
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Error updating user:', updateError);
          toast.error(`Lỗi cập nhật người dùng: ${updateError.message}`);
          return;
        }

        userId = user.id;
        console.log('✅ User updated:', userId);
      } else {
        return;
      }

      // Update user_roles
      console.log('🔄 Updating user roles...');

      // Delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('❌ Error deleting old roles:', deleteError);
        toast.error(`Lỗi xóa vai trò cũ: ${deleteError.message}`);
        return;
      }

      // Insert new roles
      const userRolesData = selectedRoleIds.map((roleId) => ({
        user_id: userId,
        role_id: roleId,
      }));

      const { error: insertRolesError } = await supabase
        .from('user_roles')
        .insert(userRolesData);

      if (insertRolesError) {
        console.error('❌ Error inserting new roles:', insertRolesError);
        toast.error(`Lỗi gán vai trò: ${insertRolesError.message}`);
        return;
      }

      console.log(`✅ Assigned ${selectedRoleIds.length} roles to user`);
      toast.success(
        mode === 'add'
          ? 'Đã tạo người dùng thành công'
          : 'Đã cập nhật người dùng thành công'
      );

      onSave();
      onClose();
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      toast.error('Lỗi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <User size={20} style={{ color: 'var(--primary, #005cb6)', flexShrink: 0 }} />
          <h3>
            {mode === 'add' && 'Thêm người dùng mới'}
            {mode === 'edit' && 'Chỉnh sửa người dùng'}
            {mode === 'view' && 'Chi tiết người dùng'}
          </h3>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Email */}
            <div className={styles.formGroup}>
              <label>
                Email <span className={styles.required}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
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
                  type="email"
                  className={styles.input}
                  style={{ paddingLeft: '40px' }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  disabled={isViewMode || mode === 'edit'}
                  required
                />
              </div>
              {mode === 'edit' && (
                <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                  Email không thể thay đổi
                </small>
              )}
            </div>

            {/* Username */}
            <div className={styles.formGroup}>
              <label>
                Tên đăng nhập <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="VD: QT01_admin hoặc QT01001_user"
                disabled={isViewMode}
                required
              />
              {/* Real-time validation feedback */}
              {!isViewMode && (
                <>
                  {usernameValidation.isValidating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <Loader2 size={14} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                      <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                        Đang kiểm tra...
                      </small>
                    </div>
                  )}
                  {!usernameValidation.isValidating && !usernameValidation.isValid && usernameValidation.error && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '6px' }}>
                      <AlertCircle size={14} style={{ color: 'var(--destructive, #dc2626)', marginTop: '2px', flexShrink: 0 }} />
                      <small style={{ color: 'var(--destructive, #dc2626)', fontSize: '12px', lineHeight: '1.4' }}>
                        {usernameValidation.error}
                      </small>
                    </div>
                  )}
                  {!usernameValidation.isValidating && usernameValidation.isValid && formData.username.trim() && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <CheckCircle size={14} style={{ color: 'var(--success, #16a34a)' }} />
                      <small style={{ color: 'var(--success, #16a34a)', fontSize: '12px' }}>
                        Tên đăng nhập hợp lệ
                      </small>
                    </div>
                  )}
                  <small style={{ 
                    display: 'block',
                    color: 'var(--muted-foreground)', 
                    fontSize: '12px',
                    marginTop: '6px',
                    lineHeight: '1.5'
                  }}>
                    Định dạng: <strong>QT[mã]_tên</strong>
                    <br />
                    • Cấp Tỉnh: <strong>QT01_admin</strong> (2 chữ số)
                    <br />
                    • Cấp Phường: <strong>QT01002_user</strong> (2 số tỉnh + 3 số phường)
                    <br />
                    <span style={{ fontSize: '11px', opacity: 0.8 }}>
                      VD: Tỉnh 01, Phường 002 → QT01002_tên
                    </span>
                  </small>
                </>
              )}
            </div>

            {/* Full Name */}
            <div className={styles.formGroup}>
              <label>
                Họ tên <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nguyễn Văn A"
                disabled={isViewMode}
                required
              />
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label>Số điện thoại <span className={styles.required}>*</span></label>
              <div style={{ position: 'relative' }}>
                <Phone
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
                  type="tel"
                  className={styles.input}
                  style={{ paddingLeft: '40px' }}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912345678"
                  disabled={isViewMode}
                  required
                />
              </div>
            </div>

            {/* Password (only for add mode) */}
            {mode === 'add' && (
              <div className={styles.formGroup}>
                <label>
                  Mật khẩu <span className={styles.required}>*</span>
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
                    type="password"
                    className={styles.input}
                    style={{ paddingLeft: '40px' }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
                <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                  Tối thiểu 8 ký tự
                </small>
              </div>
            )}

            {/* Status */}
            <div className={styles.formGroup}>
              <label>
                Trạng thái <span className={styles.required}>*</span>
              </label>
              {isViewMode ? (
                <input
                  type="text"
                  className={styles.input}
                  value={formData.status === 1 ? 'Hoạt động' : 'Đã khóa'}
                  disabled
                />
              ) : (
                <select
                  className={styles.select}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: parseInt(e.target.value) as number,
                    })
                  }
                  required
                >
                  <option value="1">Hoạt động</option>
                  <option value="0">Đã khóa</option>
                </select>
              )}
            </div>

            {/* Roles */}
            <div className={styles.formGroup}>
              <label>
                Vai trò <span className={styles.required}>*</span>
              </label>
              {isViewMode ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedRoleIds.length > 0 ? (
                    selectedRoleIds.map((roleId) => {
                      const role = roles.find((r) => r.id === roleId);
                      return (
                        <span key={roleId} className={styles.badge}>
                          <Shield size={12} />
                          {role?.name || roleId}
                        </span>
                      );
                    })
                  ) : (
                    <span style={{ color: 'var(--muted-foreground)' }}>
                      Chưa gán vai trò
                    </span>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md, 8px)',
                    padding: '12px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    background: 'var(--card)',
                  }}
                >
                  {roles.length === 0 ? (
                    <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '14px' }}>
                      Không có vai trò nào
                    </p>
                  ) : (
                    roles.map((role) => (
                      <label
                        key={role.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          padding: '10px 8px',
                          cursor: 'pointer',
                          borderRadius: 'var(--radius-sm, 4px)',
                          transition: 'background-color 0.2s',
                          gap: '12px',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = 'var(--muted)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoleIds.includes(role.id)}
                          onChange={() => handleRoleToggle(role.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            marginTop: '2px',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              color: 'var(--foreground)',
                              marginBottom: '2px',
                            }}
                          >
                            <Shield
                              size={14}
                              style={{
                                display: 'inline',
                                marginRight: '6px',
                                color: 'var(--primary)',
                                verticalAlign: 'middle',
                              }}
                            />
                            {role.name}
                          </div>
                          {role.description && (
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'var(--muted-foreground)',
                                lineHeight: 1.4,
                              }}
                            >
                              {role.description}
                            </div>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
              <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                Chọn 1 hoặc nhiều vai trò cho người dùng
              </small>
            </div>

            {/* Created date (view mode only) */}
            {isViewMode && user && (
              <>
                <div className={styles.formGroup}>
                  <label>Ngày tạo</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={new Date(user.created_at).toLocaleString('vi-VN')}
                    disabled
                  />
                </div>
                {user.last_login && (
                  <div className={styles.formGroup}>
                    <label>Đăng nhập cuối</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={new Date(user.last_login).toLocaleString('vi-VN')}
                      disabled
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                <Save size={16} />
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;