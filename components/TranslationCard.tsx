import { Translation } from "@/apis/translations";
import {
  getCategoryLabel,
  getDday,
  getLanguageLabel,
} from "@/utils/converter/label";
import { NumericFormat } from "react-number-format";
import Badge from "./Badge";
import Card from "./Card";

const TRANSLATION_STATUS = {
  QUOTE_SENT: { label: "견적 요청", step: 1 },
  TRANSLATOR_SELECTED: { label: "번역사 선택 완료", step: 2 },
  TRANSLATION_BEGAN: { label: "번역 시작", step: 3 },
  TRANSLATION_SUBMITTED: { label: "번역 제출 완료", step: 4 },
  TRANSLATION_EDIT_REQUESTED: { label: "번역 수정 요청", step: 5 },
  TRANSLATION_RESOLVED: { label: "번역 확정", step: 6 },
} as const;

type TranslationStatus = keyof typeof TRANSLATION_STATUS;

interface TranslationCardProps {
  translation: Translation;
  showStatus?: boolean;
}

function StatusBadge({
  status,
  isCanceled,
}: {
  status: TranslationStatus;
  isCanceled: boolean;
}) {
  if (isCanceled) {
    return <div className="text-[14px] font-bold text-[#8B8C8D]">취소됨</div>;
  }

  const { label, step } = TRANSLATION_STATUS[status];

  return (
    <div className="flex items-center gap-2">
      <div className="text-[14px] font-bold text-[#8B8C8D]">{label}</div>
      <div className="flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 
              ${i < step ? "bg-primary" : "bg-[#E5E7EA]"}`}
          />
        ))}
      </div>
    </div>
  );
}

function TranslationInfo({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="text-[16px] font-bold truncate">{title}</div>
      <div className="text-[#7E7F80] text-[14px] truncate">{description}</div>
    </div>
  );
}

function TranslationFee({ value, unit }: { value: number; unit: string }) {
  const unitLabel = { KRW: "원", USD: "달러" }[unit] || "";

  return (
    <div className="flex text-primary font-bold text-[16px]">
      <NumericFormat
        displayType="text"
        value={value}
        thousandsGroupStyle="thousand"
        thousandSeparator=","
      />
      <span>{unitLabel}</span>
    </div>
  );
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
    is_canceled,
  },
  showStatus = false,
}: TranslationCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {categories.map((category) => (
              <Badge key={category} color="blue">
                {getCategoryLabel(category)}
              </Badge>
            ))}
            <Badge color="black">
              {`${getLanguageLabel(source_language)[0]}${getLanguageLabel(target_language)[0]}`}
            </Badge>
            <Badge color="red">{getDday(deadline)}</Badge>
          </div>
        </div>
        <TranslationInfo title={title} description={description} />
        <div className="flex items-center justify-between">
          <TranslationFee value={fee_value} unit={fee_unit} />
          {showStatus && (
            <StatusBadge status={status} isCanceled={is_canceled} />
          )}
        </div>
      </div>
    </Card>
  );
}
