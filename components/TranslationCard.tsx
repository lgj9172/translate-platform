import { Translation } from "@/apis/translations";
import {
  getCategoryLabel,
  getDday,
  getLanguageLabel,
} from "@/utils/converter/label";
import { NumericFormat } from "react-number-format";
import Badge from "./Badge";

interface TranslationCardProps {
  translation: Translation;
  showQuotations?: boolean;
  showStatus?: boolean;
}

export default function TranslationCard({
  translation: {
    categories,
    source_language,
    target_language,
    deadline,
    fee_value,
    fee_unit,
    title,
    description,
    status,
    quotations,
  },
  showQuotations = false,
  showStatus = false,
}: TranslationCardProps) {
  const STATUS2LABEL = {
    QUOTE_SENT: "견적 요청",
    TRANSLATION_CANCELLED: "번역 취소",
    TRANSLATOR_SELECTED: "번역사 선택 완료",
    TRANSLATION_BEGAN: "번역 시작",
    TRANSLATION_SUBMITTED: "번역 제출 완료",
    TRANSLATION_EDIT_REQUESTED: "번역 수정 요청",
    TRANSLATION_RESOLVED: "번역 확정",
  };
  const STATUS2PROGRESS = {
    QUOTE_SENT: "10%",
    TRANSLATION_CANCELLED: "10%",
    TRANSLATOR_SELECTED: "10%",
    TRANSLATION_BEGAN: "50%",
    TRANSLATION_SUBMITTED: "50%",
    TRANSLATION_EDIT_REQUESTED: "50%",
    TRANSLATION_RESOLVED: "100%",
  };
  const STATUS2PROGRESSLABEL = {
    QUOTE_SENT: "번역 전",
    TRANSLATION_CANCELLED: "번역 전",
    TRANSLATOR_SELECTED: "번역 전",
    TRANSLATION_BEGAN: "번역 중",
    TRANSLATION_SUBMITTED: "번역 중",
    TRANSLATION_EDIT_REQUESTED: "번역 중",
    TRANSLATION_RESOLVED: "번역 완료",
  };

  return (
    <div className="p-[20px] border-[1px] border-gray-100 rounded-[16px] flex flex-col">
      {/* 헤더 */}
      <div className="mb-[12px] flex justify-between items-center">
        {/* 태그 모음 */}
        <div className="flex gap-1">
          {/* 카테고리 */}
          {categories.map((category) => (
            <Badge key={category} color="blue">
              {getCategoryLabel(category)}
            </Badge>
          ))}
          {/* 출발어도착어 */}
          <Badge color="black">
            {`${getLanguageLabel(source_language)[0]}${
              getLanguageLabel(target_language)[0]
            }`}
          </Badge>
          {/* D-day */}
          <Badge color="red">{getDday(deadline)}</Badge>
        </div>
        {/* 금액 */}
        <div className="flex text-primary font-bold text-[16px]">
          <span>
            <NumericFormat
              displayType="text"
              value={fee_value}
              thousandsGroupStyle="thousand"
              thousandSeparator=","
            />
          </span>
          <span>
            {fee_unit === "KRW" && "원"}
            {fee_unit === "USD" && "달러"}
          </span>
        </div>
      </div>
      {/* 제목 */}
      <div className="mb-[4px] text-[16px] font-bold">{title}</div>
      {/* 설명 */}
      <div className="mb-[12px] text-[#7E7F80] text-[14px]">{description}</div>
      {/* 풋터 */}
      {showQuotations && (
        <div className="flex justify-between">
          <span>&nbsp;</span>
          <span className="text-[14px] font-bold text-[#7E7F80]">
            받은 견적 {quotations.length}
          </span>
        </div>
      )}
      {/* 상태 */}
      {showStatus && (
        <div className="flex flex-col gap-1">
          <div className="w-full h-1 bg-[#8B8C8D] rounded-full">
            <div
              className="h-1 bg-primary rounded-full"
              style={{ width: STATUS2PROGRESS[status] }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-[14px] font-bold text-primary">
              {STATUS2PROGRESSLABEL[status] || "알 수 없는 진행상황"}
            </span>
            <span className="text-[14px] font-bold text-[#7E7F80]">
              {STATUS2LABEL[status] || "알 수 없는 상태"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
