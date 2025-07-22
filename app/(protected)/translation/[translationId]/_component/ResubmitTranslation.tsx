"use client";

import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileDownload from "@/components/FileDownload";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Button } from "@/components/ui/button";
import SubmitTranslationModal from "@/modals/SubmitTranslationModal";
import { Translation } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@/components/ui/stack";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const ResubmitTranslationFormSchema = z.object({
  file: z
    .custom<File>((file) => file instanceof File, {
      message: "유효한 파일을 선택하세요.",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      // 파일 크기 제한 (10MB)
      message: "파일 크기가 10MB를 초과할 수 없습니다.",
    })
    .refine((file) => file.type === "application/pdf", {
      // 파일 유형 제한 (PDF)
      message: "PDF 파일만 업로드할 수 있습니다.",
    }),
});

type ResubmitTranslationFormType = z.infer<
  typeof ResubmitTranslationFormSchema
>;

const ResubmitTranslationFormDefaultValue = {
  file: undefined,
};

interface Props {
  translation: Translation;
}

export default function ResubmitTranslation({ translation }: Props) {
  const [openSubmitTranslationModal, setOpenSubmitTranslationModal] =
    useState(false);

  const methods = useForm<ResubmitTranslationFormType>({
    resolver: zodResolver(ResubmitTranslationFormSchema),
    defaultValues: ResubmitTranslationFormDefaultValue,
    mode: "onChange",
  });

  const { control, handleSubmit } = methods;

  const handleSubmitValid: SubmitHandler<ResubmitTranslationFormType> = ({
    file,
  }) => {
    if (file) {
      setOpenSubmitTranslationModal(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitValid)}>
      <Stack>
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
          {translation.target_files.map((target_file) => (
            <FileDownload
              key={target_file.file_id}
              fileId={target_file.file_id}
            />
          ))}
        </InputSection>

        <InputSection>
          <LabelSection>
            <Label>변경된 번역 결과물</Label>
          </LabelSection>
          <ControllerSection>
            <Controller
              name="file"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <FileInput
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        field.onChange(e.target.files[0]); // React Hook Form의 상태 업데이트
                      }
                    }}
                    onRemove={() => {
                      field.onChange(undefined);
                    }}
                    placeholder="번역 파일 (10MB, PDF)"
                    text={field.value?.name}
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </>
              )}
            />
          </ControllerSection>
        </InputSection>

        <div className="flex justify-end">
          <Button type="submit">번역 제출</Button>
        </div>
        <SubmitTranslationModal
          open={openSubmitTranslationModal}
          onOpenChange={setOpenSubmitTranslationModal}
          translationId={translation.translation_id}
          file={methods.getValues("file")}
        />
      </Stack>
    </form>
  );
}
