import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import TextInput from "@/components/TextInput";
import { CertificationDefaultValue } from "@/model/certification";
import { PostTranslatorFormSchema } from "@/model/translator";
import { ActionIcon, Alert, Card, CloseIcon, Stack } from "@mantine/core";
import { DatePickerInput, DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { ChangeEvent } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FaCircleInfo, FaRegCalendar } from "react-icons/fa6";
import { z } from "zod";

export default function Certifications() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  // const { mutateAsync } = useMutation({ mutationFn: postFile });

  const handleClickAppend = () => {
    append(CertificationDefaultValue);
  };

  const handleClickDelete = (index: number) => {
    remove(index);
  };

  const handleChangeDateRange = (index: number, date: DateValue) => {
    const staredAt = date ? dayjs(date).toISOString() : "";
    setValue(`certifications.${index}.started_at`, staredAt, {
      shouldValidate: true,
    });
  };

  const handleChangeFile = async (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // const res = await mutateAsync({ content: file });
      // setValue(`certifications.${index}.file`, res, { shouldValidate: true });
    }
  };

  return (
    <InputSection>
      <LabelSection>
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
      </LabelSection>
      {fields.length === 0 && (
        <Alert
          color="gray"
          bg="#F9FAFB"
          title="자격증이 있다면 추가 버튼을 눌러 입력해주세요."
          icon={<FaCircleInfo />}
        />
      )}
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
              // disabled={fields.length === 1}
            >
              <CloseIcon />
            </ActionIcon>
          </div>
          <div className="flex flex-col gap-1">
            <DatePickerInput
              type="default"
              valueFormat="YYYY년 MM월 DD일"
              placeholder="발급일"
              leftSection={<FaRegCalendar />}
              value={
                dayjs(watch(`certifications.${index}.started_at`)).isValid()
                  ? dayjs(watch(`certifications.${index}.started_at`)).toDate()
                  : null
              }
              onChange={(dateValue) => {
                handleChangeDateRange(index, dateValue);
              }}
              classNames={{
                input: "focus:border-primary",
                placeholder: "text-neutral-400",
                day: "data-[selected=true]:bg-primary",
              }}
            />
            <ErrorText>
              {errors?.certifications?.[index]?.started_at?.message}
            </ErrorText>
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name={`certifications.${index}.name`}
              render={({ field: { ...f } }) => (
                <TextInput {...f} placeholder="자격증" />
              )}
            />
            <ErrorText>
              {errors?.certifications?.[index]?.name?.message}
            </ErrorText>
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name={`certifications.${index}.organization`}
              render={({ field: { ...f } }) => (
                <TextInput {...f} placeholder="발급기관" />
              )}
            />
            <ErrorText>
              {errors?.certifications?.[index]?.organization?.message}
            </ErrorText>
          </div>
          <div>
            <FileInput
              placeholder="자격증 사본 추가 (10MB, PDF)"
              onChange={(e) => handleChangeFile(index, e)}
              text={`${watch(`certifications.${index}.file_id`)}`}
            />
            <ErrorText>
              {errors?.certifications?.[index]?.file_id?.message}
            </ErrorText>
          </div>
        </Card>
      ))}
    </InputSection>
  );
}
