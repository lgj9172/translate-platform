import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  data?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export default function SelectBox({
  value,
  onChange,
  onValueChange,
  data = [],
  placeholder,
  disabled,
  name,
  className,
  ...props
}: SelectBoxProps) {
  const handleValueChange = (newValue: string) => {
    if (onChange) onChange(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      disabled={disabled}
      name={name}
      {...props}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
