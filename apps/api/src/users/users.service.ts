import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ok } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import type { UpdateAgreementDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertFromAuth(supabaseUser: SupabaseUser) {
    return this.prisma.user.upsert({
      where: { user_id: supabaseUser.id },
      update: { last_login_time: new Date() },
      create: {
        user_id: supabaseUser.id,
        email: supabaseUser.email ?? "",
        name: supabaseUser.user_metadata?.["name"] ?? "",
        nickname: supabaseUser.user_metadata?.["nickname"] ?? "",
        providers: [],
      },
    });
  }

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
      include: { translator: { select: { translator_id: true, is_deleted: true } } },
    });
    if (!user) throw new NotFoundException("사용자를 찾을 수 없습니다.");

    const is_translator = !!(user.translator && !user.translator.is_deleted);
    const authorization = {
      ...((user.authorization as Record<string, unknown>) ?? {}),
      is_translator,
    };

    return ok({ ...user, authorization });
  }

  async findOne(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        nickname: true,
        avatar: true,
        authorization: true,
        created_at: true,
      },
    });
    if (!user) throw new NotFoundException("사용자를 찾을 수 없습니다.");
    return ok(user);
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { user_id: userId },
      data: dto,
    });
    return ok(user);
  }

  async updateAgreement(userId: string, dto: UpdateAgreementDto) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!user) throw new NotFoundException();
    const prev = (user.agreement as Record<string, boolean>) ?? {};
    const updated = await this.prisma.user.update({
      where: { user_id: userId },
      data: { agreement: { ...prev, ...dto } },
    });
    return ok(updated);
  }

  async remove(userId: string) {
    await this.prisma.user.update({
      where: { user_id: userId },
      data: { is_deleted: true },
    });
    return ok(null);
  }
}
