import { postFile, getFile } from "@/apis/files";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { CareerDefaultValue } from "@/model/career";
import { PostTranslatorFormSchema } from "@/model/translator";
import { ActionIcon } from "@/components/ui/action-icon";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChangeEvent, useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";
import { Stack } from "@/components/ui/stack";

export default function Careers() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<z.infer<typeof PostTranslatorFormSchema>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "careers",
  });

  const { mutateAsync } = useMutation({ mutationFn: postFile });

  const careerFields = watch("careers");

  const getFileInfo = async (fileId: string) => {
    try {
      const fileInfo = await getFile({ fileId });
      return fileInfo;
    } catch (error) {
      console.error("파일 정보를 가져오는데 실패했습니다:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadFileNames = async () => {
      if (careerFields) {
        for (let i = 0; i < careerFields.length; i++) {
          const career = careerFields[i];
          if (career.file_id && !career.file_name) {
            const fileInfo = await getFileInfo(career.file_id);
            if (fileInfo) {
              setValue(`careers.${i}.file_name`, fileInfo.name);
            }
          }
        }
      }
    };

    loadFileNames();
  }, [careerFields, setValue]);

  const handleClickAppend = () => {
    append(CareerDefaultValue);
  };

  const handleClickDelete = (index: number) => {
    remove(index);
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
      setValue(`careers.${index}.file_name`, file.name, {
        shouldValidate: true,
      });
    }
  };

  return (
    <InputSection>
      <LabelSection>
        <Label>경력</Label>
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClickAppend}
          >
            추가
          </Button>
        </div>
      </LabelSection>
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <Stack gap="xs">
            <div className="flex justify-end">
              <ActionIcon
                variant="ghost"
                onClick={() => handleClickDelete(index)}
                disabled={fields.length === 1}
              >
                <X />
              </ActionIcon>
            </div>
            <ControllerSection>
              <div className="flex gap-2">
                <Controller
                  control={control}
                  name={`careers.${index}.started_at`}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      date={value ? dayjs(value).toDate() : undefined}
                      onDateChange={(date) =>
                        onChange(date ? dayjs(date).toISOString() : "")
                      }
                      placeholder="시작일"
                      className="flex-1"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`careers.${index}.ended_at`}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      date={value ? dayjs(value).toDate() : undefined}
                      onDateChange={(date) =>
                        onChange(date ? dayjs(date).toISOString() : "")
                      }
                      placeholder="종료일"
                      disabled={watch(`careers.${index}.is_employed`)}
                      className="flex-1"
                    />
                  )}
                />
              </div>
              <ErrorText>
                {errors?.careers?.[index]?.started_at?.message}
              </ErrorText>
              <ErrorText>
                {errors?.careers?.[index]?.ended_at?.message}
              </ErrorText>
            </ControllerSection>
            <Controller
              control={control}
              name={`careers.${index}.is_employed`}
              render={({ field: { value, onChange, ...f } }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    {...f}
                    checked={value}
                    onCheckedChange={(isChecked) => {
                      onChange(isChecked);
                      if (isChecked) {
                        setValue(
                          `careers.${index}.ended_at`,
                          dayjs().toISOString(),
                        );
                      }
                    }}
                  />
                  <label htmlFor={f.name} className="text-sm font-medium">
                    재직중
                  </label>
                </div>
              )}
            />
            <ControllerSection>
              <Controller
                control={control}
                name={`careers.${index}.name`}
                render={({ field: { ...f } }) => (
                  <Input {...f} placeholder="회사 이름" />
                )}
              />
              <ErrorText>{errors?.careers?.[index]?.name?.message}</ErrorText>
            </ControllerSection>
            <ControllerSection>
              <Controller
                control={control}
                name={`careers.${index}.position`}
                render={({ field: { ...f } }) => (
                  <Input {...f} placeholder="직무" />
                )}
              />
              <ErrorText>
                {errors?.careers?.[index]?.position?.message}
              </ErrorText>
            </ControllerSection>
            <ControllerSection>
              <Controller
                control={control}
                name={`careers.${index}.achievement`}
                render={({ field: { ...f } }) => (
                  <Input {...f} placeholder="주요성과" />
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
                onRemove={() => {
                  setValue(`careers.${index}.file_id`, "");
                  setValue(`careers.${index}.file_name`, "");
                }}
                text={watch(`careers.${index}.file_name`) || ""}
              />
              <ErrorText>
                {errors?.careers?.[index]?.file_id?.message}
              </ErrorText>
            </ControllerSection>
          </Stack>
        </Card>
      ))}
    </InputSection>
  );
}
