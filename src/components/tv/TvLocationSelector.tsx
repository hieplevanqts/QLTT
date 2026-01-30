import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Search, X } from 'lucide-react';
import { useTvData } from '@/contexts/TvDataContext';
import { VIETNAM_PROVINCES } from '@/utils/data/qltt-structure';

export default function TvLocationSelector() {
  const { filters, setFilters } = useTvData();
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
    if (filters.province && isOpen) {
      // Find province by NAME and expand it by CODE
      const province = VIETNAM_PROVINCES.find(p => p.name === filters.province);
      if (province) {
        setExpandedProvinces(prev => new Set([...prev, province.code]));
      }
    }
  }, [filters.province, isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-expand provinces when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const matchingProvinces = VIETNAM_PROVINCES
        .filter(province => 
          province.wards.some(ward => 
            ward.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
        .map(p => p.code);
      setExpandedProvinces(new Set(matchingProvinces));
    }
  }, [searchQuery]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectLocation = (provinceCode?: string, districtCode?: string, wardCode?: string) => {
    // Find province and ward names to store in filters (to match mock data)
    const province = provinceCode ? VIETNAM_PROVINCES.find(p => p.code === provinceCode) : undefined;
    const ward = province && wardCode ? province.wards.find(w => w.code === wardCode) : undefined;
    
    setFilters({
      ...filters,
      province: province?.name,
      district: undefined, // District not used in current structure
      ward: ward?.name,
    });
    setIsOpen(false);
    setSearchQuery('');
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

  const getDisplayText = () => {
    if (!filters.province) {
      return 'Tất cả địa bàn';
    }

    // Find province by NAME (since filters store names)
    const province = VIETNAM_PROVINCES.find(p => p.name === filters.province);
    if (!province) return filters.province; // Fallback to raw value

    if (filters.ward) {
      // Find ward by NAME
      const ward = province.wards.find(w => w.name === filters.ward);
      if (ward) {
        return ward.name;
      }
      return filters.ward; // Fallback to raw value
    }

    return province.name;
  };

  // Check if location filter is active
  const hasLocationFilter = filters.province || filters.ward;

  // Filter provinces and wards based on search query
  const filteredProvinces = VIETNAM_PROVINCES.map(province => {
    if (!searchQuery.trim()) {
      return province;
    }

    const query = searchQuery.toLowerCase();
    const provinceMatches = province.name.toLowerCase().includes(query);
    
    const matchedWards = province.wards.filter(ward => 
      ward.name.toLowerCase().includes(query) || 
      (ward.fullName && ward.fullName.toLowerCase().includes(query))
    );

    if (provinceMatches || matchedWards.length > 0) {
      return {
        ...province,
        wards: matchedWards,
        hasMatch: true,
      };
    }

    return null;
  }).filter(Boolean) as typeof VIETNAM_PROVINCES;

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} style={{ backgroundColor: 'rgba(0, 92, 182, 0.2)', color: 'var(--foreground)', padding: '0 2px', borderRadius: '2px' }}>{part}</mark>
        : part
    );
  };

  return (
    <div 
      ref={dropdownRef}
      style={{ 
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <button
        onClick={handleToggleDropdown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '36px',
          padding: '0 12px',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderColor: hasLocationFilter ? 'var(--primary)' : 'var(--border)',
          borderWidth: hasLocationFilter ? '2px' : '1px',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: '200px',
        }}
        onMouseEnter={(e) => {
          if (!hasLocationFilter) {
            e.currentTarget.style.borderColor = 'var(--primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!hasLocationFilter) {
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
      >
        <MapPin style={{ width: '14px', height: '14px', color: hasLocationFilter ? 'var(--color-primary)' : 'var(--muted-foreground)' }} />
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getDisplayText()}
        </span>
        <ChevronDown 
          style={{ 
            width: '14px', 
            height: '14px', 
            color: 'var(--muted-foreground)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }} 
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '360px',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--elevation-sm)',
            zIndex: 10002,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
            }}
          >
            <MapPin style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
            <span>Chọn địa bàn</span>
          </div>

          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <Search 
              style={{ 
                position: 'absolute',
                left: '28px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '14px',
                height: '14px',
                color: 'var(--muted-foreground)',
              }} 
            />
            <input
              type="text"
              placeholder="Tìm kiếm địa bàn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
              style={{
                width: '100%',
                height: '36px',
                paddingLeft: '36px',
                paddingRight: searchQuery ? '36px' : '12px',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
                backgroundColor: 'var(--input-background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '28px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--muted-foreground)',
                }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>

          {/* Menu */}
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {/* "Tất cả địa bàn" option */}
            {!searchQuery && (
              <div
                onClick={() => handleSelectLocation(undefined, undefined, undefined)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: !filters.province ? 'var(--primary)' : 'var(--foreground)',
                  backgroundColor: !filters.province ? 'rgba(0, 92, 182, 0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!filters.province) return;
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  if (!filters.province) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 92, 182, 0.05)';
                  } else {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>Tất cả địa bàn</span>
                {!filters.province && (
                  <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)' }}>✓</span>
                )}
              </div>
            )}

            {/* No results */}
            {filteredProvinces.length === 0 && searchQuery && (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '4px' }}>
                  Không tìm thấy kết quả
                </div>
                <div style={{ fontSize: 'var(--text-xs)' }}>
                  Thử tìm kiếm với từ khóa khác
                </div>
              </div>
            )}

            {/* Province List */}
            {filteredProvinces.map((province) => {
              const isExpanded = expandedProvinces.has(province.code);
              const isProvinceSelected = filters.province === province.name && !filters.ward;

              return (
                <div key={province.code}>
                  {/* Province Item */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: isProvinceSelected ? 'var(--primary)' : 'var(--foreground)',
                      backgroundColor: isProvinceSelected ? 'rgba(0, 92, 182, 0.05)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <div
                      onClick={() => handleSelectLocation(province.code, undefined, undefined)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => {
                        if (isProvinceSelected) return;
                        const parent = e.currentTarget.parentElement;
                        if (parent) parent.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        if (isProvinceSelected) return;
                        const parent = e.currentTarget.parentElement;
                        if (parent) parent.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{highlightMatch(province.name, searchQuery)}</span>
                      {isProvinceSelected && (
                        <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)' }}>✓</span>
                      )}
                    </div>
                    
                    {province.wards.length > 0 && (
                      <button
                        onClick={(e) => toggleProvinceExpand(province.code, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          padding: 0,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: 'var(--muted-foreground)',
                        }}
                      >
                        <ChevronDown
                          style={{
                            width: '14px',
                            height: '14px',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </button>
                    )}
                  </div>

                  {/* Ward List (when expanded) */}
                  {isExpanded && province.wards.length > 0 && (
                    <div style={{ backgroundColor: 'var(--muted)', paddingLeft: '16px' }}>
                      {/* "Tất cả xã/phường" option */}
                      <div
                        onClick={() => handleSelectLocation(province.code, undefined, undefined)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 16px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-normal)',
                          color: filters.province === province.name && !filters.ward ? 'var(--primary)' : 'var(--muted-foreground)',
                          backgroundColor: filters.province === province.name && !filters.ward ? 'rgba(0, 92, 182, 0.05)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          if (filters.province === province.name && !filters.ward) return;
                          e.currentTarget.style.backgroundColor = 'var(--background)';
                        }}
                        onMouseLeave={(e) => {
                          if (filters.province === province.name && !filters.ward) {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 92, 182, 0.05)';
                          } else {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <span>Tất cả xã/phường</span>
                        {filters.province === province.name && !filters.ward && (
                          <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)' }}>✓</span>
                        )}
                      </div>

                      {/* Individual Wards */}
                      {province.wards.map((ward) => {
                        const isWardSelected = filters.province === province.name && filters.ward === ward.name;
                        const wardDisplayName = ward.name;

                        return (
                          <div
                            key={ward.code}
                            onClick={() => handleSelectLocation(province.code, undefined, ward.code)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 16px',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-normal)',
                              color: isWardSelected ? 'var(--primary)' : 'var(--foreground)',
                              backgroundColor: isWardSelected ? 'rgba(0, 92, 182, 0.05)' : 'transparent',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              if (isWardSelected) return;
                              e.currentTarget.style.backgroundColor = 'var(--background)';
                            }}
                            onMouseLeave={(e) => {
                              if (isWardSelected) {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 92, 182, 0.05)';
                              } else {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <span>{highlightMatch(wardDisplayName, searchQuery)}</span>
                            {isWardSelected && (
                              <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-bold)' }}>✓</span>
                            )}
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
