"use client";

import { postTranslator } from "@/apis/translator";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import {
  PostTranslatorFormDefaultValue,
  PostTranslatorFormSchema,
} from "@/model/translator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Group, Stack } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa6";
import { z } from "zod";
import { toast } from "sonner";
import Careers from "./_component/Careers";
import Certifications from "./_component/Certifications";
import Educations from "./_component/Educations";
import Samples from "./_component/Samples";
import SelfIntroduction from "./_component/SelfIntroduction";
import Speciality from "./_component/Speciality";

export default function Page() {
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(PostTranslatorFormSchema),
    defaultValues: PostTranslatorFormDefaultValue,
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postTranslator,
    onSuccess: () => {
      toast.success("번역사 등록이 완료되었어요.", {
        richColors: true,
        position: "top-center",
      });
      router.push("/my");
    },
  });

  const handleSubmitSuccess: SubmitHandler<
    z.infer<typeof PostTranslatorFormSchema>
  > = (data) => {
    mutate({ payload: data });
  };

  const handleSubmitError: SubmitErrorHandler<
    z.infer<typeof PostTranslatorFormSchema>
  > = () => {
    toast.error("입력되지 않은 항목이 있어요.", {
      richColors: true,
      position: "top-center",
    });
  };

  return (
    <form
      onSubmit={methods.handleSubmit(handleSubmitSuccess, handleSubmitError)}
    >
      <FormProvider {...methods}>
        <Stack>
          <PageHeader>
            <Group>
              <ActionIcon
                variant="transparent"
                color="black"
                component={Link}
                href="/my"
              >
                <FaChevronLeft />
              </ActionIcon>
              <PageTitle>번역사 등록</PageTitle>
            </Group>
          </PageHeader>

          <Stack gap={48}>
            <Speciality />
            <SelfIntroduction />
            <Educations />
            <Careers />
            <Certifications />
            <Samples />
            <div className="flex justify-end">
              <Button variant="primary" type="submit" disabled={isPending}>
                제출
              </Button>
            </div>
          </Stack>
        </Stack>
      </FormProvider>
    </form>
  );
}
