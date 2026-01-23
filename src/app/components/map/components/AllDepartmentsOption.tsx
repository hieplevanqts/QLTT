import { Check, Users } from 'lucide-react';
import teamStyles from '../OfficerFilterPanel.module.css';

interface AllDepartmentsOptionProps {
  isSelected: boolean;
  departmentCount: number;
  onSelect: () => void;
}

export function AllDepartmentsOption({ isSelected, departmentCount, onSelect }: AllDepartmentsOptionProps) {
  return (
    <div
      onClick={onSelect}
      className={`${teamStyles.departmentItem} ${isSelected ? teamStyles.departmentItemSelected : ''}`}
    >
      <div className={`${teamStyles.checkbox} ${isSelected ? teamStyles.checkboxSelected : ''}`}>
        {isSelected && (
          <Check size={12} color="white" strokeWidth={3} />
        )}
      </div>
      <Users 
        size={18} 
        className={`${teamStyles.icon} ${isSelected ? teamStyles.iconSelected : teamStyles.iconDefault}`}
      />
      <div className={teamStyles.departmentContent}>
        <div className={`${teamStyles.departmentTitle} ${isSelected ? teamStyles.departmentTitleSelected : ''}`}>
          Tất cả các phòng ban
        </div>
        <div className={teamStyles.departmentSubtitle}>
          {departmentCount} phòng ban
        </div>
      </div>
    </div>
  );
}
