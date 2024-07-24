import CheckButton from "@/components/CheckButton";
import ErrorText from "@/components/ErrorText";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import TextInput from "@/components/TextInput";
import { CareerDefaultValue } from "@/model/career";
import { PostTranslatorFormSchema } from "@/model/translator";
import { ActionIcon, Card, CloseIcon, Stack } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import dayjs from "dayjs";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaRegCalendar } from "react-icons/fa6";
import { z } from "zod";

export default function Careers() {
  const {
    control,
    getValues,
    setValue,
    watch,

    formState: { errors },
  } = useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

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
    setValue(`careers.${index}.started_at`, startedAt, {
      shouldValidate: true,
    });
    setValue(`careers.${index}.ended_at`, isEmployed ? currentDate : endedAt, {
      shouldValidate: true,
    });
  };

  return (
    <InputSection>
      <LabelSection>
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
          <div className="flex flex-col gap-1">
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
            <ErrorText>
              {errors?.careers?.[index]?.started_at?.message}
            </ErrorText>
            <ErrorText>{errors?.careers?.[index]?.ended_at?.message}</ErrorText>
          </div>
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
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name={`careers.${index}.name`}
              render={({ field: { ...f } }) => (
                <TextInput {...f} placeholder="회사 이름" />
              )}
            />
            <ErrorText>{errors?.careers?.[index]?.name?.message}</ErrorText>
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name={`careers.${index}.position`}
              render={({ field: { ...f } }) => (
                <TextInput {...f} placeholder="직무" />
              )}
            />
            <ErrorText>{errors?.careers?.[index]?.position?.message}</ErrorText>
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name={`careers.${index}.achievement`}
              render={({ field: { ...f } }) => (
                <TextInput {...f} placeholder="주요성과" />
              )}
            />
            <ErrorText>
              {errors?.careers?.[index]?.achievement?.message}
            </ErrorText>
          </div>
        </Card>
      ))}
    </InputSection>
  );
}
