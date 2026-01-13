import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Lock, MapPin, Search, X } from 'lucide-react';
import { useQLTTScope } from '../../../contexts/QLTTScopeContext';
import styles from './ScopeSelector.module.css';

export function ScopeSelector() {
  const { scope, setScope, canChangeScope, availableProvinces, getScopeDisplayText } = useQLTTScope();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedProvinces, setExpandedProvinces] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Auto-expand the selected province
  useEffect(() => {
    if (scope.province && isOpen) {
      setExpandedProvinces(prev => new Set([...prev, scope.province!]));
    }
  }, [scope.province, isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-expand provinces when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      // Expand all provinces that have matching wards
      const matchingProvinces = availableProvinces
        .filter(province => 
          province.wards.some(ward => 
            ward.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
        .map(p => p.code);
      setExpandedProvinces(new Set(matchingProvinces));
    }
  }, [searchQuery, availableProvinces]);

  const handleToggleDropdown = () => {
    if (canChangeScope) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelectScope = (provinceCode: string | null, wardCode: string | null) => {
    setScope({
      province: provinceCode,
      ward: wardCode,
    });
    setIsOpen(false);
  };

  const toggleProvinceExpand = (provinceCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProvinces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(provinceCode)) {
        newSet.delete(provinceCode);
      } else {
        newSet.add(provinceCode);
      }
      return newSet;
    });
  };

  const displayText = getScopeDisplayText();
  const isLocked = !canChangeScope;

  // Filter provinces and wards based on search query
  const filteredProvinces = availableProvinces.map(province => {
    if (!searchQuery.trim()) {
      return province;
    }

    const query = searchQuery.toLowerCase();
    const provinceMatches = province.name.toLowerCase().includes(query);
    
    // Filter wards that match search
    const matchedWards = province.wards.filter(ward => 
      ward.name.toLowerCase().includes(query)
    );

    // Include province if its name matches OR if it has matching wards
    if (provinceMatches || matchedWards.length > 0) {
      return {
        ...province,
        wards: matchedWards,
        hasMatch: true,
      };
    }

    return null;
  }).filter(Boolean) as typeof availableProvinces;

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className={styles.highlight}>{part}</mark>
        : part
    );
  };

  return (
    <div className={styles.scopeSelector} ref={dropdownRef}>
      <button
        className={`${styles.trigger} ${isLocked ? styles.locked : ''}`}
        onClick={handleToggleDropdown}
        disabled={isLocked}
        aria-label="Chọn phạm vi giám sát"
      >
        <div className={styles.triggerContent}>
          <MapPin className={styles.triggerIcon} size={16} />
          <span className={styles.triggerText}>{displayText}</span>
        </div>
        {isLocked ? (
          <Lock className={styles.lockIcon} size={14} />
        ) : (
          <ChevronDown className={`${styles.chevron} ${isOpen ? styles.open : ''}`} size={16} />
        )}
      </button>

      {isOpen && canChangeScope && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <MapPin size={14} />
            <span>Chọn phạm vi</span>
          </div>

          <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            {searchQuery && (
              <button
                className={styles.clearButton}
                onClick={() => setSearchQuery('')}
                aria-label="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.menu}>
            {/* Toàn quốc option (only for cấp cục) */}
            {availableProvinces.length > 1 && !searchQuery && (
              <div
                className={`${styles.menuItem} ${!scope.province ? styles.selected : ''}`}
                onClick={() => handleSelectScope(null, null)}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemLabel}>Toàn quốc</span>
                  {!scope.province && <span className={styles.checkmark}>✓</span>}
                </div>
              </div>
            )}

            {/* No results message */}
            {filteredProvinces.length === 0 && searchQuery && (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <div className={styles.noResultsText}>
                  Không tìm thấy kết quả cho "{searchQuery}"
                </div>
                <div className={styles.noResultsHint}>
                  Thử tìm kiếm với từ khóa khác
                </div>
              </div>
            )}

            {/* Province list */}
            {filteredProvinces.map((province) => {
              const isExpanded = expandedProvinces.has(province.code);
              const isProvinceSelected = scope.province === province.code && !scope.ward;

              return (
                <div key={province.code} className={styles.provinceGroup}>
                  {/* Province header */}
                  <div
                    className={`${styles.menuItem} ${styles.provinceItem} ${isProvinceSelected ? styles.selected : ''}`}
                  >
                    <div
                      className={styles.itemContent}
                      onClick={() => handleSelectScope(province.code, null)}
                    >
                      <span className={styles.itemLabel}>{highlightMatch(province.name, searchQuery)}</span>
                      {isProvinceSelected && <span className={styles.checkmark}>✓</span>}
                    </div>
                    {province.wards.length > 0 && (
                      <button
                        className={styles.expandButton}
                        onClick={(e) => toggleProvinceExpand(province.code, e)}
                        aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                      >
                        <ChevronDown
                          size={14}
                          className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Ward list (when expanded) */}
                  {isExpanded && province.wards.length > 0 && (
                    <div className={styles.wardList}>
                      {/* "Tất cả xã/phường" option */}
                      <div
                        className={`${styles.menuItem} ${styles.wardItem} ${scope.province === province.code && !scope.ward ? styles.selected : ''}`}
                        onClick={() => handleSelectScope(province.code, null)}
                      >
                        <div className={styles.itemContent}>
                          <span className={styles.itemLabel}>Tất cả xã/phường</span>
                          {scope.province === province.code && !scope.ward && (
                            <span className={styles.checkmark}>✓</span>
                          )}
                        </div>
                      </div>

                      {/* Individual wards */}
                      {province.wards.map((ward) => {
                        const isWardSelected = scope.province === province.code && scope.ward === ward.code;
                        // Use fullName for complete address, fallback to name if not available
                        const wardDisplayName = ward.fullName || ward.name;

                        return (
                          <div
                            key={ward.code}
                            className={`${styles.menuItem} ${styles.wardItem} ${isWardSelected ? styles.selected : ''}`}
                            onClick={() => handleSelectScope(province.code, ward.code)}
                          >
                            <div className={styles.itemContent}>
                              <span className={styles.itemLabel}>{highlightMatch(wardDisplayName, searchQuery)}</span>
                              {isWardSelected && <span className={styles.checkmark}>✓</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}