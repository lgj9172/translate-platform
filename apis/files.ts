"use server";

import { requireUser } from "@/lib/auth";
import { badRequest, forbidden, internal, notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import {
  createSignedUrl,
  ensureBucket,
  extractCharCount,
  removeFromStorage,
  uploadToStorage,
} from "@/lib/storage";
import type { File } from "@/types/entities";

export const getFile = async ({ fileId }: { fileId: string }) => {
  const user = await requireUser();
  const file = await prisma.file.findUnique({ where: { file_id: fileId } });
  if (!file) throw notFound("파일을 찾을 수 없습니다.");
  if (file.user_id !== user.id)
    throw forbidden("본인이 업로드한 파일만 조회할 수 있습니다.");

  const { data, error } = await createSignedUrl(file);
  if (error) {
    console.error(`서명된 URL 생성 실패: ${error.message}`);
    throw internal("파일 URL 생성에 실패했습니다.");
  }

  return { ...file, presigned_url: data.signedUrl } as unknown as File;
};

export const postFile = async ({
  payload,
}: {
  payload: {
    content: globalThis.File | Blob;
  };
}) => {
  const user = await requireUser();
  const content = payload.content;
  if (!content || content.size === 0) {
    throw badRequest("파일이 첨부되지 않았습니다.");
  }

  await ensureBucket();

  const originalName =
    content instanceof globalThis.File ? content.name : "file";
  const mimeType = content.type || "application/octet-stream";
  const buffer = Buffer.from(await content.arrayBuffer());

  const extension = originalName.split(".").pop()?.toUpperCase() ?? "PDF";
  const fileId = crypto.randomUUID();
  const path = `${user.id}/${fileId}.${extension.toLowerCase()}`;

  const { error } = await uploadToStorage(path, buffer, mimeType);
  if (error) {
    console.error(`Storage 업로드 실패: ${error.message}`);
    throw internal("파일 업로드에 실패했습니다.");
  }

  const charCount = await extractCharCount(buffer, extension);

  const file = await prisma.file.create({
    data: {
      file_id: fileId,
      name: originalName,
      extension,
      user_id: user.id,
    },
  });

  return { ...file, ...charCount } as unknown as File;
};

export const deleteFile = async ({ fileId }: { fileId: string }) => {
  const user = await requireUser();
  const file = await prisma.file.findUnique({ where: { file_id: fileId } });
  if (!file) throw notFound();
  if (file.user_id !== user.id) throw forbidden();

  await removeFromStorage(file);
  await prisma.file.delete({ where: { file_id: fileId } });
  return null;
};
