import React from 'react';
import { Download, FileJson, Terminal } from 'lucide-react';
import { restaurants } from '@/utils/data/restaurantData';

export function DataExportPanel() {
  const handleDownloadJSON = () => {
    const json = JSON.stringify(restaurants, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mappa-mock-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const json = JSON.stringify(restaurants, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert('✅ Đã copy JSON vào clipboard!');
    });
  };

  const handleLogConsole = () => {
    
    
    
    alert('✅ Đã log data vào Console. Mở DevTools (F12) để xem!');
  };

  const stats = {
    total: restaurants.length,
    certified: restaurants.filter(r => r.category === 'certified').length,
    hotspot: restaurants.filter(r => r.category === 'hotspot').length,
    scheduled: restaurants.filter(r => r.category === 'scheduled').length,
    inspected: restaurants.filter(r => r.category === 'inspected').length,
    businessTypes: [...new Set(restaurants.map(r => r.type))].length,
    districts: [...new Set(restaurants.map(r => r.district))].length,
    wards: [...new Set(restaurants.map(r => r.ward))].length,
  };

  return (
    <div style={{
      padding: 'var(--spacing-6)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      marginBottom: 'var(--spacing-6)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <FileJson size={24} style={{ color: 'var(--color-primary)' }} />
        <h3 style={{ 
          fontSize: 'var(--font-size-lg)', 
          fontWeight: '600',
          margin: 0,
          fontFamily: 'var(--font-family-base)'
        }}>
          Export Mock Data
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-5)'
      }}>
        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-primary)' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            Tổng điểm
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#10b981' }}>
            {stats.certified}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            Certified
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#ef4444' }}>
            {stats.hotspot}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            Hotspot
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#f59e0b' }}>
            {stats.scheduled}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            Scheduled
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: '#3b82f6' }}>
            {stats.inspected}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            Inspected
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-text)' }}>
            {stats.businessTypes}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            Loại hình
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-text)' }}>
            {stats.districts}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            Phường/Xã
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-text)' }}>
            {stats.wards}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            Phường/Xã
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
        <button
          onClick={handleDownloadJSON}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-3) var(--spacing-5)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family-base)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Download size={16} />
          Download JSON
        </button>

        <button
          onClick={handleCopyJSON}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-3) var(--spacing-5)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family-base)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
        >
          <FileJson size={16} />
          Copy JSON
        </button>

        <button
          onClick={handleLogConsole}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-3) var(--spacing-5)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family-base)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
        >
          <Terminal size={16} />
          Log to Console
        </button>
      </div>

      <div style={{
        marginTop: 'var(--spacing-4)',
        padding: 'var(--spacing-3)',
        backgroundColor: 'var(--color-background)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-family-base)'
      }}>
        💡 <strong>Tip:</strong> Bạn cũng có thể mở Console (F12) và chạy <code style={{
          padding: '2px 6px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'monospace'
        }}>exportMockData()</code> hoặc <code style={{
          padding: '2px 6px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'monospace'
        }}>exportMockDataToConsole()</code>
      </div>
    </div>
  );
}
