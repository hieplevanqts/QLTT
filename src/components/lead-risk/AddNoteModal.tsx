import { useState } from 'react';
import { StickyNote, X } from 'lucide-react';
import type { Lead } from '../../../data/lead-risk/types';
import styles from './AddNoteModal.module.css';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  lead?: Lead | null;
}

export function AddNoteModal({
  isOpen,
  onClose,
  onSave,
  lead,
}: AddNoteModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (note.trim()) {
      onSave(note);
      setNote('');
      onClose();
    }
  };

  const handleCancel = () => {
    setNote('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header with Icon + Text */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <StickyNote size={20} />
            </div>
            <h3 className={styles.title}>Thêm ghi chú</h3>
          </div>
          <button className={styles.closeBtn} onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {lead && (
            <div className={styles.leadCode}>
              Mã nguồn tin: <strong>{lead.code}</strong>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Nội dung ghi chú</label>
            <textarea
              className={styles.textarea}
              placeholder="Nhập ghi chú của bạn..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              autoFocus
            />
            <div className={styles.charCount}>
              {note.length} / 500 ký tự
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Hủy
          </button>
          <button 
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!note.trim()}
          >
            Lưu ghi chú
          </button>
        </div>
      </div>
    </div>
  );
}
