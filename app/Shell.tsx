"use client";

import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import { BsPersonFill } from "react-icons/bs";

interface Props {
  children: ReactNode;
}

export default function Shell({ children }: Props) {
  // const [opened, { toggle }] = useDisclosure();

  return (
    <Container maw={768}>
      <AppShell header={{ height: 48 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px={8} justify="space-between">
            <Text
              size="xl"
              fw={900}
              variant="gradient"
              gradient={{ from: "orange", to: "yellow", deg: 90 }}
            >
              FLUENCE
            </Text>
            <Group gap={2}>
              <Button
                variant="transparent"
                color="gray"
                size="compact-xs"
                component={Link}
                href="/translation"
              >
                번역
              </Button>
              <Button
                variant="transparent"
                color="gray"
                size="compact-xs"
                component={Link}
                href="/interpret"
              >
                통역
              </Button>
              <Button
                variant="transparent"
                color="gray"
                size="compact-xs"
                component={Link}
                href="/fluence"
              >
                플루언스
              </Button>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  {/* <ActionIcon variant="transparent" color="gray">
                  <BsPerson />
                </ActionIcon> */}
                  <ActionIcon variant="transparent" color="orange">
                    <BsPersonFill />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>고객서비스</Menu.Label>
                  <Menu.Item>공지사항</Menu.Item>
                  <Menu.Item>자주하는질문</Menu.Item>
                  <Menu.Item>고객센터</Menu.Item>

                  <Menu.Divider />

                  <Menu.Label>개인</Menu.Label>
                  <Menu.Item component={Link} href="/my">
                    마이 페이지
                  </Menu.Item>
                  <Menu.Item>프로필 설정</Menu.Item>
                  <Menu.Item color="orange">로그인</Menu.Item>
                  <Menu.Item color="orange">로그아웃</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          {children}
          <Stack p="md" c="gray" mt="lg">
            <Stack gap="20px">
              <Text fz="16px" fw={700}>
                고객센터 070-8383-6353
              </Text>
            </Stack>
            <Stack gap="8px">
              <Text fz="16px" fw={700}>
                (주) 와이준소프트
              </Text>
              <Text fz="16px">대표 박윤경</Text>
              <Text fz="16px">사업자등록번호 888-81-01989</Text>
              <Text fz="16px">통신판매업신고번호 없음</Text>
            </Stack>
          </Stack>
        </AppShell.Main>
      </AppShell>
    </Container>
  );
}
