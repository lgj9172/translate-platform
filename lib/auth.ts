import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { forbidden, unauthorized } from "./errors";
import { prisma } from "./prisma";

// OAuth 최초 로그인 시 users 테이블에 레코드가 없으므로 자동 생성/갱신
async function syncUser(user: SupabaseUser) {
  const provider = (user.app_metadata?.provider as string) ?? "";

  await prisma.user.upsert({
    where: { user_id: user.id },
    update: { last_login_time: new Date() },
    create: {
      user_id: user.id,
      email: user.email ?? "",
      name: user.user_metadata?.name ?? "",
      nickname: user.user_metadata?.nickname ?? user.user_metadata?.name ?? "",
      providers: provider ? [provider as never] : [],
    },
  });
}

/**
 * 현재 쿠키 세션의 사용자를 검증한다. (기존 AuthGuard 대체)
 * 유효하면 Supabase 사용자 객체를 반환하고, users 테이블을 동기화한다.
 */
export async function requireUser(): Promise<SupabaseUser> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw unauthorized("유효하지 않은 세션입니다.");
  }

  await syncUser(user);
  return user;
}

/**
 * 세션이 있으면 사용자를, 없으면 null을 반환한다. (Public + optional user)
 */
export async function getOptionalUser(): Promise<SupabaseUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/**
 * 관리자 권한까지 검증한다. (기존 AdminGuard 대체)
 */
export async function requireAdmin(): Promise<SupabaseUser> {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { user_id: user.id },
    select: { authorization: true },
  });

  const isAdmin =
    (dbUser?.authorization as Record<string, boolean> | null)?.is_admin ===
    true;

  if (!isAdmin) {
    throw forbidden("관리자 권한이 필요합니다.");
  }

  return user;
}
