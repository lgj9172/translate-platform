import { Faq } from "@/types/entities";
import {
  ClientWithAuth,
  PaginatedResponse,
  PaginationParams,
  Response,
} from "./clients";

export const getFaqs = async ({ params }: { params: PaginationParams }) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Faq>>(`/faqs`, {
    params,
  });
  return response.data.data;
};

export const getFaq = async ({ faqId }: { faqId: string }) => {
  const response = await ClientWithAuth.get<Response<Faq>>(`/faqs/${faqId}`);
  return response.data.data;
};

export const postFaq = async ({
  payload,
}: {
  payload: {
    title: string;
    description: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<Faq>>(`/faqs`, payload);
  return response.data.data;
};

export const putFaq = async ({
  faqId,
  payload,
}: {
  faqId: string;
  payload: {
    title: string;
    description: string;
  };
}) => {
  const response = await ClientWithAuth.put<Response<Faq>>(
    `/faqs/${faqId}`,
    payload,
  );
  return response.data.data;
};

export const deleteFaq = async ({ faqId }: { faqId: string }) => {
  const response = await ClientWithAuth.delete<Response<Faq>>(`/faqs/${faqId}`);
  return response.data.data;
};
