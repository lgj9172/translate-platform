"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { postCounsel } from "@/apis/counsels";
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
import { ActionIcon } from "@/components/ui/action-icon";
import { Button } from "@/components/ui/button";
import { Group } from "@/components/ui/group";
import { Stack } from "@/components/ui/stack";
import { Textarea } from "@/components/ui/textarea";
import {
  COUNSEL_CATEGORY,
  COUNSEL_CATEGORY_LABEL,
  type Counsel,
  type CounselCategory,
} from "@/types/entities";

const PostCSAskFormSchema = z.object({
  category: z.nativeEnum(COUNSEL_CATEGORY, {
    errorMap: () => ({ message: "종류를 선택해 주세요." }),
  }),
  content: z.string().min(1, "내용을 입력해 주세요."),
  file_id: z.string().optional(),
  file_name: z.string().optional(),
});

export type PostCSAskFormType = z.infer<typeof PostCSAskFormSchema>;

const PostCSAskFormDefaultValue: PostCSAskFormType = {
  category: COUNSEL_CATEGORY.SUGGESTION,
  content: "",
  file_id: undefined,
  file_name: undefined,
};

export default function Index() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const askCategoryOptions = useMemo<
    { label: string; value: CounselCategory }[]
  >(
    () =>
      Object.entries(COUNSEL_CATEGORY).map(([key]) => ({
        label: COUNSEL_CATEGORY_LABEL[key as CounselCategory],
        value: key as CounselCategory,
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
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const fileName = watch("file_name");

  const { mutate: mutatePostCounsel } = useMutation({
    mutationFn: postCounsel,
    onSuccess: (res: Counsel) => {
      router.push(`/cs/ask/${res.counsel_id}`);
    },
  });

  const { mutateAsync: uploadFile } = useMutation({ mutationFn: postFile });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFile({ payload: { content: file } });
      setValue("file_id", res.file_id);
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

  const handlSubmitSuccess: SubmitHandler<PostCSAskFormType> = (input) => {
    mutatePostCounsel({
      payload: {
        category: input.category,
        content: input.content,
        file_id: input.file_id,
      },
    });
  };

  const handleSubmitError: SubmitErrorHandler<PostCSAskFormType> = () => {
    toast.error("잘못 입력되었거나 입력되지 않은 항목이 있어요.", {
      richColors: true,
      position: "top-center",
    });
  };

  return (
    <form onSubmit={handleSubmit(handlSubmitSuccess, handleSubmitError)}>
      <FormProvider {...methods}>
        <Stack className="w-full h-full" gap="xl">
          <PageHeader>
            <Group>
              <ActionIcon variant="ghost" asChild>
                <Link href="/cs/ask">
                  <ArrowLeftIcon />
                </Link>
              </ActionIcon>
              <PageTitle>1:1 문의 작성</PageTitle>
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
            <ControllerSection>
              <FileInput
                placeholder={isUploading ? "업로드 중..." : "파일 (10MB, PDF)"}
                onChange={handleFileChange}
                onRemove={() => {
                  setValue("file_id", undefined);
                  setValue("file_name", undefined);
                }}
                text={fileName}
                disabled={isUploading}
              />
            </ControllerSection>
          </InputSection>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || isUploading}>
              등록
            </Button>
          </div>
        </Stack>
      </FormProvider>
    </form>
  );
}
