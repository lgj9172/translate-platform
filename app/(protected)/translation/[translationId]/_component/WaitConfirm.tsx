import { Translation, File } from "@/types/entities";
import Button from "@/components/Button";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function WaitConfirm({
  translation,
}: {
  translation: Translation;
}) {
  // TODO: 번역결과물 다운로드, 번역수정요청, 번역평가, 번역종료 기능 추가 필요
  // const { downloadFile } = useFileDownload();

  const handleClickRequestUpdate = () =>
    modals.open({
      title: <div className="text-lg font-bold">번역 결과물 수정</div>,
      children: (
        <div className="flex flex-col gap-8">
          <p>
            번역 결과물에 수정이 필요한가요?
            <br />
            번역을 진행중인 상태로 변경하고 번역 결과물을 다시 올릴 수 있어요.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => modals.closeAll()}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                modals.closeAll();
              }}
            >
              번역 진행중 상태로 변경
            </Button>
          </div>
        </div>
      ),
    });

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
        {translation.target_files.map((target_file) => {
          const file = target_file as unknown as File;
          return (
            <div key={file.file_id}>
              <button type="button" className="text-[#3B82F6] font-bold">
                <span>{file.name}</span>
              </button>
            </div>
          );
        })}
      </InputSection>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          size="md"
          variant="secondary"
          onClick={handleClickRequestUpdate}
        >
          번역 결과물 수정
        </Button>
      </div>
    </Stack>
  );
}
