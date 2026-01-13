import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Login.module.css';
import mappaLogo from '../../../assets/79505e63e97894ec2d06837c57cf53a19680f611.png';
import dashboardPreview from '../../../assets/1335c3f0fc5233b65c4a3fb13a990d8063ab0c64.png';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      
      if (!result.success) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
        return;
      }

      if (result.requiresUnitSelection) {
        // Navigate to unit selection page
        navigate('/auth/select-unit');
      } else {
        // Success - navigate to main app
        navigate('/');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Side - Login Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          {/* Logo */}
          <div className={styles.logoSection}>
            <img src={mappaLogo} alt="MAPPA Logo" className={styles.logoImage} />
          </div>

          {/* Header */}
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Đăng nhập</h2>
            <p className={styles.formSubtitle}>
              Nhập thông tin tài khoản của bạn để tiếp tục
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Username */}
            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>
                Tên đăng nhập *
              </label>
              <input
                id="username"
                type="text"
                className={styles.input}
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Mật khẩu *
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className={styles.formActions}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => navigate('/auth/forgot-password')}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className={styles.spinner} />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className={styles.formFooter}>
            <button
              type="button"
              className={styles.footerLink}
              onClick={() => navigate('/auth/help')}
            >
              <HelpCircle size={16} />
              Trợ giúp đăng nhập
            </button>
            <span className={styles.separator}>•</span>
            <button
              type="button"
              className={styles.footerLink}
              onClick={() => navigate('/auth/policy')}
            >
              Chính sách bảo mật
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard Preview */}
      <div className={styles.brandingSide}>
        <div className={styles.brandingContent}>
          <div className={styles.textContent}>
            <h1 className={styles.brandingTitle}>
              Quản lý hiệu quả hệ thống thị trường của bạn
            </h1>
            <p className={styles.brandingSubtitle}>
              Đăng nhập để truy cập dashboard MAPPA và quản lý toàn bộ hoạt động của bạn
            </p>
          </div>
          
          <div className={styles.dashboardPreview}>
            <img 
              src={dashboardPreview} 
              alt="MAPPA Dashboard Preview" 
              className={styles.dashboardImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}