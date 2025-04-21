"use client";

import Button from "@/components/Button";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileDownload from "@/components/FileDownload";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Translation } from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mantine/core";
// import dayjs from "dayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const ResubmitTranslationFormSchema = z.object({
  file: z
    .custom<File>((file) => file instanceof File, {
      message: "유효한 파일을 선택하세요.",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      // 파일 크기 제한 (2MB)
      message: "파일 크기가 2MB를 초과할 수 없습니다.",
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
  const methods = useForm<ResubmitTranslationFormType>({
    resolver: zodResolver(ResubmitTranslationFormSchema),
    defaultValues: ResubmitTranslationFormDefaultValue,
    mode: "onChange",
  });

  const { control, handleSubmit } = methods;

  // const { mutateAsync } = useMutation({ mutationFn: postFile });

  // const { mutate: mutatePostTranslationResubmit } = useMutation({
  //   mutationFn: ({ translationId, fileId }: PostTranslationResubmitRequest) =>
  //     postTranslationResubmit({
  //       translationId,
  //       fileId,
  //     }),
  //   onSuccess: () => {},
  // });

  // const handleSubmitTranslation = (file: File) => {
  //   modals.open({
  //     title: <div className="text-lg font-bold">번역 제출</div>,
  //     children: (
  //       <div className="flex flex-col gap-2">
  //         <div>번역을 제출하시겠어요?</div>
  //         <div className="flex justify-end gap-2">
  //           <Button variant="secondary" onClick={() => modals.closeAll()}>
  //             닫기
  //           </Button>
  //           <Button
  //             variant="primary"
  //             onClick={async () => {
  //               const res = await mutateAsync({ content: file });
  //               mutatePostTranslationResubmit({
  //                 translationId: translation.translation_id,
  //                 fileId: res.file_id,
  //               });
  //               modals.closeAll();
  //             }}
  //           >
  //             번역 제출
  //           </Button>
  //         </div>
  //       </div>
  //     ),
  //   });
  // };

  const handleSubmitValid: SubmitHandler<ResubmitTranslationFormType> = () => {
    // if (file) handleSubmitTranslation(file);
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
