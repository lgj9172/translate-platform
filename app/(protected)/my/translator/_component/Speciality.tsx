import Chip from "@/components/Chip";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  TRANSLATION_CATEGORY,
  TRANSLATION_CATEGORY_LABEL,
  TranslationCategory,
} from "@/types/entities";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

export default function Speciality() {
  const categoryOptions: { label: string; value: TranslationCategory }[] =
    useMemo(
      () => [
        {
          label: TRANSLATION_CATEGORY_LABEL.IT,
          value: TRANSLATION_CATEGORY.IT,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.FINANCE,
          value: TRANSLATION_CATEGORY.FINANCE,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.CONTENTS,
          value: TRANSLATION_CATEGORY.CONTENTS,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.GAME,
          value: TRANSLATION_CATEGORY.GAME,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.LAW,
          value: TRANSLATION_CATEGORY.LAW,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.MEDICAL,
          value: TRANSLATION_CATEGORY.MEDICAL,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.CONSTRUCTION,
          value: TRANSLATION_CATEGORY.CONSTRUCTION,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.MARKETING,
          value: TRANSLATION_CATEGORY.MARKETING,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.LITERATURE,
          value: TRANSLATION_CATEGORY.LITERATURE,
        },
        {
          label: TRANSLATION_CATEGORY_LABEL.ETC,
          value: TRANSLATION_CATEGORY.ETC,
        },
      ],
      [],
    );

  const { control } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  return (
    <InputSection>
      <LabelSection>
        <Label>전문 분야 (최대 3개)</Label>
      </LabelSection>
      <Controller
        name="categories"
        control={control}
        render={({ field: { onChange, ...field }, fieldState: { error } }) => (
          <ControllerSection>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {categoryOptions.map((c) => (
                <Chip
                  key={c.value}
                  value={c.value}
                  checked={field.value.includes(c.value)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const updatedValue = isChecked
                      ? [...field.value, c.value]
                      : field.value.filter((v) => v !== c.value);
                    onChange(updatedValue);
                  }}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
            <ErrorText>{error?.message}</ErrorText>
          </ControllerSection>
        )}
      />
    </InputSection>
  );
}
