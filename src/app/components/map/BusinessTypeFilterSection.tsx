import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Minus, Store, Coffee, Utensils, Soup, UtensilsCrossed } from 'lucide-react';
import styles from './MapFilterPanel.module.css';
import { Category } from '../../../utils/api/categoriesApi';

type BusinessTypeFilter = { [key: string]: boolean };

interface BusinessTypeFilterSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  businessTypeFilters: BusinessTypeFilter;
  categories: Category[];
  onBusinessTypeFilterChange: (type: string) => void;
}

export const BusinessTypeFilterSection: React.FC<BusinessTypeFilterSectionProps> = ({
  isExpanded,
  onToggle,
  businessTypeFilters,
  categories,
  onBusinessTypeFilterChange,
}) => {
  const [categorySearchInput, setCategorySearchInput] = useState('');
  const [showCategoryAutocomplete, setShowCategoryAutocomplete] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Calculate businessTypeData
  const businessTypeIconMap: { [key: string]: { icon: typeof Store, color: string } } = {
    'Nhà hàng': { icon: UtensilsCrossed, color: '#6366f1' },
    'Quán cà phê': { icon: Coffee, color: '#ec4899' },
    'Quán ăn nhanh': { icon: Utensils, color: '#f97316' },
    'Quán phở': { icon: Soup, color: '#34d399' }
  };

  const businessTypeData = (categories || []).map(cat => {
    const categoryId = (cat as any)._id || cat.id;
    return {
      key: categoryId,
      label: cat.name,
      icon: businessTypeIconMap[cat.name]?.icon || Store,
      color: businessTypeIconMap[cat.name]?.color || '#9ca3af'
    };
  });

  // Sync selectedCategoryIds with businessTypeFilters
  useEffect(() => {
    const activeIds = Object.keys(businessTypeFilters || {}).filter(key => businessTypeFilters[key] === true);
    setSelectedCategoryIds(activeIds);
  }, [businessTypeFilters]);

  // Filter categories for autocomplete
  const filteredCategoriesForAutocomplete = categorySearchInput.trim()
    ? businessTypeData.filter(cat => 
        cat.label.toLowerCase().includes(categorySearchInput.toLowerCase()) &&
        !selectedCategoryIds.includes(cat.key)
      )
    : businessTypeData.filter(cat => !selectedCategoryIds.includes(cat.key));

  // Get selected category objects
  const selectedCategories = businessTypeData.filter(cat => {
    const isSelected = selectedCategoryIds.includes(cat.key);
    return isSelected && cat.key && cat.label;
  });

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    if (!selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
      onBusinessTypeFilterChange(categoryId);
    }
    setCategorySearchInput('');
    setShowCategoryAutocomplete(false);
  };

  // Handle category removal
  const handleCategoryRemove = (categoryId: string) => {
    setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    onBusinessTypeFilterChange(categoryId);
  };

  return (
    <div className={styles.filterSection}>
      <button className={styles.sectionHeader} onClick={onToggle}>
        <div className={styles.sectionTitle}>Loại hình kinh doanh</div>
        {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      <div className={`${styles.filterList} ${isExpanded ? styles.filterListExpanded : styles.filterListCollapsed}`}>
        <div className={styles.categoryAutocompleteWrapper}>
          <div className={styles.categoryInputWrapper}>
            <Search size={16} />
            <input
              type="text"
              value={categorySearchInput}
              onChange={(e) => {
                setCategorySearchInput(e.target.value);
                setShowCategoryAutocomplete(e.target.value.trim().length > 0);
              }}
              onFocus={() => {
                if (categorySearchInput.trim().length > 0) {
                  setShowCategoryAutocomplete(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowCategoryAutocomplete(false), 200);
              }}
              placeholder="Tìm kiếm danh mục..."
              className={styles.categorySearchInput}
            />
            {showCategoryAutocomplete && filteredCategoriesForAutocomplete.length > 0 && (
              <div className={styles.categoryAutocompleteDropdown}>
                {filteredCategoriesForAutocomplete.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    className={styles.categoryAutocompleteItem}
                    onClick={() => handleCategorySelect(key)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected categories as tags */}
          {selectedCategories && selectedCategories.length > 0 ? (
            <div className={styles.categoryTagsContainer}>
              {selectedCategories.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className={styles.categoryTag} style={{ borderColor: color }}>
                  <Icon size={14} style={{ color }} />
                  <span>{label}</span>
                  <button
                    type="button"
                    className={styles.categoryTagRemove}
                    onClick={() => handleCategoryRemove(key)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.categoryTagsEmpty}>
              <span>Chưa chọn danh mục nào</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

