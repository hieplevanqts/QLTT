import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, InputProps } from '../Input/Input';
import styles from './PasswordInput.module.css';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = (password: string): { level: number; label: string; color: string } => {
      if (!password) return { level: 0, label: '', color: '' };
      
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[^a-zA-Z0-9]/.test(password)) strength++;

      if (strength <= 1) return { level: 1, label: 'Yếu', color: '#D92D20' };
      if (strength === 2) return { level: 2, label: 'Trung bình', color: '#F79009' };
      if (strength === 3) return { level: 3, label: 'Khá', color: '#12B76A' };
      return { level: 4, label: 'Mạnh', color: '#12B76A' };
    };

    const strength = showStrength && value ? getPasswordStrength(value as string) : null;

    return (
      <div>
        <div className={styles.wrapper}>
          <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            {...props}
          />
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        {strength && (
          <div className={styles.strengthMeter}>
            <div className={styles.strengthBar}>
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={styles.strengthSegment}
                  style={{
                    backgroundColor: level <= strength.level ? strength.color : 'var(--muted)',
                  }}
                />
              ))}
            </div>
            <span className={styles.strengthLabel} style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
