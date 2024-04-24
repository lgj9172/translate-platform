import { InputHTMLAttributes, forwardRef } from "react";
import Input from "./Input";

const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <Input ref={ref} {...props} type="text" />);

export default TextInput;
