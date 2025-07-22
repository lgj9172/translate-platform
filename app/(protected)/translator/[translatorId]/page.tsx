"use client";

import { getTranslator } from "@/apis/translator";
import TranslatorProfile from "@/app/(protected)/translation/[translationId]/_component/TranslatorProfile";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { ActionIcon } from "@/components/ui/action-icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Group } from "@/components/ui/group";
import { Loader } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { getCategoryLabel } from "@/utils/converter/label";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Profile from "./_component/Profile";

export default function Page() {
  const router = useRouter();

  const { translatorId } = useParams<{ translatorId: string }>();

  const { data: translator, isLoading } = useQuery({
    queryKey: ["translator", translatorId],
    queryFn: () => getTranslator({ translatorId }),
  });

  if (isLoading)
    return (
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );

  if (!translator) return null;

  return (
    <Stack className="w-full h-full gap-[16px]">
      <PageHeader>
        <Group>
          <ActionIcon variant="ghost" asChild onClick={() => router.back()}>
            <ArrowLeftIcon />
          </ActionIcon>
          <PageTitle>번역사 프로필</PageTitle>
        </Group>
      </PageHeader>

      <div className="flex flex-col gap-[16px]">
        <Card>
          <TranslatorProfile translatorId={translatorId} />
        </Card>

        <Group className="justify-between">
          <Group gap={4}>
            {translator?.categories.map((category) => (
              <Badge variant="secondary" key={category}>
                {getCategoryLabel(category)}
              </Badge>
            ))}
          </Group>
        </Group>

        <div className="text-sm">{translator?.introduction}</div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="review">리뷰</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Profile translatorId={translatorId} />
        </TabsContent>
        <TabsContent value="review">
          <div className="text-sm">리뷰</div>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}
