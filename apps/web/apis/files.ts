import type { File } from "@/types/entities";
import { ClientWithAuth, type Response } from "./clients";

export const getFile = async ({ fileId }: { fileId: string }) => {
  const response = await ClientWithAuth.get<Response<File>>(`/files/${fileId}`);
  return response.data.data;
};

export const postFile = async ({
  payload,
}: {
  payload: {
    content: globalThis.File | Blob;
  };
}) => {
  const formData = new FormData();
  formData.append("file", payload.content);

  const response = await ClientWithAuth.post<Response<File>>("/files", formData);
  return response.data.data;
};

export const deleteFile = async ({ fileId }: { fileId: string }) => {
  const response = await ClientWithAuth.delete<Response<File>>(
    `/files/${fileId}`,
  );
  return response.data.data;
};
