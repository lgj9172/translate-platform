"use client";

import { postFile } from "@/apis/files";
import { postTranslation } from "@/apis/translations";
import Speciality from "@/app/(protected)/my/translator/_component/Speciality";
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
import { DateTimePicker } from "@/components/ui/date-picker";
import { Group } from "@/components/ui/group";
import { Input } from "@/components/ui/input";
import { Stack } from "@/components/ui/stack";
import { Textarea } from "@/components/ui/textarea";
import {
  TRANSLATION_CATEGORY,
  TRANSLATION_CURRENCY,
  TRANSLATION_LANGUAGE,
  TRANSLATION_LANGUAGE_LABEL,
  TranslationLanguage,
} from "@/types/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
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
import { NumericFormat } from "react-number-format";
import { z } from "zod";

const PostTranslationFormSchema = z
  .object({
    title: z.string().min(1, "제목을 입력해 주세요."),
    source_language: z.nativeEnum(TRANSLATION_LANGUAGE),
    target_language: z.nativeEnum(TRANSLATION_LANGUAGE),
    categories: z
      .array(z.nativeEnum(TRANSLATION_CATEGORY))
      .refine((value) => value.length > 0, "분야를 1개 이상 선택해 주세요.")
      .refine(
        (value) => value.length <= 3,
        "분야는 최대 3개까지만 선택 할 수 있어요.",
      ),
    description: z.string(),
    source_files: z
      .array(
        z
          .instanceof(File, {
            message: "파일이 선택되지 않았어요.",
          })
          .refine(
            (file) => file.size <= 10 * 1024 * 1024,
            "원문 파일은 최대 10MB까지 업로드 할 수 있어요.",
          ),
      )
      .refine((files) => files.length > 0, "원문 파일을 선택해 주세요."),
    deadline: z
      .string()
      .refine(
        (value) => dayjs().isBefore(value),
        "현재보다 이후 시간을 지정해 주세요.",
      ),
    fee_unit: z
      .nativeEnum(TRANSLATION_CURRENCY)
      .describe("화폐 단위를 다시 확인해주세요."),
    fee_value: z
      .number()
      .min(0, "입력된 번역료를 다시 확인해주세요.")
      .max(1000000000, "입력된 번역료를 다시 확인해주세요."),
    sample: z.string(),
  })
  .refine(
    ({ source_language, target_language }) =>
      source_language !== target_language,
    {
      message: "원문과 번역문의 언어를 다르게 선택해 주세요.",
      path: ["target_language"],
    },
  );

export type PostTranslationFormType = z.infer<typeof PostTranslationFormSchema>;

const PostTranslationFormDefaultValue = {
  title: "",
  source_language: "ko-KR" as const,
  target_language: "en-US" as const,
  categories: [],
  description: "",
  source_files: [],
  deadline: dayjs().add(7, "day").toISOString(),
  fee_unit: "KRW" as const,
  fee_value: 0,
  sample: "",
};

