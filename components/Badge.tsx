import { cva, type VariantProps } from "class-variance-authority";

const badge = cva(
  [
    "h-[26px]",
    "px-[12px]",
    "py-[4px]",
    "flex",
    "justify-center",
    "items-center",
    "rounded-[16px]",
    "text-nowrap",
    "text-[12px]",
    "font-bold",
  ],
  {
    variants: {
      color: {
        primary: ["bg-[#FFEAD0]", "text-primary"],
        black: ["bg-[#F0F0F0]", "text-[#000000]"],
        blue: ["bg-[#E7EFFF]", "text-[#2563EB]"],
        red: ["bg-[#FFE8E8]", "text-[#FF3232]"],
      },
    },
    defaultVariants: {
      color: "primary",
    },
  },
);

interface BadgeProps extends VariantProps<typeof badge> {
  children: React.ReactNode;
}

export default function Badge({ color, children }: BadgeProps) {
  return <div className={badge({ color })}>{children}</div>;
}
