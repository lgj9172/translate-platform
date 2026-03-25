import { Translation } from "@/types/entities";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Stack } from "@/components/ui/stack";
import FileDownload from "@/components/FileDownload";

export default function WaitTranslationUpdate({
  translation,
}: {
  translation: Translation;
}) {
  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">번역 수정중</div>
        <p className="text-sm text-gray-600">
          번역을 수정중이에요. <br />
          수정이 완료되면 알려드릴게요.
        </p>
      </div>

      <InputSection>
        <LabelSection>
          <Label>기존 번역 결과물</Label>
        </LabelSection>
        {translation.target_files.map((target_file) => (
          <FileDownload
            key={target_file.file_id}
            fileId={target_file.file_id}
          />
        ))}
      </InputSection>
    </Stack>
  );
}
