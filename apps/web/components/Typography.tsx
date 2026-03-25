import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  type:
    | "error"
    | "body-10"
    | "body-12"
    | "body-14"
    | "body-16"
    | "title-18"
    | "title-20"
    | "title-24"
    | "title-28";
  children: ReactNode;
  bold?: boolean;
  align?: "left" | "right" | "center";
  color?: "inherit" | "black" | "primary";
}

export default function Typography({
  type,
  children,
  bold = false,
  align = "left",
  color = "inherit",
}: TypographyProps) {
  return (
    <div
      className={cn({
        "font-normal": !bold,
        "font-bold": bold,
        "text-left": align === "left",
        "text-center": align === "center",
        "text-right": align === "right",
        "text-[12px] tracking-[-0.4] leading-[24px]": type === "error",
        "text-[10px] tracking-[-0.4] leading-[16px]": type === "body-10",
        "text-[12px] tracking-[-0.4] leading-[18px]": type === "body-12",
        "text-[14px] tracking-[-0.6] leading-[24px]": type === "body-14",
        "text-[16px] tracking-[-0.4] leading-[24px]": type === "body-16",
        "text-[18px] tracking-[-0.4] leading-[28px]": type === "title-18",
        "text-[20px] tracking-[-0.5] leading-[30px]": type === "title-20",
        "text-[24px] tracking-[-0.6] leading-[40px]": type === "title-24",
        "text-[28px] tracking-[-0.8] leading-[48px]": type === "title-28",
        "text-inherit": color === "inherit",
        "text-black": color === "black",
        "text-primary": color === "primary",
      })}
    >
      {children}
    </div>
  );
}
