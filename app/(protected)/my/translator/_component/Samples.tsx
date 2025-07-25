import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import SelectBox from "@/components/SelectBox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TranslationSampleDefaultValue } from "@/model/translationSample";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  TRANSLATION_LANGUAGE,
  TRANSLATION_LANGUAGE_LABEL,
  TranslationLanguage,
} from "@/types/entities";
import { ActionIcon } from "@/components/ui/action-icon";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";
import { useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaArrowDown } from "react-icons/fa6";
import { X } from "lucide-react";
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClickAppend}
          >
            추가
          </Button>
        </div>
      </LabelSection>
      {fields.length === 0 && (
        <Alert>
          <AlertTitle>
            공개할 번역 샘플이 있다면 추가 버튼을 눌러 입력해주세요.
          </AlertTitle>
        </Alert>
      )}
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <Stack gap="xs">
            <div className="flex justify-end">
              <ActionIcon
                variant="ghost"
                onClick={() => handleClickDelete(index)}
              >
                <X />
              </ActionIcon>
            </div>
            <ControllerSection>
              <Controller
                name={`translation_samples.${index}.source_language`}
                control={control}
                render={({ field: { onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    className="w-[120px]"
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as TranslationLanguage);
                      trigger(`translation_samples.${index}.source_language`);
                    }}
                  />
                )}
              />
              <ErrorText>
                {errors?.translation_samples?.[index]?.source_language?.message}
              </ErrorText>
            </ControllerSection>
            <ControllerSection>
              <Controller
                name={`translation_samples.${index}.source_text`}
                control={control}
                render={({ field: f }) => (
                  <Textarea
                    {...f}
                    placeholder="요청자가 나의 번역 실력을 확인할 수 있도록 샘플을 입력해주세요."
                  />
                )}
              />
              <ErrorText>
                {errors?.translation_samples?.[index]?.source_text?.message}
              </ErrorText>
            </ControllerSection>
            <div className="flex justify-center items-center text-primary">
              <FaArrowDown />
            </div>
            <ControllerSection>
              <Controller
                name={`translation_samples.${index}.target_language`}
                control={control}
                render={({ field: { onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    className="w-[120px]"
                    data={languageOptions}
                    onChange={(v) => {
                      onChange(v as TranslationLanguage);
                      trigger(`translation_samples.${index}.target_language`);
                    }}
                  />
                )}
              />
              <ErrorText>
                {errors?.translation_samples?.[index]?.target_language?.message}
              </ErrorText>
            </ControllerSection>
            <ControllerSection>
              <Controller
                name={`translation_samples.${index}.target_text`}
                control={control}
                render={({ field: f }) => (
                  <Textarea
                    {...f}
                    placeholder="요청자가 나의 번역 실력을 확인할 수 있도록 샘플을 입력해주세요."
                  />
                )}
              />
              <ErrorText>
                {errors?.translation_samples?.[index]?.target_text?.message}
              </ErrorText>
            </ControllerSection>
          </Stack>
        </Card>
      ))}
    </InputSection>
  );
}
