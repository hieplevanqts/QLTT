import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PasswordInput } from '../../ui-kit/PasswordInput/PasswordInput';
import { Button } from '../../app/components/ui/button';
import mappaLogo from 'figma:asset/79505e63e97894ec2d06837c57cf53a19680f611.png';
import styles from './Login.module.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      setLoading(false);
      navigate('/auth/login');
    }, 1500);
  };

  return (
    <div className={styles.authLayout}>
      <div className={styles.authLeft}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.logo}>
              <img src={mappaLogo} alt="Mappa" className={styles.logoImage} />
              <span className={styles.logoText}>MAPPA</span>
            </div>
            <h1 className={styles.authTitle}>Đặt lại mật khẩu</h1>
            <p className={styles.authSubtitle}>
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <PasswordInput
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              showStrength
              required
            />

            <PasswordInput
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error}
              required
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/auth/login')}
              className="w-full"
            >
              Quay lại đăng nhập
            </Button>
          </form>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authRightContent}>
          <h2 className={styles.authRightTitle}>Mật khẩu mạnh</h2>
          <p className={styles.authRightDescription}>
            Sử dụng ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
            để tạo mật khẩu an toàn.
          </p>
        </div>
      </div>
    </div>
  );
}
