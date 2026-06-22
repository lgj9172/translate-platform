"use client";

import Fee from "@/components/Fee";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import TranslatorProfile from "@/components/translation/TranslatorProfile";
import { Card } from "@/components/ui/card";
import type { Quotation, Translation } from "@/types/entities";

interface Props {
  translation: Translation;
  selectedQuotation?: Quotation;
}

export default function Translator({ translation, selectedQuotation }: Props) {
  return (
    <InputSection>
      <LabelSection>
        <Label>담당 번역사</Label>
      </LabelSection>
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
    </InputSection>
  );
}
