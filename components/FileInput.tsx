import { ChangeEventHandler, MouseEventHandler, useId, useRef } from "react";
import { CloseIcon } from "@mantine/core";
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
    <label htmlFor={id} className="relative">
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
      <div className="absolute right-0 top-0 bottom-0 w-fit flex justify-center items-center p-3">
        <button
          type="button"
          className="w-4 h-4 flex justify-center items-center"
          aria-label="remove file"
        >
          <CloseIcon />
        </button>
      </div>
    </label>
  );
}
