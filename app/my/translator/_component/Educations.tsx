import { postFile } from "@/apis/files";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import RadioButton from "@/components/RadioButton";
import SelectBox from "@/components/SelectBox";
import TextInput from "@/components/TextInput";
import { DegreeSchema } from "@/model/degree";
import { EducationDefaultValue } from "@/model/education";
import { EducationStatusSchema } from "@/model/educationStatus";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  ActionIcon,
  Card,
  CloseIcon,
  Group,
  Radio,
  Stack,
} from "@mantine/core";
import { DatesRangeValue, MonthPickerInput } from "@mantine/dates";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChangeEvent, useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaRegCalendar } from "react-icons/fa6";
import { z } from "zod";

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

  const handleChangeMonthRange = (index: number, dates: DatesRangeValue) => {
    const startedAt = dates[0] ? dayjs(dates[0]).toISOString() : "";
    const endedAt = dates[1] ? dayjs(dates[1]).toISOString() : "";
    setValue(`educations.${index}.started_at`, startedAt, {
      shouldValidate: true,
    });
    setValue(`educations.${index}.ended_at`, endedAt, { shouldValidate: true });
  };

  const handleChangeFile = async (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await mutateAsync({ content: file });
      setValue(`educations.${index}.file`, res, { shouldValidate: true });
    }
  };

  return (
    <InputSection>
      <LabelSection>
        <Label>학력</Label>
        <div>
          <button
            type="button"
            className="text-blue-500 text-sm font-bold"
            onClick={handleClickAppend}
          >
            추가
          </button>
        </div>
      </LabelSection>
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
              disabled={fields.length === 1}
            >
              <CloseIcon />
            </ActionIcon>
          </div>
          <ControllerSection>
            <MonthPickerInput
              type="range"
              valueFormat="YYYY년 MM월"
              placeholder="시작월 - 종료월"
              leftSection={<FaRegCalendar />}
              value={[
                watch(`educations.${index}.started_at`).length > 0
                  ? dayjs(watch(`educations.${index}.started_at`)).toDate()
                  : null,
                watch(`educations.${index}.ended_at`).length > 0
                  ? dayjs(watch(`educations.${index}.ended_at`)).toDate()
                  : null,
              ]}
              onChange={(datesRangeValue) => {
                handleChangeMonthRange(index, datesRangeValue);
              }}
              classNames={{
                input: "focus:border-primary",
                placeholder: "text-neutral-400",
                monthsListControl:
                  "data-[in-range=true]:bg-primary/20 data-[selected=true]:bg-primary",
              }}
            />
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
              name={`educations.${index}.status`}
              render={({ field: { value, onChange, ...f } }) => (
                <Radio.Group {...f} value={value} onChange={onChange}>
                  <Group>
                    {educationStatusOptions.map((o) => (
                      <RadioButton
                        key={o.value}
                        value={o.value}
                        label={o.label}
                      />
                    ))}
                  </Group>
                </Radio.Group>
              )}
            />
            <ErrorText>
              {errors?.educations?.[index]?.status?.message}
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
                  allowDeselect={false}
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
                <TextInput {...f} placeholder="학교 이름" />
              )}
            />
            <ErrorText>{errors?.educations?.[index]?.name?.message}</ErrorText>
          </ControllerSection>
          <ControllerSection>
            <Controller
              control={control}
              name={`educations.${index}.major`}
              render={({ field: { ...f } }) => (
                <TextInput {...f} placeholder="전공" />
              )}
            />
            <ErrorText>{errors?.educations?.[index]?.major?.message}</ErrorText>
          </ControllerSection>
          <ControllerSection>
            <FileInput
              placeholder="졸업/수료 증명서 (10MB, PDF)"
              onChange={(e) => handleChangeFile(index, e)}
              text={`${watch(`educations.${index}.file.name`)}`}
            />
            <ErrorText>
              {errors?.educations?.[index]?.file?.name?.message}
            </ErrorText>
          </ControllerSection>
        </Card>
      ))}
    </InputSection>
  );
}
