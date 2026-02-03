/**
 * ShareTemplateModal - Modal chia sẻ mẫu báo cáo với đơn vị
 */

import { useState } from 'react';
import { X, Users, Building2, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './ShareTemplateModal.module.css';

interface ShareTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName?: string;
}

interface Unit {
  id: string;
  name: string;
  level: 'cuc' | 'chi_cuc' | 'doi';
  parent?: string;
}

const MOCK_UNITS: Unit[] = [
  { id: 'cuc-01', name: 'Cục Quản lý thị trường TP.HCM', level: 'cuc' },
  { id: 'cc-01', name: 'Chi cục QLTT Quận 1', level: 'chi_cuc', parent: 'cuc-01' },
  { id: 'cc-02', name: 'Chi cục QLTT Quận 3', level: 'chi_cuc', parent: 'cuc-01' },
  { id: 'cc-03', name: 'Chi cục QLTT Quận 5', level: 'chi_cuc', parent: 'cuc-01' },
  { id: 'doi-01', name: 'Đội QLTT số 1 - Q1', level: 'doi', parent: 'cc-01' },
  { id: 'doi-02', name: 'Đội QLTT số 2 - Q1', level: 'doi', parent: 'cc-01' },
  { id: 'doi-03', name: 'Đội QLTT số 1 - Q3', level: 'doi', parent: 'cc-02' },
];

export default function ShareTemplateModal({ isOpen, onClose, templateName = 'Báo cáo mẫu' }: ShareTemplateModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [shareLevel, setShareLevel] = useState<'specific' | 'all_cuc' | 'all_chi_cuc'>('specific');

  if (!isOpen) return null;

  const filteredUnits = MOCK_UNITS.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUnit = (unitId: string) => {
    setSelectedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const handleShare = () => {
    // TODO: API call to share template
    console.log('Sharing template:', templateName, 'with units:', selectedUnits, 'level:', shareLevel);
    onClose();
  };

  const getLevelBadge = (level: string) => {
    const levelMap = {
      'cuc': { label: 'Cục', color: 'var(--primary)' },
      'chi_cuc': { label: 'Chi cục', color: 'var(--chart-3)' },
      'doi': { label: 'Đội', color: 'var(--chart-5)' }
    };
    const config = levelMap[level as keyof typeof levelMap];
    return (
      <span 
        className={styles.levelBadge}
        style={{ 
          backgroundColor: `${config.color}15`,
          color: config.color
        }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <Users className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className={styles.modalTitle}>Chia sẻ mẫu báo cáo</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Template Info */}
          <div className={styles.templateInfo}>
            <p className={styles.templateInfoLabel}>Mẫu báo cáo:</p>
            <p className={styles.templateInfoName}>{templateName}</p>
          </div>

          {/* Share Level Options */}
          <div className={styles.shareSection}>
            <label className={styles.sectionLabel}>Phạm vi chia sẻ</label>
            
            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="shareLevel"
                  value="specific"
                  checked={shareLevel === 'specific'}
                  onChange={(e) => setShareLevel(e.target.value as any)}
                />
                <div className={styles.radioLabel}>
                  <span className={styles.radioTitle}>Chọn đơn vị cụ thể</span>
                  <span className={styles.radioDescription}>Chỉ chia sẻ với các đơn vị được chọn</span>
                </div>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="shareLevel"
                  value="all_chi_cuc"
                  checked={shareLevel === 'all_chi_cuc'}
                  onChange={(e) => setShareLevel(e.target.value as any)}
                />
                <div className={styles.radioLabel}>
                  <span className={styles.radioTitle}>Tất cả Chi cục</span>
                  <span className={styles.radioDescription}>Chia sẻ với tất cả Chi cục trong Cục</span>
                </div>
              </label>

              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="shareLevel"
                  value="all_cuc"
                  checked={shareLevel === 'all_cuc'}
                  onChange={(e) => setShareLevel(e.target.value as any)}
                />
                <div className={styles.radioLabel}>
                  <span className={styles.radioTitle}>Toàn Cục</span>
                  <span className={styles.radioDescription}>Chia sẻ với toàn bộ đơn vị thuộc Cục</span>
                </div>
              </label>
            </div>
          </div>

          {/* Unit Selector (only show if specific) */}
          {shareLevel === 'specific' && (
            <div className={styles.unitSection}>
              <label className={styles.sectionLabel}>
                Chọn đơn vị ({selectedUnits.length} đã chọn)
              </label>

              {/* Search */}
              <div className={styles.searchBox}>
                <Search className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn vị..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              {/* Unit List */}
              <div className={styles.unitList}>
                {filteredUnits.map(unit => (
                  <label key={unit.id} className={styles.unitItem}>
                    <div className={styles.unitItemLeft}>
                      <input
                        type="checkbox"
                        checked={selectedUnits.includes(unit.id)}
                        onChange={() => toggleUnit(unit.id)}
                        className={styles.checkbox}
                      />
                      <Building2 className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                      <span className={styles.unitName}>{unit.name}</span>
                    </div>
                    {getLevelBadge(unit.level)}
                  </label>
                ))}
              </div>

              {filteredUnits.length === 0 && (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateText}>Không tìm thấy đơn vị nào</p>
                </div>
              )}
            </div>
          )}

          {/* Permissions Info */}
          <div className={styles.infoBox}>
            <p className={styles.infoTitle}>ℹ️ Lưu ý về quyền truy cập:</p>
            <ul className={styles.infoList}>
              <li>Các đơn vị được chia sẻ có thể <strong>xem và chạy</strong> mẫu báo cáo</li>
              <li>Dữ liệu báo cáo tự động được scope theo <strong>địa bàn/đơn vị</strong> của người xem</li>
              <li>Chỉ người tạo mẫu có quyền <strong>chỉnh sửa</strong></li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            variant="default" 
            onClick={handleShare}
            disabled={shareLevel === 'specific' && selectedUnits.length === 0}
          >
            <Check className="w-4 h-4" />
            Xác nhận chia sẻ
          </Button>
        </div>
      </div>
    </div>
  );
}
