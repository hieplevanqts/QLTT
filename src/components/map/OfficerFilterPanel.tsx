import { forwardRef, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import styles from './MapFilterPanel.module.css';
import teamStyles from './OfficerFilterPanel.module.css';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setSelectedDepartmentId } from '@/store/slices/officerFilterSlice';
import { useOfficerDepartments } from './hooks/useOfficerDepartments';
import { filterDepartmentsByQuery } from './utils/officerFilterUtils';
import { AllDepartmentsOption } from './components/AllDepartmentsOption';
import { DepartmentItem } from './components/DepartmentItem';
import { SearchInput } from './components/SearchInput';

interface OfficerFilterPanelProps {
  isOpen: boolean;
  selectedTeamId?: string;
  onClose: () => void;
  onTeamChange?: (teamId: string) => void;
}

export const OfficerFilterPanel = forwardRef<HTMLDivElement, OfficerFilterPanelProps>(
  ({ isOpen, selectedTeamId, onClose, onTeamChange }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useAppDispatch();
    
    // Use custom hook to manage departments fetching
    const { departments, isLoadingDepartments } = useOfficerDepartments(isOpen);

    // Filter departments based on search query
    const filteredDepartments = useMemo(() => {
      return filterDepartmentsByQuery(departments, searchQuery);
    }, [searchQuery, departments]);

    // Early return AFTER all hooks
    if (!isOpen) return null;

    const handleTeamSelect = (departmentId: string) => {
      // Update Redux store
      dispatch(setSelectedDepartmentId(departmentId));
      
      // Call parent callback if provided
      if (onTeamChange) {
        onTeamChange(departmentId);
      }
    };

    return (
      <div className={styles.panel} ref={ref}>
        <div className={styles.header}>
          <h3 className={styles.title}>Bộ lọc cán bộ quản lý</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.scrollableContent}>
          {/* Team Filter Section */}
          <div className={styles.filterSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Chọn đội</div>
            </div>
            
            {/* Search Box */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
            />
            
            {/* Loading State */}
            {isLoadingDepartments && (
              <div className={teamStyles.loadingState}>
                Đang tải danh sách phòng ban...
              </div>
            )}

            {/* Teams List */}
            <div className={`${teamStyles.teamsListScroll} ${teamStyles.teamsListContainer}`}>
              {/* All Departments Option */}
              <AllDepartmentsOption
                isSelected={selectedTeamId === ''}
                departmentCount={departments.length}
                onSelect={() => handleTeamSelect('')}
              />

              {/* Department List */}
              {!isLoadingDepartments && filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <DepartmentItem
                    key={dept._id}
                    department={dept}
                    isSelected={selectedTeamId === dept._id}
                    onSelect={handleTeamSelect}
                  />
                ))
              ) : !isLoadingDepartments ? (
                <div className={teamStyles.emptyState}>
                  Không tìm thấy phòng ban nào
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OfficerFilterPanel.displayName = 'OfficerFilterPanel';
