import { Card } from "@/components/ui/card";
import { Translation } from "@/types/entities";
import { getDday } from "@/utils/converter/label";
import { Badge } from "@/components/ui/badge";
import CategoryBadges from "./CatagoryBadges";
import Fee from "./Fee";
import LanguageBadge from "./LangaugeBadge";
import TranslationStatus from "./TranslationStatus";
import dayjs from "dayjs";

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

export default function TranslationCard({
  translation,
  showStatus = false,
}: TranslationCardProps) {
  const dday = dayjs(translation.deadline).diff(dayjs(), "day");
  const isUrgent = dday <= 3;

  return (
    <Card>
      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between items-start">
          <div className="flex gap-1">
            <LanguageBadge
              sourceLanguage={translation.source_language}
              targetLanguage={translation.target_language}
            />
            <CategoryBadges categories={translation.categories} />
          </div>
          <Badge variant={isUrgent ? "destructive" : "secondary"}>
            {getDday(translation.deadline)}
          </Badge>
        </div>
        <TranslationInfo
          title={translation.title}
          description={translation.description}
        />
        <div className="flex items-center justify-between">
          <Fee value={translation.fee.value} unit={translation.fee.unit} />
          {showStatus && <TranslationStatus translation={translation} />}
        </div>
      </div>
    </Card>
  );
}
