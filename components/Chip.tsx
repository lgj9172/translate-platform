import { HTMLProps, useId } from "react";

export default function Chip({
  children,
  ...props
}: HTMLProps<HTMLInputElement>) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="px-5 py-1 bg-white rounded-2xl border border-zinc-300 justify-center items-center gap-2.5 inline-flex has-[:checked]:bg-orange-50 has-[:checked]:border-orange-400"
    >
      <input {...props} id={id} type="checkbox" className="peer" hidden />
      <div className="text-neutral-400 text-sm font-normal font-['SpoqaHanSans'] leading-normal peer-checked:text-orange-400">
        {children}
      </div>
    </label>
  );
}
