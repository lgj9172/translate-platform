import { Translation } from "@/apis/translations";

export const TRANSLATION_STATUS = {
  QUOTE_SENT: { label: "견적 확인중", step: 1 },
  TRANSLATOR_SELECTED: { label: "번역 준비중", step: 2 },
  TRANSLATION_BEGAN: { label: "번역중", step: 3 },
  TRANSLATION_SUBMITTED: { label: "번역 초안 제출됨", step: 4 },
  TRANSLATION_EDIT_REQUESTED: { label: "번역 수정중", step: 5 },
  TRANSLATION_RESOLVED: { label: "번역 완료", step: 6 },
} as const;

interface TranslationStatusProps {
  translation: Translation;
}

export default function TranslationStatus({
  translation,
}: TranslationStatusProps) {
  if (translation.is_canceled) {
    return <div className="text-[14px] font-bold text-[#8B8C8D]">취소됨</div>;
  }

  const { label, step } = TRANSLATION_STATUS[translation.status];

  return (
    <div className="flex items-center gap-2">
      <div className="text-[14px] font-bold text-[#8B8C8D]">{label}</div>
      <div className="flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`status-step-${i}`}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 
              ${i < step ? "bg-primary" : "bg-[#E5E7EA]"}`}
          />
        ))}
      </div>
    </div>
  );
}
