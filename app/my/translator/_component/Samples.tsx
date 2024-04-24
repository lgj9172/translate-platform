import { Language } from "@/apis/translations";
import ErrorText from "@/components/ErrorText";
import Label from "@/components/Label";
import TextArea from "@/components/TextArea";
import { TranslationSampleDefaultValue } from "@/model/translationSample";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  ActionIcon,
  Card,
  CloseIcon,
  Group,
  Select,
  Stack,
} from "@mantine/core";
import { useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaArrowDown } from "react-icons/fa6";
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

  const { control, trigger } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

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
      {fields.map((field, index) => (
        <Card
          key={field.id}
          bg="#F9FAFB"
          radius="16px"
          component={Stack}
          gap="xs"
        >
          <Group justify="end">
            <ActionIcon
              color="dark"
              variant="transparent"
              onClick={() => handleClickDelete(index)}
              disabled={fields.length === 1}
            >
              <CloseIcon />
            </ActionIcon>
          </Group>
          <Controller
            name={`translation_samples.${index}.source_language`}
            control={control}
            render={({ field: { onChange, ...f } }) => (
              <Select
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
          <Controller
            name={`translation_samples.${index}.source_text`}
            control={control}
            render={({ field: f, fieldState: { error } }) => (
              <div className="flex flex-col gap-1">
                <TextArea {...f} placeholder="번역 샘플 원문" />
                <ErrorText>{error?.message}</ErrorText>
              </div>
            )}
          />
          <div className="flex justify-center items-center text-primary">
            <FaArrowDown />
          </div>
          <Controller
            name={`translation_samples.${index}.target_language`}
            control={control}
            render={({ field: { onChange, ...f } }) => (
              <Select
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
          <Controller
            name={`translation_samples.${index}.target_text`}
            control={control}
            render={({ field: f, fieldState: { error } }) => (
              <div className="flex flex-col gap-1">
                <TextArea {...f} placeholder="번역 샘플 원문" />
                <ErrorText>{error?.message}</ErrorText>
              </div>
            )}
          />
        </Card>
      ))}
    </div>
  );
}