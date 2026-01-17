import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import styles from './PlanTaskBoard.module.css';

export function PlanTaskBoard() {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/plans')}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Bảng tác nghiệp</h1>
          <p className={styles.subtitle}>Quản lý và theo dõi tiến độ các nhiệm vụ kiểm tra</p>
        </div>
      </div>

      <div className={styles.content}>
        <p>Task board content for plan: {planId}</p>
      </div>
    </div>
  );
}
