import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function ControllerSection({ children, className }: Props) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
}
