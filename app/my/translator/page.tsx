"use client";

import {
  getMyTranslator,
  postTranslator,
  putTranslator,
} from "@/apis/translator";
import { getUser } from "@/apis/user";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import {
  PostTranslatorFormDefaultValue,
  PostTranslatorFormSchema,
} from "@/model/translator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Center, Group, Loader, Stack } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa6";
import { toast } from "sonner";
import { z } from "zod";
import Careers from "./_component/Careers";
import Certifications from "./_component/Certifications";
import Educations from "./_component/Educations";
import Samples from "./_component/Samples";
import SelfIntroduction from "./_component/SelfIntroduction";
import Speciality from "./_component/Speciality";

export default function Page() {
  const router = useRouter();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const { data: myTranslator, isSuccess: isSuccessMyTranslator } = useQuery({
    queryKey: ["myTranslator"],
    queryFn: () => getMyTranslator(),
    enabled: user?.authorization?.is_translator,
  });

  const methods = useForm({
    resolver: zodResolver(PostTranslatorFormSchema),
    defaultValues: PostTranslatorFormDefaultValue,
    mode: "onChange",
  });

  useEffect(() => {
    if (isSuccessMyTranslator && myTranslator) {
      methods.reset(myTranslator);
    }
  }, [isSuccessMyTranslator, myTranslator, methods]);

  const { mutate: createTranslator, isPending: isPendingCreate } = useMutation({
    mutationFn: postTranslator,
    onSuccess: () => {
      toast.success("번역사 등록이 완료되었어요.", {
        richColors: true,
        position: "top-center",
      });
      router.push("/my");
    },
  });

  const { mutate: updateTranslator, isPending: isPendingUpdate } = useMutation({
    mutationFn: putTranslator,
    onSuccess: () => {
      toast.success("번역사 정보 수정이 완료되었어요.", {
        richColors: true,
        position: "top-center",
      });
      router.push("/my");
    },
  });

  const isPending = isPendingCreate || isPendingUpdate;

  const handleSubmitSuccess: SubmitHandler<
    z.infer<typeof PostTranslatorFormSchema>
  > = (data) => {
    if (user?.authorization?.is_translator && myTranslator?.translator_id) {
      updateTranslator({
        translatorId: myTranslator?.translator_id,
        payload: data,
      });
    } else {
      createTranslator({ payload: data });
    }
  };

  const handleSubmitError: SubmitErrorHandler<
    z.infer<typeof PostTranslatorFormSchema>
  > = () => {
    toast.error("입력되지 않은 항목이 있어요.", {
      richColors: true,
      position: "top-center",
    });
  };

  if (isLoadingUser) {
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );
  }

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
              <PageTitle>
                번역사{" "}
                {user?.authorization?.is_translator ? "정보 수정" : "등록"}
              </PageTitle>
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
