import classNames from "classnames";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={classNames(
      "px-3 py-2 rounded border border-slate-200 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none",
      props.className,
    )}
  />
));

export default Input;
