import { Language } from "@/apis/translations";
import ErrorText from "@/components/ErrorText";
import Label from "@/components/Label";
import SelectBox from "@/components/SelectBox";
import TextArea from "@/components/TextArea";
import { TranslationSampleDefaultValue } from "@/model/translationSample";
import { PostTranslatorFormSchema } from "@/model/translator";
import { ActionIcon, Alert, Card, CloseIcon, Stack } from "@mantine/core";
import { useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaArrowDown, FaCircleInfo } from "react-icons/fa6";
import { z } from "zod";

export default function Samples() {
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

  const {
    control,
    trigger,
    formState: { errors },
  } = useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "translation_samples",
  });

  const handleClickAppend = () => {
    append(TranslationSampleDefaultValue);
  };

  const handleClickDelete = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <Label>번역 샘플 (선택)</Label>
        <div>
          <button
            type="button"
            className="text-blue-500 text-sm font-bold"
            onClick={handleClickAppend}
          >
            추가
          </button>
        </div>
      </div>
      {fields.length === 0 && (
        <Alert
          color="gray"
          bg="#F9FAFB"
          title="공개할 번역 샘플이 있다면 추가 버튼을 눌러 입력해주세요."
          icon={<FaCircleInfo />}
        />
      )}
      {fields.map((field, index) => (
        <Card
          key={field.id}
          bg="#F9FAFB"
          radius="16px"
          component={Stack}
          gap="xs"
          pos="relative"
        >
          <ActionIcon
            color="dark"
            variant="transparent"
            onClick={() => handleClickDelete(index)}
            // disabled={fields.length === 1}
            pos="absolute"
            top={16}
            right={16}
          >
            <CloseIcon />
          </ActionIcon>
          <div className="flex flex-col gap-1">
            <Controller
              name={`translation_samples.${index}.source_language`}
              control={control}
              render={({ field: { onChange, ...f } }) => (
                <SelectBox
                  {...f}
                  w={120}
                  data={languageOptions}
                  onChange={(v) => {
                    onChange(v as (typeof Language)[0]);
                    trigger(`translation_samples.${index}.source_language`);
                  }}
                  allowDeselect={false}
                  checkIconPosition="right"
                />
              )}
            />
            <ErrorText>
              {errors?.translation_samples?.[index]?.source_language?.message}
            </ErrorText>
          </div>
          <div className="flex flex-1 gap-1">
            <Controller
              name={`translation_samples.${index}.source_text`}
              control={control}
              render={({ field: f, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <TextArea
                    {...f}
                    placeholder="요청자가 나의 번역 실력을 확인할 수 있도록 샘플을 입력해주세요."
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </div>
              )}
            />
            <ErrorText>
              {errors?.translation_samples?.[index]?.source_text?.message}
            </ErrorText>
          </div>
          <div className="flex justify-center items-center text-primary">
            <FaArrowDown />
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              name={`translation_samples.${index}.target_language`}
              control={control}
              render={({ field: { onChange, ...f } }) => (
                <SelectBox
                  {...f}
                  w={120}
                  data={languageOptions}
                  onChange={(v) => {
                    onChange(v as (typeof Language)[0]);
                    trigger(`translation_samples.${index}.target_language`);
                  }}
                  allowDeselect={false}
                  checkIconPosition="right"
                />
              )}
            />
            <ErrorText>
              {errors?.translation_samples?.[index]?.target_language?.message}
            </ErrorText>
          </div>
          <div className="flex flex-1 gap-1">
            <Controller
              name={`translation_samples.${index}.target_text`}
              control={control}
              render={({ field: f, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <TextArea
                    {...f}
                    placeholder="요청자가 나의 번역 실력을 확인할 수 있도록 샘플을 입력해주세요."
                  />
                  <ErrorText>{error?.message}</ErrorText>
                </div>
              )}
            />
            <ErrorText>
              {errors?.translation_samples?.[index]?.target_text?.message}
            </ErrorText>
          </div>
        </Card>
      ))}
    </div>
  );
}
