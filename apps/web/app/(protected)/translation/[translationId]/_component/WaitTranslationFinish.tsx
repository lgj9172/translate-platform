"use client";

import { Translation } from "@/types/entities";
import { Stack } from "@/components/ui/stack";
import dayjs from "dayjs";

interface Props {
  translation: Translation;
}

export default function WaitTranslationFinish({ translation }: Props) {
  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">번역 진행중</div>
        <p className="text-sm text-gray-600">
          번역사가 번역을 진행중이에요. 번역이 완료되면 알려드릴게요.
          <br />
          번역은{" "}
          {dayjs(translation.deadline).locale("ko").format("YYYY.MM.DD hh:mm")}
          까지는 완료 될 예정이에요.
        </p>
      </div>
    </Stack>
  );
}
