import React, { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle2, FileText, Plus } from 'lucide-react';
import { ActionModal, ActionType } from './ActionModal';
import styles from './StoreRiskProfile.module.css';

interface StoreRiskProfileProps {
  storeId: string;
  storeName: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  violationCount: number;
  lastInspection: Date;
  trendDirection: 'increasing' | 'stable' | 'decreasing';
}

export function StoreRiskProfile({
  storeId,
  storeName,
  riskScore,
  riskLevel,
  violationCount,
  lastInspection,
  trendDirection
}: StoreRiskProfileProps) {
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<ActionType>('task');

  const handleActionSubmit = (data: any) => {
    alert(`${data.type === 'task' ? 'Task' : data.type === 'plan' ? 'Plan' : 'Follow-up'} đã được tạo cho cơ sở!`);
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'critical': return 'var(--chart-1)';
      case 'high': return 'var(--chart-5)';
      case 'medium': return 'var(--chart-2)';
      case 'low': return 'var(--chart-4)';
    }
  };

  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'critical': return 'Cực kỳ nguy hiểm';
      case 'high': return 'Nguy cơ cao';
      case 'medium': return 'Nguy cơ trung bình';
      case 'low': return 'Nguy cơ thấp';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconTitle}>
          <Shield size={20} />
          <h4>Risk Profile của Cơ sở</h4>
        </div>
        <div className={styles.trendBadge} data-trend={trendDirection}>
          <TrendingUp size={14} />
          {trendDirection === 'increasing' && 'Tăng'}
          {trendDirection === 'stable' && 'Ổn định'}
          {trendDirection === 'decreasing' && 'Giảm'}
        </div>
      </div>

      <div className={styles.riskScore}>
        <div className={styles.scoreCircle}>
          <svg viewBox="0 0 100 100" className={styles.progressRing}>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getRiskColor()}
              strokeWidth="8"
              strokeDasharray={`${riskScore * 2.83} 283`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className={styles.scoreValue}>
            <span className={styles.scoreNumber}>{riskScore}</span>
            <span className={styles.scoreMax}>/100</span>
          </div>
        </div>
        <div className={styles.riskInfo}>
          <div className={styles.riskLevel} style={{ color: getRiskColor() }}>
            <AlertTriangle size={16} />
            {getRiskLabel()}
          </div>
          <div className={styles.riskMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Vi phạm:</span>
              <span className={styles.metaValue}>{violationCount} lần</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Kiểm tra gần nhất:</span>
              <span className={styles.metaValue}>
                {new Date(lastInspection).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={() => {
            setActionType('task');
            setShowActionModal(true);
          }}
        >
          <CheckCircle2 size={14} />
          Tạo Task
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => {
            setActionType('plan');
            setShowActionModal(true);
          }}
        >
          <FileText size={14} />
          Tạo Plan
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => {
            setActionType('followup');
            setShowActionModal(true);
          }}
        >
          <Plus size={14} />
          Follow-up
        </button>
      </div>

      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onSubmit={handleActionSubmit}
        type={actionType}
        source={{
          type: 'lead',
          id: storeId,
          name: storeName
        }}
      />
    </div>
  );
}
