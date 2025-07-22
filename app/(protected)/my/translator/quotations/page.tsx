"use client";

import { getTranslatorQuotations } from "@/apis/translator";
import Alert from "@/components/Alert";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import QuotationCard from "@/components/QuotationCard";
import { ActionIcon } from "@/components/ui/action-icon";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const {
    data: translatorQuotations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["translator", "quotations"],
    queryFn: () => getTranslatorQuotations({ params: { start: 0, size: 10 } }),
  });

  return (
    <Stack>
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild>
            <Link href="/my">
              <ArrowLeftIcon />
            </Link>
          </ActionIcon>
          <PageTitle>보낸 견적 요청</PageTitle>
        </Group>
      </PageHeader>
      {isLoading && (
        <Center className="h-[500px]">
          <Loader />
        </Center>
      )}
      {isError && (
        <Alert>보낸 견적 요청 목록을 불러오는 중 오류가 발생했어요.</Alert>
      )}
      {translatorQuotations?.length === 0 && (
        <Alert>아직 보낸 견적 요청이 없어요.</Alert>
      )}
      {translatorQuotations?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          {translatorQuotations?.map((quotation) => (
            <QuotationCard key={quotation.quotation_id} quotation={quotation} />
          ))}
        </div>
      )}
    </Stack>
  );
}
