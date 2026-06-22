import { useState } from "react";
import FileDownload from "@/components/FileDownload";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import ResumeTranslationModal from "@/modals/ResumeTranslationModal";
import type { Translation } from "@/types/entities";

export default function WaitConfirm({
  translation,
}: {
  translation: Translation;
}) {
  const [openResumeTranslationModal, setOpenResumeTranslationModal] =
    useState(false);

  const handleClickRequestUpdate = () => setOpenResumeTranslationModal(true);

  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">
          번역 결과물 확인 대기중
        </div>
        <p className="text-sm text-gray-600">
          번역을 요청하신분이 번역 결과물을 확인하고 있어요.
        </p>
      </div>

      <InputSection>
        <LabelSection>
          <Label>번역 결과물</Label>
        </LabelSection>
        {translation.target_files.map((target_file, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: file_id can be null
          <FileDownload
            key={`${target_file.file_id}-${index}`}
            fileId={target_file.file_id}
            presignedUrl={target_file.presigned_url}
            name={target_file.name}
          />
        ))}
      </InputSection>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          variant="secondary"
          onClick={handleClickRequestUpdate}
        >
          번역 결과물 수정
        </Button>
      </div>
      <ResumeTranslationModal
        open={openResumeTranslationModal}
        onOpenChange={setOpenResumeTranslationModal}
        translationId={translation.translation_id}
      />
    </Stack>
  );
}
