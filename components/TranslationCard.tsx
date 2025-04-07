import { Translation } from "@/types/entities";
import { getDday } from "@/utils/converter/label";
import { NumericFormat } from "react-number-format";
import Badge from "./Badge";
import Card from "./Card";
import CategoryBadges from "./CatagoryBadges";
import LanguageBadge from "./LangaugeBadge";
import TranslationStatus from "./TranslationStatus";

interface TranslationCardProps {
  translation: Translation;
  showStatus?: boolean;
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
  translation,
  showStatus = false,
}: TranslationCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <LanguageBadge
              sourceLanguage={translation.source_language}
              targetLanguage={translation.target_language}
            />
            <CategoryBadges categories={translation.categories} />
            <Badge color="red">{getDday(translation.deadline)}</Badge>
          </div>
        </div>
        <TranslationInfo
          title={translation.title}
          description={translation.description}
        />
        <div className="flex items-center justify-between">
          <TranslationFee
            value={translation.fee.value}
            unit={translation.fee.unit}
          />
          {showStatus && <TranslationStatus translation={translation} />}
        </div>
      </div>
    </Card>
  );
}
