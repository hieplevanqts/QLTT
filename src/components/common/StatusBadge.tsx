import React from 'react';
import styles from './StatusBadge.module.css';

export type StatusBadgeSize = 'sm' | 'md' | 'lg';

export interface StatusBadgeProps {
  /** The text to display inside the badge */
  label: string;
  /** Optional theme variant that matches a class in StatusBadge.module.css (e.g. 'draft', 'active', 'completed') */
  variant?: string;
  /** Optional hex, rgb, or css color for the background. Overrides variable-based styles. */
  backgroundColor?: string;
  /** Optional hex, rgb, or css color for the text. Overrides variable-based styles. */
  color?: string;
  /** Size of the badge */
  size?: StatusBadgeSize;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * A generic, independent Status Badge component.
 * It is not tied to any domain logic and simply renders the provided label and styles.
 */
export function StatusBadge({ 
  label, 
  variant, 
  backgroundColor, 
  color, 
  size = 'md', 
  className,
  style
}: StatusBadgeProps) {
  const combinedStyle: React.CSSProperties = {
    backgroundColor,
    color,
    ...style
  };

  // Resolve variant class from CSS Modules
  // If variant is provided and exists in styles, use it. 
  // Otherwise, use variant string as is (for global classes)
  const variantClass = variant && styles[variant] ? styles[variant] : (variant || '');

  const badgeClass = [
    styles.badge,
    variantClass,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClass} style={combinedStyle}>
      {label}
    </span>
  );
}

export default StatusBadge;
