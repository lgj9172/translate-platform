import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Request } from "express";
import { IS_ADMIN_KEY } from "../common/decorators/admin.decorator";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isAdmin) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const supabaseUser = (request as Request & { user: SupabaseUser }).user;
    if (!supabaseUser) throw new ForbiddenException();

    const user = await this.prisma.user.findUnique({
      where: { user_id: supabaseUser.id },
      select: { authorization: true },
    });

    const isAdminUser =
      (user?.authorization as Record<string, boolean> | null)?.is_admin === true;

    if (!isAdminUser) throw new ForbiddenException("관리자 권한이 필요합니다.");
    return true;
  }
}
