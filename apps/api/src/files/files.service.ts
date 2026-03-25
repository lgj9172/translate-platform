import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { ok } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import { SupabaseService } from "../supabase/supabase.service";

const BUCKET = "files";
const SIGNED_URL_EXPIRES = 60 * 60; // 1시간

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async onModuleInit() {
    const { data: buckets } = await this.supabase.admin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);

    if (!exists) {
      const { error } = await this.supabase.admin.storage.createBucket(BUCKET, {
        public: false,
      });
      if (error) {
        this.logger.error(`버킷 생성 실패: ${error.message}`);
      } else {
        this.logger.log(`Storage 버킷 "${BUCKET}" 생성 완료`);
      }
    }
  }

  private countText(text: string) {
    return {
      char_with_blank: text.length,
      char_without_blank: text.replace(/\s/g, "").length,
      word: text.trim() ? text.trim().split(/\s+/).length : 0,
    };
  }

  private async extractCharCount(buffer: Buffer, extension: string) {
    try {
      if (extension === "PDF") {
        // pdf-parse v1 (CommonJS) - require로 직접 로드
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
        const data = await pdfParse(buffer);
        return this.countText(data.text ?? "");
      }
      if (extension === "TXT") {
        return this.countText(buffer.toString("utf-8"));
      }
    } catch (err) {
      this.logger.warn(`글자 수 추출 실패 (${extension}): ${(err as Error).message}`);
    }
    return { char_with_blank: 0, char_without_blank: 0, word: 0 };
  }

  async upload(
    userId: string,
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ) {
    const extension = originalName.split(".").pop()?.toUpperCase() ?? "PDF";
    const fileId = crypto.randomUUID();
    const path = `${userId}/${fileId}.${extension.toLowerCase()}`;

    const { error } = await this.supabase.admin.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: mimeType });

    if (error) throw new Error(`Storage 업로드 실패: ${error.message}`);

    const charCount = await this.extractCharCount(buffer, extension);

    const file = await this.prisma.file.create({
      data: {
        file_id: fileId,
        name: originalName,
        extension,
        user_id: userId,
      },
    });

    return ok({ ...file, ...charCount });
  }

  async findOne(fileId: string) {
    const file = await this.prisma.file.findUnique({
      where: { file_id: fileId },
    });
    if (!file) throw new NotFoundException("파일을 찾을 수 없습니다.");

    const path = `${file.user_id}/${file.file_id}.${file.extension.toLowerCase()}`;
    const { data, error } = await this.supabase.admin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRES);

    if (error) throw new Error("서명된 URL 생성 실패");

    return ok({ ...file, presigned_url: data.signedUrl });
  }

  async remove(fileId: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { file_id: fileId },
    });
    if (!file) throw new NotFoundException();
    if (file.user_id !== userId) throw new ForbiddenException();

    const path = `${file.user_id}/${file.file_id}.${file.extension.toLowerCase()}`;
    await this.supabase.admin.storage.from(BUCKET).remove([path]);
    await this.prisma.file.delete({ where: { file_id: fileId } });

    return ok(null);
  }
}
