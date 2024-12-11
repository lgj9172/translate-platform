"use client";

import { postCSAsk } from "@/apis/cs";
import { postFile } from "@/apis/files";
import Button from "@/components/Button";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import SelectBox from "@/components/SelectBox";
import TextArea from "@/components/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Group, Stack } from "@mantine/core";
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

const PostCSAskFormSchema = z.object({
  category: z.string().min(1, "종류를 선택해 주세요."),
  content: z.string().min(1, "내용을 입력해 주세요."),
  files: z.array(
    z
      .instanceof(File, {
        message: "파일이 선택되지 않았어요.",
      })
      .refine(
        (file) => file.size <= 10 * 1024 * 1024,
        "파일은 최대 10MB까지 업로드 할 수 있어요.",
      ),
  ),
  // .refine((files) => files.length > 0, "파일을 선택해 주세요."),
});

export type PostCSAskFormType = z.infer<typeof PostCSAskFormSchema>;

const PostCSAskFormDefaultValue = {
  category: "의견",
  content: "",
  files: [],
};

export default function Index() {
  const router = useRouter();

  // TODO: 카테고리 value 수정 필요
  const askCategoryOptions = useMemo<{ label: string; value: string }[]>(
    () => [
      { label: "의견", value: "의견" },
      { label: "요청 취소", value: "요청 취소" },
    ],
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

  const { mutate: mutatePostCSAsk } = useMutation({
    mutationFn: postCSAsk,
    onSuccess: (res) => {
      router.push(`/cs/ask/${res.counsel_id}`);
    },
  });

  const { mutateAsync: mutatePostFile } = useMutation({
    mutationFn: postFile,
  });

  const handlSubmitSuccess: SubmitHandler<PostCSAskFormType> = async (
    input,
  ) => {
    const filesInfo = await Promise.all(
      input.files.map((file) => mutatePostFile({ content: file })),
    );
    await mutatePostCSAsk({
      ...input,
      files: filesInfo.map((file) => file.file_id),
    });
  };

  const handleSubmitError: SubmitErrorHandler<PostCSAskFormType> = async (
    error,
  ) => {
    console.log(error);
  };

  return (
    <form onSubmit={handleSubmit(handlSubmitSuccess, handleSubmitError)}>
      <FormProvider {...methods}>
        <Stack w="full" h="full">
          <PageHeader>
            <Group>
              <ActionIcon
                variant="transparent"
                color="black"
                component={Link}
                href="/"
              >
                <FaChevronLeft />
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
                  <SelectBox
                    {...field}
                    data={askCategoryOptions}
                    allowDeselect={false}
                  />
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
                  <TextArea
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
              name="files"
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
                        onChange([file]);
                        e.target.value = "";
                      }
                    }}
                    onRemove={() => onChange([])}
                    text={value?.[0]?.name}
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              등록
            </Button>
          </div>
        </Stack>
      </FormProvider>
    </form>
  );
}
