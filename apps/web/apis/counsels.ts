import { Counsel, CounselAnswer, CounselCategory } from "@/types/entities";
import {
  ClientWithAuth,
  PaginatedResponse,
  PaginationParams,
  Response,
} from "./clients";

export const getCounsels = async ({ params }: { params: PaginationParams }) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Counsel>>(
    `/counsels`,
    { params },
  );
  return response.data.data;
};

export const getCounsel = async ({ counselId }: { counselId: string }) => {
  const response = await ClientWithAuth.get<Response<Counsel>>(
    `/counsels/${counselId}`,
  );
  return response.data.data;
};

export const postCounsel = async ({
  payload,
}: {
  payload: {
    content: string;
    category: CounselCategory;
    fileId: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<Counsel>>(
    `/counsels`,
    payload,
  );
  return response.data.data;
};

export const getCounselAnswer = async ({
  counselId,
}: {
  counselId: string;
}) => {
  const response = await ClientWithAuth.get<Response<CounselAnswer>>(
    `/counsels/${counselId}/answer`,
  );
  return response.data.data;
};

export const postCounselAnswer = async ({
  counselId,
  payload,
}: {
  counselId: string;
  payload: {
    content: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<CounselAnswer>>(
    `/counsels/${counselId}/answer`,
    payload,
  );
  return response.data.data;
};

export const putCounselAnswer = async ({
  counselId,
  payload,
}: {
  counselId: string;
  payload: {
    content: string;
  };
}) => {
  const response = await ClientWithAuth.put<Response<CounselAnswer>>(
    `/counsels/${counselId}/answer`,
    payload,
  );
  return response.data.data;
};

export const deleteCounselAnswer = async ({
  counselId,
}: {
  counselId: string;
}) => {
  const response = await ClientWithAuth.delete<Response<CounselAnswer>>(
    `/counsels/${counselId}/answer`,
  );
  return response.data.data;
};
