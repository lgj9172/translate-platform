import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 서비스 롤 클라이언트 — RLS를 우회하는 서버 전용 작업(Storage, 토큰 검증)에 사용
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  adminClient = createClient(url, serviceRoleKey);
  return adminClient;
}
