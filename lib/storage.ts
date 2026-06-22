import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "./prisma";

export const BUCKET = "files";
const SIGNED_URL_EXPIRES = 60 * 60; // 1시간

let bucketEnsured = false;

// 버킷이 없으면 생성 (기존 FilesService.onModuleInit 대체, 최초 1회 lazy)
export async function ensureBucket() {
  if (bucketEnsured) return;
  const admin = getSupabaseAdmin();
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    const { error } = await admin.storage.createBucket(BUCKET, {
      public: false,
    });
    if (error) {
      console.error(`버킷 생성 실패: ${error.message}`);
      return;
    }
    console.log(`Storage 버킷 "${BUCKET}" 생성 완료`);
  }
  bucketEnsured = true;
}

function countText(text: string) {
  return {
    char_with_blank: text.length,
    char_without_blank: text.replace(/\s/g, "").length,
    word: text.trim() ? text.trim().split(/\s+/).length : 0,
  };
}

export async function extractCharCount(buffer: Buffer, extension: string) {
  try {
    if (extension === "PDF") {
      // pdf-parse v1 (CommonJS)
      const pdfParse = require("pdf-parse") as (
        buf: Buffer,
      ) => Promise<{ text: string }>;
      const data = await pdfParse(buffer);
      return countText(data.text ?? "");
    }
    if (extension === "TXT") {
      return countText(buffer.toString("utf-8"));
    }
  } catch (err) {
    console.warn(`글자 수 추출 실패 (${extension}): ${(err as Error).message}`);
  }
  return { char_with_blank: 0, char_without_blank: 0, word: 0 };
}

function storagePath(file: {
  user_id: string;
  file_id: string;
  extension: string;
}) {
  return `${file.user_id}/${file.file_id}.${file.extension.toLowerCase()}`;
}

export async function uploadToStorage(
  path: string,
  buffer: Buffer,
  contentType: string,
) {
  const admin = getSupabaseAdmin();
  return admin.storage.from(BUCKET).upload(path, buffer, { contentType });
}

export async function createSignedUrl(file: {
  user_id: string;
  file_id: string;
  extension: string;
}) {
  const admin = getSupabaseAdmin();
  return admin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath(file), SIGNED_URL_EXPIRES);
}

export async function removeFromStorage(file: {
  user_id: string;
  file_id: string;
  extension: string;
}) {
  const admin = getSupabaseAdmin();
  return admin.storage.from(BUCKET).remove([storagePath(file)]);
}

// translations / quotations 에서 첨부파일 정보를 보강할 때 사용
export async function enrichFileInfo(
  fileId: string,
): Promise<{ name: string; presigned_url: string | null } | null> {
  const file = await prisma.file.findUnique({ where: { file_id: fileId } });
  if (!file) return null;
  const { data, error } = await createSignedUrl(file);
  if (error) {
    console.warn(`signed URL 생성 실패: ${error.message}`);
    return { name: file.name, presigned_url: null };
  }
  return { name: file.name, presigned_url: data.signedUrl };
}
