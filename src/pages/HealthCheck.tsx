/**
 * Health Check Component
 * Minimal component to verify app is rendering correctly in Figma Make editor
 */

export default function HealthCheck() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Inter, sans-serif',
      color: '#101828',
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#005cb6',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
        }}>
          ✓
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '0.5rem',
        }}>
          MAPPA Portal
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#667085',
          marginBottom: '1rem',
        }}>
          App is running successfully
        </p>
        <div style={{
          backgroundColor: '#f2f4f7',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#344054',
        }}>
          <div><strong>Status:</strong> Ready</div>
          <div><strong>Type:</strong> Pure Frontend</div>
          <div><strong>Backend:</strong> None</div>
          <div><strong>Storage:</strong> localStorage</div>
        </div>
      </div>
    </div>
  );
}
