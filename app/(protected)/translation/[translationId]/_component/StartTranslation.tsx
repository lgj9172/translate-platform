"use client";

import StartTranslationModal from "@/modals/StartTranslationModal";
import { Translation } from "@/types/entities";
import { Stack } from "@mantine/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function StartTranslation({
  translation,
}: {
  translation: Translation;
}) {
  const [openStartTranslationModal, setOpenStartTranslationModal] =
    useState(false);

  const handleClickStartTranslation = () => {
    setOpenStartTranslationModal(true);
  };

  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">번역 시작</div>
        <p className="text-sm text-gray-600">
          번역할 준비가 되었다면 번역 시작을 눌러주세요.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleClickStartTranslation}>번역 시작</Button>
      </div>
      <StartTranslationModal
        open={openStartTranslationModal}
        onOpenChange={setOpenStartTranslationModal}
        translationId={translation.translation_id}
      />
    </Stack>
  );
}
