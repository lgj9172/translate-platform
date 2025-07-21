"use client";

import { postFile } from "@/apis/files";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import SelectBox from "@/components/SelectBox";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon } from "@/components/ui/action-icon";
import { Group } from "@/components/ui/group";
import { Stack } from "@/components/ui/stack";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa6";
import { z } from "zod";
import { Counsel, COUNSEL_CATEGORY, CounselCategory } from "@/types/entities";
import { postCounsel } from "@/apis/counsels";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PostCSAskFormSchema = z.object({
  category: z.nativeEnum(COUNSEL_CATEGORY, {
    errorMap: () => ({ message: "종류를 선택해 주세요." }),
  }),
  content: z.string().min(1, "내용을 입력해 주세요."),
  file: z
    .instanceof(globalThis.File, {
      message: "파일이 선택되지 않았어요.",
    })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "파일은 최대 10MB까지 업로드 할 수 있어요.",
    ),
});

export type PostCSAskFormType = z.infer<typeof PostCSAskFormSchema>;

const PostCSAskFormDefaultValue = {
  category: COUNSEL_CATEGORY.SUGGESTION,
  content: "",
  files: [] as globalThis.File[],
};

export default function Index() {
  const router = useRouter();

  const askCategoryOptions = useMemo<
    { label: string; value: CounselCategory }[]
  >(
    () =>
      Object.entries(COUNSEL_CATEGORY).map(([value, label]) => ({
        label,
        value: value as CounselCategory,
      })),
    [],
  );

  const methods = useForm<PostCSAskFormType>({
    resolver: zodResolver(PostCSAskFormSchema),
    defaultValues: PostCSAskFormDefaultValue,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: mutatePostCounsel } = useMutation({
    mutationFn: postCounsel,
    onSuccess: (res: Counsel) => {
      router.push(`/cs/ask/${res.counsel_id}`);
    },
  });

  const { mutateAsync: mutatePostFile } = useMutation({
    mutationFn: postFile,
  });

  const handlSubmitSuccess: SubmitHandler<PostCSAskFormType> = async (
    input,
  ) => {
    const fileInfo = await mutatePostFile({
      payload: { content: input.file },
    });
    if (!fileInfo) {
      throw new Error("파일 업로드에 실패했습니다.");
    }
    mutatePostCounsel({
      payload: {
        category: input.category,
        content: input.content,
        fileId: fileInfo.file_id,
      },
    });
  };

  const handleSubmitError: SubmitErrorHandler<PostCSAskFormType> = async () => {
    toast.error("잘못 입력되었거나 입력되지 않은 항목이 있어요.", {
      richColors: true,
      position: "top-center",
    });
  };

  return (
    <form onSubmit={handleSubmit(handlSubmitSuccess, handleSubmitError)}>
      <FormProvider {...methods}>
        <Stack className="w-full h-full">
          <PageHeader>
            <Group>
              <ActionIcon variant="ghost" asChild>
                <Link href="/cs/ask">
                  <FaChevronLeft />
                </Link>
              </ActionIcon>
              <PageTitle>번역요청</PageTitle>
            </Group>
          </PageHeader>

          <InputSection>
            <LabelSection>
              <Label>종류</Label>
            </LabelSection>
            <Controller
              name="category"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ControllerSection>
                  <SelectBox {...field} data={askCategoryOptions} />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>내용</Label>
            </LabelSection>
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ControllerSection>
                  <Textarea
                    {...field}
                    maxLength={100}
                    placeholder="번역과 관련이 있다면 번역 ID도 함께 적어주세요."
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>첨부파일</Label>
            </LabelSection>
            <Controller
              name="file"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <ControllerSection>
                  <FileInput
                    placeholder="파일 (10MB, PDF)"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                        e.target.value = "";
                      }
                    }}
                    onRemove={() => onChange(null)}
                    text={value?.name}
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              등록
            </Button>
          </div>
        </Stack>
      </FormProvider>
    </form>
  );
}
