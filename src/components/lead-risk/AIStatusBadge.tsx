import { Sparkles, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './AIStatusBadge.module.css';

type AIStatus = 'analyzed' | 'processing' | 'high_confidence' | 'needs_review' | 'spam';

interface AIStatusBadgeProps {
  status: AIStatus;
  size?: 'sm' | 'md';
}

export function AIStatusBadge({ status, size = 'md' }: AIStatusBadgeProps) {
  const getContent = () => {
    switch (status) {
      case 'analyzed':
        return {
          icon: <Sparkles size={size === 'sm' ? 12 : 14} />,
          text: 'AI đã phân tích',
          variant: 'primary' as const,
        };
      case 'processing':
        return {
          icon: <Loader size={size === 'sm' ? 12 : 14} className={styles.spin} />,
          text: 'Đang phân tích...',
          variant: 'secondary' as const,
        };
      case 'high_confidence':
        return {
          icon: <CheckCircle size={size === 'sm' ? 12 : 14} />,
          text: 'Tin cậy cao',
          variant: 'success' as const,
        };
      case 'needs_review':
        return {
          icon: <AlertCircle size={size === 'sm' ? 12 : 14} />,
          text: 'Cần review',
          variant: 'warning' as const,
        };
      case 'spam':
        return {
          icon: <AlertCircle size={size === 'sm' ? 12 : 14} />,
          text: 'Spam/Trùng',
          variant: 'danger' as const,
        };
    }
  };

  const content = getContent();

  return (
    <span 
      className={styles.badge}
      data-variant={content.variant}
      data-size={size}
    >
      {content.icon}
      <span className={styles.text}>{content.text}</span>
    </span>
  );
}
