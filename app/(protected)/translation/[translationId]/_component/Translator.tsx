"use client";

import Card from "@/components/Card";
import Fee from "@/components/Fee";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Translation } from "@/types/entities";
import { Avatar, Stack } from "@mantine/core";

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
            <Avatar />
            <div>
              <div className="text-[14px] text-[#4B4D4D]">번역사이름</div>
              <div className="text-[14px] text-[#8B8C8D]">경력 5년</div>
            </div>
          </div>

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
            <div>세부사항입니다.</div>
          </InputSection>
        </div>
      </Card>
    </Stack>
  );
}
