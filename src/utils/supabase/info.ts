/* Supabase config loaded from Vite environment variables. */

function extractProjectIdFromUrl(url: string): string {
  try {
    const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

// @ts-ignore - import.meta.env is provided by Vite
const envProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || '';
// @ts-ignore - import.meta.env is provided by Vite
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
// @ts-ignore - import.meta.env is provided by Vite
const envPublicAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY || '';
// @ts-ignore - import.meta.env is provided by Vite
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const projectId = envProjectId || extractProjectIdFromUrl(envUrl);
export const publicAnonKey = envPublicAnonKey || envAnonKey;

if (!projectId) {
  console.warn(
    'Supabase projectId is missing. Set VITE_SUPABASE_PROJECT_ID or VITE_SUPABASE_URL in .env.'
  );
}

if (!publicAnonKey) {
  console.warn(
    'Supabase anon key is missing. Set VITE_SUPABASE_PUBLIC_ANON_KEY or VITE_SUPABASE_ANON_KEY in .env.'
  );
}
