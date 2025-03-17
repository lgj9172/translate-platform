import { postFile } from "@/apis/files";
import CheckButton from "@/components/CheckButton";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import TextInput from "@/components/TextInput";
import { CareerDefaultValue } from "@/model/career";
import { PostTranslatorFormSchema } from "@/model/translator";
import { ActionIcon, Card, CloseIcon, Stack } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChangeEvent } from "react";
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

  const { mutateAsync } = useMutation({ mutationFn: postFile });

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

  const handleChangeFile = async (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await mutateAsync({
        payload: { content: file },
      });
      setValue(`careers.${index}.file_id`, res.file_id, {
        shouldValidate: true,
      });
    }
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
          <ControllerSection>
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
          </ControllerSection>
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
          <ControllerSection>
            <Controller
              control={control}
              name={`careers.${index}.name`}
              render={({ field: { ...f } }) => (
                <TextInput {...f} placeholder="회사 이름" />
              )}
            />
            <ErrorText>{errors?.careers?.[index]?.name?.message}</ErrorText>
          </ControllerSection>
          <ControllerSection>
            <Controller
              control={control}
              name={`careers.${index}.position`}
              render={({ field: { ...f } }) => (
                <TextInput {...f} placeholder="직무" />
              )}
            />
            <ErrorText>{errors?.careers?.[index]?.position?.message}</ErrorText>
          </ControllerSection>
          <ControllerSection>
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
          </ControllerSection>
          <ControllerSection>
            <FileInput
              placeholder="경력 증명서 (10MB, PDF)"
              onChange={(e) => handleChangeFile(index, e)}
              text={`${watch(`careers.${index}.file_id`)}`}
            />
            <ErrorText>{errors?.careers?.[index]?.file_id?.message}</ErrorText>
          </ControllerSection>
        </Card>
      ))}
    </InputSection>
  );
}
