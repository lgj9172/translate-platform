import { Box } from "@mantine/core";

interface Props {
  children: React.ReactNode;
}

export default function PageHeader({ children }: Props) {
  return (
    <Box w="100%" mb="xl">
      {children}
    </Box>
  );
}
