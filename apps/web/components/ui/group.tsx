import * as React from "react";
import { cn } from "@/lib/utils";

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
}

const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  (
    {
      className,
      gap = "md",
      align = "center",
      justify = "start",
      wrap = "wrap",
      ...props
    },
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
      baseline: "items-baseline",
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const wrapClasses = {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    };

    const gapClass =
      typeof gap === "number" ? `gap-[${gap}px]` : gapClasses[gap];

    return (
      <div
        className={cn(
          "flex",
          gapClass,
          alignClasses[align],
          justifyClasses[justify],
          wrapClasses[wrap],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Group.displayName = "Group";

export { Group };
