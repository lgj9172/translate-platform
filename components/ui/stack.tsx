import * as React from "react";
import { cn } from "@/lib/utils";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { className, gap = "md", align = "stretch", justify = "start", ...props },
    ref,
  ) => {
    const gapClasses = {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const gapClass =
      typeof gap === "number" ? `gap-[${gap}px]` : gapClasses[gap];

    return (
      <div
        className={cn(
          "flex flex-col",
          gapClass,
          alignClasses[align],
          justifyClasses[justify],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Stack.displayName = "Stack";

export { Stack };
