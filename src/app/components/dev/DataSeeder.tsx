import React, { useState } from 'react';
import { seedRestaurants, deleteAllRestaurants } from '../../../utils/api/restaurantApi';
import { restaurants } from '../../../data/restaurantData';
import { Upload, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DataSeederProps {
  isVisible: boolean;
}

export function DataSeeder({ isVisible }: DataSeederProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [hideAfterSeed, setHideAfterSeed] = useState(false);

  // Don't render if not visible OR if hidden after successful seed
  if (!isVisible || hideAfterSeed) {
    return null;
  }

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      setMessage({ type: 'info', text: `Đang seed ${restaurants.length} hộ kinh doanh...` });

      console.log('🌱 Starting seed process...');
      console.log(`📊 Total restaurants to seed: ${restaurants.length}`);
      
      const result = await seedRestaurants(restaurants);
      
      console.log('✅ Seed successful:', result);
      
      setMessage({ 
        type: 'success', 
        text: `✅ ${result.message}. Đang tải lại trang...` 
      });
      
      // Mark as seeded in localStorage so we can hide on next refresh
      localStorage.setItem('mappa_data_seeded', 'true');
      
      // Auto-reload page after 1.5 seconds to show the data
      setTimeout(() => {
        console.log('🔄 Reloading page to show seeded data...');
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('❌ Seed error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      setMessage({ 
        type: 'error', 
        text: `❌ Lỗi khi seed dữ liệu: ${error.message}` 
      });
      setIsSeeding(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa TẤT CẢ dữ liệu trong KV store?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setMessage({ type: 'info', text: 'Đang xóa dữ liệu...' });

      const result = await deleteAllRestaurants();
      
      setMessage({ 
        type: 'success', 
        text: `✅ ${result.message}` 
      });
      
      console.log('Delete result:', result);
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Lỗi khi xóa dữ liệu: ${error.message}` 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 10000,
      maxWidth: '400px'
    }}>
      <div style={{
        background: 'white',
        border: '2px solid var(--primary)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            ⚙️
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827'
            }}>
              Database Setup Required
            </h3>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#6b7280'
            }}>
              Development Tool
            </p>
          </div>
        </div>

        <div style={{
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#92400e',
            lineHeight: '1.5'
          }}>
            ⚠️ <strong>Database trống!</strong> Bạn cần seed dữ liệu mẫu để xem bản đồ hoạt động.
          </p>
        </div>

        {message && (
          <div style={{
            background: message.type === 'error' ? '#fee2e2' : 
                       message.type === 'success' ? '#dcfce7' : '#dbeafe',
            border: `1px solid ${message.type === 'error' ? '#ef4444' : 
                                  message.type === 'success' ? '#22c55e' : '#3b82f6'}`,
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: message.type === 'error' ? '#991b1b' : 
                     message.type === 'success' ? '#166534' : '#1e40af',
              lineHeight: '1.5'
            }}>
              {message.text}
            </p>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <button
            onClick={handleSeed}
            disabled={isSeeding || isDeleting}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: isSeeding ? '#9ca3af' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isSeeding || isDeleting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isSeeding ? (
              <>
                <span className="spinner" style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Đang seed...
              </>
            ) : (
              <>
                <span style={{ fontSize: '16px' }}>📦</span>
                Seed 1000 Records
              </>
            )}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting || isSeeding}
            style={{
              padding: '12px 16px',
              background: 'white',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isDeleting || isSeeding ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {isDeleting ? (
              <>
                <span className="spinner" style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(239,68,68,0.3)',
                  borderTopColor: '#ef4444',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
              </>
            ) : (
              <>🗑️</>
            )}
          </button>
        </div>

        <p style={{
          margin: 0,
          fontSize: '12px',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          💡 Seed data bao gồm 1000 hộ kinh doanh với đầy đủ thông tin địa bàn Hà Nội.
        </p>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    </div>
  );
}