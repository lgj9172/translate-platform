import {
  Translation,
  TranslationCategory,
  TranslationComment,
  TranslationCurrency,
  TranslationLanguage,
} from "@/types/entities";
import {
  ClientWithAuth,
  PaginatedResponse,
  PaginationParams,
  Response,
} from "./clients";

export const getTranslations = async ({
  params,
}: {
  params: PaginationParams;
}) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Translation>>(
    `/translations`,
    {
      params,
    },
  );
  return response.data.data;
};

export const getTranslationsClient = async ({
  params,
}: {
  params: PaginationParams;
}) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Translation>>(
    `/translations/client`,
    {
      params,
    },
  );
  return response.data.data;
};

export const getTranslationsTranslator = async ({
  params,
}: {
  params: PaginationParams;
}) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Translation>>(
    `/translations/translator`,
    {
      params,
    },
  );
  return response.data.data;
};

export const getTranslation = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.get<Response<Translation>>(
    `/translations/${translationId}`,
  );
  return response.data.data;
};

export const postTranslation = async ({
  payload,
}: {
  payload: {
    title: string;
    source_language: TranslationLanguage;
    target_language: TranslationLanguage;
    categories: TranslationCategory[];
    description: string;
    source_files: { file_id: string }[];
    deadline: string;
    fee: {
      unit: TranslationCurrency;
      value: number;
    };
    sample: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations`,
    payload,
  );
  return response.data.data;
};

export const getTranslationComments = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.get<Response<TranslationComment[]>>(
    `/translations/${translationId}/comments`,
  );
  return response.data.data;
};

export const postTranslationComment = async ({
  translationId,
  payload,
}: {
  translationId: string;
  payload: {
    content: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<TranslationComment>>(
    `/translations/${translationId}/comments`,
    payload,
  );
  return response.data.data;
};

export const postTranslationCancel = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/cancel`,
  );
  return response.data.data;
};

export const postTranslationStart = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/start`,
  );
  return response.data.data;
};

export const postTranslationSubmit = async ({
  translationId,
  payload,
}: {
  translationId: string;
  payload: {
    target_files: string[];
  };
}) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/submit`,
    payload,
  );
  return response.data.data;
};

export const postTranslationConfirm = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/confirm`,
  );
  return response.data.data;
};

export const postTranslationRequestRevision = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/request_revision`,
  );
  return response.data.data;
};

export const postTranslationResume = async ({
  translationId,
}: {
  translationId: string;
}) => {
  const response = await ClientWithAuth.post<Response<Translation>>(
    `/translations/${translationId}/resume`,
  );
  return response.data.data;
};
