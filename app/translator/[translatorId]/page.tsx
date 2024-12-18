"use client";

import { getTranslator } from "@/apis/translator";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { getCategoryLabel } from "@/utils/converter/label";
import {
  ActionIcon,
  Avatar,
  Center,
  Group,
  Loader,
  Stack,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa6";
import Profile from "./_component/Profile";

export default function Page() {
  const router = useRouter();

  const { translatorId: id } = useParams();
  const translatorId = Array.isArray(id) ? id[0] : id;

  const { data: translator, isLoading } = useQuery({
    queryKey: ["translator", translatorId],
    queryFn: () => getTranslator(translatorId),
  });

  if (isLoading)
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );

  if (!translator) return null;

  return (
    <Stack w="full" h="full" gap={16}>
      <PageHeader>
        <Group>
          <ActionIcon
            variant="transparent"
            color="black"
            onClick={() => router.back()}
          >
            <FaChevronLeft />
          </ActionIcon>
          <PageTitle>번역사 프로필</PageTitle>
        </Group>
      </PageHeader>

      <div className="flex flex-col gap-[16px]">
        <Card>
          <div className="flex gap-[8px]">
            <Avatar src="avatar.png" />
            <div>
              <div className="text-[14px] text-[#4B4D4D]">
                {translator?.user_id}
              </div>
              <div className="text-[14px] text-[#8B8C8D]">
                {`경력 ${translator?.experience}년・최근 ${translator?.recent_translations}건`}
              </div>
            </div>
          </div>
        </Card>

        <div>{translator?.introduction}</div>

        <Group justify="space-between">
          <Group gap={4}>
            {translator?.categories.map((category) => (
              <Badge color="blue">{getCategoryLabel(category)}</Badge>
            ))}
          </Group>
        </Group>
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
          <div>리뷰</div>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}
