import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    const inputClasses = [
      styles.input,
      icon && styles.inputWithIcon,
      error && styles.inputError,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          {icon && <span className={styles.inputIcon}>{icon}</span>}
          <input ref={ref} className={inputClasses} {...props} />
        </div>
        {error && <p className={`${styles.helperText} ${styles.errorText}`}>{error}</p>}
        {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
