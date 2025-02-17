import { Quotation } from "@/types/entities";
import {
  ClientWithAuth,
  Response,
  PaginatedResponse,
  PaginationParams,
} from "./clients";

export const getTranslationQuotations = async ({
  translationId,
  params,
}: {
  translationId: string;
  params: PaginationParams;
}) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Quotation>>(
    `/translations/${translationId}/quotations`,
    {
      params,
    },
  );
  return response.data.data;
};

export const getTranslationQuotation = async ({
  translationId,
  quotationId,
}: {
  translationId: string;
  quotationId: string;
}) => {
  const response = await ClientWithAuth.get<Response<Quotation>>(
    `/translations/${translationId}/quotations/${quotationId}`,
  );
  return response.data.data;
};

export const getTranslatorQuotation = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.get<Response<Quotation>>(
    `/translations/${translationId}/quotations/translator`,
  );
  return response.data.data;
};

export const getSelectedQuotation = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.get<Response<Quotation>>(
    `/translations/${translationId}/selected-quotation`,
  );
  return response.data.data;
};

export const postTranslationQuotation = async ({
  translationId,
  payload,
}: {
  translationId: string;
  payload: {
    fee: {
      unit: "KRW" | "USD";
      value: number;
    };
    detail?: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<Quotation>>(
    `/translations/${translationId}/quotations`,
    payload,
  );
  return response.data.data;
};

export const postTranslationQuotationCancel = async ({
  translationId,
  quotationId,
}: {
  translationId: string;
  quotationId: string;
}) => {
  const response = await ClientWithAuth.post<Response<Quotation>>(
    `/translations/${translationId}/quotations/${quotationId}/cancel`,
  );
  return response.data.data;
};

export const postTranslationQuotationSelect = async ({
  translationId,
  quotationId,
}: {
  translationId: string;
  quotationId: string;
}) => {
  const response = await ClientWithAuth.post<Response<Quotation>>(
    `/translations/${translationId}/quotations/${quotationId}/select`,
  );
  return response.data.data;
};
