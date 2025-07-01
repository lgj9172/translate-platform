import { Radio, RadioProps } from "@mantine/core";

export default function RadioButton(props: RadioProps) {
  return (
    <Radio
      {...props}
      size="sm"
      classNames={{
        radio: "checked:bg-primary checked:border-primary",
      }}
    />
  );
}
