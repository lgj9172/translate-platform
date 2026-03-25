import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface RadioButtonProps {
  value: string;
  label: string;
  id?: string;
}

export default function RadioButton({ value, label, id }: RadioButtonProps) {
  const radioId = id || value;

  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={radioId} />
      <Label htmlFor={radioId}>{label}</Label>
    </div>
  );
}
