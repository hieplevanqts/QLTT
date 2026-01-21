import React, { useState } from 'react';
import { Save, Trash2, Share2, Lock, User, Building2, Star } from 'lucide-react';
import { FilterPreset, FilterGroup, PresetScope } from '../../types/advancedFilter';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../app/components/ui/select';
import { ConfirmDialog } from '../ConfirmDialog';
import styles from './FilterPresetPanel.module.css';

interface FilterPresetPanelProps {
  presets: FilterPreset[];
  onLoadPreset: (preset: FilterPreset) => void;
  onSavePreset: (name: string, description: string, scope: PresetScope) => void;
  onDeletePreset: (presetId: string) => void;
  onSharePreset?: (presetId: string) => void;
  currentUserId: string;
  userRole: 'user' | 'unit_manager' | 'admin'; // For RBAC
}

export function FilterPresetPanel({
  presets,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
  onSharePreset,
  currentUserId,
  userRole,
}: FilterPresetPanelProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [saveScope, setSaveScope] = useState<PresetScope>('personal');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    presetId: string;
    presetName: string;
  }>({ open: false, presetId: '', presetName: '' });

  const canCreateUnitPreset = userRole === 'unit_manager' || userRole === 'admin';

  const handleSave = () => {
    if (!saveName.trim()) {
      alert('Vui lòng nhập tên bộ lọc');
      return;
    }

    onSavePreset(saveName, saveDescription, saveScope);
    setShowSaveDialog(false);
    setSaveName('');
    setSaveDescription('');
    setSaveScope('personal');
  };

  const handleDelete = (preset: FilterPreset) => {
    setDeleteConfirm({
      open: true,
      presetId: preset.id,
      presetName: preset.name,
    });
  };

  const confirmDelete = () => {
    onDeletePreset(deleteConfirm.presetId);
    setDeleteConfirm({ open: false, presetId: '', presetName: '' });
  };

  const canDeletePreset = (preset: FilterPreset) => {
    // Can delete own presets
    if (preset.createdBy === currentUserId) return true;
    
    // Admins can delete any
    if (userRole === 'admin') return true;
    
    // Unit managers can delete unit presets
    if (userRole === 'unit_manager' && preset.scope === 'unit') return true;
    
    return false;
  };

  const canEditPreset = (preset: FilterPreset) => {
    return canDeletePreset(preset);
  };

  // Separate presets
  const standardPresets = presets.filter(p => p.isStandard);
  const unitPresets = presets.filter(p => !p.isStandard && p.scope === 'unit');
  const personalPresets = presets.filter(p => !p.isStandard && p.scope === 'personal');

  return (
    <div className={styles.panel}>
      {/* Save New Preset */}
      <div className={styles.saveSection}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          className={styles.saveButton}
        >
          <Save size={16} />
          Lưu bộ lọc
        </Button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className={styles.saveDialog}>
          <div className={styles.saveDialogContent}>
            <h4 className={styles.saveDialogTitle}>Lưu bộ lọc</h4>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên bộ lọc <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="VD: Cửa hàng có vi phạm trong Q1 2024"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Mô tả</label>
              <textarea
                className={styles.textarea}
                placeholder="Mô tả mục đích sử dụng bộ lọc..."
                rows={3}
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phạm vi</label>
              <Select value={saveScope} onValueChange={(value: PresetScope) => setSaveScope(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">
                    <div className={styles.scopeOption}>
                      <User size={16} />
                      <span>Cá nhân</span>
                    </div>
                  </SelectItem>
                  {canCreateUnitPreset && (
                    <SelectItem value="unit">
                      <div className={styles.scopeOption}>
                        <Building2 size={16} />
                        <span>Đơn vị (Toàn Chi cục)</span>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.saveDialogActions}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(false)}
              >
                Hủy
              </Button>
              <Button size="sm" onClick={handleSave}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Presets List */}
      <div className={styles.presetsList}>
        {/* Standard Presets */}
        {standardPresets.length > 0 && (
          <div className={styles.presetsSection}>
            <h4 className={styles.sectionTitle}>
              <Star size={16} className={styles.sectionIcon} />
              Bộ lọc chuẩn
            </h4>
            {standardPresets.map(preset => (
              <PresetItem
                key={preset.id}
                preset={preset}
                onLoad={() => onLoadPreset(preset)}
                onDelete={canDeletePreset(preset) ? () => handleDelete(preset) : undefined}
                onShare={onSharePreset && canEditPreset(preset) ? () => onSharePreset(preset.id) : undefined}
              />
            ))}
          </div>
        )}

        {/* Unit Presets */}
        {unitPresets.length > 0 && (
          <div className={styles.presetsSection}>
            <h4 className={styles.sectionTitle}>
              <Building2 size={16} className={styles.sectionIcon} />
              Bộ lọc đơn vị
            </h4>
            {unitPresets.map(preset => (
              <PresetItem
                key={preset.id}
                preset={preset}
                onLoad={() => onLoadPreset(preset)}
                onDelete={canDeletePreset(preset) ? () => handleDelete(preset) : undefined}
                onShare={onSharePreset && canEditPreset(preset) ? () => onSharePreset(preset.id) : undefined}
              />
            ))}
          </div>
        )}

        {/* Personal Presets */}
        {personalPresets.length > 0 && (
          <div className={styles.presetsSection}>
            <h4 className={styles.sectionTitle}>
              <User size={16} className={styles.sectionIcon} />
              Bộ lọc cá nhân
            </h4>
            {personalPresets.map(preset => (
              <PresetItem
                key={preset.id}
                preset={preset}
                onLoad={() => onLoadPreset(preset)}
                onDelete={canDeletePreset(preset) ? () => handleDelete(preset) : undefined}
                onShare={onSharePreset && canEditPreset(preset) ? () => onSharePreset(preset.id) : undefined}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {presets.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Chưa có bộ lọc nào được lưu</p>
            <p className={styles.emptyHint}>Tạo bộ lọc và click "Lưu bộ lọc" để lưu lại</p>
          </div>
        )}
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Xóa bộ lọc"
        description={`Bạn có chắc muốn xóa bộ lọc "${deleteConfirm.presetName}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

interface PresetItemProps {
  preset: FilterPreset;
  onLoad: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

function PresetItem({ preset, onLoad, onDelete, onShare }: PresetItemProps) {
  return (
    <div className={styles.presetItem}>
      <div className={styles.presetInfo} onClick={onLoad}>
        <div className={styles.presetHeader}>
          <h5 className={styles.presetName}>{preset.name}</h5>
          <div className={styles.presetBadges}>
            {preset.isStandard && (
              <Badge variant="default" className={styles.standardBadge}>
                <Lock size={12} />
                Chuẩn
              </Badge>
            )}
            {preset.scope === 'unit' && !preset.isStandard && (
              <Badge variant="secondary">
                <Building2 size={12} />
                Đơn vị
              </Badge>
            )}
          </div>
        </div>
        {preset.description && (
          <p className={styles.presetDescription}>{preset.description}</p>
        )}
        <div className={styles.presetMeta}>
          <span className={styles.presetDate}>
            {new Date(preset.updatedAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
      
      <div className={styles.presetActions}>
        {onShare && (
          <button
            className={styles.actionButton}
            onClick={onShare}
            title="Chia sẻ"
          >
            <Share2 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            className={styles.actionButton}
            onClick={onDelete}
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
