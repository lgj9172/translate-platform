import { Select, SelectProps } from "@mantine/core";

export default function SelectBox(props: SelectProps) {
  return (
    <Select
      {...props}
      size="sm"
      classNames={{
        input: "border-slate-200 focus:border-primary",
      }}
    />
  );
}
