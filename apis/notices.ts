import { Notice } from "@/types/entities";
import {
  ClientWithAuth,
  PaginatedResponse,
  PaginationParams,
  Response,
} from "./clients";

export const getNotices = async ({ params }: { params: PaginationParams }) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Notice>>(
    `/notices`,
    { params },
  );
  return response.data.data;
};

export const getNotice = async ({ noticeId }: { noticeId: string }) => {
  const response = await ClientWithAuth.get<Response<Notice>>(
    `/notices/${noticeId}`,
  );
  return response.data.data;
};

export const postNotice = async ({
  payload,
}: {
  payload: {
    title: string;
    description: string;
    isImportant: boolean;
  };
}) => {
  const response = await ClientWithAuth.post<Response<Notice>>(
    "/notices",
    payload,
  );
  return response.data.data;
};

export const putNotice = async ({
  noticeId,
  payload,
}: {
  noticeId: string;
  payload: {
    title: string;
    description: string;
    isImportant: boolean;
  };
}) => {
  const response = await ClientWithAuth.put<Response<Notice>>(
    `/notices/${noticeId}`,
    payload,
  );
  return response.data.data;
};

export const deleteNotice = async ({ noticeId }: { noticeId: string }) => {
  const response = await ClientWithAuth.delete<Response<Notice>>(
    `/notices/${noticeId}`,
  );
  return response.data.data;
};
