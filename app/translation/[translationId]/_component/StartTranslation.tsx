"use client";

import {
  postTranslationStart,
  PostTranslationStartRequest,
  Translation,
} from "@/apis/translations";
import Button from "@/components/Button";
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";

interface Props {
  translation: Translation;
}

export default function StartTranslation({ translation }: Props) {
  const { mutate: mutatePostTranslationStart } = useMutation({
    mutationFn: ({ translationId }: PostTranslationStartRequest) =>
      postTranslationStart({
        translationId,
      }),
    onSuccess: () => {},
  });

  const handleClickStartTranslation = () => {
    modals.open({
      title: <div className="text-lg font-bold">번역 시작</div>,
      children: (
        <div className="flex flex-col gap-2">
          <div>
            번역이 시작되었나요?
            <br />
            번역 시작 버튼을 눌러 번역 요청자에게 번역이 시작되었음을
            알려주세요.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => modals.closeAll()}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                mutatePostTranslationStart({
                  translationId: translation.translation_id,
                });
                modals.closeAll();
              }}
            >
              번역 시작
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <Stack>
      <div className="text-lg font-bold">
        번역할 준비가 되었다면 번역 시작을 눌러주세요.
      </div>

      <div className="flex justify-end">
        <Button
          size="md"
          variant="primary"
          onClick={handleClickStartTranslation}
        >
          번역 시작
        </Button>
      </div>
    </Stack>
  );
}
