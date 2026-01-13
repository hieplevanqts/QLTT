import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css';

interface BackButtonProps {
  to?: string;
  label?: string;
  onClick?: () => void;
}

export function BackButton({ to, label = 'Quay lại', onClick }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      className={styles.backButton}
      onClick={handleClick}
      title={label}
    >
      <ArrowLeft size={20} />
    </button>
  );
}
