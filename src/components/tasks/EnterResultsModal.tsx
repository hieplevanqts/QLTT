import React, { useState } from 'react';
import { X, CheckCircle, Save, FileText, Upload, AlertCircle } from 'lucide-react';
import styles from './EnterResultsModal.module.css';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  note?: string;
}

interface EnterResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskId: string;
  onSave: (results: { checklist: ChecklistItem[]; canComplete: boolean }) => void;
  onComplete: (results: { checklist: ChecklistItem[] }) => void;
}

export function EnterResultsModal({ 
  isOpen, 
  onClose, 
  taskTitle, 
  taskId,
  onSave,
  onComplete 
}: EnterResultsModalProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Kiểm tra giấy phép kinh doanh', completed: false },
    { id: '2', label: 'Kiểm tra nguồn gốc hàng hóa', completed: false },
    { id: '3', label: 'Kiểm tra chất lượng sản phẩm', completed: false },
    { id: '4', label: 'Kiểm tra điều kiện bảo quản', completed: false },
    { id: '5', label: 'Kiểm tra hồ sơ nhập khẩu', completed: false },
    { id: '6', label: 'Chụp ảnh hiện trường', completed: false },
    { id: '7', label: 'Lập biên bản', completed: false },
  ]);

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [generalNote, setGeneralNote] = useState('');

  if (!isOpen) return null;

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateNote = (id: string, note: string) => {
    setNotes(prev => ({ ...prev, [id]: note }));
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const allCompleted = completedCount === totalCount;
  const progress = Math.round((completedCount / totalCount) * 100);

  const handleSave = () => {
    const results = {
      checklist: checklist.map(item => ({
        ...item,
        note: notes[item.id] || undefined
      })),
      canComplete: allCompleted
    };
    onSave(results);
    onClose();
  };

  const handleComplete = () => {
    if (!allCompleted) {
      alert('Vui lòng hoàn thành tất cả các mục kiểm tra trước khi hoàn thành nhiệm vụ');
      return;
    }
    const results = {
      checklist: checklist.map(item => ({
        ...item,
        note: notes[item.id] || undefined
      }))
    };
    onComplete(results);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FileText size={20} />
            </div>
            <div>
              <h2 className={styles.title}>Nhập kết quả kiểm tra</h2>
              <p className={styles.subtitle}>{taskTitle}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>
              Tiến độ: {completedCount}/{totalCount} mục
            </span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Info Banner */}
          <div className={styles.infoBanner}>
            <AlertCircle size={16} />
            <span>
              Hoàn thành tất cả các mục kiểm tra để có thể đánh dấu "Hoàn thành" nhiệm vụ
            </span>
          </div>

          {/* Checklist */}
          <div className={styles.checklistSection}>
            <h3 className={styles.sectionTitle}>Danh sách kiểm tra</h3>
            <div className={styles.checklistItems}>
              {checklist.map((item) => (
                <div key={item.id} className={styles.checklistItem}>
                  <div className={styles.checklistHeader}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className={styles.checkbox}
                      />
                      <span className={item.completed ? styles.completedText : ''}>
                        {item.label}
                      </span>
                    </label>
                  </div>
                  {item.completed && (
                    <div className={styles.noteInput}>
                      <textarea
                        placeholder="Ghi chú (tùy chọn)..."
                        value={notes[item.id] || ''}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                        rows={2}
                        className={styles.textarea}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* General Note */}
          <div className={styles.field}>
            <label className={styles.label}>
              Ghi chú chung
            </label>
            <textarea
              value={generalNote}
              onChange={(e) => setGeneralNote(e.target.value)}
              placeholder="Nhập ghi chú chung về kết quả kiểm tra..."
              rows={4}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Hủy
          </button>
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
            >
              <Save size={16} />
              Lưu
            </button>
            <button
              type="button"
              className={styles.completeButton}
              onClick={handleComplete}
              disabled={!allCompleted}
              title={!allCompleted ? 'Hoàn thành tất cả các mục kiểm tra để có thể hoàn thành nhiệm vụ' : ''}
            >
              <CheckCircle size={16} />
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnterResultsModal;
