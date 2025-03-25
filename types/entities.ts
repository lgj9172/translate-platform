// Common
export const ORDER = {
  desc: "desc",
  asc: "asc",
} as const;
export const ORDER_LABEL = {
  [ORDER.desc]: "내림차순",
  [ORDER.asc]: "오름차순",
} as const;
export type Order = keyof typeof ORDER;

export interface PaginationParams {
  start?: number;
  size?: number;
  order?: Order;
}

export interface Response<T> {
  code: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends Response<T[]> {
  result_count: number;
  total_count: number;
}

// User
export const USER_PROVIDER = {
  naver: "naver",
  kakao: "kakao",
} as const;
export const USER_PROVIDER_LABEL = {
  [USER_PROVIDER.naver]: "네이버",
  [USER_PROVIDER.kakao]: "카카오",
} as const;
export type UserProvider = keyof typeof USER_PROVIDER;

export interface User {
  user_id: string;
  email: string;
  name: string;
  nickname: string;
  phone_number: string;
  avatar: string;
  birthdate: string;
  is_age_verification: boolean;
  is_deleted: boolean;
  last_login_time: string;
  providers: UserProvider[];
  agreement?: UserAgreement;
  authorization?: UserAuthorization;
  created_at?: string;
  updated_at?: string;
}

export interface UserAgreement {
  is_agree_privacy_policy: boolean;
  is_agree_use_policy: boolean;
  is_agree_marketing: boolean;
  is_agree_marketing_email: boolean;
  is_agree_marketing_sms: boolean;
}

export interface UserAuthorization {
  is_translator: boolean;
  is_admin: boolean;
}

export interface Token {
  refresh_token: string;
}

export const FILE_EXTENSION = {
  PDF: "PDF",
} as const;
export const FILE_EXTENSION_LABEL = {
  [FILE_EXTENSION.PDF]: "PDF 문서",
} as const;
export type FileExtension = keyof typeof FILE_EXTENSION;

export interface File {
  file_id: string;
  name: string;
  extension: FileExtension;
  user_id: string;
  presigned_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Translation
export const TRANSLATION_LANGUAGE = {
  "ko-KR": "ko-KR",
  "en-US": "en-US",
  "ja-JP": "ja-JP",
  "zh-CN": "zh-CN",
  "ru-RU": "ru-RU",
  "es-ES": "es-ES",
  "ar-SA": "ar-SA",
  "de-DE": "de-DE",
  "fr-FR": "fr-FR",
} as const;
export const TRANSLATION_LANGUAGE_LABEL = {
  [TRANSLATION_LANGUAGE["ko-KR"]]: "한국어",
  [TRANSLATION_LANGUAGE["en-US"]]: "영어",
  [TRANSLATION_LANGUAGE["ja-JP"]]: "일본어",
  [TRANSLATION_LANGUAGE["zh-CN"]]: "중국어",
  [TRANSLATION_LANGUAGE["ru-RU"]]: "러시아어",
  [TRANSLATION_LANGUAGE["es-ES"]]: "스페인어",
  [TRANSLATION_LANGUAGE["ar-SA"]]: "아랍어",
  [TRANSLATION_LANGUAGE["de-DE"]]: "독일어",
  [TRANSLATION_LANGUAGE["fr-FR"]]: "프랑스어",
} as const;
export type TranslationLanguage = keyof typeof TRANSLATION_LANGUAGE;

export const TRANSLATION_CATEGORY = {
  IT: "IT",
  FINANCE: "FINANCE",
  CONTENTS: "CONTENTS",
  GAME: "GAME",
  LAW: "LAW",
  MEDICAL: "MEDICAL",
  CONSTRUCTION: "CONSTRUCTION",
  MARKETING: "MARKETING",
  LITERATURE: "LITERATURE",
  ETC: "ETC",
} as const;
export const TRANSLATION_CATEGORY_LABEL = {
  [TRANSLATION_CATEGORY.IT]: "IT",
  [TRANSLATION_CATEGORY.FINANCE]: "금융",
  [TRANSLATION_CATEGORY.CONTENTS]: "콘텐츠",
  [TRANSLATION_CATEGORY.GAME]: "게임",
  [TRANSLATION_CATEGORY.LAW]: "법률",
  [TRANSLATION_CATEGORY.MEDICAL]: "의료",
  [TRANSLATION_CATEGORY.CONSTRUCTION]: "건설",
  [TRANSLATION_CATEGORY.MARKETING]: "마케팅",
  [TRANSLATION_CATEGORY.LITERATURE]: "문학",
  [TRANSLATION_CATEGORY.ETC]: "기타",
} as const;
export type TranslationCategory = keyof typeof TRANSLATION_CATEGORY;

export const TRANSLATION_CURRENCY = {
  KRW: "KRW",
  USD: "USD",
} as const;
export const TRANSLATION_CURRENCY_LABEL = {
  [TRANSLATION_CURRENCY.KRW]: "원",
  [TRANSLATION_CURRENCY.USD]: "달러",
} as const;
export type TranslationCurrency = keyof typeof TRANSLATION_CURRENCY;

export const TRANSLATION_STATUS = {
  QUOTE_SENT: "QUOTE_SENT",
  TRANSLATOR_SELECTED: "TRANSLATOR_SELECTED",
  TRANSLATION_BEGAN: "TRANSLATION_BEGAN",
  TRANSLATION_SUBMITTED: "TRANSLATION_SUBMITTED",
  TRANSLATION_EDIT_REQUESTED: "TRANSLATION_EDIT_REQUESTED",
  TRANSLATION_RESOLVED: "TRANSLATION_RESOLVED",
} as const;
export const TRANSLATION_STATUS_LABEL = {
  [TRANSLATION_STATUS.QUOTE_SENT]: "견적 제출됨",
  [TRANSLATION_STATUS.TRANSLATOR_SELECTED]: "번역사 선택됨",
  [TRANSLATION_STATUS.TRANSLATION_BEGAN]: "번역 시작됨",
  [TRANSLATION_STATUS.TRANSLATION_SUBMITTED]: "번역 제출됨",
  [TRANSLATION_STATUS.TRANSLATION_EDIT_REQUESTED]: "수정 요청됨",
  [TRANSLATION_STATUS.TRANSLATION_RESOLVED]: "번역 완료됨",
} as const;
export type TranslationStatus = keyof typeof TRANSLATION_STATUS;

export interface Fee {
  unit: TranslationCurrency;
  value: number;
}

export interface TranslationSourceFile {
  char_with_blank: number;
  char_without_blank: number;
  word: number;
  file_id?: string;
}

export interface TranslationTargetFile {
  char_with_blank: number;
  char_without_blank: number;
  word: number;
  file_id: string;
}

export interface Translation {
  translation_id: string;
  title: string;
  source_language: TranslationLanguage;
  target_language: TranslationLanguage;
  categories: TranslationCategory[];
  description: string;
  source_files: TranslationSourceFile[];
  target_files: TranslationTargetFile[];
  deadline: string;
  fee: Fee;
  sample: string;
  status: TranslationStatus;
  is_deleted: boolean;
  is_canceled: boolean;
  remaining_revisions: number;
  user_id: string;
  resolved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TranslationComment {
  comment_id: string;
  content: string;
  user_id: string;
  translation_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Quotation {
  quotation_id: string;
  translation_id: string;
  translator_id: string;
  fee: Fee;
  detail?: string;
  is_deleted: boolean;
  is_canceled: boolean;
  is_selected: boolean;
}

export const COUNSEL_CATEGORY = {
  SUGGESTION: "SUGGESTION",
  REQUEST_CANCELLATION: "REQUEST_CANCELLATION",
} as const;
export const COUNSEL_CATEGORY_LABEL = {
  [COUNSEL_CATEGORY.SUGGESTION]: "의견",
  [COUNSEL_CATEGORY.REQUEST_CANCELLATION]: "요청 취소",
} as const;
export type CounselCategory = keyof typeof COUNSEL_CATEGORY;

export interface Counsel {
  counsel_id: string;
  content: string;
  is_done: boolean;
  is_deleted: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  category: CounselCategory;
  file_id: string;
}

export interface CounselAnswer {
  answer_id: string;
  content: string;
  answered_at: string;
  counsel_id: string;
}

export const TRANSLATOR_DEGREE = {
  BACHELOR: "BACHELOR",
  MASTER: "MASTER",
  DOCTOR: "DOCTOR",
} as const;
export const TRANSLATOR_DEGREE_LABEL = {
  [TRANSLATOR_DEGREE.BACHELOR]: "학사",
  [TRANSLATOR_DEGREE.MASTER]: "석사",
  [TRANSLATOR_DEGREE.DOCTOR]: "박사",
} as const;
export type TranslatorDegree = keyof typeof TRANSLATOR_DEGREE;

export const TRANSLATOR_GRADUATION_STATUS = {
  GRADUATED: "GRADUATED",
  COMPLETED: "COMPLETED",
} as const;
export const TRANSLATOR_GRADUATION_STATUS_LABEL = {
  [TRANSLATOR_GRADUATION_STATUS.GRADUATED]: "졸업",
  [TRANSLATOR_GRADUATION_STATUS.COMPLETED]: "수료",
} as const;
export type TranslatorGraduationStatus =
  keyof typeof TRANSLATOR_GRADUATION_STATUS;

export const TRANSLATOR_VERIFICATION_STATUS = {
  UNVERIFIED: "UNVERIFIED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
} as const;
export const TRANSLATOR_VERIFICATION_STATUS_LABEL = {
  [TRANSLATOR_VERIFICATION_STATUS.UNVERIFIED]: "미인증",
  [TRANSLATOR_VERIFICATION_STATUS.REJECTED]: "반려",
  [TRANSLATOR_VERIFICATION_STATUS.COMPLETED]: "인증 완료",
  [TRANSLATOR_VERIFICATION_STATUS.PENDING]: "인증 대기",
} as const;
export type TranslatorVerificationStatus =
  keyof typeof TRANSLATOR_VERIFICATION_STATUS;

export interface TranslatorEducation {
  education_id?: string;
  name: string;
  major: string;
  degree: TranslatorDegree;
  graduation_status: TranslatorGraduationStatus;
  started_at: string;
  ended_at: string;
  verification_status?: TranslatorVerificationStatus;
  file_id: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TranslatorCareer {
  career_id?: string;
  name: string;
  position: string;
  achievement?: string;
  is_employed?: boolean;
  started_at: string;
  ended_at?: string;
  verification_status?: TranslatorVerificationStatus;
  file_id: string;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TranslatorCertification {
  certification_id?: string;
  name: string;
  organization: string;
  started_at: string;
  verification_status?: TranslatorVerificationStatus;
  file_id: string;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TranslationSample {
  translation_sample_id?: string;
  source_language: TranslationLanguage;
  target_language: TranslationLanguage;
  source_text: string;
  target_text: string;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Translator {
  translator_id: string;
  categories: TranslationCategory[];
  introduction: string;
  educations: TranslatorEducation[];
  careers: TranslatorCareer[];
  certifications: TranslatorCertification[];
  translation_samples: TranslationSample[];
  user_id: string;
  total_career_duration?: number;
  recent_translations?: number;
  is_draft: boolean;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Notice {
  notice_id: string;
  title: string;
  description: string;
  is_important: boolean;
  created_by: string;
  updated_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Faq {
  faq_id: string;
  title: string;
  description: string;
  created_by: string;
  updated_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  blog_id: string;
  title: string;
  content: string;
  is_deleted: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogComment {
  comment_id: string;
  content: string;
  user_id: string;
  blog_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewRating {
  translation_quality: number;
  communication: number;
  deadline_compliance: number;
}

export interface Review {
  translator_id: string;
  translation_id: string;
  ratings: ReviewRating;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewType {
  review_type_id: string;
  field_name: string;
  description?: string;
}
