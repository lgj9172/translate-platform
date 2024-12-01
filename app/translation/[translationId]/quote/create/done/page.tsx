"use client";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Check from "@assets/icons/check.svg";
import { Center, Stack } from "@mantine/core";
import Link from "next/link";

interface Props {
  params: { translationId: string };
}

export default function Index({ params: { translationId } }: Props) {
  return (
    <Center h={500}>
      <Stack w="100%" align="center" gap="xl">
        <Stack align="center">
          <Check />
          <div className="flex flex-col items-center justify-center gap-[16px]">
            <div className="text-[24px] font-bold">
              견적을 성공적으로 보냈어요
            </div>
            <div className="text-[16px]">
              요청자가 작업을 진행할 번역사를 선택할 때까지 조금만 기다려주세요.
            </div>
          </div>
          <Alert>
            <div className="flex flex-col justify-center items-start">
              <div className="text-[16px] font-bold">
                견적을 보낸 이후엔 이렇게 진행돼요
              </div>
              <ul className="list-disc list-inside flex flex-col justify-center items-start">
                <li>요청자가 견적을 보낸 번역사들을 확인합니다.</li>
                <li>작업을 진행할 번역사를 선택해 번역료를 결제해요.</li>
                <li>선택된 번역사는 문자를 통해 알림을 받아요.</li>
              </ul>
            </div>
          </Alert>
        </Stack>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="secondary">메인 화면</Button>
          </Link>
          <Link href={`/translation/${translationId}`}>
            <Button variant="primary">이 번역 요청 보기</Button>
          </Link>
          <Link href="/my/translation/request">
            <Button variant="primary">나의 요청</Button>
          </Link>
        </div>
      </Stack>
    </Center>
  );
}