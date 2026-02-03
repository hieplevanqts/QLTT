import React, { useEffect, useMemo, useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useQLTTScope } from '@/contexts/QLTTScopeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setScope } from '@/store/slices/qlttScopeSlice';
import styles from './ScopeSelector.module.css';
import { RootState } from '@/store/rootReducer';
import { fetchDepartmentById, fetchDepartmentByPath } from '@/utils/api/departmentsApi';

export function ScopeSelector() {
  const {
    scope,
    setScope: setContextScope,
    availableDivisions,
    isLoading,
    locks,
  } = useQLTTScope();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  // Local State
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [arrayDepartment, setArrayDepartment] = useState<any[]>([]);
  const [departmentDetail, setDepartmentDetail] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  /**
   * Logic khởi tạo phân cấp dựa trên department_id của user
   */
  useEffect(() => {
    const initHierarchy = async () => {
      if (!user?.department_id) return;
      setIsInitializing(true);

      try {
        // 1. Lấy thông tin chi tiết phòng ban của user
        const currentDept = await fetchDepartmentById(user.department_id);
        if (!currentDept) return;
        setDepartmentDetail(currentDept);

        // 2. Kiểm tra xem có đơn vị cấp con hay không
        const childrenResult = await fetchDepartmentByPath(currentDept.path || '');
        const children = childrenResult?.data || [];

        let finalDivisionId = '';
        let finalTeamId = '';
        let teamList: any[] = [];

        if (children.length > 0) {
          // TRƯỜNG HỢP 1: User thuộc cấp CỤC (có đơn vị con)
          finalDivisionId = currentDept._id;
          teamList = children; // Danh sách đội là các con
          finalTeamId = scope.teamId || ''; // Giữ nguyên team đang chọn nếu có
        } else if (currentDept.parent_id) {
          // TRƯỜNG HỢP 2: User thuộc cấp ĐỘI (không có con, tìm cấp cha)
          const parentDept = await fetchDepartmentById(currentDept.parent_id);
          if (parentDept) {
            finalDivisionId = parentDept._id;
            // Lấy danh sách các đơn vị cùng cấp với user (anh em)
            const siblingsResult = await fetchDepartmentByPath(parentDept.path || '');
            teamList = siblingsResult?.data || [];
            finalTeamId = currentDept._id; // Active chính đội của user
          }
        }

        // 3. Cập nhật State và Store
        setSelectedDivision(finalDivisionId);
        setSelectedTeam(finalTeamId);
        setArrayDepartment(teamList);

        const newScope = {
          ...scope,
          divisionId: finalDivisionId,
          teamId: finalTeamId || null,
        };

        setContextScope(newScope);
        dispatch(setScope(newScope));

      } catch (error) {
        console.error('Error initializing ScopeSelector:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initHierarchy();
  }, [user?.department_id]);

  // Sync local state khi context scope thay đổi từ bên ngoài
  useEffect(() => {
    if (scope.divisionId) setSelectedDivision(scope.divisionId);
    if (scope.teamId) setSelectedTeam(scope.teamId);
  }, [scope.divisionId, scope.teamId]);

  // Xử lý thay đổi Chi cục (Select 1)
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divisionId = e.target.value || null;
    setSelectedDivision(divisionId || '');
    setSelectedTeam('');

    const newScope = { ...scope, divisionId, teamId: null, areaId: null };
    setContextScope(newScope);
    dispatch(setScope(newScope));
  };

  // Xử lý thay đổi Đội (Select 2)
  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = e.target.value || null;
    setSelectedTeam(teamId || '');

    const newScope = { ...scope, teamId, areaId: null };
    setContextScope(newScope);
    dispatch(setScope(newScope));
  };

  /**
   * Điều kiện Disable:
   * 1. Khóa Chi cục nếu user đã được định danh vào một đơn vị cụ thể.
   * 2. Khóa Đội nếu user thuộc cấp Đội (không có quyền xem đội khác) - tùy chỉnh theo nghiệp vụ.
   */
  const isDisabledDivision = isLoading || isInitializing || !!user?.department_id;
  const isDisabledTeam = isLoading || isInitializing || (arrayDepartment.length === 0);

  return (
    <div 
      className={styles.scopeSelector} 
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.selectWrapper}>
        <MapPin className={styles.selectIcon} size={16} />
        
        {/* Select 1: Chi cục / Cục */}
        <select
          value={selectedDivision}
          onChange={handleDivisionChange}
          className={styles.select}
          disabled={isDisabledDivision}
        >
          <option value="">Chọn đơn vị</option>
          {availableDivisions.map((div) => (
            <option key={div.id} value={div.id}>
              {div.name}
            </option>
          ))}
        </select>
        
        {/* Select 2: Đội QLTT */}
        <select
          value={selectedTeam}
          onChange={handleTeamChange}
          className={styles.select}
          disabled={isDisabledTeam}
        >
          <option value="">Tất cả các đội</option>
          {arrayDepartment.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}