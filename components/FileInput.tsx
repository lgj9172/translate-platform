import { ChangeEventHandler, MouseEventHandler, useId, useRef } from "react";
import TextInput from "./TextInput";

interface Props {
  text?: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function FI({ text, placeholder = "", onChange }: Props) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClickInput: MouseEventHandler<HTMLInputElement> = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <label htmlFor={id}>
      <input
        ref={fileInputRef}
        hidden
        type="file"
        id={id}
        onChange={onChange}
      />
      <TextInput
        readOnly
        value={text}
        placeholder={placeholder}
        className="w-full hover:cursor-pointer"
        onClick={handleClickInput}
      />
    </label>
  );
}
