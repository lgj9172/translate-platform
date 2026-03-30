import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "../common/decorators/public.decorator";
import type { PrismaService } from "../prisma/prisma.service";
import type { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException("토큰이 없습니다.");

    const {
      data: { user },
      error,
    } = await this.supabase.admin.auth.getUser(token);

    if (error || !user)
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");

    // OAuth 최초 로그인 시 users 테이블에 레코드가 없으므로 자동 생성
    await this.syncUser(user);

    (request as Request & { user: SupabaseUser; accessToken: string }).user =
      user;
    (
      request as Request & { user: SupabaseUser; accessToken: string }
    ).accessToken = token;

    return true;
  }

  private async syncUser(user: SupabaseUser) {
    const provider = (user.app_metadata?.provider as string) ?? "";

    await this.prisma.user.upsert({
      where: { user_id: user.id },
      update: { last_login_time: new Date() },
      create: {
        user_id: user.id,
        email: user.email ?? "",
        name: user.user_metadata?.name ?? "",
        nickname:
          user.user_metadata?.nickname ?? user.user_metadata?.name ?? "",
        providers: provider ? [provider as never] : [],
      },
    });
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
