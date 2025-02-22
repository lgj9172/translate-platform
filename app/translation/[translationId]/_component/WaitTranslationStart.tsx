"use client";

import { postTranslationCancel } from "@/apis/translations";
import Button from "@/components/Button";
import { Translation } from "@/types/entities";
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";

interface Props {
  translation: Translation;
}

export default function WaitTranslationStart({ translation }: Props) {
  const { mutate: mutatePostTranslationCancel } = useMutation({
    mutationFn: postTranslationCancel,
    onSuccess: () => {},
  });

  const handleClickCancelTranslation = () =>
    modals.open({
      title: <div className="text-lg font-bold">번역 요청 취소</div>,
      children: (
        <div className="flex flex-col gap-2">
          <div>아직 변역이 시작되지 않았다면 취소 할 수 있어요.</div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => modals.closeAll()}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                mutatePostTranslationCancel({
                  translationId: translation.translation_id,
                });
                modals.closeAll();
              }}
            >
              번역 요청 취소
            </Button>
          </div>
        </div>
      ),
    });

  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">번역 준비중</div>
        <p className="text-sm text-gray-600">
          번역사가 번역 내용을 확인중이에요. 번역이 시작되면 알려드릴게요.
        </p>
      </div>
      <div className="flex justify-end">
        <Button
          size="md"
          variant="secondary"
          onClick={handleClickCancelTranslation}
        >
          번역 요청 취소
        </Button>
      </div>
    </Stack>
  );
}
