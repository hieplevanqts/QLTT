import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { X, Building2, MapPin, Users, FileText, AlertCircle, DollarSign, MessageSquare, GraduationCap, BarChart3, Phone, Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import type { RootState } from '@/store/store';
import { fetchDepartmentById } from '@/utils/api/departmentsApi';
import { DepartmentAreasResponse, getUsersByDepartment, getDepartmentsByWard, DepartmentUser, DepartmentByWard } from '@/utils/api/departmentAreasApi';
import { fetchDepartmentAreas } from '@/utils/api/departmentAreasApi';
import { generateFakeData } from './utils/departmentDetailUtils';
import { DepartmentMetricCard } from './components/DepartmentMetricCard';
import { DepartmentOfficersList } from './components/DepartmentOfficersList';
import styles from './DepartmentDetailModal.module.css';

interface DepartmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  departmentData?: any; // Optional initial data from map
}

export function DepartmentDetailModal({ isOpen, onClose, departmentId, departmentData }: DepartmentDetailModalProps) {
  // Redux State - Get user and department info
  const { user, department: authDepartment } = useAppSelector((state: RootState) => state.auth);
  const userDepartmentId = authDepartment?.id;
  
  const [department, setDepartment] = useState<any>(null);
  const [areas, setAreas] = useState<DepartmentAreasResponse | null>(null);
  const [users, setUsers] = useState<DepartmentUser[]>([]);
  const [departmentsByWard, setDepartmentsByWard] = useState<Map<string, DepartmentByWard[]>>(new Map());
  const [usersByDepartment, setUsersByDepartment] = useState<Map<string, DepartmentUser[]>>(new Map()); // 🔥 NEW: Store users by department_id
  const [usersUpdateTrigger, setUsersUpdateTrigger] = useState(0); // 🔥 NEW: Trigger to force re-render when users update
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingDepartmentUsers, setIsLoadingDepartmentUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !departmentId) return;

    // 🔥 FIX: Reset states when departmentId changes to ensure fresh data
    setDepartment(null);
    setAreas(null);
    setDepartmentsByWard(new Map());
    setUsersByDepartment(new Map());
    setError(null);

    async function loadDepartmentData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch department details
        const dept = await fetchDepartmentById(departmentId);
        setDepartment(dept);

        // 🔥 FIX: Only fetch areas if departmentData is not available
        // departmentData from map already has correct ward_id, so we should use it
        if (!departmentData || !departmentData.areas || departmentData.areas.length === 0) {
          // Fetch department areas only if we don't have data from map
          const areasData = await fetchDepartmentAreas(departmentId);
          // 🔥 FIX: Only set areas if it has valid ward_ids
          if (areasData && areasData.areas && areasData.areas.some(a => a.ward_id)) {
            setAreas(areasData);
          }
        }
      } catch (err: any) {
        console.error('❌ Error loading department data:', err);
        setError(err?.message || 'Không thể tải dữ liệu phòng ban');
      } finally {
        setIsLoading(false);
      }
    }

    loadDepartmentData();
  }, [isOpen, departmentId, departmentData]);

  // 🔥 NEW: Fetch users by department when modal opens or departmentId changes
  useEffect(() => {
    if (!isOpen || !departmentId) {
      setUsers([]);
      setIsLoadingUsers(false);
      return;
    }

    // 🔥 FIX: Reset users immediately when departmentId changes to show loading state
    setUsers([]);
    setIsLoadingUsers(true);

    async function loadUsers() {
      try {
        console.log('🔄 DepartmentDetailModal: Fetching users for department:', departmentId);
        const departmentUsers = await getUsersByDepartment(departmentId);
        console.log('✅ DepartmentDetailModal: Loaded', departmentUsers.length, 'users for department', departmentId);
        setUsers(departmentUsers);
      } catch (err: any) {
        console.error('❌ Error loading department users:', err);
        // Don't set error state, just log - users are optional
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    }

    loadUsers();
  }, [isOpen, departmentId]);

  // 🔥 NEW: Fetch users for each department from departmentsByWard
  // Use useCallback to avoid recreating function on every render
  // MUST be defined before useEffect that uses it
  const loadUsersForDepartments = useCallback(async (departmentIds: string[]) => {
    setIsLoadingDepartmentUsers(true);
    
    try {
      const usersMap = new Map<string, DepartmentUser[]>();
      
      // Call get_users_by_department for each department in parallel
      const userPromises = departmentIds.map(deptId => 
        getUsersByDepartment(deptId).then(users => ({ deptId, users }))
      );
      
      const userResults = await Promise.allSettled(userPromises);
      
      userResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { deptId, users } = result.value;
          if (users && users.length > 0) {
            usersMap.set(deptId, users);
            console.log(`✅ DepartmentDetailModal: Loaded ${users.length} users for department ${deptId}`);
          }
        } else {
          console.error(`❌ Error loading users for department:`, result.reason);
        }
      });
      
      console.log('📊 DepartmentDetailModal: Final usersByDepartment map:', {
        size: usersMap.size,
        entries: Array.from(usersMap.entries()).map(([deptId, users]) => ({
          deptId,
          usersCount: users.length
        }))
      });
      
      // 🔥 FIX: Create a new Map instance to ensure React detects the change and re-renders
      // React uses reference equality for state updates, so we need a new Map instance
      const newUsersMap = new Map(usersMap);
      console.log('🔄 DepartmentDetailModal: Updating usersByDepartment state', {
        oldSize: usersByDepartment.size,
        newSize: newUsersMap.size,
        willTriggerRerender: true
      });
      setUsersByDepartment(newUsersMap);
      // 🔥 FIX: Force re-render by updating trigger counter
      setUsersUpdateTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error('❌ Error loading users for departments:', err);
    } finally {
      setIsLoadingDepartmentUsers(false);
    }
  }, []);

  // 🔥 NEW: Fetch departments by ward when areas are loaded
  useEffect(() => {
    if (!isOpen) {
      return; // Don't clear, keep existing data
    }
    
    // 🔥 FIX: Only proceed if areas have valid ward_ids
    if (!areas || !areas.areas || areas.areas.length === 0) {
      console.log('⚠️ DepartmentDetailModal: No areas available for fetching departments');
      return; // Don't clear, keep existing data
    }

    // 🔥 FIX: Check if areas have valid ward_ids before proceeding
    const hasValidWardIds = areas.areas.some(a => a.ward_id && typeof a.ward_id === 'string' && a.ward_id.trim() !== '');
    if (!hasValidWardIds) {
      console.warn('⚠️ DepartmentDetailModal: Areas do not have valid ward_ids, skipping department fetch');
      return; // Don't clear, keep existing data
    }

    async function loadDepartmentsByWard() {
      setIsLoadingDepartments(true);
      
      try {
        // Extract unique ward_ids from areas
        console.log('🔍 DepartmentDetailModal: Areas data:', {
          hasAreas: !!areas,
          areasCount: areas?.areas?.length || 0,
          areasSample: areas?.areas?.slice(0, 2)
        });
        
        const allWardIds = areas.areas!
          .map(a => {
            const wardId = a.ward_id;
            console.log('🔍 DepartmentDetailModal: Area ward_id:', { wardId, type: typeof wardId, hasWardId: !!wardId });
            return wardId;
          });
        
        const uniqueWardIds = Array.from(new Set(
          allWardIds.filter((wardId): wardId is string => wardId && typeof wardId === 'string' && wardId.trim() !== '')
        ));
        
        console.log('🔍 DepartmentDetailModal: Extracted ward IDs:', {
          allWardIdsCount: allWardIds.length,
          uniqueWardIdsCount: uniqueWardIds.length,
          uniqueWardIds: uniqueWardIds
        });
        
        if (uniqueWardIds.length === 0) {
          console.warn('⚠️ DepartmentDetailModal: No valid ward IDs found in areas - skipping department fetch');
          setIsLoadingDepartments(false);
          return; // Don't clear, keep existing data
        }
        
        console.log('🔄 DepartmentDetailModal: Fetching departments for', uniqueWardIds.length, 'wards:', uniqueWardIds);
        
        // Call get_departments_by_ward for each ward in parallel
        const departmentPromises = uniqueWardIds.map(wardId => 
          getDepartmentsByWard(wardId).then(depts => ({ wardId, depts }))
        );
        
        const departmentResults = await Promise.allSettled(departmentPromises);
        
        const departmentsMap = new Map<string, DepartmentByWard[]>();
        
        departmentResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const { wardId, depts } = result.value;
            console.log(`📦 DepartmentDetailModal: Result for ward ${wardId}:`, {
              hasDepts: !!depts,
              deptsType: Array.isArray(depts) ? 'array' : typeof depts,
              deptsLength: Array.isArray(depts) ? depts.length : 'N/A',
              deptsSample: Array.isArray(depts) && depts.length > 0 ? depts[0] : null
            });
            
            if (depts && Array.isArray(depts) && depts.length > 0) {
              departmentsMap.set(wardId, depts);
              console.log(`✅ DepartmentDetailModal: Loaded ${depts.length} departments for ward ${wardId}`);
            } else {
              console.warn(`⚠️ DepartmentDetailModal: No departments found for ward ${wardId}`);
            }
          } else {
            console.error(`❌ Error loading departments for ward ${uniqueWardIds[index]}:`, result.reason);
          }
        });
        
        console.log('📊 DepartmentDetailModal: Final departmentsMap:', {
          size: departmentsMap.size,
          entries: Array.from(departmentsMap.entries()).map(([wardId, depts]) => ({
            wardId,
            deptsCount: depts.length,
            depts: depts.map(d => ({ id: d._id, name: d.name, code: d.code }))
          }))
        });
        
        // 🔥 FIX: Only update if we have valid data
        if (departmentsMap.size > 0) {
          setDepartmentsByWard(departmentsMap);
          
          // 🔥 NEW: Extract all department_ids and fetch users for each
          const allDepartmentIds = new Set<string>();
          departmentsMap.forEach((depts) => {
            depts.forEach(dept => {
              const deptId = (dept as any).department_id || dept._id;
              if (deptId && typeof deptId === 'string' && deptId.trim() !== '') {
                allDepartmentIds.add(deptId);
              }
            });
          });
          
          if (allDepartmentIds.size > 0) {
            console.log('🔄 DepartmentDetailModal: Fetching users for', allDepartmentIds.size, 'departments');
            loadUsersForDepartments(Array.from(allDepartmentIds));
          }
        } else {
          console.warn('⚠️ DepartmentDetailModal: No departments found for any ward');
        }
      } catch (err: any) {
        console.error('❌ Error loading departments by ward:', err);
        // Don't clear on error, keep existing data
      } finally {
        setIsLoadingDepartments(false);
      }
    }

    loadDepartmentsByWard();
  }, [isOpen, areas, loadUsersForDepartments]);

  // 🔥 FIX: Use initial data from map if available (has correct ward_id)
  // This should run FIRST to set areas before other effects
  useEffect(() => {
    if (departmentData && departmentData.areas && departmentData.areas.length > 0) {
      console.log('🔍 DepartmentDetailModal: Using departmentData from map:', {
        areasCount: departmentData.areas.length,
        sample: departmentData.areas[0]
      });
      
      if (!department) {
        setDepartment({ name: departmentData.departmentId, _id: departmentId });
      }
      
      // 🔥 FIX: Transform departmentData to areas format with proper ward_id
      const transformedAreas = {
        areas: departmentData.areas.map((a: any) => ({
          province_id: a.provinceId || '',
          ward_id: a.wardId || null, // 🔥 IMPORTANT: Keep ward_id from map data
          wards_with_coordinates: a.coordinates ? {
            center_lat: a.coordinates.center?.[0] || null,
            center_lng: a.coordinates.center?.[1] || null,
            bounds: a.coordinates.bounds || null,
            area: a.coordinates.area || null,
            officer: a.coordinates.officer || null,
          } : null
        })).filter((a: any) => a.ward_id !== null && a.ward_id !== undefined) // 🔥 Filter out areas without ward_id
      };
      
      console.log('✅ DepartmentDetailModal: Transformed areas from departmentData:', {
        originalCount: departmentData.areas.length,
        transformedCount: transformedAreas.areas.length,
        sample: transformedAreas.areas[0]
      });
      
      // 🔥 FIX: Only set areas if we have valid ward_ids, and don't override if already set with valid data
      if (transformedAreas.areas.length > 0) {
        setAreas(transformedAreas);
      }
    }
  }, [departmentData, departmentId]);

  // Generate fake data if needed - MUST be before early return
  const fakeData = useMemo(() => generateFakeData(departmentId), [departmentId]);
  
  // 🔥 NEW: Collect all departments from departmentsByWard for header display
  // MUST be before early return to follow hooks rules
  const allDepartmentsByWard = useMemo(() => {
    const deptsList: Array<{ wardId: string; departments: DepartmentByWard[] }> = [];
    departmentsByWard.forEach((depts, wardId) => {
      if (depts && depts.length > 0) {
        deptsList.push({ wardId, departments: depts });
      }
    });
    return deptsList;
  }, [departmentsByWard]);
  
  // 🔥 NEW: Get all unique department names for header
  // MUST be before early return to follow hooks rules
  const departmentNamesForHeader = useMemo(() => {
    const names: string[] = [];
    departmentsByWard.forEach((depts) => {
      depts.forEach(dept => {
        // 🔥 FIX: API returns department_name, not name
        const name = (dept as any).department_name || dept.name || dept.code || '';
        if (name && typeof name === 'string' && name.trim() !== '' && !names.includes(name)) {
          names.push(name);
        }
      });
    });
    console.log('🔍 DepartmentDetailModal: Department names for header:', names);
    return names;
  }, [departmentsByWard]);

  if (!isOpen) return null;
  
  // Calculate statistics from real data
  const totalAreas = areas?.areas?.length || 0;
  const areasWithCoordinates = areas?.areas?.filter(a => a.wards_with_coordinates?.center_lat && a.wards_with_coordinates?.center_lng).length || 0;
  const realOfficers = areas?.areas
    ?.map(a => a.wards_with_coordinates?.officer)
    .filter((o): o is string => o !== null && o !== undefined && o !== '') || [];
  const uniqueRealOfficers = Array.from(new Set(realOfficers));
  
  // 🔥 NEW: Use users from API if available, otherwise use officers from areas, fallback to fake data
  const displayOfficers = users.length > 0
    ? users.map(user => ({ 
        name: user.full_name || user.email || 'Cán bộ', 
        isReal: true, 
        details: user,
        email: user.email,
        phone: user.phone
      }))
    : uniqueRealOfficers.length > 0 
      ? uniqueRealOfficers.map(name => ({ name, isReal: true }))
      : fakeData.officers.map(o => ({ name: o.fullName, isReal: false, details: o }));
  const totalOfficers = displayOfficers.length;
  
  // Use fake statistics if real data is insufficient
  const hasRealStats = totalAreas > 0 || uniqueRealOfficers.length > 0;
  const stats = hasRealStats ? null : fakeData.statistics;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  // Handle modal content click - prevent closing
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle close button click
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={handleBackdropClick} />

      {/* Modal - Compact Layout */}
      <div className={styles.modal} onClick={handleModalClick}>
        {/* Compact Header */}
        <div className={styles.header}>
          {/* Close Button - Fixed */}
          <button
            type="button"
            onClick={handleCloseClick}
            className={styles.closeButton}
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div className={styles.headerContent}>
            {/* Smaller Avatar */}
            <div className={styles.avatar}>
              <Building2 size={35} color="white" strokeWidth={1.5} />
            </div>

            {/* Department Info - Inline */}
            <div className={styles.departmentInfo}>
              <h2 className={styles.departmentTitle}>
                {isLoading ? 'Đang tải...' : (department?.name || 'Phòng ban')}
              </h2>
              
              <div className={styles.departmentSubtitle}>
                {department?.parent_id ? 'Phòng ban trực thuộc' : 'Phòng ban chính'}
              </div>
              
              {/* 🔥 NEW: Display departments by ward in header */}
              {departmentNamesForHeader.length > 0 && (
                <div className={styles.departmentsByWardHeader}>
                  <Building2 size={12} />
                  <span className={styles.departmentsByWardText}>
                    {departmentNamesForHeader.length === 1 
                      ? departmentNamesForHeader[0]
                      : `${departmentNamesForHeader.length} phòng ban: ${departmentNamesForHeader.slice(0, 2).join(', ')}${departmentNamesForHeader.length > 2 ? '...' : ''}`
                    }
                  </span>
                </div>
              )}
              
              <div className={styles.departmentMeta}>
                <MapPin size={12} />
                {totalAreas} khu vực phụ trách • {totalOfficers} cán bộ
              </div>
            </div>

            {/* Quick Stats - Inline */}
            <div className={styles.quickStats}>
              <div className={styles.statBadge}>
                <div className={styles.statValue}>
                  {totalAreas}
                </div>
                <div className={styles.statLabel}>
                  Khu vực
                </div>
              </div>
              
              <div className={styles.statBadge}>
                <div className={styles.statValue}>
                  {totalOfficers}
                </div>
                <div className={styles.statLabel}>
                  Cán bộ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Compact & Scrollable */}
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingState}>
              Đang tải dữ liệu...
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              {error}
            </div>
          ) : (
            <>
              {/* Department Info - Side by Side */}
              <div className={styles.infoGrid}>
                {/* Department Details - Compact */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <Building2 size={16} color="var(--color-primary)" />
                    Thông tin
                  </h3>
                  
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <FileText size={16} color="var(--color-primary)" />
                      <span className={styles.infoItemText}>ID: {departmentId ? departmentId.substring(0, 8) : 'N/A'}...</span>
                    </div>

                    {department?.name && (
                      <div className={styles.infoItem}>
                        <Building2 size={16} color="var(--color-primary)" />
                        <span className={styles.infoItemText}>{department.name}</span>
                      </div>
                    )}
                    
                    {/* Contact Info - Fake if not available */}
                    <div className={styles.infoItem}>
                      <Phone size={16} color="var(--color-primary)" />
                      <span className={styles.infoItemText}>{fakeData.contact.phone}</span>
                    </div>
                    
                    <div className={`${styles.infoItem} ${styles.infoItemSmall}`}>
                      <Mail size={16} color="var(--color-primary)" />
                      <span className={styles.infoItemTextEllipsis}>
                        {fakeData.contact.email}
                      </span>
                    </div>
                    
                    <div className={styles.infoItemAddress}>
                      <MapPin size={16} color="var(--color-primary)" className={styles.infoItemAddressIcon} />
                      <span className={styles.infoItemText}>{fakeData.contact.address}</span>
                    </div>
                  </div>
                </div>

                {/* Managed Areas - Compact */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <MapPin size={16} color="var(--color-primary)" />
                    Địa bàn
                  </h3>
                  
                  <div className={styles.infoList}>
                    <div className={`${styles.infoItem} ${styles.infoItemSmall}`}>
                      <MapPin size={14} color="var(--color-primary)" />
                      <span className={styles.infoItemText}>{totalAreas} khu vực phụ trách</span>
                    </div>
                    <div className={`${styles.infoItem} ${styles.infoItemSmall}`}>
                      <Users size={14} color="var(--color-primary)" />
                      <span className={styles.infoItemText}>{totalOfficers} cán bộ phụ trách</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Officers List */}
              <DepartmentOfficersList 
                displayOfficers={displayOfficers}
                isLoadingUsers={isLoadingUsers}
              />

              {/* Departments by Ward */}
              {(() => {
                console.log('🔍 DepartmentDetailModal: Rendering departments section', {
                  departmentsByWardSize: departmentsByWard.size,
                  isLoadingDepartments,
                  shouldShow: departmentsByWard.size > 0 || isLoadingDepartments,
                  entries: Array.from(departmentsByWard.entries()).map(([wardId, depts]) => ({
                    wardId,
                    deptsCount: depts?.length || 0
                  }))
                });
                
                return (departmentsByWard.size > 0 || isLoadingDepartments) ? (
                  <div className={styles.officersSection}>
                    <h3 className={styles.sectionTitle}>
                      <Building2 size={16} color="var(--color-primary)" />
                      Phòng ban quản lý theo địa bàn ({isLoadingDepartments ? '...' : departmentsByWard.size} khu vực)
                      {isLoadingDepartmentUsers && (
                        <span style={{ fontSize: '12px', marginLeft: '8px', opacity: 0.7 }}>
                          (Đang tải cán bộ...)
                        </span>
                      )}
                    </h3>
                    
                    {isLoadingDepartments ? (
                      <div className={styles.loadingState}>
                        Đang tải thông tin phòng ban...
                      </div>
                    ) : departmentsByWard.size === 0 ? (
                      <div className={styles.loadingState}>
                        Không có phòng ban nào quản lý các khu vực này
                      </div>
                    ) : (
                      <div className={styles.officersList}>
                        {Array.from(departmentsByWard.entries()).map(([wardId, depts]) => {
                          console.log('🔍 DepartmentDetailModal: Rendering ward', wardId, 'with', depts?.length || 0, 'departments');
                        // Find ward name from areas if available
                        const wardArea = areas?.areas?.find(a => a.ward_id === wardId);
                        const wardName = wardArea?.ward_id || (wardId ? `Ward ${wardId.substring(0, 8)}...` : 'Unknown Ward');
                        
                        return (
                          <div key={wardId || 'unknown'} className={styles.wardDepartmentGroup}>
                            <div className={styles.wardHeader}>
                              <MapPin size={14} color="var(--color-primary)" />
                              <span className={styles.wardName}>{wardName}</span>
                              <span className={styles.wardDeptCount}>({depts?.length || 0} phòng ban)</span>
                            </div>
                            <div className={styles.departmentsList}>
                              {(depts || []).map((dept) => {
                                // 🔥 FIX: API returns department_id, not _id
                                const deptId = (dept as any).department_id || dept?._id || 'unknown';
                                // 🔥 FIX: API returns department_name, not name
                                const deptName = (dept as any).department_name || dept?.name || (dept as any).department_code || dept?.code || (deptId && typeof deptId === 'string' ? deptId.substring(0, 8) : 'N/A');
                                
                                // 🔥 NEW: Get users for this department
                                const deptUsers = usersByDepartment.get(deptId) || [];
                                
                                return (
                                  <div key={deptId} className={styles.departmentItem}>
                                    <div className={styles.departmentItemMain}>
                                      <Building2 size={12} color="var(--color-primary)" />
                                      <span className={styles.departmentName}>
                                        {deptName}
                                      </span>
                                      {dept?.type && (
                                        <span className={styles.departmentType}>
                                          ({dept.type})
                                        </span>
                                      )}
                                      {deptUsers.length > 0 && (
                                        <span className={styles.departmentUserCount}>
                                          • {deptUsers.length} cán bộ
                                        </span>
                                      )}
                                    </div>
                                    {/* 🔥 NEW: Display users for this department */}
                                    {deptUsers.length > 0 && (
                                      <div className={styles.departmentUsersList}>
                                        {deptUsers.slice(0, 3).map((user, idx) => (
                                          <div key={user._id || idx} className={styles.departmentUserItem}>
                                            <Users size={10} color="var(--color-primary)" />
                                            <span className={styles.departmentUserName}>
                                              {user.full_name || user.email || 'Cán bộ'}
                                            </span>
                                          </div>
                                        ))}
                                        {deptUsers.length > 3 && (
                                          <div className={styles.departmentUserMore}>
                                            +{deptUsers.length - 3} cán bộ khác
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      </div>
                    )
                  }
                </div>
                ) : null;
              })()}

              {/* Performance Metrics - Compact Grid */}
              <div>
                <h3 className={styles.sectionTitle}>
                  <BarChart3 size={16} color="var(--color-primary)" />
                  {hasRealStats ? 'Thống kê địa bàn' : 'Kết quả công tác năm 2024'}
                </h3>

                <div className={styles.metricsGrid}>
                  {/* Metric Card 1 - Total Areas or Inspections */}
                  <DepartmentMetricCard
                    icon={hasRealStats ? MapPin : FileText}
                    value={hasRealStats ? totalAreas : (stats?.totalInspections || 0)}
                    label={hasRealStats ? 'Tổng khu vực' : 'Lần kiểm tra'}
                    variant="blue"
                  />

                  {/* Metric Card 2 - Areas with Coordinates or Violations */}
                  <DepartmentMetricCard
                    icon={hasRealStats ? MapPin : AlertCircle}
                    value={hasRealStats ? areasWithCoordinates : (stats?.totalViolations || 0)}
                    label={hasRealStats ? 'Có tọa độ' : 'Vi phạm'}
                    variant="red"
                  />

                  {/* Metric Card 3 - Officers or Fines */}
                  <DepartmentMetricCard
                    icon={hasRealStats ? Users : FileText}
                    value={hasRealStats ? totalOfficers : (stats?.totalFines || 0)}
                    label={hasRealStats ? 'Cán bộ' : 'Xử phạt'}
                    variant={hasRealStats ? 'purple' : 'yellow'}
                  />
                  
                  {/* Additional fake stats cards */}
                  {!hasRealStats && stats && (
                    <>
                      {/* Metric Card 4 - Fine Amount */}
                      <DepartmentMetricCard
                        icon={DollarSign}
                        value={`${(stats.totalFineAmount / 1000000).toFixed(0)}M`}
                        label="Tiền phạt (VNĐ)"
                        variant="green"
                        valueSize="large"
                      />

                      {/* Metric Card 5 - Complaints */}
                      <DepartmentMetricCard
                        icon={MessageSquare}
                        value={stats.totalComplaints}
                        label="Khiếu nại"
                        variant="purple"
                      />

                      {/* Metric Card 6 - Education */}
                      <DepartmentMetricCard
                        icon={GraduationCap}
                        value={stats.totalEducation}
                        label="Tuyên truyền"
                        variant="orange"
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

