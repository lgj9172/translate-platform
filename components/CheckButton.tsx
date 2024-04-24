import { Checkbox, CheckboxProps } from "@mantine/core";
import { forwardRef } from "react";

const CheckButton = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => (
    <Checkbox
      {...props}
      ref={ref}
      size="sm"
      classNames={{
        input: "checked:bg-primary checked:border-primary",
      }}
    />
  ),
);

export default CheckButton;
