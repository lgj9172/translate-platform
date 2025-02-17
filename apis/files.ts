import { File } from "@/types/entities";
import { objectToFormData } from "@/utils/converter/form";
import {
  ClientWithAuth,
  PaginatedResponse,
  PaginationParams,
  Response,
} from "./clients";

export const getFiles = async ({ params }: { params: PaginationParams }) => {
  const response = await ClientWithAuth.get<PaginatedResponse<File>>(`/files`, {
    params,
  });
  return response.data.data;
};

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
  const formData = objectToFormData(payload);

  const response = await ClientWithAuth.post<Response<File>>(
    "/files",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
};

export const deleteFile = async ({ fileId }: { fileId: string }) => {
  const response = await ClientWithAuth.delete<Response<File>>(
    `/files/${fileId}`,
  );
  return response.data.data;
};
