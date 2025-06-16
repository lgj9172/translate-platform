import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import SelectBox from "@/components/SelectBox";
import TextArea from "@/components/TextArea";
import { Button } from "@/components/ui/button";
import { TranslationSampleDefaultValue } from "@/model/translationSample";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  TRANSLATION_LANGUAGE,
  TRANSLATION_LANGUAGE_LABEL,
  TranslationLanguage,
} from "@/types/entities";
import { ActionIcon, Alert, Card, CloseIcon, Stack } from "@mantine/core";
import { useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaArrowDown, FaCircleInfo } from "react-icons/fa6";
import { z } from "zod";

export default function Samples() {
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
    <InputSection>
      <LabelSection>
        <Label>번역 샘플 (선택)</Label>
        <div>
          <Button variant="ghost" size="sm" onClick={handleClickAppend}>
            추가
          </Button>
        </div>
      </LabelSection>
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
          <div className="flex justify-end">
            <ActionIcon
              color="dark"
              variant="transparent"
              onClick={() => handleClickDelete(index)}
              // disabled={fields.length === 1}
            >
              <CloseIcon />
            </ActionIcon>
          </div>
          <InputSection>
            <Controller
              name={`translation_samples.${index}.source_language`}
              control={control}
              render={({ field: { onChange, ...f } }) => (
                <ControllerSection>
                  <SelectBox
                    {...f}
                    w={120}
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as TranslationLanguage);
                      trigger(`translation_samples.${index}.source_language`);
                    }}
                    allowDeselect={false}
                    checkIconPosition="right"
                  />
                  <ErrorText>
                    {
                      errors?.translation_samples?.[index]?.source_language
                        ?.message
                    }
                  </ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>
          <InputSection>
            <Controller
              name={`translation_samples.${index}.source_text`}
              control={control}
              render={({ field: f }) => (
                <ControllerSection>
                  <TextArea
                    {...f}
                    placeholder="요청자가 나의 번역 실력을 확인할 수 있도록 샘플을 입력해주세요."
                  />
                  <ErrorText>
                    {errors?.translation_samples?.[index]?.source_text?.message}
                  </ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>
          <div className="flex justify-center items-center text-primary">
            <FaArrowDown />
          </div>
          <InputSection>
            <Controller
              name={`translation_samples.${index}.target_language`}
              control={control}
              render={({ field: { onChange, ...f } }) => (
                <ControllerSection>
                  <SelectBox
                    {...f}
                    w={120}
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as TranslationLanguage);
                      trigger(`translation_samples.${index}.target_language`);
                    }}
                    allowDeselect={false}
                    checkIconPosition="right"
                  />
                  <ErrorText>
                    {
                      errors?.translation_samples?.[index]?.target_language
                        ?.message
                    }
                  </ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>
          <InputSection>
            <Controller
              name={`translation_samples.${index}.target_text`}
              control={control}
              render={({ field: f }) => (
                <ControllerSection>
                  <TextArea
                    {...f}
                    placeholder="요청자가 나의 번역 실력을 확인할 수 있도록 샘플을 입력해주세요."
                  />
                  <ErrorText>
                    {errors?.translation_samples?.[index]?.target_text?.message}
                  </ErrorText>
                </ControllerSection>
              )}
            />
          </InputSection>

          <ErrorText>
            {errors?.translation_samples?.[index]?.root?.message}
          </ErrorText>
        </Card>
      ))}
    </InputSection>
  );
}
