import { postFile } from "@/apis/files";
import CheckButton from "@/components/CheckButton";
import ControllerSection from "@/components/ControllerSection";
import ErrorText from "@/components/ErrorText";
import FileInput from "@/components/FileInput";
import InputSection from "@/components/InputSection";
import Label from "@/components/Label";
import LabelSection from "@/components/LabelSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CareerDefaultValue } from "@/model/career";
import { PostTranslatorFormSchema } from "@/model/translator";
import { ActionIcon } from "@/components/ui/action-icon";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChangeEvent } from "react";
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
    }
  };

  return (
    <InputSection>
      <LabelSection>
        <Label>경력</Label>
        <div>
          <Button variant="ghost" size="sm" onClick={handleClickAppend}>
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
                    <Input
                      type="date"
                      value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
                      onChange={(e) =>
                        onChange(
                          e.target.value
                            ? dayjs(e.target.value).toISOString()
                            : "",
                        )
                      }
                      className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-primary"
                      placeholder="시작일"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`careers.${index}.ended_at`}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      type="date"
                      value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
                      onChange={(e) =>
                        onChange(
                          e.target.value
                            ? dayjs(e.target.value).toISOString()
                            : "",
                        )
                      }
                      className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-primary"
                      placeholder="종료일"
                      disabled={watch(`careers.${index}.is_employed`)}
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
                  <CheckButton
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
                text={`${watch(`careers.${index}.file_id`)}`}
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
