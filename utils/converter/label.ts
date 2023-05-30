import dayjs from "dayjs";

interface KeyValueMap {
  [key: string]: any;
}

const category2label: KeyValueMap = {
  IT: "IT",
  FINANCE: "경제/금융",
  CONTENTS: "콘텐츠 자막",
  GAME: "게임",
  LAW: "법률/특허",
  MEDICAL: "의료",
  CONSTRUCTION: "건설",
  MARKETING: "마케팅",
  LITERATURE: "문학",
  ETC: "기타",
};

export const getCategoryLabel = (key: string) => {
  return category2label[key];
};

const language2label: KeyValueMap = {
  "ko-KR": "한국어",
  "en-US": "영어",
  "ja-JP": "일본어",
  "zh-CN": "중국어",
  "ar-SA": "아랍어",
  "ru-RU": "러시아어",
  "es-ES": "스페인어",
  "fr-FR": "프랑스어",
  "de-DE": "독일어",
};
export const getLanguageLabel = (key: string) => {
  return language2label[key];
};

export const getDday = (date: string) => {
  return `D-${Math.max(0, dayjs(date).diff(dayjs(), "day"))}`;
};
