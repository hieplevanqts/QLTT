import { Search } from 'lucide-react';
import teamStyles from '../OfficerFilterPanel.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Tìm kiếm phòng ban...' }: SearchInputProps) {
  return (
    <div className={teamStyles.searchContainer}>
      <Search 
        size={16} 
        className={teamStyles.searchIcon}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={teamStyles.searchInput}
      />
    </div>
  );
}
