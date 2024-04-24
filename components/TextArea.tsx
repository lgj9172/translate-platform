import React, { forwardRef } from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

const TextArea = forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  (props, ref) => (
    <TextareaAutosize
      ref={ref}
      className="px-3 py-2 rounded border border-slate-200 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none"
      {...props}
    />
  ),
);

export default TextArea;
