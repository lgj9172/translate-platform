import { MouseEventHandler, Ref, useEffect, useRef, useState } from "react";
import Typography from "./Typography";
import Checkbox from "./Checkbox";

interface Props {
  options: { label: string; value: string; disabled?: boolean }[];
  value: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

export default function MultipleSelectBox(
  { options, value, onChange, placeholder = "" }: Props,
  ref: Ref<HTMLButtonElement>,
) {
  const selectRef = useRef<HTMLDivElement>(null);

  const optionsRef = useRef(null);

  const [open, setOpen] = useState(false);

  const handleClickSelect: MouseEventHandler<HTMLButtonElement> = () => {
    setOpen((prev) => !prev);
  };

  const handleClickOption = (v: string) => {
    const updatedValue = value.includes(v)
      ? value.filter((e) => e !== v)
      : [...value, v];
    if (onChange) onChange(updatedValue);
  };

  useEffect(() => {
    const handleOutsideClose = (e: MouseEvent) => {
      if (
        open &&
        selectRef.current &&
        !selectRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("click", handleOutsideClose);
    return () => document.removeEventListener("click", handleOutsideClose);
  });

  return (
    <div ref={selectRef} className="relative flex items-center">
      <button
        ref={ref}
        type="button"
        onClick={handleClickSelect}
        className="flex items-center"
      >
        <Typography type="body-16">
          {value.length === 0
            ? placeholder
            : options
                .filter((option) => value.includes(option.value))
                .map((option) => option.label)
                .join(", ")}
        </Typography>
        {open ? (
          <path d="M9 6L13.3301 10.5H4.66987L9 6Z" fill="#8B8C8D" />
        ) : (
          <path d="M9 12L4.66987 7.5L13.3301 7.5L9 12Z" fill="#8B8C8D" />
        )}
      </button>
      {open && (
        <ul
          ref={optionsRef}
          className="z-10 absolute top-6 left-0 mt-1 py-3 min-w-[150px] max-h-[248px]
              border border-[#D7D8D9] rounded-xl bg-white list-none overflow-y-auto"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="presentation"
              onClick={() => handleClickOption(option.value)}
              className="px-4 py-1
                  overflow-hidden text-ellipsis whitespace-nowrap
                 hover:bg-[#FFF7ED]"
            >
              <Checkbox
                text={option.label}
                readOnly
                checked={value.includes(option.value)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
