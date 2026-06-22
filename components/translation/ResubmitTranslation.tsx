"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFile } from "@/apis/files";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileDownload from "@/components/FileDownload";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import SubmitTranslationModal from "@/modals/SubmitTranslationModal";
import type { Translation } from "@/types/entities";

const ResubmitTranslationFormSchema = z.object({
  file_id: z.string().min(1, "번역 파일을 업로드해 주세요."),
  file_name: z.string(),
});

type ResubmitTranslationFormType = z.infer<
  typeof ResubmitTranslationFormSchema
>;

interface Props {
  translation: Translation;
}

export default function ResubmitTranslation({ translation }: Props) {
  const [openSubmitTranslationModal, setOpenSubmitTranslationModal] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm<ResubmitTranslationFormType>({
    resolver: zodResolver(ResubmitTranslationFormSchema),
    defaultValues: { file_id: "", file_name: "" },
  });

  const { control, handleSubmit, setValue, watch } = methods;
  const fileId = watch("file_id");
  const fileName = watch("file_name");

  const { mutateAsync: uploadFile } = useMutation({ mutationFn: postFile });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFile({ payload: { content: file } });
      setValue("file_id", res.file_id, { shouldValidate: true });
      setValue("file_name", res.name);
    } catch {
      toast.error("파일 업로드에 실패했습니다.", {
        richColors: true,
        position: "top-center",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitValid: SubmitHandler<ResubmitTranslationFormType> = () => {
    setOpenSubmitTranslationModal(true);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitValid)}>
      <Stack gap="xl">
        <div className="flex flex-col gap-2 mb-4">
          <div className="text-xl font-bold text-gray-800">번역 제출</div>
          <p className="text-sm text-gray-600">
            번역 수정이 완료되었다면 제출해주세요.
          </p>
        </div>

        <InputSection>
          <LabelSection>
            <Label>기존 번역 결과물</Label>
          </LabelSection>
          {translation.target_files.map((target_file, index) => (
            <FileDownload
              // biome-ignore lint/suspicious/noArrayIndexKey: file_id may be duplicated at runtime
              key={`${target_file.file_id}-${index}`}
              fileId={target_file.file_id}
              presignedUrl={target_file.presigned_url}
              name={target_file.name}
            />
          ))}
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>변경된 번역 결과물</Label>
          </LabelSection>
          <ControllerSection>
            <Controller
              name="file_id"
              control={control}
              render={({ fieldState: { error } }) => (
                <>
                  <FileInput
                    onChange={handleFileChange}
                    onRemove={() => {
                      setValue("file_id", "", { shouldValidate: true });
                      setValue("file_name", "");
                    }}
                    placeholder={
                      isUploading ? "업로드 중..." : "번역 파일 (10MB, PDF)"
                    }
                    text={fileName || undefined}
                    disabled={isUploading}
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </>
              )}
            />
          </ControllerSection>
        </InputSection>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUploading}>
            번역 제출
          </Button>
        </div>

        {fileId && (
          <SubmitTranslationModal
            open={openSubmitTranslationModal}
            onOpenChange={setOpenSubmitTranslationModal}
            translationId={translation.translation_id}
            fileId={fileId}
          />
        )}
      </Stack>
    </form>
  );
}
