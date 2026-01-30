import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, ArrowLeft } from 'lucide-react';
import { Input } from '../@/components/ui-kit/Input/Input';
import { Button } from '../@/components/ui/button';
import mappaLogo from '../../assets/79505e63e97894ec2d06837c57cf53a19680f611.png';
import styles from './Login.module.css';
import resetStyles from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<'phone' | 'email'>('phone');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending reset link/OTP
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className={styles.authLayout}>
        <div className={styles.authLeft}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <div className={resetStyles.successIcon}>✓</div>
              <h1 className={styles.authTitle}>Kiểm tra {inputMode === 'phone' ? 'tin nhắn' : 'email'}</h1>
              <p className={styles.authSubtitle}>
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến {inputMode === 'phone' ? 'số điện thoại' : 'email'} của bạn
              </p>
            </div>

            <div className={styles.form}>
              <Button onClick={() => navigate('/auth/login')} className="w-full">
                Quay lại đăng nhập
              </Button>
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                  Không nhận được?{' '}
                </span>
                <button
                  onClick={() => setSubmitted(false)}
                  className={styles.toggleLink}
                >
                  Gửi lại
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.authRight}>
          <div className={styles.authRightContent}>
            <h2 className={styles.authRightTitle}>Khôi phục tài khoản</h2>
            <p className={styles.authRightDescription}>
              Làm theo hướng dẫn để đặt lại mật khẩu và truy cập lại hệ thống.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authLayout}>
      <div className={styles.authLeft}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.logo}>
              <img src={mappaLogo} alt="Mappa" className={styles.logoImage} />
              <span className={styles.logoText}>MAPPA</span>
            </div>
            <h1 className={styles.authTitle}>Quên mật khẩu?</h1>
            <p className={styles.authSubtitle}>
              Nhập {inputMode === 'phone' ? 'số điện thoại' : 'email'} để nhận hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <Input
                label={inputMode === 'phone' ? 'Số điện thoại' : 'Email'}
                type={inputMode === 'phone' ? 'tel' : 'email'}
                placeholder={inputMode === 'phone' ? '+84 90 123 4567' : 'email@example.com'}
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                icon={inputMode === 'phone' ? <Phone size={18} /> : <Mail size={18} />}
                required
              />
              <div className={styles.inputModeToggle}>
                <a
                  className={styles.toggleLink}
                  onClick={() => {
                    setInputMode(inputMode === 'phone' ? 'email' : 'phone');
                    setPhoneOrEmail('');
                  }}
                >
                  {inputMode === 'phone' ? 'Dùng email' : 'Dùng số điện thoại'}
                </a>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Đang gửi...' : 'Gửi hướng dẫn'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/auth/login')}
              className="w-full gap-2"
            >
              <ArrowLeft size={18} />
              Quay lại đăng nhập
            </Button>
          </form>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authRightContent}>
          <h2 className={styles.authRightTitle}>Cần trợ giúp?</h2>
          <p className={styles.authRightDescription}>
            Liên hệ bộ phận hỗ trợ kỹ thuật qua hotline 1900-xxxx hoặc email support@mappa.vn
            nếu bạn gặp khó khăn trong việc khôi phục tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
}
