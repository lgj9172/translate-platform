import { CareerDefaultValue } from "@/model/career";
import { PostTranslatorFormSchema } from "@/model/translator";
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  CloseIcon,
  Group,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import dayjs from "dayjs";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaRegCalendar } from "react-icons/fa6";
import { z } from "zod";

export default function Career() {
  const { control, getValues, setValue, watch } =
    useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "careers",
  });

  const handleClickAppend = () => {
    append(CareerDefaultValue);
  };

  const handleClickDelete = (index: number) => {
    remove(index);
  };

  const handleChangeDateRange = (index: number, dates: DatesRangeValue) => {
    const startDate = dates[0] ? dayjs(dates[0]).toISOString() : "";
    const endDate = dates[1] ? dayjs(dates[1]).toISOString() : "";
    const isWorking = getValues(`careers.${index}.isWorking`);
    const currentDate = dayjs().toISOString();
    setValue(`careers.${index}.startDate`, startDate);
    setValue(`careers.${index}.endDate`, isWorking ? currentDate : endDate);
  };

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Title order={4}>경력</Title>
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
            <DatePickerInput
              type="range"
              valueFormat="YYYY년 MM월 DD일"
              placeholder="시작일 - 종료일"
              leftSection={<FaRegCalendar />}
              value={[
                dayjs(watch(`careers.${index}.startDate`)).isValid()
                  ? dayjs(watch(`careers.${index}.startDate`)).toDate()
                  : null,
                dayjs(watch(`careers.${index}.endDate`)).isValid()
                  ? dayjs(watch(`careers.${index}.endDate`)).toDate()
                  : null,
              ]}
              onChange={(datesRangeValue) => {
                handleChangeDateRange(index, datesRangeValue);
              }}
              closeOnChange={watch(`careers.${index}.isWorking`)}
              maxDate={
                watch(`careers.${index}.isWorking`)
                  ? dayjs().toDate()
                  : undefined
              }
            />
          </Group>
          <Controller
            control={control}
            name={`careers.${index}.isWorking`}
            render={({ field: { value, onChange, ...f } }) => (
              <Checkbox
                {...f}
                label="재직중"
                checked={value}
                onChange={(e) => {
                  const isChecked = e.currentTarget.checked;
                  onChange(isChecked);
                  if (isChecked) {
                    setValue(`careers.${index}.endDate`, dayjs().toISOString());
                  }
                }}
              />
            )}
          />
          <Controller
            control={control}
            name={`careers.${index}.company`}
            render={({ field: { ...f } }) => (
              <TextInput {...f} placeholder="회사 이름" />
            )}
          />
          <Controller
            control={control}
            name={`careers.${index}.position`}
            render={({ field: { ...f } }) => (
              <TextInput {...f} placeholder="직무" />
            )}
          />
          <Controller
            control={control}
            name={`careers.${index}.achievements`}
            render={({ field: { ...f } }) => (
              <Textarea {...f} placeholder="주요성과" />
            )}
          />
        </Card>
      ))}
    </Stack>
  );
}
