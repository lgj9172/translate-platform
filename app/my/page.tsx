"use client";

import PageHeader from "@/components/PageHeader";
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import Link from "next/link";
import { FaArrowLeft, FaCaretRight } from "react-icons/fa6";

export default function Page() {
  return (
    <Stack>
      <Group>
        <ActionIcon
          variant="transparent"
          color="black"
          component={Link}
          href="/"
        >
          <FaArrowLeft />
        </ActionIcon>
      </Group>
      <PageHeader>
        <Title>마이 페이지</Title>
      </PageHeader>
      <Card withBorder radius="md">
        <Stack>
          <SimpleGrid cols={2}>
            <Group>
              <Avatar size="xl" src={null} alt="no image here" />
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  고객
                </Text>
                <Text>홍길동</Text>{" "}
                <Group>
                  <Text fz="xs" c="dimmed">
                    test@test.io
                  </Text>
                </Group>
                <Group>
                  <Text fz="xs" c="dimmed">
                    010-1234-5678
                  </Text>
                </Group>
              </Stack>
            </Group>
            <SimpleGrid cols={{ base: 1, xs: 2 }}>
              <UnstyledButton component={Link} href="/my/translation">
                <Paper p="md">
                  <Text c="dimmed">내 번역 요청</Text>
                  <Group c="orange" justify="space-between" wrap="nowrap">
                    <Text size="xl" fw="bolder">
                      8
                    </Text>
                    <FaCaretRight />
                  </Group>
                </Paper>
              </UnstyledButton>
              <UnstyledButton>
                <Paper p="md">
                  <Text c="dimmed">평가</Text>
                  <Group c="orange" justify="space-between">
                    <Text size="xl" fw="bolder">
                      8
                    </Text>
                    <FaCaretRight />
                  </Group>
                </Paper>
              </UnstyledButton>
            </SimpleGrid>
          </SimpleGrid>
        </Stack>
      </Card>
      <Stack>
        <SimpleGrid cols={2}>
          <Button variant="light" color="orange">
            번역사 등록
          </Button>
          <Button variant="light" color="orange">
            공지사항
          </Button>
          <Button variant="light" color="orange">
            자주하는질문
          </Button>
          <Button variant="light" color="orange">
            고객센터
          </Button>
        </SimpleGrid>
        <Button variant="outline" color="orange">
          로그아웃
        </Button>
      </Stack>
    </Stack>
  );
}
