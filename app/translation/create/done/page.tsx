"use client";

import { CheckCircleIcon } from "@chakra-ui/icons";
import { Button, Center, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Index() {
  const router = useRouter();

  const handleClickDone = () => {
    router.push("/");
  };

  return (
    <Stack h="full" p={8}>
      <Center flexGrow={1}>
        <Stack alignItems="center">
          <CheckCircleIcon fontSize="4xl" color="orange.500" />
          <Text fontSize="xl" fontWeight="bold">
            번역 요청을 완료했어요.
          </Text>
        </Stack>
      </Center>
      <HStack justifyContent="center" py="8">
        <Button
          w="full"
          size="lg"
          colorScheme="orange"
          onClick={handleClickDone}
        >
          나의 요청 화면으로 이동
        </Button>
      </HStack>
    </Stack>
  );
}
