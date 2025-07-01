import FileDownload from "@/components/FileDownload";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Button } from "@/components/ui/button";
import { Translation } from "@/types/entities";
import { Stack } from "@/components/ui/stack";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function ConfirmTranslation({
  translation,
}: {
  translation: Translation;
}) {
  // TODO: 번역결과물 다운로드, 번역수정요청, 번역평가, 번역종료 기능 추가 필요
  // const { downloadFile } = useFileDownload();

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

      <Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>번역 수정 요청</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-8">
            <p>
              번역 수정을 요청하시겠어요?
              <br />
              번역 수정 요청은 최대 3번 가능해요.
            </p>
            <div>현재 수정 요청 가능 횟수: 3번</div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setOpenUpdateModal(false)}
              >
                닫기
              </Button>
              <Button onClick={() => setOpenUpdateModal(false)}>
                번역 수정 요청
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openConfirmModal} onOpenChange={setOpenConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>번역 확정</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-8">
            <p>번역이 만족스러우셨나요?</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setOpenConfirmModal(false)}
              >
                닫기
              </Button>
              <Button onClick={() => setOpenConfirmModal(false)}>
                번역 확정
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
