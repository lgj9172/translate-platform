import { Stack } from "@/components/ui/stack";

interface Props {
  children: React.ReactNode;
}

export default function PageHeader({ children }: Props) {
  return <Stack className="w-full mb-4">{children}</Stack>;
}
