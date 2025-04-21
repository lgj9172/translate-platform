"use client";

import { Translation } from "@/types/entities";
import Card from "@/components/Card";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Stack } from "@mantine/core";
import { NumericFormat } from "react-number-format";

interface Props {
  translation: Translation;
}

export default function Payment({ translation }: Props) {
  return (
    <Stack>
      <Label>결제 정보</Label>

      {/* TODO: 이 번역에 결제된 정보를 가져와서 보여주어야 함 */}
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

            <div className="flex text-primary font-bold text-[16px]">
              <span>
                <NumericFormat
                  displayType="text"
                  value={12345}
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                />
              </span>
              <span>
                {translation.fee.unit === "KRW" && "원"}
                {translation.fee.unit === "USD" && "달러"}
              </span>
            </div>
          </InputSection>
        </div>
      </Card>
    </Stack>
  );
}
