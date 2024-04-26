import CheckButton from "@/components/CheckButton";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import { CareerDefaultValue } from "@/model/career";
import { PostTranslatorFormSchema } from "@/model/translator";
import { ActionIcon, Card, CloseIcon, Group, Stack } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import dayjs from "dayjs";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaRegCalendar } from "react-icons/fa6";
import { z } from "zod";

export default function Careers() {
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
    const startedAt = dates[0] ? dayjs(dates[0]).toISOString() : "";
    const endedAt = dates[1] ? dayjs(dates[1]).toISOString() : "";
    const isEmployed = getValues(`careers.${index}.is_employed`);
    const currentDate = dayjs().toISOString();
    setValue(`careers.${index}.started_at`, startedAt);
    setValue(`careers.${index}.ended_at`, isEmployed ? currentDate : endedAt);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <Label>경력</Label>
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
          <Group>
            <DatePickerInput
              type="range"
              valueFormat="YYYY년 MM월 DD일"
              placeholder="시작일 - 종료일"
              leftSection={<FaRegCalendar />}
              value={[
                dayjs(watch(`careers.${index}.started_at`)).isValid()
                  ? dayjs(watch(`careers.${index}.started_at`)).toDate()
                  : null,
                dayjs(watch(`careers.${index}.ended_at`)).isValid()
                  ? dayjs(watch(`careers.${index}.ended_at`)).toDate()
                  : null,
              ]}
              onChange={(datesRangeValue) => {
                handleChangeDateRange(index, datesRangeValue);
              }}
              maxDate={
                watch(`careers.${index}.is_employed`)
                  ? dayjs().toDate()
                  : undefined
              }
              classNames={{
                input: "focus:border-primary",
                placeholder: "text-neutral-400",
                day: "data-[in-range=true]:bg-primary/20 data-[selected=true]:bg-primary",
              }}
            />
          </Group>
          <Controller
            control={control}
            name={`careers.${index}.is_employed`}
            render={({ field: { value, onChange, ...f } }) => (
              <CheckButton
                {...f}
                label="재직중"
                checked={value}
                onChange={(e) => {
                  const isChecked = e.currentTarget.checked;
                  onChange(isChecked);
                  if (isChecked) {
                    setValue(
                      `careers.${index}.ended_at`,
                      dayjs().toISOString(),
                    );
                  }
                }}
              />
            )}
          />
          <Controller
            control={control}
            name={`careers.${index}.name`}
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
            name={`careers.${index}.achievement`}
            render={({ field: { ...f } }) => (
              <TextInput {...f} placeholder="주요성과" />
            )}
          />
        </Card>
      ))}
    </div>
  );
}