export default function Index() {
  const router = useRouter();

  const languageOptions = useMemo<
    { label: string; value: TranslationLanguage }[]
  >(
    () => [
      {
        label: TRANSLATION_LANGUAGE_LABEL["ko-KR"],
        value: TRANSLATION_LANGUAGE["ko-KR"],
      },
      {
        label: TRANSLATION_LANGUAGE_LABEL["en-US"],
        value: TRANSLATION_LANGUAGE["en-US"],
      },
      {
        label: TRANSLATION_LANGUAGE_LABEL["ja-JP"],
        value: TRANSLATION_LANGUAGE["ja-JP"],
      },
    ],
    [],
  );

  const methods = useForm<PostTranslationFormType>({
    resolver: zodResolver(PostTranslationFormSchema),
    defaultValues: PostTranslationFormDefaultValue,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;

  const { mutate: mutatePostTranslation, isPending: isPostTranslationPending } =
    useMutation({
      mutationFn: postTranslation,
      onSuccess: (res) => {
        router.push(`/translation/${res.translation_id}`);
      },
    });

  const { mutateAsync: mutatePostFile, isPending: isPostFilePending } =
    useMutation({
      mutationFn: postFile,
    });

  const handlSubmitSuccess: SubmitHandler<PostTranslationFormType> = async (
    input,
  ) => {
    const filesInfo = await Promise.all(
      input.source_files.map((file) =>
        mutatePostFile({
          payload: {
            content: file,
          },
        }),
      ),
    );
    await mutatePostTranslation({
      payload: {
        ...input,
        source_files: filesInfo.map((file) => ({ file_id: file.file_id })),
        fee: {
          unit: input.fee_unit,
          value: input.fee_value,
        },
      },
    });
  };

  const handleSubmitError: SubmitErrorHandler<
    PostTranslationFormType
  > = async () => {};

  return (
    <form onSubmit={handleSubmit(handlSubmitSuccess, handleSubmitError)}>
      <FormProvider {...methods}>
        <Stack className="w-full h-full" gap="xl">
          <PageHeader>
            <Group>
              <ActionIcon variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeftIcon />
                </Link>
              </ActionIcon>
              <PageTitle>번역 요청</PageTitle>
            </Group>
          </PageHeader>

          <InputSection>
            <LabelSection>
              <Label>제목</Label>
            </LabelSection>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ControllerSection>
                  <Input
                    {...field}
                    maxLength={100}
                    placeholder="요청에 대해 알려주세요. (최대 30자)"
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>언어</Label>
            </LabelSection>
            <Group>
              <Controller
                name="source_language"
                control={control}
                render={({ field: { onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    className="w-[120px]"
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as TranslationLanguage);
                      trigger(`source_language`);
                    }}
                  />
                )}
              />
              <div className="flex justify-center items-center text-primary">
                <ArrowRightIcon />
              </div>
              <Controller
                name="target_language"
                control={control}
                render={({ field: { onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    className="w-[120px]"
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as TranslationLanguage);
                      trigger(`target_language`);
                    }}
                  />
                )}
              />
            </Group>
            <ErrorText>
              {errors.source_language?.message ??
                errors.target_language?.message}
            </ErrorText>
          </InputSection>

          <Speciality />

          <InputSection>
            <LabelSection>
              <Label>세부 요청사항</Label>
            </LabelSection>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ControllerSection>
                  <Textarea
                    {...field}
                    maxLength={100}
                    placeholder="번역사가 번역 시 고려하거나 주의했으면 하는 내용이 있다면 적어주세요."
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>원문</Label>
            </LabelSection>
            <Controller
              name="source_files"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <ControllerSection>
                  <FileInput
                    placeholder="원문 파일 (10MB, PDF)"
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

          <InputSection>
            <LabelSection>
              <Label>마감 기한</Label>
            </LabelSection>
            <Controller
              name="deadline"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <ControllerSection>
                  <DateTimePicker
                    date={value ? dayjs(value).toDate() : undefined}
                    onDateChange={(date) =>
                      onChange(date ? dayjs(date).toISOString() : "")
                    }
                    placeholder="마감 기한을 선택하세요"
                    minDate={new Date()}
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>희망 번역료</Label>
            </LabelSection>
            <Controller
              name="fee_value"
              control={control}
              render={({
                field: { onChange, ...field },
                fieldState: { error },
              }) => (
                <ControllerSection>
                  <div className="relative">
                    <NumericFormat
                      {...field}
                      customInput={Input}
                      thousandSeparator=","
                      allowNegative={false}
                      decimalScale={0}
                      min={0}
                      max={1000000000}
                      onValueChange={(values) =>
                        onChange(values.floatValue || 0)
                      }
                      className="focus:border-primary pl-6"
                      placeholder="0"
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                      ₩
                    </span>
                  </div>
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>원문 샘플(선택)</Label>
            </LabelSection>
            <Controller
              name="sample"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ControllerSection>
                  <Textarea
                    {...field}
                    maxLength={100}
                    placeholder="원문의 스타일, 난이도를 확인할 수 있는 한 문단을 알려주세요. 샘플을 추가하면 더 많은 번역사와 매칭될 수 있어요."
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                isSubmitting || isPostTranslationPending || isPostFilePending
              }
            >
              등록
            </Button>
          </div>
        </Stack>
      </FormProvider>
    </form>
  );
}
