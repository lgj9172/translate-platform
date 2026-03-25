import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import { SupabaseService } from "../supabase/supabase.service";
import type {
  CreateCommentDto,
  CreateTranslationDto,
  QueryTranslationDto,
  UpdateTranslationDto,
} from "./translations.dto";

const FILES_BUCKET = "files";
const SIGNED_URL_EXPIRES = 60 * 60;

@Injectable()
export class TranslationsService {
  private readonly logger = new Logger(TranslationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async findAll(query: QueryTranslationDto) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;

    const where = {
      is_deleted: false,
      ...(query.status ? { status: query.status as never } : {}),
    };

    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.translation.findMany({ where, skip, take, orderBy: { created_at: "desc" } }),
      this.prisma.translation.count({ where }),
    ]);

    return paginated(data, total_count, data.length);
  }

  async findAllByTranslator(userId: string, query: QueryTranslationDto) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;

    const translator = await this.prisma.translator.findUnique({
      where: { user_id: userId },
    });

    if (!translator) return paginated([], 0, 0);

    const where = {
      is_deleted: false,
      quotations: {
        some: {
          translator_id: translator.translator_id,
          is_selected: true,
          is_deleted: false,
        },
      },
      ...(query.status ? { status: query.status as never } : {}),
    };

    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.translation.findMany({ where, skip, take, orderBy: { created_at: "desc" } }),
      this.prisma.translation.count({ where }),
    ]);

    return paginated(data, total_count, data.length);
  }

  async findAllByUser(userId: string, query: QueryTranslationDto) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;

    const where = {
      user_id: userId,
      is_deleted: false,
      ...(query.status ? { status: query.status as never } : {}),
    };

    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.translation.findMany({ where, skip, take, orderBy: { created_at: "desc" } }),
      this.prisma.translation.count({ where }),
    ]);

    return paginated(data, total_count, data.length);
  }

  async create(userId: string, dto: CreateTranslationDto) {
    const translation = await this.prisma.translation.create({
      data: {
        title: dto.title,
        source_language: dto.source_language,
        target_language: dto.target_language,
        categories: dto.categories,
        description: dto.description ?? "",
        source_files: dto.source_files as object[],
        target_files: [],
        deadline: new Date(dto.deadline),
        fee: dto.fee,
        sample: dto.sample ?? "",
        user_id: userId,
      },
    });
    return ok(translation);
  }

  async findOne(translationId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
      include: { quotations: { where: { is_deleted: false } } },
    });
    if (!translation) throw new NotFoundException("번역을 찾을 수 없습니다.");

    const sourceFiles = (translation.source_files ?? []) as Array<{ file_id?: string }>;
    const enrichedSourceFiles = await Promise.all(
      sourceFiles.map(async (sf) => {
        if (!sf.file_id) return sf;
        const file = await this.prisma.file.findUnique({ where: { file_id: sf.file_id } });
        if (!file) return sf;
        const path = `${file.user_id}/${file.file_id}.${file.extension.toLowerCase()}`;
        const { data, error } = await this.supabase.admin.storage
          .from(FILES_BUCKET)
          .createSignedUrl(path, SIGNED_URL_EXPIRES);
        if (error) this.logger.warn(`signed URL 생성 실패: ${error.message}`);
        return { ...sf, name: file.name, presigned_url: data?.signedUrl ?? null };
      }),
    );

    return ok({ ...translation, source_files: enrichedSourceFiles });
  }

  async update(translationId: string, userId: string, dto: UpdateTranslationDto) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.user_id !== userId) throw new ForbiddenException();

    const updated = await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: {
        ...dto,
        ...(dto.deadline ? { deadline: new Date(dto.deadline) } : {}),
      },
    });
    return ok(updated);
  }

  async remove(translationId: string, userId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.user_id !== userId) throw new ForbiddenException();

    await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: { is_deleted: true },
    });
    return ok(null);
  }

  async cancel(translationId: string, userId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.user_id !== userId) throw new ForbiddenException();

    await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: { is_canceled: true },
    });
    return ok(null);
  }

  async resolve(translationId: string, userId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.user_id !== userId) throw new ForbiddenException();

    await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: { status: "TRANSLATION_RESOLVED", resolved_at: new Date() },
    });
    return ok(null);
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  async getComments(translationId: string) {
    const comments = await this.prisma.translationComment.findMany({
      where: { translation_id: translationId },
      orderBy: { created_at: "asc" },
    });
    return ok(comments);
  }

  async addComment(translationId: string, userId: string, dto: CreateCommentDto) {
    const comment = await this.prisma.translationComment.create({
      data: { content: dto.content, user_id: userId, translation_id: translationId },
    });
    return ok(comment);
  }
}
