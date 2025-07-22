import { postFile } from "@/apis/files";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import RadioButton from "@/components/RadioButton";
import SelectBox from "@/components/SelectBox";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { DegreeSchema } from "@/model/degree";
import { EducationDefaultValue } from "@/model/education";
import { EducationStatusSchema } from "@/model/educationStatus";
import { PostTranslatorFormSchema } from "@/model/translator";
import { ActionIcon } from "@/components/ui/action-icon";
import { Card } from "@/components/ui/card";
import { Group } from "@/components/ui/group";
import { Stack } from "@/components/ui/stack";
import { RadioGroup } from "@/components/ui/radio-group";
import { X } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChangeEvent, useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { z } from "zod";
import { Input } from "@/components/ui/input";

export default function Educations() {
  const educationStatusOptions = useMemo<
    { label: string; value: z.infer<typeof EducationStatusSchema> }[]
  >(
    () => [
      { label: "졸업", value: "GRADUATED" },
      { label: "수료", value: "COMPLETED" },
    ],
    [],
  );

  const degreeOptions = useMemo<
    { label: string; value: z.infer<typeof DegreeSchema> }[]
  >(
    () => [
      { label: "학사", value: "BACHELOR" },
      { label: "석사", value: "MASTER" },
      { label: "박사", value: "DOCTOR" },
    ],
    [],
  );

  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  const { mutateAsync } = useMutation({ mutationFn: postFile });

  const handleClickAppend = () => {
    append(EducationDefaultValue);
  };

  const handleClickDelete = (index: number) => {
    remove(index);
  };

  const handleChangeFile = async (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await mutateAsync({
        payload: { content: file },
      });
      setValue(`educations.${index}.file_id`, res.file_id, {
        shouldValidate: true,
      });
    }
  };

  return (
    <InputSection>
      <LabelSection>
        <Label>학력</Label>
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
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <Stack gap="xs">
            <div className="flex justify-end">
              <ActionIcon
                variant="ghost"
                onClick={() => handleClickDelete(index)}
                disabled={fields.length === 1}
              >
                <X />
              </ActionIcon>
            </div>
            <ControllerSection>
              <div className="flex gap-2">
                <Controller
                  control={control}
                  name={`educations.${index}.started_at`}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      date={value ? dayjs(value).toDate() : undefined}
                      onDateChange={(date) =>
                        onChange(date ? dayjs(date).toISOString() : "")
                      }
                      placeholder="시작월"
                      className="flex-1"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`educations.${index}.ended_at`}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      date={value ? dayjs(value).toDate() : undefined}
                      onDateChange={(date) =>
                        onChange(date ? dayjs(date).toISOString() : "")
                      }
                      placeholder="종료월"
                      className="flex-1"
                    />
                  )}
                />
              </div>
              <ErrorText>
                {errors?.educations?.[index]?.started_at?.message}
              </ErrorText>
              <ErrorText>
                {errors?.educations?.[index]?.ended_at?.message}
              </ErrorText>
            </ControllerSection>
            <ControllerSection>
              <Controller
                control={control}
                name={`educations.${index}.graduation_status`}
                render={({ field: { value, onChange, ...f } }) => (
                  <RadioGroup {...f} value={value} onValueChange={onChange}>
                    <Group>
                      {educationStatusOptions.map((o) => (
                        <RadioButton
                          key={o.value}
                          value={o.value}
                          label={o.label}
                        />
                      ))}
                    </Group>
                  </RadioGroup>
                )}
              />
              <ErrorText>
                {errors?.educations?.[index]?.graduation_status?.message}
              </ErrorText>
            </ControllerSection>
            <ControllerSection>
              <Controller
                control={control}
                name={`educations.${index}.degree`}
                render={({ field: { value, onChange, ...f } }) => (
                  <SelectBox
                    {...f}
                    value={value}
                    onChange={(v) => onChange(v as string)}
                    data={degreeOptions}
                  />
                )}
              />
              <ErrorText>
                {errors?.educations?.[index]?.degree?.message}
              </ErrorText>
            </ControllerSection>
            <ControllerSection>
              <Controller
                control={control}
                name={`educations.${index}.name`}
                render={({ field: { ...f } }) => (
                  <Input {...f} placeholder="학교 이름" />
                )}
              />
              <ErrorText>
                {errors?.educations?.[index]?.name?.message}
              </ErrorText>
            </ControllerSection>
            <ControllerSection>
              <Controller
                control={control}
                name={`educations.${index}.major`}
                render={({ field: { ...f } }) => (
                  <Input {...f} placeholder="전공" />
                )}
              />
              <ErrorText>
                {errors?.educations?.[index]?.major?.message}
              </ErrorText>
            </ControllerSection>
            <ControllerSection>
              <FileInput
                placeholder="졸업/수료 증명서 (10MB, PDF)"
                onChange={(e) => handleChangeFile(index, e)}
                text={`${watch(`educations.${index}.file_id`)}`}
              />
              <ErrorText>
                {errors?.educations?.[index]?.file_id?.message}
              </ErrorText>
            </ControllerSection>
          </Stack>
        </Card>
      ))}
    </InputSection>
  );
}
