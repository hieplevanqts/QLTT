import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Shield, Lock, Building2 } from 'lucide-react';
import styles from '../pages/AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

// Default password for all new users
const DEFAULT_PASSWORD = 'Couppa@123';

/**
 * ⚠️ IMPORTANT - RBAC Implementation Notes:
 * 
 * Database has a legacy 'role' field (varchar) in users table that is DEPRECATED.
 * DO NOT USE users.role field.
 * 
 * ✅ CORRECT: Use user_roles junction table (many-to-many)
 *   - Insert/Update: Delete old roles → Insert new roles into user_roles
 *   - Display: user.user_roles?.map(ur => ur.roles)
 *   - Multi-select: selectedRoleIds array → user_roles records
 * 
 * ⚠️ IMPORTANT - Department Relationship:
 *   - Uses department_users junction table (many-to-many, but 1 user = 1 department)
 *   - users (1) ←→ (N) department_users (N) ←→ (1) departments
 *   - 1 user has ONLY 1 department (enforce in logic)
 *   - Insert/Update: Delete old → Insert new into department_users
 *   - Display: user.department_users?.[0]?.departments
 *   - Single-select: selectedDepartmentId string → department_users record
 * 
 * ❌ INCORRECT: formData.role (legacy field)
 */

interface User {
  id: string;
  email: string;
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
  department_users?: {
    departments: {
      id: string;
      name: string;
      code: string;
      level: number;
    };
  }[];
  // Helper property for easy access (1 user = 1 department)
  department?: {
    id: string;
    name: string;
    code: string;
    level: number;
  };
}

interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface Department {
  id: string;
  parent_id: string | null;
  name: string;
  code: string;
  level: number;
  path: string | null;
}

interface UserModalProps {
  mode: 'add' | 'edit' | 'view';
  user: User | null;
  roles: Role[];
  departments: Department[];
  onClose: () => void;
  onSave: () => void;
}

// Helper function to build hierarchical department options
const buildDepartmentOptions = (departments: Department[]) => {
  const departmentMap = new Map<string, Department>();
  departments.forEach((dept) => departmentMap.set(dept.id, dept));

  const buildTree = (parentId: string | null, depth: number = 0): { id: string; label: string; depth: number }[] => {
    const children = departments.filter((dept) => dept.parent_id === parentId);
    const result: { id: string; label: string; depth: number }[] = [];

    children.forEach((child) => {
      // Add indent based on depth
      const indent = '  '.repeat(depth); // 2 spaces per level
      const prefix = depth > 0 ? '├─ ' : '';
      result.push({
        id: child.id,
        label: `${indent}${prefix}${child.name} (${child.code})`,
        depth,
      });

      // Recursively add children
      result.push(...buildTree(child.id, depth + 1));
    });

    return result;
  };

  return buildTree(null);
};

// Helper function to get department path from root to selected
const getDepartmentPath = (departmentId: string, departments: Department[]): string => {
  const departmentMap = new Map<string, Department>();
  departments.forEach((dept) => departmentMap.set(dept.id, dept));

  const path: string[] = [];
  let currentId: string | null = departmentId;

  // Build path from selected to root
  while (currentId) {
    const dept = departmentMap.get(currentId);
    if (dept) {
      path.unshift(dept.code); // Add to beginning of array
      currentId = dept.parent_id;
    } else {
      break;
    }
  }

  return path.join(''); // ✅ Ghép liền không có separator
};

// Helper function to get department path with separator (for display)
const getDepartmentPathWithSeparator = (departmentId: string, departments: Department[]): string => {
  const departmentMap = new Map<string, Department>();
  departments.forEach((dept) => departmentMap.set(dept.id, dept));

  const path: string[] = [];
  let currentId: string | null = departmentId;

  // Build path from selected to root
  while (currentId) {
    const dept = departmentMap.get(currentId);
    if (dept) {
      path.unshift(dept.code); // Add to beginning of array
      currentId = dept.parent_id;
    } else {
      break;
    }
  }

  return path.join(' > '); // With separator for display
};

