import FileDownload from "@/components/FileDownload";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Button } from "@/components/ui/button";
import { Translation } from "@/types/entities";
import { Stack } from "@/components/ui/stack";
import { useState } from "react";
import RequestUpdateModal from "@/modals/RequestUpdateModal";
import ConfirmCompleteModal from "@/modals/ConfirmCompleteModal";

export default function ConfirmTranslation({
  translation,
}: {
  translation: Translation;
}) {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleClickRequestUpdate = () => setOpenUpdateModal(true);
  const handleClickConfirm = () => setOpenConfirmModal(true);

  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">번역 결과물 확인</div>
        <p className="text-sm text-gray-600">
          번역이 완료되었어요. 완료된 내용을 확인해주세요.
        </p>
      </div>

      <InputSection>
        <LabelSection>
          <Label>번역 결과물</Label>
        </LabelSection>
        {translation.target_files.map((target_file) => (
          <FileDownload
            key={target_file.file_id}
            fileId={target_file.file_id}
          />
        ))}
      </InputSection>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          variant="secondary"
          onClick={handleClickRequestUpdate}
        >
          번역 수정 요청
        </Button>
        <Button type="submit" onClick={handleClickConfirm}>
          번역 확정
        </Button>
      </div>

      <RequestUpdateModal
        open={openUpdateModal}
        onOpenChange={setOpenUpdateModal}
        translationId={translation.translation_id}
      />
      <ConfirmCompleteModal
        open={openConfirmModal}
        onOpenChange={setOpenConfirmModal}
        translationId={translation.translation_id}
      />
    </Stack>
  );
}
