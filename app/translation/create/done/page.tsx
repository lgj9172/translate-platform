"use client";

import { Button, Center, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { FaCircleCheck } from "react-icons/fa6";

export default function Index() {
  return (
    <Center h={500}>
      <Stack w="100%" align="center" gap="xl">
        <Stack align="center">
          <Text c="orange">
            <FaCircleCheck size={32} />
          </Text>
          <Text size="xl">번역 요청을 완료했어요.</Text>
        </Stack>
        <Button component={Link} color="orange" href="/">
          나의 요청 화면으로 이동
        </Button>
      </Stack>
    </Center>
  );
}
