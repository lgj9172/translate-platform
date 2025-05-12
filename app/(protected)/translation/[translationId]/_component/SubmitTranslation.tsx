"use client";

import { postFile } from "@/apis/files";
import { postTranslationSubmit } from "@/apis/translations";
import Button from "@/components/Button";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Translation } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const SubmitTranslationFormSchema = z.object({
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

type SubmitTranslationFormType = z.infer<typeof SubmitTranslationFormSchema>;

const SubmitTranslationFormDefaultValue = {
  file: undefined,
};

interface Props {
  translation: Translation;
}

export default function SubmitTranslation({ translation }: Props) {
  const methods = useForm<SubmitTranslationFormType>({
    resolver: zodResolver(SubmitTranslationFormSchema),
    defaultValues: SubmitTranslationFormDefaultValue,
    mode: "onChange",
  });

  const { control, handleSubmit } = methods;

  const { mutateAsync } = useMutation({ mutationFn: postFile });

  const { mutate: mutatePostTranslationSubmit } = useMutation({
    mutationFn: postTranslationSubmit,
    onSuccess: () => {},
  });

  const handleSubmitTranslation = (file: File) => {
    modals.open({
      title: <div className="text-lg font-bold">번역 제출</div>,
      children: (
        <div className="flex flex-col gap-2">
          <div>번역을 제출하시겠어요?</div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => modals.closeAll()}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                const res = await mutateAsync({
                  payload: { content: file },
                });
                mutatePostTranslationSubmit({
                  translationId: translation.translation_id,
                  payload: { target_files: [res.file_id] },
                });
                modals.closeAll();
              }}
            >
              번역 제출
            </Button>
          </div>
        </div>
      ),
    });
  };

  const handleSubmitValid: SubmitHandler<SubmitTranslationFormType> = ({
    file,
  }) => {
    if (file) handleSubmitTranslation(file);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitValid)}>
      <Stack>
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
          <Button
            type="submit"
            size="md"
            variant="primary"
            onClick={handleSubmit(handleSubmitValid)}
          >
            번역 제출
          </Button>
        </div>
      </Stack>
    </form>
  );
}
