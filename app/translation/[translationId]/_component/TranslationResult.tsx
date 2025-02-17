import { Translation, File } from "@/types/entities";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Stack } from "@mantine/core";

export default function TranslationResult({
  translation,
}: {
  translation: Translation;
}) {
  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">번역 완료</div>
        <p className="text-sm text-gray-600">번역이 완료되었어요.</p>
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
    </Stack>
  );
}
