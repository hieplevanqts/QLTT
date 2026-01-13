import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import mappaLogo from 'figma:asset/79505e63e97894ec2d06837c57cf53a19680f611.png';
import styles from './Login.module.css';

export default function SessionExpired() {
  const navigate = useNavigate();

  return (
    <div className={styles.authLayout}>
      <div className={styles.authLeft}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.logo}>
              <img src={mappaLogo} alt="Mappa" className={styles.logoImage} />
              <span className={styles.logoText}>MAPPA</span>
            </div>
            
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F79009 0%, #FDB022 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={40} color="white" />
            </div>

            <h1 className={styles.authTitle}>Phiên đăng nhập hết hạn</h1>
            <p className={styles.authSubtitle}>
              Phiên làm việc của bạn đã hết hạn do không hoạt động trong thời gian dài.
              Vui lòng đăng nhập lại để tiếp tục.
            </p>
          </div>

          <div className={styles.form}>
            <Button onClick={() => navigate('/auth/login')} className="w-full">
              Đăng nhập lại
            </Button>

            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              backgroundColor: 'var(--muted)', 
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center'
            }}>
              <p style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--muted-foreground)', 
                margin: 0 
              }}>
                <strong>Lưu ý:</strong> Phiên làm việc sẽ tự động hết hạn sau 30 phút không hoạt động
                để đảm bảo an toàn thông tin.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authRightContent}>
          <h2 className={styles.authRightTitle}>Bảo mật thông tin</h2>
          <p className={styles.authRightDescription}>
            Hệ thống tự động đăng xuất sau thời gian không hoạt động để bảo vệ
            dữ liệu nhạy cảm và thông tin quản lý thị trường.
          </p>
        </div>
      </div>
    </div>
  );
}
