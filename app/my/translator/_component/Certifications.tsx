import Label from "@/components/Label";
import { CertificationDefaultValue } from "@/model/certification";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  ActionIcon,
  Card,
  CloseIcon,
  FileInput,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import { DatePickerInput, DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaRegCalendar } from "react-icons/fa6";
import { z } from "zod";

export default function Certifications() {
  const { control, setValue, watch } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const handleClickAppend = () => {
    append(CertificationDefaultValue);
  };

  const handleClickDelete = (index: number) => {
    remove(index);
  };

  const handleChangeDateRange = (index: number, date: DateValue) => {
    const startDate = date ? dayjs(date).toISOString() : "";
    setValue(`certifications.${index}.start_at`, startDate);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <Label>자격증 (선택)</Label>
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
            <DatePickerInput
              type="default"
              valueFormat="YYYY년 MM월 DD일"
              placeholder="발급일"
              leftSection={<FaRegCalendar />}
              value={
                dayjs(watch(`certifications.${index}.start_at`)).isValid()
                  ? dayjs(watch(`certifications.${index}.start_at`)).toDate()
                  : null
              }
              onChange={(dateValue) => {
                handleChangeDateRange(index, dateValue);
              }}
            />
          </Group>
          <Controller
            control={control}
            name={`certifications.${index}.name`}
            render={({ field: { ...f } }) => (
              <TextInput {...f} placeholder="자격증" />
            )}
          />
          <Controller
            control={control}
            name={`certifications.${index}.organization`}
            render={({ field: { ...f } }) => (
              <TextInput {...f} placeholder="발급기관" />
            )}
          />
          <FileInput placeholder="자격증 사본 추가 (10MB, PDF)" />
        </Card>
      ))}
    </div>
  );
}
