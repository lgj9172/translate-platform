import classNames from "classnames";
import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={classNames(
        "px-3 py-2 rounded-sm border border-slate-200 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-hidden",
        props.className,
      )}
    />
  );
}
