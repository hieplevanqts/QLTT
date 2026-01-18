/**
 * Department Modal - MAPPA Portal
 * Modal để thêm/sửa/xem department
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Building2, AlertCircle, Loader2, MapPin, Search } from 'lucide-react';
import styles from './AdminPage.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Area {
  id: string;
  code: string;
  name: string;
  level: string;
  provinceid: string | null;
  wardid: string | null;
  managerid: string | null;
  description: string | null;
  status: number;
}

interface Department {
  id?: string;
  parent_id: string | null;
  name: string;
  code: string;
  level: number;
  path: string | null;
}

interface DepartmentModalProps {
  mode: 'add' | 'edit' | 'view' | 'add-child';
  department?: Department;
  parentDepartment?: Department;
  onClose: () => void;
  onRefresh: () => void;
}

// Helper function to get level name
const getLevelName = (level: number): string => {
  const levelNames: { [key: number]: string } = {
    1: 'Cục',
    2: 'Chi cục',
    3: 'Đội',
  };
  return levelNames[level] || `Cấp ${level}`;
};

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  mode,
  department,
  parentDepartment,
  onClose,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<Department>({
    parent_id: parentDepartment?.id || department?.parent_id || null,
    name: department?.name || '',
    code: department?.code || '',
    level: department?.level || (parentDepartment ? parentDepartment.level + 1 : 1),
    path: department?.path || null,
  });

  // Area multi-select states
  const [allAreas, setAllAreas] = useState<Area[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [areaSearchQuery, setAreaSearchQuery] = useState('');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [assignedAreas, setAssignedAreas] = useState<Map<string, string>>(new Map()); // area_id -> department_id
  const [parentDepartmentAreas, setParentDepartmentAreas] = useState<string[]>([]); // For level 3 (Đội)

  const isViewMode = mode === 'view';
  const isAddChild = mode === 'add-child';

  useEffect(() => {
    fetchAllDepartments();
    fetchAllAreas();
    fetchAllAssignedAreas(); // ✅ Fetch all area assignments
    if (department?.id) {
      fetchDepartmentAreas(department.id);
    }
    // ✅ If editing level 3 (Đội), fetch parent's areas
    if (formData.level === 3 && formData.parent_id) {
      fetchParentDepartmentAreas(formData.parent_id);
    }
    
    // ✅ NEW: If level 1 (Cục), auto-select all areas
    if (formData.level === 1 && allAreas.length > 0 && !department?.id) {
      const allAreaIds = allAreas.map(a => a.id);
      setSelectedAreas(allAreaIds);
    }
  }, [department?.id, formData.level, formData.parent_id, allAreas.length, mode]); // ✅ Added mode to dependencies

  // ✅ NEW: Force refresh assigned areas when modal opens/mode changes
  useEffect(() => {
    fetchAllAssignedAreas();
  }, [mode, department?.id]);

  // ✅ Debug effect to track state changes
  useEffect(() => {
    console.log({
      allAreasCount: allAreas.length,
      selectedAreasCount: selectedAreas.length,
      selectedAreaIds: selectedAreas,
      departmentId: department?.id,
      assignedAreasCount: assignedAreas.size,
      assignedAreasMap: Array.from(assignedAreas.entries()).map(([areaId, deptId]) => ({
        areaId,
        deptId,
        areaName: allAreas.find(a => a.id === areaId)?.name || 'Unknown',
        deptName: allDepartments.find(d => d.id === deptId)?.name || 'Unknown',
      })),
    });
  }, [allAreas, selectedAreas, department?.id, assignedAreas, allDepartments]);

  const fetchAllDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .is('deleted_at', null)
        .order('name');

      if (error) {
        console.error('Error fetching departments:', error);
        return;
      }

      setAllDepartments(data || []);
    } catch (error) {
      console.error('Error in fetchAllDepartments:', error);
    }
  };

  const fetchAllAreas = async () => {
    try {
      
      const { data, error, count } = await supabase
        .from('areas')
        .select('*', { count: 'exact' })
        .order('name');

      console.log({
        data, 
        error, 
        count,
        dataLength: data?.length,
        hasData: !!data,
        hasError: !!error 
      });

      if (error) {
        console.error('❌ Error fetching areas:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        toast.error(`Lỗi khi tải danh sách địa bàn: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
      }

      setAllAreas(data || []);
    } catch (error) {
      console.error('💥 Exception in fetchAllAreas:', error);
      toast.error('Lỗi khi tải danh sách địa bàn');
    }
  };

  const fetchAllAssignedAreas = async () => {
    try {
      
      const { data, error } = await supabase
        .from('department_areas')
        .select('*');

      console.log({
        data, 
        error,
        dataLength: data?.length,
        hasData: !!data,
        hasError: !!error 
      });

      if (error) {
        console.error('❌ Error fetching assigned areas:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        toast.error(`Lỗi khi tải danh sách phân bổ địa bàn: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
      }

      
      // Populate assignedAreas map
      const map = new Map<string, string>();
      data?.forEach((item) => {
        map.set(item.area_id, item.department_id);
      });
      setAssignedAreas(map);
    } catch (error) {
      console.error('💥 Exception in fetchAllAssignedAreas:', error);
      toast.error('Lỗi khi tải danh sách phân bổ địa bàn');
    }
  };

  const fetchDepartmentAreas = async (departmentId: string) => {
    try {
      
      const { data, error } = await supabase
        .from('department_areas')
        .select('area_id')
        .eq('department_id', departmentId);

      console.log({
        data, 
        error,
        dataLength: data?.length 
      });

      if (error) {
        console.error('❌ Error fetching department areas:', error);
        toast.error(`Lỗi khi tải địa bàn của đơn vị: ${error.message}`);
        return;
      }

      const areaIds = data?.map((item) => item.area_id) || [];
      areaIds.forEach((areaId) => {
        const found = allAreas.find((a) => a.id === areaId);
      });
      
      setSelectedAreas(areaIds);
      
      // Force re-render check
      setTimeout(() => {
      }, 100);
    } catch (error) {
      console.error('💥 Exception in fetchDepartmentAreas:', error);
    }
  };

  const fetchParentDepartmentAreas = async (parentId: string) => {
    try {
      
      const { data, error } = await supabase
        .from('department_areas')
        .select('area_id')
        .eq('department_id', parentId);

      console.log({
        data, 
        error,
        dataLength: data?.length 
      });

      if (error) {
        console.error('❌ Error fetching parent department areas:', error);
        toast.error(`Lỗi khi tải địa bàn của đơn vị cha: ${error.message}`);
        return;
      }

      const areaIds = data?.map((item) => item.area_id) || [];
      areaIds.forEach((areaId) => {
        const found = allAreas.find((a) => a.id === areaId);
      });
      
      setParentDepartmentAreas(areaIds);
      
      // Force re-render check
      setTimeout(() => {
      }, 100);
    } catch (error) {
      console.error('💥 Exception in fetchParentDepartmentAreas:', error);
    }
  };

  const handleChange = (field: keyof Department, value: any) => {
    if (isViewMode) return;

    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // If parent changes, update level
      if (field === 'parent_id') {
        if (value) {
          const parent = allDepartments.find((d) => d.id === value);
          if (parent) {
            updated.level = parent.level + 1;
          }
        } else {
          // Nếu không có parent → tự động là Cục (level 1)
          updated.level = 1;
        }
      }

      // If level changes, convert to number
      if (field === 'level') {
        updated.level = typeof value === 'string' ? parseInt(value, 10) : value;
        
        // ✅ Nếu chọn Cục (level 1) → tự động clear parent
        if (updated.level === 1) {
          updated.parent_id = null;
          
          // ✅ Auto-select all areas when changing to level 1
          if (allAreas.length > 0) {
            const allAreaIds = allAreas.map(a => a.id);
            setSelectedAreas(allAreaIds);
          }
        }
      }

      return updated;
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên đơn vị');
      return false;
    }

    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã đơn vị');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) {
      onClose();
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Calculate path
      let path = formData.code;
      if (formData.parent_id) {
        const parent = allDepartments.find((d) => d.id === formData.parent_id);
        if (parent && parent.path) {
          path = `${parent.path}.${formData.code}`;
        }
      }

      const dataToSave = {
        ...formData,
        path,
      };

      let departmentId = department?.id;

      if (mode === 'edit' && department?.id) {
        // Update existing department
        const { error } = await supabase
          .from('departments')
          .update(dataToSave)
          .eq('id', department.id);

        if (error) throw error;

        // Save areas for edit mode
        await saveDepartmentAreas(department.id);

        toast.success('Cập nhật đơn vị thành công');
      } else {
        // Insert new department
        const { data: newDept, error } = await supabase
          .from('departments')
          .insert([dataToSave])
          .select()
          .single();

        if (error) throw error;

        // Save areas for new department
        if (newDept?.id) {
          await saveDepartmentAreas(newDept.id);
        }

        toast.success(isAddChild ? 'Thêm đơn vị con thành công' : 'Thêm đơn vị thành công');
      }

      onRefresh();
      onClose();
    } catch (error: any) {
      console.error('Error saving department:', error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveDepartmentAreas = async (departmentId: string) => {
    try {
      console.log({
        departmentId,
        selectedAreas,
        selectedAreasCount: selectedAreas.length,
      });

      // Delete existing department areas
      const { error: deleteError } = await supabase
        .from('department_areas')
        .delete()
        .eq('department_id', departmentId);

      if (deleteError) {
        console.error('❌ Error deleting old department areas:', deleteError);
        throw deleteError;
      }


      // Insert new department areas
      if (selectedAreas.length > 0) {
        const areaData = selectedAreas.map((areaId) => ({
          department_id: departmentId,
          area_id: areaId,
        }));


        const { data: insertedData, error: insertError } = await supabase
          .from('department_areas')
          .insert(areaData)
          .select();

        if (insertError) {
          console.error('❌ Error inserting department areas:', insertError);
          console.error('Insert error code:', insertError.code);
          console.error('Insert error message:', insertError.message);
          console.error('Insert error details:', insertError.details);
          throw insertError;
        }

      } else {
      }
    } catch (error: any) {
      console.error('💥 Exception in saveDepartmentAreas:', error);
      toast.error(`Lỗi khi lưu địa bàn: ${error.message}`);
      throw error; // Re-throw to prevent form from closing
    }
  };

  const getModalTitle = () => {
    if (mode === 'add') return 'Thêm đơn vị gốc';
    if (mode === 'add-child') return `Thêm đơn vị con của "${parentDepartment?.name}"`;
    if (mode === 'edit') return 'Chỉnh sửa đơn vị';
    return 'Chi tiết đơn vị';
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalHeader}>
            <Building2 size={24} style={{ color: 'var(--primary, #005cb6)' }} />
            <h3 style={{ margin: 0, flex: 1 }}>{getModalTitle()}</h3>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.modalBody}>
            {/* Parent Department (if adding child) */}
            {isAddChild && parentDepartment && (
              <div className={styles.alertInfo} style={{ marginBottom: 'var(--spacing-4, 16px)' }}>
                <AlertCircle size={16} />
                <div>
                  <strong>Đơn vị cha:</strong> {parentDepartment.name} ({parentDepartment.code})
                  <br />
                  <strong>Loại:</strong> {getLevelName(parentDepartment.level)} → <strong>Loại mới:</strong> {getLevelName(parentDepartment.level + 1)}
                </div>
              </div>
            )}

            {/* Parent Department Selector (for root add/edit) */}
            {!isAddChild && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Đơn vị cha
                  <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--muted-foreground)' }}>
                    {' '}(Để trống nếu là đơn vị gốc)
                  </span>
                </label>
                <select
                  className={styles.select}
                  value={formData.parent_id || ''}
                  onChange={(e) => handleChange('parent_id', e.target.value || null)}
                  disabled={isViewMode || formData.level === 1}
                  style={formData.level === 1 ? { background: 'var(--muted)', cursor: 'not-allowed' } : {}}
                >
                  <option value="">-- Không có (Đơn vị gốc) --</option>
                  {allDepartments
                    .filter((dept) => dept.id !== department?.id) // ✅ Loại bỏ chính nó
                    .map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code}) - {getLevelName(dept.level)}
                      </option>
                    ))}
                </select>
                {formData.level === 1 && (
                  <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                    Đơn vị Cục không có đơn vị cha (là đơn vị gốc)
                  </small>
                )}
              </div>
            )}

            {/* Department Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên đơn vị <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="Nhập tên đơn vị"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isViewMode}
                required
              />
            </div>

            {/* Department Code */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Mã đơn vị <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="Nhập mã đơn vị (ví dụ: DV001)"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                disabled={isViewMode || mode === 'edit'}
                style={mode === 'edit' ? { background: 'var(--muted)', cursor: 'not-allowed' } : {}}
                required
              />
              {mode === 'edit' && (
                <small style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  ⚠️ Không thể thay đổi mã đơn vị sau khi tạo (để đảm bảo tính toàn vẹn dữ liệu)
                </small>
              )}
            </div>

            {/* Level (editable select) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Loại đơn vị</label>
              <select
                className={styles.select}
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
                disabled={isViewMode}
              >
                <option value={1}>Cục</option>
                <option value={2}>Chi cục</option>
                <option value={3}>Đội</option>
              </select>
              <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                Loại có thể được thay đổi khi cần thiết
              </small>
            </div>

            {/* Path (read-only for edit) */}
            {mode === 'edit' && formData.path && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Đường dẫn</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.path}
                  disabled
                  style={{ background: 'var(--muted)', cursor: 'not-allowed', fontFamily: 'Monaco, monospace', fontSize: '13px' }}
                />
              </div>
            )}

            {/* Area Multi-Select */}
            {/* ✅ HIDE for Level 1 (Cục) - they manage all areas by default */}
            {formData.level !== 1 && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Địa bàn quản lý
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginLeft: '8px' }}>
                    ({allAreas.length} địa bàn có sẵn)
                  </span>
                  <button
                    type="button"
                    onClick={fetchAllAreas}
                    style={{
                      marginLeft: '12px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    🔄 Refresh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.table(allAreas.map(a => ({
                        name: a.name,
                        code: a.code,
                        level: a.level,
                        provinceid: a.provinceid,
                        wardid: a.wardid,
                      })));
                      console.table(Array.from(assignedAreas.entries()).map(([areaId, deptId]) => ({
                        areaId,
                        areaName: allAreas.find(a => a.id === areaId)?.name || 'Unknown',
                        departmentId: deptId,
                        departmentName: allDepartments.find(d => d.id === deptId)?.name || 'Unknown',
                      })));
                      
                      // Show alert with summary
                      alert(
                        `📊 DEBUG INFO:\n\n` +
                        `Total Areas: ${allAreas.length}\n` +
                        `- Provinces: ${allAreas.filter(a => a.level === 'province').length}\n` +
                        `- Wards: ${allAreas.filter(a => a.level === 'ward').length}\n\n` +
                        `Parent Dept Areas: ${parentDepartmentAreas.length}\n` +
                        `Assigned Areas: ${assignedAreas.size}\n\n` +
                        `Check Console (F12) for detailed table view!`
                      );
                    }}
                    style={{
                      marginLeft: '8px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    🐛 Debug
                  </button>
                </label>
                
                {/* Debug Info */}
                {allAreas.length === 0 && (
                  <div 
                    style={{ 
                      padding: '12px', 
                      background: '#fef3c7', 
                      border: '1px solid #fbbf24',
                      borderRadius: '6px',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}
                  >
                    ⚠️ Không có dữ liệu địa bàn được trả về từ Supabase.
                    <br />
                    <strong>Có thể do:</strong>
                    <ul style={{ marginTop: '8px', marginBottom: '8px', paddingLeft: '20px' }}>
                      <li>Bảng <code>areas</code> chưa có dữ liệu</li>
                      <li>Row Level Security (RLS) đang chặn query</li>
                      <li>Người dùng hiện tại không có quyền đọc</li>
                    </ul>
                    <strong>Giải pháp:</strong>
                    <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      <li>Mở Console (F12) và kiểm tra logs</li>
                      <li>Chạy file SQL: <code>/SUPABASE_RLS_AREAS_POLICY.sql</code></li>
                      <li>Thêm dữ liệu vào bảng "Cơ sở & Địa bàn"</li>
                    </ol>
                  </div>
                )}
                
                {/* Selected Area Tags */}
                {selectedAreas.length > 0 && (
                  <div className={styles.selectedAreaTags}>
                    {selectedAreas.map((areaId) => {
                      const area = allAreas.find((a) => a.id === areaId);
                      if (!area) return null;
                      return (
                        <div key={areaId} className={styles.areaTag}>
                          <MapPin size={12} />
                          {area.name}
                          <button
                            type="button"
                            onClick={() => setSelectedAreas(selectedAreas.filter((id) => id !== areaId))}
                            disabled={isViewMode}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Search Input & Dropdown */}
                <div className={styles.areaSelectContainer}>
                  <div style={{ position: 'relative' }}>
                    <Search 
                      size={16} 
                      style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: 'var(--muted-foreground)' 
                      }} 
                    />
                    <input
                      type="text"
                      className={styles.areaSearchInput}
                      style={{ paddingLeft: '40px' }}
                      placeholder={allAreas.length > 0 ? "Tìm kiếm địa bàn..." : "Chưa có dữ liệu địa bàn"}
                      value={areaSearchQuery}
                      onChange={(e) => {
                        setAreaSearchQuery(e.target.value);
                      }}
                      onFocus={() => {
                        setShowAreaDropdown(true);
                      }}
                      onBlur={() => setTimeout(() => setShowAreaDropdown(false), 200)}
                      disabled={isViewMode || allAreas.length === 0}
                    />
                  </div>
                  
                  {showAreaDropdown && !isViewMode && allAreas.length > 0 && (
                    <div className={styles.areaDropdown}>
                      {(() => {
                        // ✅ Business Logic: Filter areas based on department level
                        const getAvailableAreas = () => {
                          // Level 1 (Cục): No area restrictions
                          if (formData.level === 1) {
                            return allAreas;
                          }
                          
                          // Level 2 (Chi cục): Only show province-level areas + filter out areas assigned to other Chi cục
                          if (formData.level === 2) {
                            return allAreas.filter((area) => {
                              // ✅ RULE 1: Chi cục chỉ được chọn địa bàn có level = "province"
                              if (area.level !== 'province') {
                                return false;
                              }
                              
                              const assignedDeptId = assignedAreas.get(area.id);
                              
                              // ✅ RULE 2: Area is available if:
                              // 1. Not assigned to any department, OR
                              // 2. Already assigned to THIS department (can keep it)
                              if (!assignedDeptId || assignedDeptId === department?.id) {
                                return true;
                              }
                              
                              // Check if assigned to another department
                              const assignedDept = allDepartments.find((d) => d.id === assignedDeptId);
                              
                              // ⚠️ RULE 3: If assigned department is also level 2 (Chi cục) and is different → HIDE
                              if (assignedDept && assignedDept.level === 2 && assignedDept.id !== department?.id) {
                                return false;
                              }
                              
                              return true;
                            });
                          }
                          
                          // Level 3 (Đội): Only show ward-level areas, no duplicates between teams
                          if (formData.level === 3) {
                            console.log({
                              totalAreas: allAreas.length,
                              totalWards: allAreas.filter(a => a.level === 'ward').length,
                              assignedAreasCount: assignedAreas.size,
                            });
                            
                            return allAreas.filter((area) => {
                              // ✅ RULE 1: Đội chỉ được chọn địa bàn có level = "ward"
                              if (area.level !== 'ward') {
                                return false;
                              }
                              
                              // ✅ RULE 2: Check if already assigned to another Đội
                              const assignedDeptId = assignedAreas.get(area.id);
                              
                              // Area is available if:
                              // 1. Not assigned to any department, OR
                              // 2. Already assigned to THIS department (can keep its own areas)
                              if (!assignedDeptId || assignedDeptId === department?.id) {
                                return true;
                              }
                              
                              // Check if assigned to another Đội
                              const assignedDept = allDepartments.find((d) => d.id === assignedDeptId);
                              
                              // ⚠️ RULE 3: If assigned to ANY Đội (level 3) → HIDE
                              // Exception: if it's THIS department (can keep its own areas)
                              if (assignedDept && assignedDept.level === 3 && assignedDept.id !== department?.id) {
                                return false;
                              }
                              
                              return true;
                            });
                          }
                          
                          return allAreas;
                        };
                        
                        const availableAreas = getAvailableAreas();
                        
                        const filtered = availableAreas.filter((area) =>
                          area.name.toLowerCase().includes(areaSearchQuery.toLowerCase()) ||
                          area.code.toLowerCase().includes(areaSearchQuery.toLowerCase())
                        );
                        
                        console.log({
                          level: formData.level,
                          totalAreas: allAreas.length,
                          availableAreas: availableAreas.length,
                          filteredBySearch: filtered.length,
                          parentDepartmentAreasCount: parentDepartmentAreas.length,
                          assignedAreasCount: assignedAreas.size,
                        });
                        
                        // ✅ Special message for level 3 with no parent
                        if (formData.level === 3 && !formData.parent_id) {
                          return (
                            <div style={{ 
                              padding: '16px', 
                              textAlign: 'center', 
                              color: '#ef4444',
                              background: '#fee2e2',
                              borderRadius: '6px',
                              margin: '8px',
                            }}>
                              <strong>⚠️ Vui lòng chọn đơn vị cha (Chi cục) trước</strong>
                              <br />
                              <small style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                                Đi chỉ có thể quản lý địa bàn mà Chi cục cha đã được phân công.
                              </small>
                            </div>
                          );
                        }
                        
                        // ✅ Special message for level 3 with parent but parent has no areas
                        if (formData.level === 3 && formData.parent_id && parentDepartmentAreas.length === 0) {
                          const parentDept = allDepartments.find((d) => d.id === formData.parent_id);
                          return (
                            <div style={{ 
                              padding: '16px', 
                              textAlign: 'center', 
                              color: '#f59e0b',
                              background: '#fef3c7',
                              borderRadius: '6px',
                              margin: '8px',
                            }}>
                              <strong>⚠️ Chi cục cha chưa có địa bàn nào</strong>
                              <br />
                              <small style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                                Đơn vị cha "{parentDept?.name}" chưa được phân công địa bàn nào.
                                <br />
                                Vui lòng phân công địa bàn cho Chi cục cha trước.
                              </small>
                            </div>
                          );
                        }
                        
                        if (filtered.length === 0) {
                          if (formData.level === 2 && availableAreas.length === 0) {
                            return (
                              <div style={{ 
                                padding: '16px', 
                                textAlign: 'center', 
                                color: '#f59e0b',
                                background: '#fef3c7',
                                borderRadius: '6px',
                                margin: '8px',
                              }}>
                                <strong>⚠️ Tất cả địa bàn đã được phân công cho các Chi cục khác</strong>
                                <br />
                                <small style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                                  Mỗi địa bàn chỉ có thể thuộc về 1 Chi cục duy nhất.
                                </small>
                              </div>
                            );
                          }
                          
                          if (formData.level === 3 && availableAreas.length === 0) {
                            return (
                              <div style={{ 
                                padding: '16px', 
                                textAlign: 'center', 
                                color: '#f59e0b',
                                background: '#fef3c7',
                                borderRadius: '6px',
                                margin: '8px',
                              }}>
                                <strong>⚠️ Tất cả địa bàn của Chi cục cha đã được phân công cho các Đội khác</strong>
                                <br />
                                <small style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                                  Đội chỉ có thể quản lý địa bàn chưa được phân công cho Đội khác.
                                </small>
                              </div>
                            );
                          }
                          
                          return (
                            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                              Không tìm thấy địa bàn phù hợp với "{areaSearchQuery}"
                            </div>
                          );
                        }
                        
                        return filtered.map((area) => {
                          // ✅ Check if area is already assigned to another department
                          const assignedDeptId = assignedAreas.get(area.id);
                          const isAssignedToOther = assignedDeptId && assignedDeptId !== department?.id;
                          const assignedDept = isAssignedToOther ? allDepartments.find((d) => d.id === assignedDeptId) : null;
                          
                          return (
                            <div
                              key={area.id}
                              className={styles.areaOption}
                              onClick={() => {
                                if (selectedAreas.includes(area.id)) {
                                  setSelectedAreas(selectedAreas.filter((id) => id !== area.id));
                                } else {
                                  setSelectedAreas([...selectedAreas, area.id]);
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedAreas.includes(area.id)}
                                readOnly
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500 }}>{area.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                  {area.code} • {area.level}
                                  {isAssignedToOther && assignedDept && (
                                    <span style={{ 
                                      marginLeft: '8px', 
                                      color: '#f59e0b',
                                      fontWeight: 500,
                                    }}>
                                      • Đã phân công cho: {assignedDept.name} ({assignedDept.code})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
                
                <small style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>
                  {selectedAreas.length > 0 
                    ? `Đã chọn ${selectedAreas.length} địa bàn` 
                    : allAreas.length > 0 
                      ? formData.level === 2 
                        ? '⚠️ Chi cục chỉ được chọn địa bàn cấp tỉnh (province). Mỗi địa bàn chỉ thu��c 1 Chi cục duy nhất.'
                        : formData.level === 3
                          ? '⚠️ Đội chỉ được chọn địa bàn cấp phường/xã (ward). Mỗi địa bàn chỉ thuộc 1 Đội duy nhất.'
                          : 'Chọn các địa bàn mà đơn vị này quản lý'
                      : 'Vui lòng thêm địa bàn vào hệ thống trước'}
                </small>
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnSecondary}
              disabled={loading}
            >
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Building2 size={16} />
                    {mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;