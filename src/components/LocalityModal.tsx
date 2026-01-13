/**
 * Locality Modal - MAPPA Portal
 * Modal for CREATE/EDIT/VIEW địa bàn with conditional logic
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  Building2, 
  User, 
  Mail,
  ChevronDown,
  Search,
  Check,
} from 'lucide-react';
import styles from '../pages/AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Province {
  id: string;
  code: string;
  name: string;
}

interface Ward {
  id: string;
  code: string;
  name: string;
  provinceid: string;
}

interface UserOption {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface LocalityModalProps {
  mode: 'add' | 'edit' | 'view';
  onClose: () => void;
  onSave: () => void;
}

export const LocalityModal: React.FC<LocalityModalProps> = ({
  mode,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    level: '', // '', 'province', 'ward'
    province_id: '',
    ward_id: '',
    manager_id: '',
    status: 1 as number, // 1 = hoạt động, 0 = tạm dừng
    description: '',
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [filteredWards, setFilteredWards] = useState<Ward[]>([]);
  
  // User dropdown states
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProvinces();
    fetchWards();
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter wards based on selected province
    if (formData.province_id) {
      const filtered = wards.filter(w => w.provinceid === formData.province_id);
      setFilteredWards(filtered);
    } else {
      setFilteredWards([]);
    }
  }, [formData.province_id, wards]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProvinces = async () => {
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProvinces(data || []);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchWards = async () => {
    try {
      const { data, error } = await supabase
        .from('wards')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setWards(data || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .eq('status', 1) // Only active users
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!formData.level) {
      toast.error('Vui lòng chọn cấp địa bàn');
      return;
    }

    if (formData.level === 'province' && !formData.province_id) {
      toast.error('Vui lòng chọn Tỉnh/Thành phố');
      return;
    }

    if (formData.level === 'ward' && (!formData.province_id || !formData.ward_id)) {
      toast.error('Vui lòng chọn đầy đủ Tỉnh/Thành phố và Xã/Phường');
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Saving locality...', formData);
      
      // Here you would save to your database
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(
        mode === 'add'
          ? 'Đã tạo địa bàn thành công'
          : 'Đã cập nhật địa bàn thành công'
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

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const query = userSearchQuery.toLowerCase();
    return (
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleSelectUser = (user: UserOption) => {
    setSelectedUser(user);
    setFormData({ ...formData, manager_id: user.id });
    setShowUserDropdown(false);
    setUserSearchQuery('');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', width: '100%' }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <MapPin size={20} style={{ color: 'var(--primary, #005cb6)', flexShrink: 0 }} />
          <h3>
            {mode === 'add' && 'Thêm địa bàn mới'}
            {mode === 'edit' && 'Chỉnh sửa địa bàn'}
            {mode === 'view' && 'Chi tiết địa bàn'}
          </h3>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Grid Layout - 2 columns */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 'var(--spacing-4, 16px)',
            }}>
              {/* Mã */}
              <div className={styles.formGroup}>
                <label>
                  Mã <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: DB001"
                  disabled={isViewMode}
                  required
                />
              </div>

              {/* Tên */}
              <div className={styles.formGroup}>
                <label>
                  Tên <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên địa bàn"
                  disabled={isViewMode}
                  required
                />
              </div>

              {/* Cấp */}
              <div className={styles.formGroup}>
                <label>
                  Cấp <span className={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    className={styles.select}
                    value={formData.level}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        level: e.target.value,
                        province_id: '',
                        ward_id: '',
                      });
                    }}
                    disabled={isViewMode}
                    required
                  >
                    <option value="">Chọn cấp</option>
                    <option value="province">Tỉnh/Thành phố</option>
                    <option value="ward">Xã/Phường</option>
                  </select>
                  <ChevronDown 
                    size={16} 
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted-foreground)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div className={styles.formGroup}>
                <label>
                  Trạng thái <span className={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    className={styles.select}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: parseInt(e.target.value) as number,
                      })
                    }
                    disabled={isViewMode}
                    required
                  >
                    <option value="1">Hoạt động</option>
                    <option value="0">Tạm dừng</option>
                  </select>
                  <ChevronDown 
                    size={16} 
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted-foreground)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Conditional: Chọn Tỉnh/Thành phố */}
              {(formData.level === 'province' || formData.level === 'ward') && (
                <div className={styles.formGroup}>
                  <label>
                    Chọn Tỉnh/Thành phố <span className={styles.required}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted-foreground)',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    />
                    <select
                      className={styles.select}
                      style={{ paddingLeft: '40px' }}
                      value={formData.province_id}
                      onChange={(e) => setFormData({ ...formData, province_id: e.target.value, ward_id: '' })}
                      disabled={isViewMode}
                      required
                    >
                      <option value="">-- Chọn Tỉnh/Thành phố --</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown 
                      size={16} 
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted-foreground)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Conditional: Chọn Xã/Phường */}
              {formData.level === 'ward' && (
                <div className={styles.formGroup}>
                  <label>
                    Chọn Xã/Phường <span className={styles.required}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted-foreground)',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    />
                    <select
                      className={styles.select}
                      style={{ paddingLeft: '40px' }}
                      value={formData.ward_id}
                      onChange={(e) => setFormData({ ...formData, ward_id: e.target.value })}
                      disabled={isViewMode || !formData.province_id}
                      required
                    >
                      <option value="">-- Chọn Xã/Phường --</option>
                      {filteredWards.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown 
                      size={16} 
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted-foreground)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  {!formData.province_id && (
                    <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                      Vui lòng chọn Tỉnh/Thành phố trước
                    </small>
                  )}
                </div>
              )}

              {/* Người phụ trách - Searchable Dropdown */}
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Người phụ trách</label>
                <div style={{ position: 'relative' }} ref={userDropdownRef}>
                  {/* Selected User Display or Search Input */}
                  {selectedUser && !showUserDropdown ? (
                    <div
                      className={styles.input}
                      onClick={() => !isViewMode && setShowUserDropdown(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: isViewMode ? 'default' : 'pointer',
                        padding: '10px 12px',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-full, 50%)',
                          background: 'linear-gradient(135deg, var(--primary, #005cb6) 0%, #0077d4 100%)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {selectedUser.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: 500, 
                          fontSize: '14px',
                          color: 'var(--text-primary)',
                          marginBottom: '2px',
                        }}>
                          {selectedUser.full_name}
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          <Mail size={12} />
                          {selectedUser.email}
                        </div>
                      </div>
                      {!isViewMode && (
                        <X
                          size={18}
                          style={{ color: 'var(--muted-foreground)', cursor: 'pointer', flexShrink: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(null);
                            setFormData({ ...formData, manager_id: '' });
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <Search
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--muted-foreground)',
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}
                      />
                      <input
                        type="text"
                        className={styles.input}
                        style={{ paddingLeft: '40px' }}
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        onFocus={() => !isViewMode && setShowUserDropdown(true)}
                        placeholder="Tìm kiếm người dùng..."
                        disabled={isViewMode}
                      />
                    </div>
                  )}

                  {/* Dropdown List */}
                  {showUserDropdown && !isViewMode && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md, 8px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 1000,
                      }}
                    >
                      {filteredUsers.length === 0 ? (
                        <div
                          style={{
                            padding: '16px',
                            textAlign: 'center',
                            color: 'var(--muted-foreground)',
                            fontSize: '14px',
                          }}
                        >
                          Không tìm thấy người dùng
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 16px',
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--border)',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = 'var(--muted)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = 'transparent')
                            }
                          >
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full, 50%)',
                                background: 'linear-gradient(135deg, var(--primary, #005cb6) 0%, #0077d4 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ 
                                fontWeight: 500, 
                                fontSize: '14px',
                                color: 'var(--text-primary)',
                                marginBottom: '4px',
                              }}>
                                {user.full_name}
                              </div>
                              <div style={{ 
                                fontSize: '13px', 
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}>
                                <Mail size={12} />
                                {user.email}
                              </div>
                            </div>
                            {selectedUser?.id === user.id && (
                              <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                  Tìm kiếm theo tên hoặc email
                </small>
              </div>
            </div>

            {/* Mô tả - Full width */}
            <div className={styles.formGroup} style={{ marginTop: 'var(--spacing-2, 8px)' }}>
              <label>Mô tả</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả địa bàn..."
                disabled={isViewMode}
                rows={4}
                style={{
                  resize: 'vertical',
                  minHeight: '100px',
                }}
              />
            </div>
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

export default LocalityModal;
