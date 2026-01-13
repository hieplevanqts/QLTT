import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { Input } from '../../ui-kit/Input/Input';
import { PasswordInput } from '../../ui-kit/PasswordInput/PasswordInput';
import { Button } from '../../app/components/ui/button';
import mappaLogo from '../../assets/79505e63e97894ec2d06837c57cf53a19680f611.png';
import dashboardMockup from '../../assets/2b1097cb77fa180f7d977d1131a32542b655ede2.png';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<'phone' | 'email'>('phone');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/auth/select-jurisdiction');
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
            <h1 className={styles.authTitle}>Chào mừng quay trở lại</h1>
            <p className={styles.authSubtitle}>
              Đăng nhập để tiếp tục quản lý và giám sát
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

            <PasswordInput
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className={styles.formOptions}>
              <label className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={styles.checkboxLabel}>Ghi nhớ đăng nhập</span>
              </label>
              <a href="/auth/forgot-password" className={styles.forgotPassword}>
                Quên mật khẩu?
              </a>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className={styles.authFooter}>
            <p className={styles.helpText}>
              Cần trợ giúp? <a href="#" className={styles.helpLink}>Liên hệ bộ phận hỗ trợ</a>
            </p>
            <div className={styles.authFooterLinks}>
              <a href="#" className={styles.footerLink}>Chính sách bảo mật</a>
              <span className={styles.divider}>•</span>
              <a href="#" className={styles.footerLink}>Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authRightContent}>
          <div className={styles.marketingSection}>
            <h2 className={styles.marketingTitle}>
              Quản lý thị trường<br />
              thông minh và hiệu quả
            </h2>
            <p className={styles.marketingSubtitle}>
              Đăng nhập để truy cập vào hệ thống quản lý và giám sát cơ sở kinh doanh trên toàn địa bàn.
            </p>
            
            <div className={styles.dashboardMockupContainer}>
              <img 
                src={dashboardMockup} 
                alt="MAPPA Dashboard Preview" 
                className={styles.dashboardMockup}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}