import { EducationDefaultValue } from "@/model/education";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  CloseIcon,
  FileInput,
  Group,
  Radio,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DatesRangeValue, MonthPickerInput } from "@mantine/dates";
import dayjs from "dayjs";
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

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Title order={4}>학력</Title>
        <Group>
          <Button onClick={handleClickAppend} size="xs" variant="subtle">
            추가
          </Button>
        </Group>
      </Group>
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
          <FileInput placeholder="졸업/수료 증명서" />
        </Card>
      ))}
    </Stack>
  );
}
