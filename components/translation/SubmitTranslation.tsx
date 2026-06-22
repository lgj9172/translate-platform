"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { postFile } from "@/apis/files";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import SubmitTranslationModal from "@/modals/SubmitTranslationModal";
import type { Translation } from "@/types/entities";

const SubmitTranslationFormSchema = z.object({
  file_id: z.string().min(1, "번역 파일을 업로드해 주세요."),
  file_name: z.string(),
});

type SubmitTranslationFormType = z.infer<typeof SubmitTranslationFormSchema>;

export default function SubmitTranslation({
  translation,
}: {
  translation: Translation;
}) {
  const [openSubmitTranslationModal, setOpenSubmitTranslationModal] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm<SubmitTranslationFormType>({
    resolver: zodResolver(SubmitTranslationFormSchema),
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

  const handleSubmitValid: SubmitHandler<SubmitTranslationFormType> = () => {
    setOpenSubmitTranslationModal(true);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitValid)}>
      <Stack gap="xl">
        <div className="flex flex-col gap-2 mb-4">
          <div className="text-xl font-bold text-gray-800">번역 제출</div>
          <p className="text-sm text-gray-600">
            번역 초안이 완료되었다면 제출해주세요.
            <br />
            번역은{" "}
            {dayjs(translation.deadline)
              .locale("ko")
              .format("YYYY.MM.DD hh:mm")}
            까지는 완료 되어야 합니다.
          </p>
        </div>

        <InputSection>
          <LabelSection>
            <Label>번역문</Label>
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
          <Button
            type="submit"
            onClick={handleSubmit(handleSubmitValid)}
            disabled={isUploading}
          >
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
