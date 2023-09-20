import { Stack } from "@mantine/core";

interface Props {
  children: React.ReactNode;
}

export default function PageHeader({ children }: Props) {
  return <Stack w="100%">{children}</Stack>;
}
