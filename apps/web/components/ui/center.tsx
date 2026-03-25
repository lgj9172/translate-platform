import * as React from "react";
import { cn } from "@/lib/utils";

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline = false, ...props }, ref) => {
    return (
      <div
        className={cn(
          inline ? "inline-flex" : "flex",
          "items-center justify-center",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Center.displayName = "Center";

export { Center };
