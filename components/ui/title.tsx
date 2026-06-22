import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const titleVariants = cva("font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      1: "text-4xl lg:text-5xl",
      2: "text-3xl lg:text-4xl",
      3: "text-2xl lg:text-3xl",
      4: "text-xl lg:text-2xl",
      5: "text-lg lg:text-xl",
      6: "text-base lg:text-lg",
    },
  },
  defaultVariants: {
    size: 2,
  },
});

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  asChild?: boolean;
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  ref?: React.Ref<HTMLHeadingElement>;
}

function Title({
  ref,
  className,
  size,
  order,
  asChild = false,
  ...props
}: TitleProps) {
  const Comp = asChild ? Slot : (`h${order || size || 2}` as React.ElementType);
  return (
    <Comp
      className={cn(titleVariants({ size: size || order, className }))}
      ref={ref}
      {...props}
    />
  );
}
Title.displayName = "Title";

export { Title, titleVariants };
