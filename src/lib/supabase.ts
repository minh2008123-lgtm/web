import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env?.VITE_SUPABASE_URL as string | undefined) || '';
const rawAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined) || '';

/**
 * Chốt chặn bảo mật Giai đoạn 3:
 * Tuyệt đối không cho phép sử dụng service_role key ở phía Frontend.
 */
function assertNotServiceRoleKey(key: string): boolean {
  if (!key) return false;
  try {
    const parts = key.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.role === 'service_role') {
        console.error(
          '[SECURITY BLOCK] Phát hiện service_role key ở Frontend! Đã chặn kết nối để bảo vệ RLS.'
        );
        return true;
      }
    }
  } catch {
    // ignore non-JWT placeholder
  }
  return key.toLowerCase().includes('service_role');
}

export const hasForbiddenServiceRoleKey = assertNotServiceRoleKey(rawAnonKey);

export const isSupabaseConfigured =
  Boolean(rawUrl && rawAnonKey) &&
  !rawUrl.includes('your-project-id') &&
  !rawAnonKey.includes('your-public-anon-key') &&
  !hasForbiddenServiceRoleKey;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(rawUrl, rawAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
