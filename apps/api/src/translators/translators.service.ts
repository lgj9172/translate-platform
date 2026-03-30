import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import type { PrismaService } from "../prisma/prisma.service";
import type {
  CreateTranslatorDto,
  UpdateTranslatorDto,
} from "./translators.dto";

@Injectable()
export class TranslatorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { start?: number; size?: number; category?: string }) {
    const take = query.size ?? 20;
    const skip = query.start ?? 0;
    const where = {
      is_deleted: false,
      is_draft: false,
      ...(query.category ? { categories: { has: query.category } } : {}),
    };
    const [data, total_count] = await this.prisma.$transaction([
      this.prisma.translator.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { name: true, avatar: true, nickname: true } },
        },
        orderBy: { created_at: "desc" },
      }),
      this.prisma.translator.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async findOne(translatorId: string) {
    const translator = await this.prisma.translator.findUnique({
      where: { translator_id: translatorId, is_deleted: false },
      include: {
        user: {
          select: { name: true, avatar: true, nickname: true, email: true },
        },
        educations: { where: { is_deleted: false } },
        careers: { where: { is_deleted: false } },
        certifications: { where: { is_deleted: false } },
        translation_samples: { where: { is_deleted: false } },
      },
    });
    if (!translator) throw new NotFoundException("번역사를 찾을 수 없습니다.");
    return ok(translator);
  }

  async findByUserId(userId: string) {
    const translator = await this.prisma.translator.findUnique({
      where: { user_id: userId },
      include: {
        educations: { where: { is_deleted: false } },
        careers: { where: { is_deleted: false } },
        certifications: { where: { is_deleted: false } },
        translation_samples: { where: { is_deleted: false } },
      },
    });
    if (!translator) throw new NotFoundException("번역사 프로필이 없습니다.");
    return ok(translator);
  }

  async create(userId: string, dto: CreateTranslatorDto) {
    const translator = await this.prisma.$transaction(async (tx) => {
      const created = await tx.translator.create({
        data: {
          user_id: userId,
          categories: dto.categories ?? [],
          introduction: dto.introduction ?? "",
        },
      });

      if (dto.educations?.length) {
        await tx.translatorEducation.createMany({
          data: dto.educations.map((e) => ({
            translator_id: created.translator_id,
            name: e.name,
            major: e.major,
            degree: e.degree as never,
            graduation_status: e.graduation_status as never,
            started_at: new Date(e.started_at),
            ended_at: new Date(e.ended_at),
            file_id: e.file_id,
          })),
        });
      }

      if (dto.careers?.length) {
        await tx.translatorCareer.createMany({
          data: dto.careers.map((c) => ({
            translator_id: created.translator_id,
            name: c.name,
            position: c.position,
            achievement: c.achievement,
            is_employed: c.is_employed ?? false,
            started_at: new Date(c.started_at),
            ended_at: c.ended_at ? new Date(c.ended_at) : null,
            file_id: c.file_id,
          })),
        });
      }

      if (dto.certifications?.length) {
        await tx.translatorCertification.createMany({
          data: dto.certifications.map((c) => ({
            translator_id: created.translator_id,
            name: c.name,
            organization: c.organization,
            started_at: new Date(c.started_at),
            file_id: c.file_id,
          })),
        });
      }

      if (dto.translation_samples?.length) {
        await tx.translationSample.createMany({
          data: dto.translation_samples.map((s) => ({
            translator_id: created.translator_id,
            source_language: s.source_language,
            target_language: s.target_language,
            source_text: s.source_text,
            target_text: s.target_text,
          })),
        });
      }

      return created;
    });
    return ok(translator);
  }

  async update(translatorId: string, userId: string, dto: UpdateTranslatorDto) {
    const translator = await this.prisma.translator.findUnique({
      where: { translator_id: translatorId },
    });
    if (!translator) throw new NotFoundException();
    if (translator.user_id !== userId) throw new ForbiddenException();

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.translator.update({
        where: { translator_id: translatorId },
        data: {
          ...(dto.categories !== undefined
            ? { categories: dto.categories }
            : {}),
          ...(dto.introduction !== undefined
            ? { introduction: dto.introduction }
            : {}),
        },
      });

      if (dto.educations !== undefined) {
        await tx.translatorEducation.updateMany({
          where: { translator_id: translatorId },
          data: { is_deleted: true },
        });
        if (dto.educations.length > 0) {
          await tx.translatorEducation.createMany({
            data: dto.educations.map((e) => ({
              translator_id: translatorId,
              name: e.name,
              major: e.major,
              degree: e.degree as never,
              graduation_status: e.graduation_status as never,
              started_at: new Date(e.started_at),
              ended_at: new Date(e.ended_at),
              file_id: e.file_id,
            })),
          });
        }
      }

      if (dto.careers !== undefined) {
        await tx.translatorCareer.updateMany({
          where: { translator_id: translatorId },
          data: { is_deleted: true },
        });
        if (dto.careers.length > 0) {
          await tx.translatorCareer.createMany({
            data: dto.careers.map((c) => ({
              translator_id: translatorId,
              name: c.name,
              position: c.position,
              achievement: c.achievement,
              is_employed: c.is_employed ?? false,
              started_at: new Date(c.started_at),
              ended_at: c.ended_at ? new Date(c.ended_at) : null,
              file_id: c.file_id,
            })),
          });
        }
      }

      if (dto.certifications !== undefined) {
        await tx.translatorCertification.updateMany({
          where: { translator_id: translatorId },
          data: { is_deleted: true },
        });
        if (dto.certifications.length > 0) {
          await tx.translatorCertification.createMany({
            data: dto.certifications.map((c) => ({
              translator_id: translatorId,
              name: c.name,
              organization: c.organization,
              started_at: new Date(c.started_at),
              file_id: c.file_id,
            })),
          });
        }
      }

      if (dto.translation_samples !== undefined) {
        await tx.translationSample.updateMany({
          where: { translator_id: translatorId },
          data: { is_deleted: true },
        });
        if (dto.translation_samples.length > 0) {
          await tx.translationSample.createMany({
            data: dto.translation_samples.map((s) => ({
              translator_id: translatorId,
              source_language: s.source_language,
              target_language: s.target_language,
              source_text: s.source_text,
              target_text: s.target_text,
            })),
          });
        }
      }

      return result;
    });

    return ok(updated);
  }

  async publish(translatorId: string, userId: string) {
    const translator = await this.prisma.translator.findUnique({
      where: { translator_id: translatorId },
    });
    if (!translator) throw new NotFoundException();
    if (translator.user_id !== userId) throw new ForbiddenException();

    const updated = await this.prisma.translator.update({
      where: { translator_id: translatorId },
      data: { is_draft: false },
    });
    return ok(updated);
  }
}
