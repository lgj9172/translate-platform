"use client";

import { Translation } from "@/apis/translations";
import Card from "@/components/Card";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Avatar, Stack } from "@mantine/core";
import { NumericFormat } from "react-number-format";

interface Props {
  translation: Translation;
}

export default function Translator({ translation }: Props) {
  return (
    <Stack>
      <Label>담당 번역사</Label>
      {/* TODO: 이 번역에 선택된 견적을 가져와서 보여주어야 함 */}
      <Card>
        <div className="flex flex-col gap-2">
          <div className="flex gap-[8px]">
            <Avatar src="avatar.png" />
            <div>
              <div className="text-[14px] text-[#4B4D4D]">번역사이름</div>
              <div className="text-[14px] text-[#8B8C8D]">경력 5년</div>
            </div>
          </div>

          <InputSection>
            <LabelSection>
              <Label>번역료</Label>
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
                {translation.fee_unit === "KRW" && "원"}
                {translation.fee_unit === "USD" && "달러"}
              </span>
            </div>
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>세부사항</Label>
            </LabelSection>
            <div>세부사항입니다.</div>
          </InputSection>
        </div>
      </Card>
    </Stack>
  );
}
