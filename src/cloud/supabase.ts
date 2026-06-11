/**
 * Single Supabase client + env helpers.
 * Якщо env-змінних нема — повертає `null` і весь хмарний модуль працює як no-op.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudEnabled = Boolean(URL && ANON);

let _client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (!cloudEnabled) return null;
  if (!_client) {
    _client = createClient(URL!, ANON!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}

export function functionsBaseUrl(): string {
  if (!URL) return '';
  return `${URL}/functions/v1`;
}
