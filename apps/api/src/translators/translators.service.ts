import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ok, paginated } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import type {
  CreateTranslatorDto,
  UpdateTranslatorDto,
  UpsertCareerDto,
  UpsertCertificationDto,
  UpsertEducationDto,
  UpsertSampleDto,
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
        include: { user: { select: { name: true, avatar: true, nickname: true } } },
        orderBy: { created_at: "desc" },
      }),
      this.prisma.translator.count({ where }),
    ]);
    return paginated(data, total_count, data.length);
  }

  async findOne(translatorId: string) {
    const translator = await this.prisma.translator.findUnique({
      where: { translator_id: translatorId },
      include: {
        user: { select: { name: true, avatar: true, nickname: true, email: true } },
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

    const updated = await this.prisma.translator.update({
      where: { translator_id: translatorId },
      data: dto,
    });
    return ok(updated);
  }

  // ── Education ─────────────────────────────────────────────────────────────

  async upsertEducation(translatorId: string, userId: string, dto: UpsertEducationDto) {
    await this.assertOwner(translatorId, userId);
    if (dto.education_id) {
      const updated = await this.prisma.translatorEducation.update({
        where: { education_id: dto.education_id },
        data: {
          name: dto.name,
          major: dto.major,
          degree: dto.degree as never,
          graduation_status: dto.graduation_status as never,
          started_at: new Date(dto.started_at),
          ended_at: new Date(dto.ended_at),
          file_id: dto.file_id,
        },
      });
      return ok(updated);
    }
    const created = await this.prisma.translatorEducation.create({
      data: {
        translator_id: translatorId,
        name: dto.name,
        major: dto.major,
        degree: dto.degree as never,
        graduation_status: dto.graduation_status as never,
        started_at: new Date(dto.started_at),
        ended_at: new Date(dto.ended_at),
        file_id: dto.file_id,
      },
    });
    return ok(created);
  }

  async removeEducation(educationId: string, userId: string) {
    const edu = await this.prisma.translatorEducation.findUnique({
      where: { education_id: educationId },
      include: { translator: true },
    });
    if (!edu) throw new NotFoundException();
    if (edu.translator.user_id !== userId) throw new ForbiddenException();
    await this.prisma.translatorEducation.update({
      where: { education_id: educationId },
      data: { is_deleted: true },
    });
    return ok(null);
  }

  // ── Career ────────────────────────────────────────────────────────────────

  async upsertCareer(translatorId: string, userId: string, dto: UpsertCareerDto) {
    await this.assertOwner(translatorId, userId);
    if (dto.career_id) {
      const updated = await this.prisma.translatorCareer.update({
        where: { career_id: dto.career_id },
        data: {
          name: dto.name,
          position: dto.position,
          achievement: dto.achievement,
          is_employed: dto.is_employed,
          started_at: new Date(dto.started_at),
          ended_at: dto.ended_at ? new Date(dto.ended_at) : null,
          file_id: dto.file_id,
        },
      });
      return ok(updated);
    }
    const created = await this.prisma.translatorCareer.create({
      data: {
        translator_id: translatorId,
        name: dto.name,
        position: dto.position,
        achievement: dto.achievement,
        is_employed: dto.is_employed ?? false,
        started_at: new Date(dto.started_at),
        ended_at: dto.ended_at ? new Date(dto.ended_at) : null,
        file_id: dto.file_id,
      },
    });
    return ok(created);
  }

  async removeCareer(careerId: string, userId: string) {
    const career = await this.prisma.translatorCareer.findUnique({
      where: { career_id: careerId },
      include: { translator: true },
    });
    if (!career) throw new NotFoundException();
    if (career.translator.user_id !== userId) throw new ForbiddenException();
    await this.prisma.translatorCareer.update({
      where: { career_id: careerId },
      data: { is_deleted: true },
    });
    return ok(null);
  }

  // ── Certification ─────────────────────────────────────────────────────────

  async upsertCertification(translatorId: string, userId: string, dto: UpsertCertificationDto) {
    await this.assertOwner(translatorId, userId);
    if (dto.certification_id) {
      const updated = await this.prisma.translatorCertification.update({
        where: { certification_id: dto.certification_id },
        data: {
          name: dto.name,
          organization: dto.organization,
          started_at: new Date(dto.started_at),
          file_id: dto.file_id,
        },
      });
      return ok(updated);
    }
    const created = await this.prisma.translatorCertification.create({
      data: {
        translator_id: translatorId,
        name: dto.name,
        organization: dto.organization,
        started_at: new Date(dto.started_at),
        file_id: dto.file_id,
      },
    });
    return ok(created);
  }

  async removeCertification(certificationId: string, userId: string) {
    const cert = await this.prisma.translatorCertification.findUnique({
      where: { certification_id: certificationId },
      include: { translator: true },
    });
    if (!cert) throw new NotFoundException();
    if (cert.translator.user_id !== userId) throw new ForbiddenException();
    await this.prisma.translatorCertification.update({
      where: { certification_id: certificationId },
      data: { is_deleted: true },
    });
    return ok(null);
  }

  // ── Sample ────────────────────────────────────────────────────────────────

  async upsertSample(translatorId: string, userId: string, dto: UpsertSampleDto) {
    await this.assertOwner(translatorId, userId);
    if (dto.translation_sample_id) {
      const updated = await this.prisma.translationSample.update({
        where: { translation_sample_id: dto.translation_sample_id },
        data: {
          source_language: dto.source_language,
          target_language: dto.target_language,
          source_text: dto.source_text,
          target_text: dto.target_text,
        },
      });
      return ok(updated);
    }
    const created = await this.prisma.translationSample.create({
      data: {
        translator_id: translatorId,
        source_language: dto.source_language,
        target_language: dto.target_language,
        source_text: dto.source_text,
        target_text: dto.target_text,
      },
    });
    return ok(created);
  }

  async removeSample(sampleId: string, userId: string) {
    const sample = await this.prisma.translationSample.findUnique({
      where: { translation_sample_id: sampleId },
      include: { translator: true },
    });
    if (!sample) throw new NotFoundException();
    if (sample.translator.user_id !== userId) throw new ForbiddenException();
    await this.prisma.translationSample.update({
      where: { translation_sample_id: sampleId },
      data: { is_deleted: true },
    });
    return ok(null);
  }

  // ── Reviews ───────────────────────────────────────────────────────────────

  async getReviews(translatorId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { translator_id: translatorId },
      orderBy: { created_at: "desc" },
    });
    return ok(reviews);
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private async assertOwner(translatorId: string, userId: string) {
    const translator = await this.prisma.translator.findUnique({
      where: { translator_id: translatorId },
    });
    if (!translator) throw new NotFoundException();
    if (translator.user_id !== userId) throw new ForbiddenException();
  }
}
