"use client";

import PageHeader from "@/components/PageHeader";
import { ActionIcon, Group, Stack, Tabs, Title } from "@mantine/core";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import Before from "./Before";
import Finished from "./Finished";
import Ongoing from "./Ongoing";

export default function Page() {
  return (
    <Stack>
      <Group>
        <ActionIcon
          variant="transparent"
          color="black"
          component={Link}
          href="/my"
        >
          <FaArrowLeft />
        </ActionIcon>
      </Group>
      <PageHeader>
        <Title>내 번역 요청</Title>
      </PageHeader>
      <Tabs color="orange" variant="pills" defaultValue="before">
        <Tabs.List mb="md">
          <Tabs.Tab value="before">번역 전</Tabs.Tab>
          <Tabs.Tab value="ongoing">번역 진행 중</Tabs.Tab>
          <Tabs.Tab value="finished">번역 종료</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="before">
          <Before />
        </Tabs.Panel>

        <Tabs.Panel value="ongoing">
          <Ongoing />
        </Tabs.Panel>

        <Tabs.Panel value="finished">
          <Finished />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
