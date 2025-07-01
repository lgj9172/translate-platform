import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "muted";
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = "md", color = "primary", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    };

    const colorClasses = {
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
    };

    return (
      <div
        className={cn("inline-flex items-center justify-center", className)}
        ref={ref}
        {...props}
      >
        <Loader2
          className={cn("animate-spin", sizeClasses[size], colorClasses[color])}
        />
      </div>
    );
  },
);
Loader.displayName = "Loader";

export { Loader };
