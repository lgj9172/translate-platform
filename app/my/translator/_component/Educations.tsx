import { postFile } from "@/apis/files";
import FileInput from "@/components/FileInput";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import { EducationDefaultValue } from "@/model/education";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  ActionIcon,
  Box,
  Card,
  CloseIcon,
  Group,
  Radio,
  Select,
  Stack,
} from "@mantine/core";
import { DatesRangeValue, MonthPickerInput } from "@mantine/dates";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChangeEvent } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaRegCalendar } from "react-icons/fa6";
import { z } from "zod";

export default function Educations() {
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
    const startMonth = dates[0] ? dayjs(dates[0]).toISOString() : "";
    const endMonth = dates[1] ? dayjs(dates[1]).toISOString() : "";
    setValue(`educations.${index}.startMonth`, startMonth);
    setValue(`educations.${index}.endMonth`, endMonth);
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
          <Group>
            <MonthPickerInput
              type="range"
              valueFormat="YYYY년 MM월"
              placeholder="시작월 - 종료월"
              leftSection={<FaRegCalendar />}
              value={[
                watch(`educations.${index}.startMonth`).length > 0
                  ? dayjs(watch(`educations.${index}.startMonth`)).toDate()
                  : null,
                watch(`educations.${index}.endMonth`).length > 0
                  ? dayjs(watch(`educations.${index}.endMonth`)).toDate()
                  : null,
              ]}
              onChange={(datesRangeValue) => {
                handleChangeMonthRange(index, datesRangeValue);
              }}
            />
          </Group>
          <Controller
            control={control}
            name={`educations.${index}.graduation_status`}
            render={({ field: { value, onChange, ...f } }) => (
              <Radio.Group {...f} value={value} onChange={onChange}>
                <Group>
                  <Radio value="졸업" label="졸업" />
                  <Radio value="수료" label="수료" />
                </Group>
              </Radio.Group>
            )}
          />
          <Box>
            <Controller
              control={control}
              name={`educations.${index}.degree`}
              render={({ field: { value, onChange, ...f } }) => (
                <Select
                  {...f}
                  value={value}
                  onChange={(v) => onChange(v as string)}
                  data={[
                    { value: "학사", label: "학사" },
                    { value: "석사", label: "석사" },
                    { value: "박사", label: "박사" },
                  ]}
                  allowDeselect={false}
                />
              )}
            />
          </Box>
          <Controller
            control={control}
            name={`educations.${index}.schoolName`}
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