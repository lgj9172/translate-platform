import ErrorText from "@/components/ErrorText";
import Label from "@/components/Label";
import TextArea from "@/components/TextArea";
import { PostTranslatorFormSchema } from "@/model/translator";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

export default function SelfIntroduction() {
  const { control } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <Label>자기소개</Label>
      </div>
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col gap-1">
            <TextArea
              {...field}
              maxLength={100}
              placeholder="간단한 소개를 전해보세요. (최대 100자)"
            />
            <ErrorText>{error?.message}</ErrorText>
          </div>
        )}
      />
    </div>
  );
}