// Helper function to generate username from full name
// Example: "Đặng Dinh Phương" → "PHUONGDD"
const generateInitials = (fullName: string): string => {
  if (!fullName || !fullName.trim()) return '';
  
  // Remove extra spaces and normalize
  const normalized = fullName.trim().replace(/\s+/g, ' ');
  const parts = normalized.split(' ');
  
  if (parts.length === 0) return '';
  
  // Get first name (last word) - uppercase without diacritics
  const firstName = parts[parts.length - 1].toUpperCase();
  
  // Get initials from last name and middle names (all words except last)
  const initials = parts
    .slice(0, -1) // All except last word
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  
  return firstName + initials;
};

// Helper function to remove Vietnamese diacritics
const removeDiacritics = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Helper function to generate username: {dept_code}_{initials}
const generateUsername = (fullName: string, departmentId: string | null, departments: Department[]): string => {
  if (!fullName.trim()) return '';
  
  const initials = removeDiacritics(generateInitials(fullName));
  
  if (!departmentId) {
    return initials; // No department, just return initials
  }
  
  const deptCode = getDepartmentPath(departmentId, departments);
  return `${deptCode}_${initials}`;
};

// ✅ Helper function to check if username exists in database
const checkUsernameExists = async (username: string, excludeUserId?: string): Promise<boolean> => {
  try {
    const query = supabase
      .from('users')
      .select('id, username')
      .eq('username', username);
    
    // Exclude current user when editing
    if (excludeUserId) {
      query.neq('id', excludeUserId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Error checking username:', error);
      return false;
    }
    
    return (data && data.length > 0);
  } catch (error) {
    console.error('❌ Error in checkUsernameExists:', error);
    return false;
  }
};

// ✅ Helper function to generate unique username with suffix if needed
const generateUniqueUsername = async (
  baseUsername: string,
  excludeUserId?: string
): Promise<string> => {
  try {
    console.log('🔍 Checking username availability:', baseUsername);
    
    // Check if base username exists
    const baseExists = await checkUsernameExists(baseUsername, excludeUserId);
    
    if (!baseExists) {
      console.log('✅ Username available:', baseUsername);
      return baseUsername;
    }
    
    console.log('⚠️  Username exists, finding next available suffix...');
    
    // Find all usernames with same base pattern
    const pattern = `${baseUsername}%`;
    const query = supabase
      .from('users')
      .select('username')
      .like('username', pattern);
    
    if (excludeUserId) {
      query.neq('id', excludeUserId);
    }
    
    const { data: existingUsers, error } = await query;
    
    if (error) {
      console.error('❌ Error querying usernames:', error);
      return `${baseUsername}02`; // Fallback to 02
    }
    
    // Extract all suffixes
    const existingUsernames = existingUsers?.map((u) => u.username) || [];
    const suffixes: number[] = [];
    
    existingUsernames.forEach((username) => {
      if (username === baseUsername) {
        suffixes.push(1); // Base username counts as "01"
      } else if (username.startsWith(baseUsername)) {
        // Extract numeric suffix (e.g., "QT01_PHUONGDD02" → "02" → 2)
        const suffix = username.slice(baseUsername.length);
        const num = parseInt(suffix, 10);
        if (!isNaN(num)) {
          suffixes.push(num);
        }
      }
    });
    
    // Find next available number
    let nextSuffix = 2; // Start from 02
    while (suffixes.includes(nextSuffix)) {
      nextSuffix++;
    }
    
    const uniqueUsername = `${baseUsername}${nextSuffix.toString().padStart(2, '0')}`;
    console.log(`✅ Unique username generated: ${uniqueUsername} (suffix: ${nextSuffix})`);
    
    return uniqueUsername;
  } catch (error) {
    console.error('❌ Error in generateUniqueUsername:', error);
    return `${baseUsername}02`; // Fallback
  }
};

export const UserModal: React.FC<UserModalProps> = ({
  mode,
  user,
  roles,
  departments,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    status: 1 as number, // 1 = kích hoạt, 0 = hủy kích hoạt
    password: DEFAULT_PASSWORD, // Mặc định là Couppa@123
  });
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState<string>(''); // ✅ State for username
  const [checkingUsername, setCheckingUsername] = useState(false); // ✅ State for checking username availability

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        phone: user.phone || '',
        status: user.status || 1,
        password: DEFAULT_PASSWORD,
      });

      // Set selected roles
      const roleIds = user.user_roles?.map((ur) => ur.roles.id) || [];
      setSelectedRoleIds(roleIds);

      // Set selected department
      const departmentId = user.department_users?.[0]?.departments.id || null;
      setSelectedDepartmentId(departmentId);
    }
  }, [user]);

  const handleRoleToggle = (roleId: string) => {
    if (selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId));
    } else {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  };

  const handleDepartmentChange = (departmentId: string | null) => {
    setSelectedDepartmentId(departmentId);
    
    // Console log department path
    if (departmentId) {
      const concatenatedPath = getDepartmentPath(departmentId, departments);
      const pathWithSeparator = getDepartmentPathWithSeparator(departmentId, departments);
      const selectedDept = departments.find((d) => d.id === departmentId);
      
      console.log('🏢 ========== DEPARTMENT PATH ==========');
      console.log('📍 Selected Department:', selectedDept?.name, `(${selectedDept?.code})`);
      console.log('📂 Path (Separated):', pathWithSeparator);
      console.log('🔗 Path (Concatenated):', concatenatedPath);
      console.log('🎯 Level:', selectedDept?.level);
      console.log('=========================================');
    } else {
      console.log('🏢 Department cleared');
      setGeneratedUsername(''); // ✅ Clear generated username
    }
  };
  
  // ✅ Watch for full_name and department changes, then check database for unique username
  useEffect(() => {
    const checkAndGenerateUsername = async () => {
      if (formData.full_name.trim() && selectedDepartmentId) {
        setCheckingUsername(true);
        
        const baseUsername = generateUsername(formData.full_name, selectedDepartmentId, departments);
        console.log('👤 ========== AUTO-GENERATED USERNAME ==========');
        console.log('📝 Full Name:', formData.full_name);
        console.log('🏢 Department:', departments.find(d => d.id === selectedDepartmentId)?.name);
        console.log('🔗 Base Username:', baseUsername);
        
        // ✅ Check database and generate unique username
        const uniqueUsername = await generateUniqueUsername(baseUsername, user?.id);
        setGeneratedUsername(uniqueUsername);
        
        console.log('✅ Final Username:', uniqueUsername);
        console.log('================================================');
        
        setCheckingUsername(false);
      } else {
        setGeneratedUsername('');
      }
    };
    
    checkAndGenerateUsername();
  }, [formData.full_name, selectedDepartmentId, departments, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate: Email, Full Name, Phone, Department are required
    if (!formData.email.trim() || !formData.full_name.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!formData.full_name.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return;
    }

    if (!selectedDepartmentId) {
      toast.error('Vui lòng chọn phòng ban');
      return;
    }

    if (!generatedUsername) {
      toast.error('Không thể tạo tên đăng nhập. Vui lòng kiểm tra Họ tên và Phòng ban');
      return;
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
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        status: formData.status,
        username: generatedUsername, // ✅ Save generated username
        updated_at: new Date().toISOString(),
      };

      let userId: string;

      if (mode === 'add') {
        // Create user using database function that syncs with auth.users
        console.log('🔄 Creating user in both public.users and auth.users...');
        
        const { data: createResult, error: createError } = await supabase
          .rpc('create_user_with_auth', {
            p_email: formData.email.trim(),
            p_password: formData.password || 'Couppa@123',
            p_full_name: formData.full_name.trim(),
            p_phone: formData.phone.trim() || null,
            p_avatar_url: null,
            p_status: formData.status,
          });

        if (createError) {
          console.error('❌ Error creating user:', createError);
          
          // Fallback to direct insert if function doesn't exist
          if (createError.message.includes('function') || createError.message.includes('does not exist')) {
            console.warn('⚠️  RPC function not found, using direct insert...');
            
            const passwordHash = await bcrypt.hash(formData.password || 'Couppa@123', 10);
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert([{
                ...userData,
                password_hash: passwordHash
              }])
              .select()
              .single();

            if (insertError) {
              console.error('❌ Error inserting user:', insertError);
              toast.error(`Lỗi tạo người dùng: ${insertError.message}`);
              return;
            }

            userId = newUser.id;
            console.log('✅ User created with direct insert (trigger will sync to auth.users)');
          } else {
            toast.error(`Lỗi tạo người dùng: ${createError.message}`);
            return;
          }
        } else {
          userId = createResult;
          console.log('✅ User created in both tables via RPC function');
        }
      } else if (mode === 'edit' && user) {
        // ✅ Update existing user using RPC function for safe auth.users + public.users update
        console.log('🔄 Updating user via RPC function...');
        
        const { data: rpcResult, error: rpcError } = await supabase
          .rpc('update_user_profile', {
            p_user_id: user.id,
            p_email: formData.email.trim(),
            p_phone: formData.phone.trim() || null,
            p_full_name: formData.full_name.trim(),
            p_username: generatedUsername,
            p_status: formData.status,
          });

        if (rpcError) {
          console.error('❌ Error calling update_user_profile RPC:', rpcError);
          
          // Fallback: Try direct update to public.users only
          console.warn('⚠️  RPC function failed, using fallback direct update...');
          const { error: updateError } = await supabase
            .from('users')
            .update(userData)
            .eq('id', user.id);

          if (updateError) {
            console.error('❌ Error updating user:', updateError);
            toast.error(`Lỗi cập nhật người dùng: ${updateError.message}`);
            return;
          }
          
          console.log('✅ User updated via fallback (public.users only)');
        } else {
          // Check if RPC returned success
          if (rpcResult && !rpcResult.success) {
            console.error('❌ RPC returned error:', rpcResult.error);
            toast.error(`Lỗi cập nhật: ${rpcResult.error}`);
            return;
          }
          
          console.log('✅ User updated via RPC function (both auth.users and public.users)');
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

      // Update department_users
      console.log('🔄 Updating user department...');

      // Delete existing department_users
      const { error: deleteDepartmentError } = await supabase
        .from('department_users')
        .delete()
        .eq('user_id', userId);

      if (deleteDepartmentError) {
        console.error('❌ Error deleting old department_users:', deleteDepartmentError);
        toast.error(`Lỗi xóa phòng ban cũ: ${deleteDepartmentError.message}`);
        return;
      }

      // Insert new department_users
      if (selectedDepartmentId) {
        const { error: insertDepartmentError } = await supabase
          .from('department_users')
          .insert({
            user_id: userId,
            department_id: selectedDepartmentId,
          });

        if (insertDepartmentError) {
          console.error('❌ Error inserting new department_users:', insertDepartmentError);
          toast.error(`Lỗi gán phòng ban: ${insertDepartmentError.message}`);
          return;
        }

        console.log(`✅ Assigned department to user: ${selectedDepartmentId}`);
      } else {
        console.log('✅ No department assigned to user');
      }

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

            {/* Department */}
            <div className={styles.formGroup}>
              <label>
                Phòng ban <span className={styles.required}>*</span>
              </label>
              {isViewMode ? (
                <input
                  type="text"
                  className={styles.input}
                  value={user?.department?.name || 'Chưa gán phòng ban'}
                  disabled
                />
              ) : (
                <select
                  className={styles.select}
                  value={selectedDepartmentId || ''}
                  onChange={(e) => handleDepartmentChange(e.target.value || null)}
                  required
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {buildDepartmentOptions(departments).map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              )}
              <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                Chọn 1 phòng ban cho người dùng (bắt buộc để tạo tên đăng nhập)
              </small>
            </div>

            {/* Auto-generated Username */}
            <div className={styles.formGroup}>
              <label>
                Tên đăng nhập {mode !== 'view' && <span className={styles.required}>*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <User
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
                  type="text"
                  className={styles.input}
                  style={{
                    paddingLeft: '40px',
                    backgroundColor: isViewMode ? 'var(--muted)' : 'var(--card)',
                    color: generatedUsername ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontFamily: 'Inter, monospace',
                    fontWeight: generatedUsername ? 600 : 400,
                  }}
                  value={generatedUsername}
                  placeholder={
                    !formData.full_name.trim()
                      ? 'Nhập họ tên trước...'
                      : !selectedDepartmentId
                      ? 'Chọn phòng ban trước...'
                      : 'QT01_PHUONGDD'
                  }
                  disabled
                  readOnly
                />
              </div>
              <small
                style={{
                  color: generatedUsername ? 'var(--primary)' : 'var(--muted-foreground)',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {generatedUsername
                  ? '✅ Tên đăng nhập được tạo tự động từ Phòng ban + Họ tên'
                  : '⚠️ Vui lòng nhập Họ tên và chọn Phòng ban để tạo tên đăng nhập'}
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