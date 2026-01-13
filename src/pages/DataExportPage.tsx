import React from 'react';
import PageHeader from '../layouts/PageHeader';
import { DataExportPanel } from '../app/components/DataExportPanel';

export default function DataExportPage() {
  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 7.5rem)' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xuất dữ liệu' }
        ]}
        title="Xuất dữ liệu Mock"
      />

      <div style={{ 
        padding: 'var(--spacing-6)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <DataExportPanel />
        
        <div style={{
          marginTop: 'var(--spacing-6)',
          padding: 'var(--spacing-6)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: '600',
            marginBottom: 'var(--spacing-4)',
            fontFamily: 'var(--font-family-base)'
          }}>
            📖 Hướng dẫn sử dụng
          </h3>
          
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-4)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family-base)',
            color: 'var(--color-text-secondary)'
          }}>
            <div>
              <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                1. Download JSON File
              </strong>
              <p>Click button "Download JSON" để tải file JSON chứa toàn bộ 800 điểm mock data về máy.</p>
            </div>
            
            <div>
              <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                2. Copy JSON
              </strong>
              <p>Click button "Copy JSON" để copy toàn bộ JSON data vào clipboard, sau đó paste vào editor hoặc tool khác.</p>
            </div>
            
            <div>
              <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                3. Log to Console
              </strong>
              <p>Click button "Log to Console" để xem data trong DevTools Console. Mở Console (F12) để xem chi tiết.</p>
            </div>
            
            <div>
              <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                4. Sử dụng trong Code
              </strong>
              <p>Import trực tiếp từ code:</p>
              <pre style={{
                marginTop: 'var(--spacing-2)',
                padding: 'var(--spacing-3)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-md)',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: 'var(--font-size-xs)'
              }}>
{`import { restaurants } from './src/data/restaurantData';

// Sử dụng data
console.log(restaurants.length); // 800

// Lọc theo category
const hotspots = restaurants.filter(r => r.category === 'hotspot');

// Export to JSON
const json = JSON.stringify(restaurants, null, 2);`}
              </pre>
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: 'var(--spacing-6)',
          padding: 'var(--spacing-5)',
          backgroundColor: '#eff6ff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #dbeafe'
        }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <div style={{ fontSize: '24px' }}>💡</div>
            <div>
              <strong style={{ 
                color: '#1e40af',
                display: 'block',
                marginBottom: 'var(--spacing-2)',
                fontFamily: 'var(--font-family-base)'
              }}>
                Console Functions
              </strong>
              <p style={{ 
                fontSize: 'var(--font-size-sm)',
                color: '#1e3a8a',
                fontFamily: 'var(--font-family-base)',
                lineHeight: 1.6
              }}>
                Bạn cũng có thể mở Console (F12) và chạy trực tiếp:
              </p>
              <ul style={{
                marginTop: 'var(--spacing-2)',
                paddingLeft: 'var(--spacing-5)',
                fontSize: 'var(--font-size-sm)',
                color: '#1e3a8a',
                fontFamily: 'var(--font-family-base)',
                lineHeight: 1.8
              }}>
                <li><code style={{
                  padding: '2px 6px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'monospace',
                  fontSize: 'var(--font-size-xs)'
                }}>exportMockData()</code> - Download file JSON</li>
                <li><code style={{
                  padding: '2px 6px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'monospace',
                  fontSize: 'var(--font-size-xs)'
                }}>exportMockDataToConsole()</code> - Log data ra console</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
