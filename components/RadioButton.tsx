import { Radio, RadioProps } from "@mantine/core";
import { forwardRef } from "react";

const RadioButton = forwardRef<HTMLInputElement, RadioProps>((props, ref) => (
  <Radio
    {...props}
    ref={ref}
    size="sm"
    classNames={{
      radio: "checked:bg-primary checked:border-primary",
    }}
  />
));

export default RadioButton;
