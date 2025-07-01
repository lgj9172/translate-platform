import { InputHTMLAttributes } from "react";
import Input from "./Input";

export default function TextInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  return <Input {...props} type="text" />;
}
