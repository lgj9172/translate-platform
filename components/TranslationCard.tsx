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
    quotations,
  },
}: TranslationCardProps) {
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
      <div className="flex justify-between">
        <span>&nbsp;</span>
        <span className="text-[14px] font-bold text-[#7E7F80]">
          받은 견적 {quotations.length}
        </span>
      </div>
    </div>
  );
}
