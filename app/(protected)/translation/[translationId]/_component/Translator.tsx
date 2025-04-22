"use client";

import { getSelectedQuotation } from "@/apis/translations-quotations";
import Card from "@/components/Card";
import Fee from "@/components/Fee";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Translation } from "@/types/entities";
import { Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import TranslatorProfile from "./TranslatorProfile";

interface Props {
  translation: Translation;
}

export default function Translator({ translation }: Props) {
  const { data: selectedQuotation } = useQuery({
    queryKey: [
      "translations",
      translation.translation_id,
      "selected-quotation",
    ],
    queryFn: () =>
      getSelectedQuotation({ translationId: translation.translation_id }),
  });

  return (
    <Stack>
      <Label>담당 번역사</Label>
      <Card>
        <div className="flex flex-col gap-2">
          {selectedQuotation && (
            <TranslatorProfile translatorId={selectedQuotation.translator_id} />
          )}
          <InputSection>
            <LabelSection>
              <Label>번역료</Label>
            </LabelSection>
            <Fee value={translation.fee.value} unit={translation.fee.unit} />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>세부사항</Label>
            </LabelSection>
            <div>{translation.description || "-"}</div>
          </InputSection>
        </div>
      </Card>
    </Stack>
  );
}
