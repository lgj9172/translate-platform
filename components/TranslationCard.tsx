import { Translation } from "@/apis/translations";
import {
  getCategoryLabel,
  getDday,
  getLanguageLabel,
} from "@/utils/converter/label";
import { NumericFormat } from "react-number-format";
import Badge from "./Badge";
import Card from "./Card";

interface TranslationCardProps {
  translation: Translation;
  showStatus?: boolean;
}

const STEPS: (keyof typeof STATUS)[] = [
  "QUOTE_SENT",
  "TRANSLATOR_SELECTED",
  "TRANSLATION_BEGAN",
  "TRANSLATION_SUBMITTED",
  "TRANSLATION_EDIT_REQUESTED",
  "TRANSLATION_RESOLVED",
];

// const STATUS = {
//   QUOTE_SENT: {
//     label: "견적 요청",
//     progress: 1,
//     progressLabel: "번역 전",
//   },
//   TRANSLATION_CANCELLED: {
//     label: "번역 취소",
//     progress: 1,
//     progressLabel: "번역 전",
//   },
//   TRANSLATOR_SELECTED: {
//     label: "번역사 선택 완료",
//     progress: 1,
//     progressLabel: "번역 전",
//   },
//   TRANSLATION_BEGAN: {
//     label: "번역 시작",
//     progress: 2,
//     progressLabel: "번역 중",
//   },
//   TRANSLATION_SUBMITTED: {
//     label: "번역 제출 완료",
//     progress: 2,
//     progressLabel: "번역 중",
//   },
//   TRANSLATION_EDIT_REQUESTED: {
//     label: "번역 수정 요청",
//     progress: 2,
//     progressLabel: "번역 중",
//   },
//   TRANSLATION_RESOLVED: {
//     label: "번역 확정",
//     progress: 3,
//     progressLabel: "번역 완료",
//   },
// };

const STATUS = {
  QUOTE_SENT: {
    label: "견적 요청",
    progress: 0,
  },
  TRANSLATION_CANCELLED: {
    label: "번역 취소",
    progress: 1,
  },
  TRANSLATOR_SELECTED: {
    label: "번역사 선택 완료",
    progress: 1,
  },
  TRANSLATION_BEGAN: {
    label: "번역 시작",
    progress: 2,
  },
  TRANSLATION_SUBMITTED: {
    label: "번역 제출 완료",
    progress: 3,
  },
  TRANSLATION_EDIT_REQUESTED: {
    label: "번역 수정 요청",
    progress: 4,
  },
  TRANSLATION_RESOLVED: {
    label: "번역 확정",
    progress: 5,
  },
};

function TranslationCard({
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
  },
  showStatus = false,
}: TranslationCardProps) {
  // const { progress, label, progressLabel } = STATUS[status];
  const { progress } = STATUS[status];

  return (
    <Card>
      <div className="flex flex-col gap-4">
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
              <span>
                {{
                  KRW: "원",
                  USD: "달러",
                }[fee_unit] || ""}
              </span>
            </span>
          </div>
        </div>
        <div>
          <div className="mb-[4px] text-[16px] font-bold">{title}</div>
          <div className="text-[#7E7F80] text-[14px]">{description}</div>
        </div>
        {/* {showStatus && (
          <div className="flex flex-col gap-1">
            <div className="w-full h-1 rounded-full flex gap-[2px]">
              {Array.from({ length: progress }, (_, i) => (
                <div key={i} className="h-1 w-full rounded-full bg-primary" />
              ))}
              {Array.from({ length: 3 - progress }, (_, i) => (
                <div key={i} className="h-1 w-full rounded-full bg-[#8B8C8D]" />
              ))}
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] font-bold text-primary">
                {progressLabel}
              </span>
              <span className="text-[14px] font-bold text-[#7E7F80]">
                {label}
              </span>
            </div>
          </div>
        )} */}
        {showStatus && (
          <div className="flex gap-1">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={`w-1/6 rounded-full ${i !== progress && "opacity-30"}`}
              >
                <div
                  className={`h-1 rounded-full ${i <= progress ? "bg-primary" : "bg-[#8B8C8D]"}`}
                />
                <div
                  className={`truncate text-center text-[14px] font-bold ${i <= progress ? "text-primary" : "text-[#8B8C8D]"}`}
                >
                  {STATUS[step].label}
                </div>
              </div>

              // <div
              //   key={step}
              //   className={`w-1/6 p-1 rounded-md truncate text-center text-[14px] text-white ${i <= progress ? "bg-primary" : "bg-gray-300"}`}
              // >
              //   {STATUS[step].label}
              // </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export default TranslationCard;
