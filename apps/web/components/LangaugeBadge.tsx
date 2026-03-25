import { TranslationLanguage } from "@/types/entities";
import { getLanguageLabel } from "@/utils/converter/label";
import { FaArrowRight } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

export default function LanguageBadge({
  sourceLanguage,
  targetLanguage,
}: {
  sourceLanguage: TranslationLanguage;
  targetLanguage: TranslationLanguage;
}) {
  return (
    <Badge variant="outline">
      {getLanguageLabel(sourceLanguage)}
      <FaArrowRight className="w-2 h-2" />
      {getLanguageLabel(targetLanguage)}
    </Badge>
  );
}
