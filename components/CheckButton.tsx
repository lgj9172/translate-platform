import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

interface CheckButtonProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
}

export default function CheckButton({
  checked,
  onCheckedChange,
  disabled,
  id,
  className,
  ...props
}: CheckButtonProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      id={id}
      className={className}
      {...props}
    />
  );
}
