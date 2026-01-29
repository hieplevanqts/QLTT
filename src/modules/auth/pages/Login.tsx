import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { loginRequest, clearError } from '@/store/slices/authSlice';
import { RootState } from '../../../store/rootReducer';
import styles from './Login.module.css';
import mappaLogo from '@/assets/79505e63e97894ec2d06837c57cf53a19680f611.png';
import dashboardPreview from '@/assets/1335c3f0fc5233b65c4a3fb13a990d8063ab0c64.png';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux
  const { isAuthenticated, isLoading, error: authError } = useAppSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated (only once)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Get the redirect location from state, or default to home
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  // Clear error when user starts typing (only once per error)
  useEffect(() => {
    if (authError && (email || password)) {
      // Clear error when user starts typing new input
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [email, password, authError, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      return;
    }

    // Dispatch login action
    dispatch(loginRequest({ email: email.trim(), password }));
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--background)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--border)',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            fontSize: '14px',
            color: 'var(--muted-foreground)',
            fontWeight: 500
          }}>Đang tải...</div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

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
          {authError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="Nhập email đăng nhập"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
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
              disabled={isLoading || !email.trim() || !password.trim()}
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
