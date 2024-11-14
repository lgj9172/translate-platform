"use client";

import { postFile } from "@/apis/files";
import {
  Category,
  Language,
  postTranslation,
  postTranslationFile,
} from "@/apis/translations";
import Speciality from "@/app/my/translator/_component/Speciality";
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
import TextInput from "@/components/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Group, NumberInput, Stack } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FaArrowRight, FaChevronLeft, FaRegCalendar } from "react-icons/fa6";
import { z } from "zod";

const PostTranslationFormSchema = z
  .object({
    title: z.string().min(1, "제목을 입력해 주세요."),
    sourceLanguage: z
      .enum([...Language, ""])
      .refine((value) => value !== "", "번역 할 문서의 언어를 선택해 주세요."),
    targetLanguage: z
      .enum([...Language, ""])
      .refine(
        (value) => value !== "",
        "어떤 언어로 번역되어야 하는지 선택해 주세요.",
      ),
    categories: z
      .array(z.enum(Category))
      .refine((value) => value.length > 0, "분야를 1개 이상 선택해 주세요.")
      .refine(
        (value) => value.length <= 2,
        "분야는 최대 2개까지만 선택 할 수 있어요.",
      ),
    description: z.string(),
    translationFileFormat: z.string(),
    translationFile: z.any().transform((files) => files[0]),
    translationText: z.string(),
    sample: z.string(),
    endDateTime: z
      .date()
      .refine(
        (value) => dayjs().isBefore(value),
        "현재보다 이후 시간을 지정해 주세요.",
      ),
    desiredFeeValue: z
      .number()
      .min(0, "입력된 번역료를 다시 확인해주세요.")
      .max(1000000000, "입력된 번역료를 다시 확인해주세요."),
  })
  .refine(
    ({ sourceLanguage, targetLanguage }) => sourceLanguage !== targetLanguage,
    {
      message: "원문과 번역문의 언어를 다르게 선택해 주세요.",
      path: ["targetLanguage"],
    },
  )
  .refine(
    ({ translationFileFormat, translationFile }) => {
      if (translationFileFormat === "file") return !!translationFile;
      return true;
    },
    {
      message: "원문 파일을 선택해 주세요.",
      path: ["translationFile"],
    },
  )
  .refine(
    ({ translationFileFormat, translationText }) => {
      if (translationFileFormat === "text") return !!translationText;
      return true;
    },
    {
      message: "원문을 입력해 주세요.",
      path: ["translationText"],
    },
  );

type PostTranslationFormType = z.infer<typeof PostTranslationFormSchema>;

const PostTranslationFormDefaultValue = {
  title: "",
  sourceLanguage: "ko-KR" as const,
  targetLanguage: "en-US" as const,
  categories: [],
  description: "",
  translationFileFormat: "file",
  translationFile: "",
  translationText: "",
  sample: "",
  endDateTime: dayjs().toDate(),
  desiredFeeValue: 0,
};

export default function Index() {
  const languageOptions = useMemo<
    { label: string; value: (typeof Language)[number] }[]
  >(
    () => [
      { label: "한국어", value: "ko-KR" },
      { label: "영어", value: "en-US" },
      { label: "일본어", value: "ja-JP" },
    ],
    [],
  );

  const router = useRouter();

  const methods = useForm<PostTranslationFormType>({
    resolver: zodResolver(PostTranslationFormSchema),
    defaultValues: PostTranslationFormDefaultValue,
    mode: "onChange",
  });

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;

  const translationFileFormat = watch("translationFileFormat");

  const { mutateAsync: mutatePostTranslationFile } = useMutation({
    mutationFn: postTranslationFile,
    onSuccess: () => {
      router.push("/translation/create/done");
    },
  });

  const { mutateAsync: mutatePostTranslation } = useMutation({
    mutationFn: postTranslation,
  });

  const { mutateAsync } = useMutation({ mutationFn: postFile });

  const handleClickCreate: SubmitHandler<PostTranslationFormType> = async ({
    title,
    sourceLanguage,
    targetLanguage,
    categories,
    description,
    translationFile,
    translationText,
    endDateTime,
    desiredFeeValue,
    sample,
  }) => {
    const translationData =
      translationFileFormat === "file" ? translationFile : translationText;
    const fileUploadResponse = await mutatePostTranslationFile({
      content: translationData,
    });
    const fileId = fileUploadResponse.file_id;
    if (sourceLanguage && targetLanguage) {
      await mutatePostTranslation({
        title,
        sourceLanguage,
        targetLanguage,
        categories,
        description,
        fileId,
        endDateTime: endDateTime.toUTCString(),
        desiredFeeValue,
        desiredFeeUnit: "KRW",
        sample,
      });
    }
  };

  const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await mutateAsync({ content: file });
      // const res = await mutateAsync({ content: file });
      // setValue(`educations.${index}.file`, res, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleClickCreate)}>
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
              <Label>제목</Label>
            </LabelSection>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ControllerSection>
                  <TextInput
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
                name="sourceLanguage"
                control={control}
                render={({ field: { onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    w={120}
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as (typeof Language)[0]);
                      trigger(`sourceLanguage`);
                    }}
                    allowDeselect={false}
                    checkIconPosition="right"
                  />
                )}
              />
              <div className="flex justify-center items-center text-primary">
                <FaArrowRight />
              </div>
              <Controller
                name="targetLanguage"
                control={control}
                render={({ field: { onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    w={120}
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as (typeof Language)[0]);
                      trigger(`sourceLanguage`);
                    }}
                    allowDeselect={false}
                    checkIconPosition="right"
                  />
                )}
              />
            </Group>
            <ErrorText>
              {errors.sourceLanguage?.message ?? errors.targetLanguage?.message}
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
                  <TextArea
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
            <ControllerSection>
              <FileInput
                placeholder="원문 파일 (10MB, PDF)"
                onChange={(e) => handleChangeFile(e)}
                // text={`${watch(`educations.${index}.file.name`)}`}
              />
              {/* <ErrorText>
                {errors?.educations?.[index]?.file?.name?.message}
              </ErrorText> */}
            </ControllerSection>
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>마감 기한</Label>
            </LabelSection>
            <Controller
              name="endDateTime"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DateTimePicker
                  valueFormat="YYYY년 MM월 DD일 HH시 mm분"
                  leftSection={<FaRegCalendar />}
                  value={dayjs(value).toDate()}
                  onChange={(dateValue) =>
                    dateValue
                      ? onChange(dayjs(dateValue).toISOString())
                      : onChange(null)
                  }
                  classNames={{
                    input: "focus:border-primary",
                    // placeholder: "text-neutral-400",
                    day: "data-[selected=true]:bg-primary",
                    timeInput: "focus:border-primary",
                  }}
                />
              )}
            />
          </InputSection>

          <InputSection>
            <LabelSection>
              <Label>희망 번역료</Label>
            </LabelSection>
            <Controller
              name="desiredFeeValue"
              control={control}
              render={({
                field: { onChange, ...field },
                fieldState: { error },
              }) => (
                <ControllerSection>
                  <NumberInput
                    {...field}
                    onChange={(v) => onChange(Number(v))}
                    step={1000}
                    clampBehavior="strict"
                    min={0}
                    max={1000000000}
                    allowNegative={false}
                    allowDecimal={false}
                    thousandSeparator=","
                    leftSection="₩"
                    withAsterisk
                    classNames={{
                      input: "focus:border-primary",
                    }}
                  />
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
                  <TextArea
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
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              등록
            </Button>
          </div>
        </Stack>
      </FormProvider>
    </form>
  );
}
