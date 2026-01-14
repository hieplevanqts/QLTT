/**
 * Supabase Configuration
 * Đọc từ biến môi trường để bảo mật thông tin credentials
 * 
 * Cấu hình trong file .env (ưu tiên):
 * - VITE_SUPABASE_PROJECT_ID: Project ID của Supabase (chỉ ID, không phải full URL)
 * - VITE_SUPABASE_PUBLIC_ANON_KEY: Public anonymous key của Supabase
 * 
 * Hoặc có thể sử dụng:
 * - VITE_SUPABASE_URL: Full URL (sẽ extract projectId từ URL)
 * - VITE_SUPABASE_ANON_KEY: Anon key (fallback nếu không có PUBLIC_ANON_KEY)
 * 
 * Lấy thông tin tại: https://app.supabase.com/project/_/settings/api
 */

// Hàm extract projectId từ URL
function extractProjectIdFromUrl(url: string): string {
  try {
    // Format: https://<project-id>.supabase.co
    const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

// Đọc từ biến môi trường Vite (import.meta.env)
// @ts-ignore - import.meta.env is available in Vite
const envProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || '';
// @ts-ignore
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
// @ts-ignore
const envPublicAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY || '';
// @ts-ignore
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Xác định projectId (ưu tiên VITE_SUPABASE_PROJECT_ID, sau đó extract từ URL)
export const projectId = envProjectId || extractProjectIdFromUrl(envUrl);

// Xác định publicAnonKey (ưu tiên VITE_SUPABASE_PUBLIC_ANON_KEY, sau đó VITE_SUPABASE_ANON_KEY)
export const publicAnonKey = envPublicAnonKey || envAnonKey;

// Validate environment variables
if (!projectId) {
  console.warn(
    '⚠️ VITE_SUPABASE_PROJECT_ID hoặc VITE_SUPABASE_URL chưa được cấu hình. ' +
    'Vui lòng thêm vào file .env. Xem README.md để biết cách cấu hình.'
  );
}

if (!publicAnonKey) {
  console.warn(
    '⚠️ VITE_SUPABASE_PUBLIC_ANON_KEY hoặc VITE_SUPABASE_ANON_KEY chưa được cấu hình. ' +
    'Vui lòng thêm vào file .env. Xem README.md để biết cách cấu hình.'
  );
}