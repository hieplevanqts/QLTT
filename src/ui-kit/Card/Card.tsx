import React, { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Card = ({ children, hoverable, onClick, className }: CardProps) => {
  const cardClasses = [
    styles.card,
    hoverable && styles.cardHoverable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const CardHeader = ({ title, description, action }: CardHeaderProps) => (
  <div className={styles.cardHeader}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h3 className={styles.cardTitle}>{title}</h3>
        {description && <p className={styles.cardDescription}>{description}</p>}
      </div>
      {action}
    </div>
  </div>
);

export const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={`${styles.cardContent} ${className || ''}`}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={`${styles.cardFooter} ${className || ''}`}>{children}</div>
);
