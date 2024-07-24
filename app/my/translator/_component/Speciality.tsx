import { Category } from "@/apis/translations";
import Chip from "@/components/Chip";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { PostTranslatorFormSchema } from "@/model/translator";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

export default function Speciality() {
  const categoryOptions: { label: string; value: (typeof Category)[number] }[] =
    useMemo(
      () => [
        { label: "IT/기술", value: "IT" },
        { label: "경제/금융", value: "FINANCE" },
        { label: "콘텐츠 자막", value: "CONTENTS" },
        { label: "게임", value: "GAME" },
        { label: "법률/특허", value: "LAW" },
        { label: "의료", value: "MEDICAL" },
        { label: "건설", value: "CONSTRUCTION" },
        { label: "마케팅", value: "MARKETING" },
        { label: "문학", value: "LITERATURE" },
        { label: "기타", value: "ETC" },
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
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((c) => (
                <Chip
                  key={c.value}
                  value={c.value}
                  checked={field.value.includes(c.value)}
                  onChange={(e) => {
                    const isChecked = e.currentTarget.checked;
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
