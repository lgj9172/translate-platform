import { X } from "lucide-react";
import {
  type ChangeEventHandler,
  type MouseEventHandler,
  useId,
  useRef,
} from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  text?: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onRemove?: () => void;
  isInvalid?: boolean;
  disabled?: boolean;
}

export default function FileInput({
  text,
  placeholder = "",
  onChange,
  onRemove,
  isInvalid,
  disabled,
}: Props) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickInput: MouseEventHandler<HTMLInputElement> = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <label
      htmlFor={id}
      className="relative"
      data-invalid={isInvalid || undefined}
    >
      <input
        ref={fileInputRef}
        hidden
        type="file"
        id={id}
        onChange={onChange}
        disabled={disabled}
      />
      <Input
        readOnly
        value={text ?? ""}
        placeholder={placeholder}
        className={cn(
          "w-full hover:cursor-pointer",
          isInvalid && "border-destructive ring-[3px] ring-destructive/20",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
        onClick={disabled ? undefined : handleClickInput}
      />
      {text && (
        <div className="absolute right-0 top-0 bottom-0 w-fit flex justify-center items-center p-3">
          <button
            type="button"
            className="w-4 h-4 flex justify-center items-center"
            aria-label="remove file"
            onClick={(e) => {
              e.preventDefault();
              onRemove?.();
            }}
          >
            <X />
          </button>
        </div>
      )}
    </label>
  );
}
