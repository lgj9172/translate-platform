"use client";

import { getTranslation } from "@/apis/translations";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export default function Page() {
  const path = usePathname();

  const translationId = path.split("/")[path.split("/").length - 1];

  const { data } = useQuery({
    queryKey: ["translation", translationId],
    queryFn: () => getTranslation({ translationId }),
  });

  return (
    <Stack w="full" h="full" p={8} gap={8}>
      <Heading>{data?.title}</Heading>
      <Text>{data?.description}</Text>
    </Stack>
  );
}
