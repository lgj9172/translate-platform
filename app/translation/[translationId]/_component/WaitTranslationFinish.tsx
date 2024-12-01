"use client";

import { Translation } from "@/apis/translations";
import { Stack } from "@mantine/core";
import dayjs from "dayjs";

interface Props {
  translation: Translation;
}

export default function WaitTranslationFinish({ translation }: Props) {
  return (
    <Stack>
      <div className="text-lg font-bold">
        고객 님, 번역사가 번역을 진행중이에요.
        <br />
        번역이 완료되면 알려드릴게요.
        <br />
        번역은{" "}
        {dayjs(translation.deadline).locale("ko").format("YYYY.MM.DD A hh:mm")}
        까지는 완료 될 예정이에요.
      </div>
    </Stack>
  );
}
