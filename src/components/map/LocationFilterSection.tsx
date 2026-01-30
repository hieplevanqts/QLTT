import React, { useState, useEffect } from 'react';
import { MapPin, Search, X, Plus, Minus } from 'lucide-react';
import styles from './MapFilterPanel.module.css';
import { fetchProvinces, fetchWardsByProvinceId, ProvinceApiData, WardApiData } from '@/utils/api/locationsApi';

interface LocationFilterSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  selectedProvince?: string;
  selectedWard?: string;
  onProvinceChange?: (province: string) => void;
  onWardChange?: (ward: string) => void;
}

export const LocationFilterSection: React.FC<LocationFilterSectionProps> = ({
  isExpanded,
  onToggle,
  selectedProvince,
  selectedWard,
  onProvinceChange,
  onWardChange,
}) => {
  const [provinceSearchInput, setProvinceSearchInput] = useState('');
  const [showProvinceAutocomplete, setShowProvinceAutocomplete] = useState(false);
  const [selectedProvinceIds, setSelectedProvinceIds] = useState<string[]>([]);
  const [wardSearchInput, setWardSearchInput] = useState('');
  const [showWardAutocomplete, setShowWardAutocomplete] = useState(false);
  const [selectedWardIds, setSelectedWardIds] = useState<string[]>([]);
  const [provincesDB, setProvincesDB] = useState<ProvinceApiData[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [wardsDB, setWardsDB] = useState<WardApiData[]>([]);

  // Load danh sách tỉnh khi component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const data = await fetchProvinces();
        setProvincesDB(data);
      } catch (error) {
        console.error('Error loading provinces:', error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Load danh sách xã khi chọn tỉnh
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedProvince) {
        setIsLoadingWards(true);
        try {
          const data = await fetchWardsByProvinceId(selectedProvince);
          setWardsDB(data);
        } catch (error) {
          console.error('Error loading wards:', error);
          setWardsDB([]);
        } finally {
          setIsLoadingWards(false);
        }
      } else {
        setWardsDB([]);
      }
    };
    fetchWards();
  }, [selectedProvince]);

  // Sync selectedProvinceIds with selectedProvince
  useEffect(() => {
    if (selectedProvince) {
      setSelectedProvinceIds([selectedProvince]);
    } else {
      setSelectedProvinceIds([]);
    }
  }, [selectedProvince]);

  // Sync selectedWardIds with selectedWard
  useEffect(() => {
    if (selectedWard) {
      setSelectedWardIds([selectedWard]);
    } else {
      setSelectedWardIds([]);
    }
  }, [selectedWard]);

  // Filter provinces for autocomplete
  const filteredProvincesForAutocomplete = provinceSearchInput.trim()
    ? provincesDB.filter(p => 
        p.name.toLowerCase().includes(provinceSearchInput.toLowerCase()) &&
        !selectedProvinceIds.includes(p._id)
      )
    : provincesDB.filter(p => !selectedProvinceIds.includes(p._id));

  // Get selected province objects
  const selectedProvinces = provincesDB.filter(p => selectedProvinceIds.includes(p._id));

  // Handle province selection
  const handleProvinceSelect = (provinceId: string) => {
    setSelectedProvinceIds([provinceId]);
    onProvinceChange?.(provinceId);
    onWardChange?.('');
    setProvinceSearchInput('');
    setShowProvinceAutocomplete(false);
  };

  // Handle province removal
  const handleProvinceRemove = () => {
    setSelectedProvinceIds([]);
    onProvinceChange?.('');
    onWardChange?.('');
  };

  // Filter wards for autocomplete
  const filteredWardsForAutocomplete = wardSearchInput.trim()
    ? wardsDB.filter(w => 
        w.name.toLowerCase().includes(wardSearchInput.toLowerCase()) &&
        !selectedWardIds.includes(w._id)
      )
    : wardsDB.filter(w => !selectedWardIds.includes(w._id));

  // Get selected ward objects
  const selectedWards = wardsDB.filter(w => selectedWardIds.includes(w._id));

  // Handle ward selection
  const handleWardSelect = (wardId: string) => {
    setSelectedWardIds([wardId]);
    onWardChange?.(wardId);
    setWardSearchInput('');
    setShowWardAutocomplete(false);
  };

  // Handle ward removal
  const handleWardRemove = () => {
    setSelectedWardIds([]);
    onWardChange?.('');
  };

  return (
    <div className={styles.filterSection}>
      <button className={styles.sectionHeader} onClick={onToggle}>
        <div className={styles.sectionTitle}><MapPin size={16} /> Vị trí</div>
        {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      <div className={`${styles.filterList} ${isExpanded ? styles.filterListExpanded : styles.filterListCollapsed}`}>
        {/* Province autocomplete */}
        <div className={styles.categoryAutocompleteWrapper}>
          <div className={styles.categoryInputWrapper}>
            <Search size={16} />
            <input
              type="text"
              value={provinceSearchInput}
              onChange={(e) => {
                setProvinceSearchInput(e.target.value);
                setShowProvinceAutocomplete(e.target.value.trim().length > 0);
              }}
              onFocus={() => {
                if (provinceSearchInput.trim().length > 0) {
                  setShowProvinceAutocomplete(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowProvinceAutocomplete(false), 200);
              }}
              placeholder="Tìm kiếm tỉnh thành..."
              className={styles.categorySearchInput}
              disabled={isLoadingProvinces || selectedProvinceIds.length > 0}
            />
            {showProvinceAutocomplete && !isLoadingProvinces && filteredProvincesForAutocomplete.length > 0 && (
              <div className={styles.categoryAutocompleteDropdown}>
                {filteredProvincesForAutocomplete.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    className={styles.categoryAutocompleteItem}
                    onClick={() => handleProvinceSelect(p._id)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected province as tag */}
          {selectedProvinces && selectedProvinces.length > 0 ? (
            <div className={styles.categoryTagsContainer}>
              {selectedProvinces.map((p) => (
                <div key={p._id} className={styles.categoryTag} style={{ borderColor: '#005cb6' }}>
                  <MapPin size={14} style={{ color: '#005cb6' }} />
                  <span>{p.name}</span>
                  <button
                    type="button"
                    className={styles.categoryTagRemove}
                    onClick={() => handleProvinceRemove()}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.categoryTagsEmpty}>
              <span>Chưa chọn tỉnh thành nào</span>
            </div>
          )}
        </div>

        {/* Ward autocomplete (only show when province is selected) */}
        {selectedProvince && (
          <div className={styles.categoryAutocompleteWrapper} style={{ marginTop: '8px' }}>
            <div className={styles.categoryInputWrapper}>
              <Search size={16} />
              <input
                type="text"
                value={wardSearchInput}
                onChange={(e) => {
                  setWardSearchInput(e.target.value);
                  setShowWardAutocomplete(e.target.value.trim().length > 0);
                }}
                onFocus={() => {
                  if (wardSearchInput.trim().length > 0) {
                    setShowWardAutocomplete(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowWardAutocomplete(false), 200);
                }}
                placeholder="Tìm kiếm xã..."
                className={styles.categorySearchInput}
                disabled={isLoadingWards || selectedWardIds.length > 0}
              />
              {showWardAutocomplete && !isLoadingWards && filteredWardsForAutocomplete.length > 0 && (
                <div className={styles.categoryAutocompleteDropdown}>
                  {filteredWardsForAutocomplete.map((w) => (
                    <button
                      key={w._id}
                      type="button"
                      className={styles.categoryAutocompleteItem}
                      onClick={() => handleWardSelect(w._id)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <span>{w.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected ward as tag */}
            {selectedWards && selectedWards.length > 0 ? (
              <div className={styles.categoryTagsContainer}>
                {selectedWards.map((w) => (
                  <div key={w._id} className={styles.categoryTag} style={{ borderColor: '#005cb6' }}>
                    <MapPin size={14} style={{ color: '#005cb6' }} />
                    <span>{w.name}</span>
                    <button
                      type="button"
                      className={styles.categoryTagRemove}
                      onClick={() => handleWardRemove()}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.categoryTagsEmpty}>
                <span>Chưa chọn xã nào</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


