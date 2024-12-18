import { Translation } from "@/apis/translations";
import {
  getCategoryLabel,
  getDday,
  getLanguageLabel,
} from "@/utils/converter/label";
import { NumericFormat } from "react-number-format";
import Badge from "./Badge";
import Card from "./Card";
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
            {translation.categories.map((category) => (
              <Badge key={category} color="blue">
                {getCategoryLabel(category)}
              </Badge>
            ))}
            <Badge color="black">
              {`${getLanguageLabel(translation.source_language)[0]}${
                getLanguageLabel(translation.target_language)[0]
              }`}
            </Badge>
            <Badge color="red">{getDday(translation.deadline)}</Badge>
          </div>
        </div>
        <TranslationInfo
          title={translation.title}
          description={translation.description}
        />
        <div className="flex items-center justify-between">
          <TranslationFee
            value={translation.fee_value}
            unit={translation.fee_unit}
          />
          {showStatus && <TranslationStatus translation={translation} />}
        </div>
      </div>
    </Card>
  );
}
