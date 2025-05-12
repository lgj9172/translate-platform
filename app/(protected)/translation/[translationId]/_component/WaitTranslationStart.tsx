"use client";

import Button from "@/components/Button";
import CancelTranslationModal from "@/modals/CancelTranslationModal";
import { Translation } from "@/types/entities";
import { Stack } from "@mantine/core";
import { useState } from "react";

interface Props {
  translation: Translation;
}

export default function WaitTranslationStart({ translation }: Props) {
  const [openCancelTranslationModal, setOpenCancelTranslationModal] =
    useState(false);

  const handleClickCancelTranslation = () => {
    setOpenCancelTranslationModal(true);
  };

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
      <CancelTranslationModal
        open={openCancelTranslationModal}
        onOpenChange={setOpenCancelTranslationModal}
        translationId={translation.translation_id}
      />
    </Stack>
  );
}
