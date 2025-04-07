import { memo } from "react";
import { TranslationLanguage } from "@/types/entities";
import { getLanguageLabel } from "@/utils/converter/label";
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
      {`${getLanguageLabel(sourceLanguage)} → ${getLanguageLabel(targetLanguage)}`}
    </Badge>
  ),
);

export default LanguageBadge;
