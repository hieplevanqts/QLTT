import React, { useState } from 'react';
import { AlertOctagon, Send, Clock, TrendingUp, User, FileText } from 'lucide-react';
import styles from './EscalationPanel.module.css';

interface EscalationPanelProps {
  leadId: string;
  leadTitle: string;
  currentUrgency: string;
  slaRemaining: number; // hours
  onEscalate: (data: any) => void;
}

export function EscalationPanel({ 
  leadId, 
  leadTitle, 
  currentUrgency,
  slaRemaining,
  onEscalate 
}: EscalationPanelProps) {
  const [reason, setReason] = useState('');
  const [escalateTo, setEscalateTo] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('high');

  const shouldAutoEscalate = slaRemaining <= 2;

  const handleEscalate = () => {
    if (!reason.trim() || !escalateTo) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    onEscalate({
      leadId,
      reason,
      escalateTo,
      urgencyLevel,
      escalatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <AlertOctagon size={20} />
        <h3>Báo cáo lên</h3>
      </div>

      {shouldAutoEscalate && (
        <div className={styles.autoAlert}>
          <Clock size={16} />
          <div>
            <strong>Cảnh báo SLA!</strong>
            <p>Còn {slaRemaining}h - Nên báo cáo lên ngay</p>
          </div>
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.currentInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Lead:</span>
            <span className={styles.value}>{leadTitle}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Mức độ khẩn cấp hiện tại:</span>
            <span className={styles.urgencyBadge} data-urgency={currentUrgency}>
              {getUrgencyLabel(currentUrgency)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>SLA còn lại:</span>
            <span className={styles.value} style={{ color: slaRemaining <= 2 ? 'var(--chart-1)' : 'var(--foreground)' }}>
              {slaRemaining}h
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="escalateTo">
            <User size={14} />
            Báo cáo lên
          </label>
          <select 
            id="escalateTo"
            value={escalateTo} 
            onChange={(e) => setEscalateTo(e.target.value)}
          >
            <option value="">-- Chọn người nhận --</option>
            <option value="team-lead">Trưởng nhóm</option>
            <option value="chi-cuc-truong">Chi Cục Trưởng</option>
            <option value="cuc-truong">Cục Trưởng</option>
            <option value="bo">Bộ QLTT</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="urgencyLevel">
            <TrendingUp size={14} />
            Mức độ khẩn cấp mới
          </label>
          <select 
            id="urgencyLevel"
            value={urgencyLevel} 
            onChange={(e) => setUrgencyLevel(e.target.value)}
          >
            <option value="high">Cao</option>
            <option value="critical">Nghiêm trọng</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reason">
            <FileText size={14} />
            Lý do báo cáo lên
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Vì sao lead này cần báo cáo lên? Rủi ro nếu không xử lý ngay?"
            rows={4}
          />
        </div>

        <button className={styles.escalateBtn} onClick={handleEscalate}>
          <Send size={16} />
          Báo cáo lên ngay
        </button>
      </div>

      <div className={styles.rules}>
        <h4>Quy tắc tự động báo cáo</h4>
        <ul>
          <li>
            <Clock size={12} />
            SLA &lt; 2h → Cảnh báo Trưởng nhóm
          </li>
          <li>
            <AlertOctagon size={12} />
            Lead nghiêm trọng chưa phân công sau 30 phút
          </li>
          <li>
            <TrendingUp size={12} />
            Mức độ cao không có tiến triển sau 4h
          </li>
        </ul>
      </div>
    </div>
  );
}

function getUrgencyLabel(urgency: string): string {
  const labels: Record<string, string> = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    critical: 'Nghiêm trọng',
  };
  return labels[urgency] || urgency;
}