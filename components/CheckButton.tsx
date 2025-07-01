import { Checkbox, CheckboxProps } from "@mantine/core";

export default function CheckButton(props: CheckboxProps) {
  return (
    <Checkbox
      {...props}
      size="sm"
      classNames={{
        input: "checked:bg-primary checked:border-primary",
      }}
    />
  );
}
