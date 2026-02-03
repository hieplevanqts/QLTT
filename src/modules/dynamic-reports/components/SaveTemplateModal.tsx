import { useState } from 'react';
import { X, Save, FileText, Users, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import styles from '../DynamicReports.module.css';

interface SaveTemplateModalProps {
  onClose: () => void;
  onSave: (name: string, description: string, scope: 'personal' | 'unit') => void;
  dataset?: string;
  columnsCount?: number;
  filtersCount?: number;
}

export default function SaveTemplateModal({ 
  onClose, 
  onSave, 
  dataset, 
  columnsCount = 0, 
  filtersCount = 0 
}: SaveTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState<'personal' | 'unit'>('personal');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên báo cáo');
      return;
    }

    if (name.trim().length < 3) {
      toast.error('Tên báo cáo phải có ít nhất 3 ký tự');
      return;
    }

    setIsSaving(true);
    
    // Simulate async save
    setTimeout(() => {
      onSave(name.trim(), description.trim(), scope);
      setIsSaving(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderIcon}>
            <Save className="w-5 h-5" />
          </div>
          <div className={styles.modalHeaderText}>
            <h2 className={styles.modalTitle}>Lưu mẫu báo cáo</h2>
            <p className={styles.modalSubtitle}>
              Lưu cấu hình báo cáo để sử dụng lại sau này
            </p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} disabled={isSaving}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Summary Info */}
          {dataset && (
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <FileText className="w-4 h-4" />
                <span>Thông tin báo cáo</span>
              </div>
              <div className={styles.infoCardContent}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nguồn dữ liệu:</span>
                  <span className={styles.infoValue}>{dataset}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số cột:</span>
                  <span className={styles.infoValue}>{columnsCount} cột</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Số bộ lọc:</span>
                  <span className={styles.infoValue}>{filtersCount} điều kiện</span>
                </div>
              </div>
            </div>
          )}

          {/* Name Input */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Tên báo cáo <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="VD: Báo cáo cơ sở chờ duyệt tháng 1/2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={100}
              autoFocus
              disabled={isSaving}
            />
            <div className={styles.inputHelp}>
              {name.length}/100 ký tự
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Mô tả</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Mô tả mục đích, nội dung và cách sử dụng báo cáo này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              disabled={isSaving}
            />
            <div className={styles.inputHelp}>
              {description.length}/500 ký tự
            </div>
          </div>

          {/* Scope Selection */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Phạm vi chia sẻ <span className={styles.required}>*</span>
            </label>
            <div className={styles.radioGroup}>
              <label className={`${styles.radioCard} ${scope === 'personal' ? styles.radioCardActive : ''}`}>
                <input
                  type="radio"
                  name="scope"
                  value="personal"
                  checked={scope === 'personal'}
                  onChange={() => setScope('personal')}
                  disabled={isSaving}
                />
                <div className={styles.radioCardIcon}>
                  <Lock className="w-5 h-5" />
                </div>
                <div className={styles.radioCardContent}>
                  <div className={styles.radioCardTitle}>Cá nhân</div>
                  <div className={styles.radioCardDesc}>
                    Chỉ bạn có thể xem và sử dụng mẫu báo cáo này
                  </div>
                </div>
                {scope === 'personal' && (
                  <div className={styles.radioCardCheck}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </label>

              <label className={`${styles.radioCard} ${scope === 'unit' ? styles.radioCardActive : ''}`}>
                <input
                  type="radio"
                  name="scope"
                  value="unit"
                  checked={scope === 'unit'}
                  onChange={() => setScope('unit')}
                  disabled={isSaving}
                />
                <div className={styles.radioCardIcon}>
                  <Users className="w-5 h-5" />
                </div>
                <div className={styles.radioCardContent}>
                  <div className={styles.radioCardTitle}>Đơn vị</div>
                  <div className={styles.radioCardDesc}>
                    Tất cả thành viên trong đơn vị có thể xem và sử dụng
                  </div>
                </div>
                {scope === 'unit' && (
                  <div className={styles.radioCardCheck}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Info Alert */}
          <div className={styles.alertInfo}>
            <AlertCircle className="w-4 h-4" />
            <div className={styles.alertContent}>
              <strong>Lưu ý:</strong> Mẫu báo cáo sẽ lưu cấu hình (cột, bộ lọc, nhóm) 
              nhưng không lưu dữ liệu. Mỗi lần chạy báo cáo sẽ lấy dữ liệu mới nhất.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
          >
            {isSaving ? (
              <>
                <div className={styles.buttonSpinner}></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Lưu mẫu
              </>
            )}
          </Button>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className={styles.modalHint}>
          Nhấn <kbd>Ctrl</kbd> + <kbd>Enter</kbd> để lưu nhanh
        </div>
      </div>
    </div>
  );
}
