import {
  BadRequestException,
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
  SubmitTranslationDto,
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

    // status 미지정 시 기본값: QUOTE_SENT (견적 모집 중인 것만 마켓플레이스에 노출)
    const where = {
      is_deleted: false,
      is_canceled: false,
      status: (query.status ?? "QUOTE_SENT") as never,
    };

    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.translation.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
      }),
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
      this.prisma.translation.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
      }),
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
      this.prisma.translation.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
      }),
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

  async findOne(translationId: string, userId?: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
      include: { quotations: { where: { is_deleted: false } } },
    });
    if (!translation) throw new NotFoundException("번역을 찾을 수 없습니다.");

    const isOwner = !!userId && translation.user_id === userId;
    let canSeeFiles = isOwner;

    if (!isOwner && userId) {
      const translator = await this.prisma.translator.findUnique({
        where: { user_id: userId },
      });
      if (translator) {
        const selected = await this.prisma.quotation.findFirst({
          where: {
            translation_id: translationId,
            translator_id: translator.translator_id,
            is_selected: true,
          },
        });
        canSeeFiles = !!selected;
      }
    }

    const sourceFiles = (translation.source_files ?? []) as Array<{
      file_id?: string;
    }>;
    const enrichedSourceFiles = await Promise.all(
      sourceFiles.map(async (sf) => {
        if (!sf.file_id) return sf;
        if (!canSeeFiles) return { ...sf, presigned_url: null };
        const file = await this.prisma.file.findUnique({
          where: { file_id: sf.file_id },
        });
        if (!file) return sf;
        const path = `${file.user_id}/${file.file_id}.${file.extension.toLowerCase()}`;
        const { data, error } = await this.supabase.admin.storage
          .from(FILES_BUCKET)
          .createSignedUrl(path, SIGNED_URL_EXPIRES);
        if (error) this.logger.warn(`signed URL 생성 실패: ${error.message}`);
        return {
          ...sf,
          name: file.name,
          presigned_url: data?.signedUrl ?? null,
        };
      }),
    );

    return ok({ ...translation, source_files: enrichedSourceFiles });
  }

  private async getTranslatorByUserId(userId: string) {
    const translator = await this.prisma.translator.findUnique({
      where: { user_id: userId },
    });
    if (!translator) throw new ForbiddenException("번역사 프로필이 없습니다.");
    return translator;
  }

  private async assertIsSelectedTranslator(
    translationId: string,
    translatorId: string,
  ) {
    const selected = await this.prisma.quotation.findFirst({
      where: {
        translation_id: translationId,
        translator_id: translatorId,
        is_selected: true,
      },
    });
    if (!selected)
      throw new ForbiddenException("이 번역의 선택된 번역사가 아닙니다.");
  }

  async start(translationId: string, userId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.status !== "TRANSLATOR_SELECTED")
      throw new BadRequestException("번역을 시작할 수 없는 상태입니다.");

    const translator = await this.getTranslatorByUserId(userId);
    await this.assertIsSelectedTranslator(
      translationId,
      translator.translator_id,
    );

    await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: { status: "TRANSLATION_BEGAN" },
    });
    return ok(null);
  }

  async submit(
    translationId: string,
    userId: string,
    dto: SubmitTranslationDto,
  ) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (
      !["TRANSLATION_BEGAN", "TRANSLATION_EDIT_REQUESTED"].includes(
        translation.status as string,
      )
    )
      throw new BadRequestException("번역을 제출할 수 없는 상태입니다.");

    const translator = await this.getTranslatorByUserId(userId);
    await this.assertIsSelectedTranslator(
      translationId,
      translator.translator_id,
    );

    await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: { status: "TRANSLATION_SUBMITTED", target_files: dto.target_files },
    });
    return ok(null);
  }

  async confirm(translationId: string, userId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.user_id !== userId) throw new ForbiddenException();
    if (translation.status !== "TRANSLATION_SUBMITTED")
      throw new BadRequestException("번역을 확정할 수 없는 상태입니다.");

    await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: { status: "TRANSLATION_RESOLVED", resolved_at: new Date() },
    });
    return ok(null);
  }

  async requestRevision(translationId: string, userId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.user_id !== userId) throw new ForbiddenException();
    if (translation.status !== "TRANSLATION_SUBMITTED")
      throw new BadRequestException("수정 요청할 수 없는 상태입니다.");
    if (translation.remaining_revisions <= 0)
      throw new BadRequestException("수정 요청 횟수를 모두 사용했습니다.");

    await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: {
        status: "TRANSLATION_EDIT_REQUESTED",
        remaining_revisions: { decrement: 1 },
      },
    });
    return ok(null);
  }

  async resume(translationId: string, userId: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.status !== "TRANSLATION_EDIT_REQUESTED")
      throw new BadRequestException("재시작할 수 없는 상태입니다.");

    const translator = await this.getTranslatorByUserId(userId);
    await this.assertIsSelectedTranslator(
      translationId,
      translator.translator_id,
    );

    await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: { status: "TRANSLATION_BEGAN" },
    });
    return ok(null);
  }

  async update(
    translationId: string,
    userId: string,
    dto: UpdateTranslationDto,
  ) {
    const translation = await this.prisma.translation.findUnique({
      where: { translation_id: translationId },
    });
    if (!translation) throw new NotFoundException();
    if (translation.user_id !== userId) throw new ForbiddenException();
    if (translation.status !== "QUOTE_SENT")
      throw new BadRequestException(
        "견적 모집 중인 번역만 수정할 수 있습니다.",
      );

    const updated = await this.prisma.translation.update({
      where: { translation_id: translationId },
      data: {
        ...dto,
        ...(dto.deadline ? { deadline: new Date(dto.deadline) } : {}),
      },
    });
    return ok(updated);
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

  // ── Comments ──────────────────────────────────────────────────────────────

  async getComments(translationId: string) {
    const comments = await this.prisma.translationComment.findMany({
      where: { translation_id: translationId },
      orderBy: { created_at: "asc" },
    });
    return ok(comments);
  }

  async addComment(
    translationId: string,
    userId: string,
    dto: CreateCommentDto,
  ) {
    const comment = await this.prisma.translationComment.create({
      data: {
        content: dto.content,
        user_id: userId,
        translation_id: translationId,
      },
    });
    return ok(comment);
  }
}
