import { Check, Users } from 'lucide-react';
import { OfficerDepartment } from '../../../../utils/api/officerFilterApi';
import teamStyles from '../OfficerFilterPanel.module.css';

interface DepartmentItemProps {
  department: OfficerDepartment;
  isSelected: boolean;
  onSelect: (departmentId: string) => void;
}

export function DepartmentItem({ department, isSelected, onSelect }: DepartmentItemProps) {
  return (
    <div
      onClick={() => onSelect(department._id)}
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
        <div className={`${teamStyles.departmentName} ${isSelected ? teamStyles.departmentNameSelected : ''}`}>
          {department.name || 'Không có tên'}
        </div>
      </div>
    </div>
  );
}
