import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#f9fafb',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Đã xảy ra lỗi
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại sau.
            </p>
            {this.state.error && (
              <details style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                textAlign: 'left'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#991b1b',
                  marginBottom: '8px'
                }}>
                  Chi tiết lỗi
                </summary>
                <pre style={{
                  fontSize: '12px',
                  color: '#7f1d1d',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#005cb6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#004a94'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#005cb6'}
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
