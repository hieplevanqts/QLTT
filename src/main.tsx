import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

// Global error handler để bắt và suppress lỗi "No checkout popup config found"
// Lỗi này đến từ Supabase khi có tính năng checkout/billing không được config
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;
  if (
    error?.message?.includes('No checkout popup config found') ||
    error?.message?.includes('checkout') && error?.message?.includes('popup')
  ) {
    // Suppress lỗi checkout popup vì chúng ta không sử dụng tính năng này
    event.preventDefault();
    console.warn('⚠️ Supabase checkout popup error suppressed (feature not used):', error.message);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
