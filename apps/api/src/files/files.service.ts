import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ok } from "../common/response";
import { PrismaService } from "../prisma/prisma.service";
import { SupabaseService } from "../supabase/supabase.service";

const BUCKET = "files";
const SIGNED_URL_EXPIRES = 60 * 60; // 1시간

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

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

    const file = await this.prisma.file.create({
      data: {
        file_id: fileId,
        name: originalName,
        extension,
        user_id: userId,
      },
    });

    return ok(file);
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
