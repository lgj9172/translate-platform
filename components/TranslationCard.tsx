import HeartIcon from "@assets/icons/heart.svg";
import PPTIcon from "@assets/icons/ppt.svg";
import { NumericFormat } from "react-number-format";
import {
  getCategoryLabel,
  getDday,
  getLanguageLabel,
} from "@/utils/converter/label";
import { Translation } from "@/apis/translations";

interface TranslationCardProps {
  translation: Translation;
}

export default function TranslationCard({
  translation: {
    categories,
    language,
    end_time,
    desired_fee,
    title,
    description,
    file,
    quantity,
    quotations,
    likes,
  },
}: TranslationCardProps) {
  return (
    <div className="p-[20px]">
      <div className="mb-[12px] flex justify-between">
        <div className="flex gap-[4px]">
          {categories.map((category) => (
            <div className="h-[22px] px-[12px] py-[2px] bg-[#E7EFFF] flex justify-center items-center rounded-[16px] font-[700] text-[12px] leading-[18px] tracking-[-0.004em]">
              {getCategoryLabel(category)}
            </div>
          ))}
          <div className="h-[22px] px-[12px] py-[2px] bg-[#F0F0F0] flex justify-center items-center rounded-[16px] font-[700] text-[12px] leading-[18px] tracking-[-0.004em]">
            {`${getLanguageLabel(language.source)[0]}${
              getLanguageLabel(language.target)[0]
            }`}
          </div>
          <div className="h-[22px] px-[12px] py-[2px] bg-[#FFE8E8] flex justify-center items-center rounded-[16px] font-[700] text-[12px] leading-[18px] tracking-[-0.004em] text-[#FF3232]">
            {getDday(end_time)}
          </div>
        </div>
        <div className="font-[700] text-[16px] leading-[18px] tracking-[-0.006em] text-primary flex items-center">
          <NumericFormat
            displayType="text"
            value={desired_fee.value}
            thousandsGroupStyle="thousand"
            thousandSeparator=","
          />
          <span>
            {desired_fee.unit === "KRW" && "원"}
            {desired_fee.unit === "USD" && "달러"}
          </span>
        </div>
      </div>
      <div className="mb-[4px] font-[700] text-[16px] leading-[24px] tracking-[-0.004em]">
        {title}
      </div>

      <div className="mb-[12px] font-[400] text-[14px] leading-[24px] tracking-[-0.006em] text-[#7B7B7B]">
        {description}
      </div>

      <div className="mb-[16px] font-[400] text-[14px] leading-[18px] tracking-[-0.006em] text-[#4D4D4D] flex items-center gap-[8px]">
        {file.type === "PPT" ? <PPTIcon /> : ""}
        <span>
          <NumericFormat
            displayType="text"
            value={quantity.value}
            thousandsGroupStyle="thousand"
            thousandSeparator=","
          />
          <span>
            {quantity.unit === "CHAR" && "글자"}
            {quantity.unit === "WORD" && "단어"}
          </span>
        </span>
      </div>

      <div className="font-[400] text-[14px] leading-[21px] tracking-[-0.006em] flex justify-between items-center">
        <div className="flex gap-[4px] justify-center items-center">
          <span>받은 견적</span>
          <span>{quotations}</span>
        </div>
        <div className="flex gap-[4px] justify-center items-center">
          <HeartIcon />
          <span>{likes}</span>
        </div>
      </div>
    </div>
  );
}
