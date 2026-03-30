import { Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  /** 서비스 롤 클라이언트 — RLS를 우회하는 서버 전용 작업에 사용 */
  readonly admin: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    this.admin = createClient(
      config.getOrThrow<string>("SUPABASE_URL"),
      config.getOrThrow<string>("SUPABASE_SERVICE_ROLE_KEY"),
    );
  }

  /** 사용자 액세스 토큰으로 RLS가 적용된 클라이언트를 생성 */
  forUser(accessToken: string): SupabaseClient {
    return createClient(
      this.config.getOrThrow<string>("SUPABASE_URL"),
      this.config.getOrThrow<string>("SUPABASE_ANON_KEY"),
      {
        global: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      },
    );
  }
}
