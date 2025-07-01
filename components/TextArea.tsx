import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

export default function TextArea(props: TextareaAutosizeProps) {
  return (
    <TextareaAutosize
      className="w-full px-3 py-2 rounded-sm border border-slate-200 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-hidden"
      {...props}
    />
  );
}
