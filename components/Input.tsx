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
      "px-4 py-1 rounded border border-slate-200 placeholder:text-slate-400 focus:outline-primary font-['SpoqaHanSans']",
      props.className,
    )}
  />
));

export default Input;
