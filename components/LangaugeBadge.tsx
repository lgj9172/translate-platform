import { TranslationLanguage } from "@/types/entities";
import { getLanguageLabel } from "@/utils/converter/label";
import { memo } from "react";
import { FaArrowRight } from "react-icons/fa6";
import Badge from "./Badge";

const LanguageBadge = memo(
  ({
    sourceLanguage,
    targetLanguage,
  }: {
    sourceLanguage: TranslationLanguage;
    targetLanguage: TranslationLanguage;
  }) => (
    <Badge color="black">
      {getLanguageLabel(sourceLanguage)}
      <FaArrowRight className="w-2 h-2" />
      {getLanguageLabel(targetLanguage)}
    </Badge>
  ),
);

export default LanguageBadge;
