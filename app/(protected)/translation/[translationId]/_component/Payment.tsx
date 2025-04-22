"use client";

import Card from "@/components/Card";
import Fee from "@/components/Fee";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Translation } from "@/types/entities";

interface Props {
  translation: Translation;
}

export default function Payment({ translation }: Props) {
  return (
    <InputSection>
      <LabelSection>
        <Label>결제 정보</Label>
      </LabelSection>
      <Card>
        <div className="flex flex-col gap-2">
          <InputSection>
            <LabelSection>
              <Label>결제 방법</Label>
            </LabelSection>
            <div>계좌이체</div>
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>결제 금액</Label>
            </LabelSection>
            <Fee value={translation.fee.value} unit={translation.fee.unit} />
          </InputSection>
        </div>
      </Card>
    </InputSection>
  );
}
