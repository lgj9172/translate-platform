import { InputHTMLAttributes, LegacyRef, forwardRef, useId } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  text: string;
}

const Checkbox = forwardRef(
  ({ id, text, ...props }: Props, ref: LegacyRef<HTMLInputElement>) => {
    const uniqueId = useId();

    return (
      <div className="relative flex items-center gap-2">
        <input
          {...props}
          ref={ref}
          type="checkbox"
          id={uniqueId}
          className="peer appearance-none w-3.5 h-3.5 m-0.5 bg-gray-100 rounded-sm checked:bg-orange-400 disabled:bg-zinc-300"
        />
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-[9px] left-1 pointer-events-none"
        >
          <path d="M1 1.92308L3.46154 5L9 1" stroke="white" />
        </svg>
        <label
          htmlFor={uniqueId}
          className="text-neutral-800 text-base font-normal leading-normal peer-checked:text-orange-400 pointer-events-none"
        >
          {text}
        </label>
      </div>
    );
  },
);

export default Checkbox;
