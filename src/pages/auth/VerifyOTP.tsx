import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../app/components/ui/button';
import mappaLogo from 'figma:asset/79505e63e97894ec2d06837c57cf53a19680f611.png';
import styles from './Login.module.css';
import otpStyles from './VerifyOTP.module.css';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 số');
      return;
    }

    setLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      navigate('/overview');
    }, 1500);
  };

  const handleResend = () => {
    setResendCountdown(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
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
            <h1 className={styles.authTitle}>Xác thực OTP</h1>
            <p className={styles.authSubtitle}>
              Mã xác thực đã được gửi đến số điện thoại <strong>+84 90 123 4567</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <div className={otpStyles.otpInputs}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={otpStyles.otpInput}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {error && <p className={otpStyles.errorText}>{error}</p>}
            </div>

            <div className={otpStyles.resendSection}>
              {resendCountdown > 0 ? (
                <p className={otpStyles.resendText}>
                  Gửi lại mã sau {resendCountdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className={otpStyles.resendButton}
                >
                  Gửi lại mã
                </button>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Đang xác thực...' : 'Xác nhận'}
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
          <h2 className={styles.authRightTitle}>
            Bảo mật tài khoản
          </h2>
          <p className={styles.authRightDescription}>
            Xác thực hai yếu tố giúp bảo vệ tài khoản của bạn khỏi truy cập trái phép.
          </p>
        </div>
      </div>
    </div>
  );
}
