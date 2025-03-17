import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import TextArea from "@/components/TextArea";
import { PostTranslatorFormSchema } from "@/model/translator";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

export default function SelfIntroduction() {
  const { control } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  return (
    <InputSection>
      <LabelSection>
        <Label>자기소개</Label>
      </LabelSection>
      <Controller
        name="introduction"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <ControllerSection>
            <TextArea
              {...field}
              maxLength={100}
              placeholder="간단한 소개를 전해보세요. (최대 100자)"
            />
            <ErrorText>{error?.message}</ErrorText>
          </ControllerSection>
        )}
      />
    </InputSection>
  );
}
