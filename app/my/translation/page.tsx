"use client";

import PageHeader from "@/components/PageHeader";
import PageTitle from "@/components/PageTitle";
import { ActionIcon, Group, Stack, Tabs } from "@mantine/core";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import Before from "./Before";
import Finished from "./Finished";
import Ongoing from "./Ongoing";

export default function Page() {
  return (
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
          <PageTitle>내 번역 요청</PageTitle>
        </Group>
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
