import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ReactNode, useId } from "react";

interface ChipProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
}

export default function Chip({ children, className, ...props }: ChipProps) {
  const id = useId();
  return (
    <div className="relative inline-flex items-center">
      <input id={id} type="checkbox" className="sr-only peer" {...props} />
      <Label
        htmlFor={id}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm font-medium transition-colors outline-none border-input bg-white text-foreground shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent/20 cursor-pointer select-none",
          "peer-checked:border-primary peer-checked:text-primary peer-checked:bg-accent/10",
          className,
        )}
        data-slot="chip"
      >
        {children}
      </Label>
    </div>
  );
}
