/**
 * Locality Form Demo - MAPPA Portal
 * Trang demo cho form "Chỉnh sửa địa bàn" với conditional logic
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import styles from './AdminPage.module.css';
import { LocalityModal } from '../components/LocalityModal';

export const LocalityFormDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  const handleOpenModal = (mode: 'add' | 'edit' | 'view') => {
    setModalMode(mode);
    setShowModal(true);
  };

  const handleSave = () => {
    console.log('✅ Saved successfully');
  };

  return (
    <div style={{ 
      padding: 'var(--spacing-6, 24px)',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-6, 24px)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-3, 12px)',
          marginBottom: 'var(--spacing-3, 12px)',
        }}>
          <MapPin size={28} style={{ color: 'var(--primary, #005cb6)' }} />
          <h1 style={{ 
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            Demo: Form Chỉnh sửa Địa bàn
          </h1>
        </div>
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '15px',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Form với conditional logic: Trường "Cấp" điều khiển việc hiển thị dropdown Tỉnh/Thành phố và Xã/Phường. 
          Dropdown "Người phụ trách" có khả năng tìm kiếm thực thể từ bảng users.
        </p>
      </div>

      {/* Demo Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--spacing-4, 16px)',
      }}>
        {/* Add Mode Card */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: 'var(--spacing-5, 20px)',
          transition: 'all 0.2s',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-3, 12px)',
          }}>
            Chế độ Thêm mới
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-4, 16px)',
            lineHeight: 1.5,
          }}>
            Mở form ở chế độ thêm địa bàn mới. Tất cả các trường đều có thể chỉnh sửa.
          </p>
          <button 
            className={styles.btnPrimary}
            onClick={() => handleOpenModal('add')}
            style={{ width: '100%' }}
          >
            <Plus size={16} />
            Thêm địa bàn mới
          </button>
        </div>

        {/* Edit Mode Card */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: 'var(--spacing-5, 20px)',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-3, 12px)',
          }}>
            Chế độ Chỉnh sửa
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-4, 16px)',
            lineHeight: 1.5,
          }}>
            Mở form ở chế độ chỉnh sửa địa bàn hiện có. Các trường có thể chỉnh sửa.
          </p>
          <button 
            className={styles.btnPrimary}
            onClick={() => handleOpenModal('edit')}
            style={{ width: '100%' }}
          >
            Chỉnh sửa địa bàn
          </button>
        </div>

        {/* View Mode Card */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: 'var(--spacing-5, 20px)',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-3, 12px)',
          }}>
            Chế độ Xem
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-4, 16px)',
            lineHeight: 1.5,
          }}>
            Mở form ở chế độ xem chi tiết địa bàn. Tất cả các trường đều chỉ đọc.
          </p>
          <button 
            className={styles.btnPrimary}
            onClick={() => handleOpenModal('view')}
            style={{ width: '100%' }}
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      {/* Features List */}
      <div style={{
        marginTop: 'var(--spacing-6, 24px)',
        background: 'linear-gradient(135deg, rgba(0, 92, 182, 0.05) 0%, rgba(0, 92, 182, 0.08) 100%)',
        border: '1px solid rgba(0, 92, 182, 0.2)',
        borderRadius: 'var(--radius-lg, 12px)',
        padding: 'var(--spacing-5, 20px)',
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--primary, #005cb6)',
          marginBottom: 'var(--spacing-4, 16px)',
        }}>
          ✨ Tính năng nổi bật
        </h3>
        <ul style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          margin: 0,
          paddingLeft: '24px',
        }}>
          <li>
            <strong>Conditional Logic:</strong> Trường "Cấp" tự động hiển thị/ẩn dropdown Tỉnh/Thành phố và Xã/Phường
          </li>
          <li>
            <strong>Cascading Dropdown:</strong> Khi chọn Tỉnh/Thành phố, dropdown Xã/Phường sẽ tự động filter theo tỉnh đã chọn
          </li>
          <li>
            <strong>Searchable User Dropdown:</strong> Tìm kiếm người phụ trách theo tên hoặc email với UI đẹp mắt
          </li>
          <li>
            <strong>Grid Layout 2 cột:</strong> Bố cục responsive, dễ nhìn và chuyên nghiệp
          </li>
          <li>
            <strong>Design System:</strong> Tuân thủ design tokens từ theme.css, dễ dàng customize
          </li>
          <li>
            <strong>Validation:</strong> Kiểm tra đầy đủ dữ liệu trước khi submit
          </li>
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <LocalityModal
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default LocalityFormDemo;
