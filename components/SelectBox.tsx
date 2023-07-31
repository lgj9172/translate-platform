import {
  MouseEventHandler,
  Ref,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import Typography from "./Typography";

interface Props {
  options: { label: string; value: any; disabled?: boolean }[];
  value: number | string | any[];
  onChange: (value: any) => void;
  placeholder?: string;
  multiple?: boolean;
}

const SelectBox = forwardRef(
  (
    { options, value, onChange, multiple = false, placeholder = "" }: Props,
    ref: Ref<HTMLButtonElement>,
  ) => {
    const selectRef = useRef<HTMLDivElement>(null);

    const optionsRef = useRef(null);

    const [open, setOpen] = useState(false);

    const handleClickSelect: MouseEventHandler<HTMLButtonElement> = () => {
      setOpen((prev) => !prev);
    };

    const handleClickOption = (v: number | string | boolean) => {
      if (!multiple) {
        onChange(v);
        setOpen(false);
      } else if (Array.isArray(value)) {
        const updatedValue = value.includes(v)
          ? value.filter((e) => e !== v)
          : [...value, v];
        onChange(updatedValue);
      }
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
      <div ref={selectRef} className="relative inline-block">
        <button
          ref={ref}
          type="button"
          onClick={handleClickSelect}
          className="flex items-center"
        >
          <Typography type="body-16">
            {typeof value === "undefined" && placeholder}
            {typeof value === "string" && value.length === 0 && placeholder}
            {Array.isArray(value) && value.length === 0 && placeholder}
            {!multiple &&
              options.find((option) => option.value === value)?.label}
            {multiple &&
              Array.isArray(value) &&
              options
                .filter((option) => value.includes(option.value))
                .map((option) => option.label)
                .join(", ")}
          </Typography>
          {open ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 6L13.3301 10.5H4.66987L9 6Z" fill="#8B8C8D" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 12L4.66987 7.5L13.3301 7.5L9 12Z" fill="#8B8C8D" />
            </svg>
          )}
        </button>
        {open && (
          <ul
            ref={optionsRef}
            className="z-10 absolute top-6 left-0 mt-1 py-3 min-w-[150px] max-h-[248px]
              border border-[#D7D8D9] rounded-xl bg-white list-none overflow-y-auto
              "
          >
            {options.map((option) => (
              <li
                role="presentation"
                key={option.value}
                onClick={() => handleClickOption(option.value)}
                className="px-4 py-1
                  overflow-hidden text-ellipsis whitespace-nowrap
                 hover:bg-[#FFF7ED]"
              >
                {(!multiple && value === option.value) ||
                (Array.isArray(value) && value.includes(option.value)) ? (
                  <Typography type="body-16" color="primary">
                    {option.label}
                  </Typography>
                ) : (
                  <Typography type="body-16" color="inherit">
                    {option.label}
                  </Typography>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

export default SelectBox;
