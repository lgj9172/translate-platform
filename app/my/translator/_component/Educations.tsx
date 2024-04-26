import { postFile } from "@/apis/files";
import FileInput from "@/components/FileInput";
import Label from "@/components/Label";
import RadioButton from "@/components/RadioButton";
import SelectBox from "@/components/SelectBox";
import TextInput from "@/components/TextInput";
import { DegreeSchema } from "@/model/degree";
import { EducationDefaultValue } from "@/model/education";
import { EducationStatusSchema } from "@/model/educationStatus";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  ActionIcon,
  Box,
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

  const { control, setValue, watch } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

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
    setValue(`educations.${index}.started_at`, startedAt);
    setValue(`educations.${index}.ended_at`, endedAt);
  };

  const handleChangeFile = async (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await mutateAsync({ content: file });
      setValue(`educations.${index}.file`, res);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
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
      </div>
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
            disabled={fields.length === 1}
            pos="absolute"
            top={16}
            right={16}
          >
            <CloseIcon />
          </ActionIcon>
          <div>
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
            {/* <ErrorText>{errors.educations[index].ended_at.message}</ErrorText> */}
          </div>
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
          <Box>
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
          </Box>
          <Controller
            control={control}
            name={`educations.${index}.name`}
            render={({ field: { ...f } }) => (
              <TextInput {...f} placeholder="학교 이름" />
            )}
          />
          <Controller
            control={control}
            name={`educations.${index}.major`}
            render={({ field: { ...f } }) => (
              <TextInput {...f} placeholder="전공" />
            )}
          />
          <FileInput
            placeholder="졸업/수료 증명서 (10MB, PDF)"
            onChange={(e) => handleChangeFile(index, e)}
            text={`${watch(`educations.${index}.file.name`)}`}
          />
        </Card>
      ))}
    </div>
  );
}
