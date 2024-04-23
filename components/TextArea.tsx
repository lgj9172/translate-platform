import React, { forwardRef } from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

const TextArea = forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  (props, ref) => (
    <TextareaAutosize
      ref={ref}
      className="px-4 py-1 rounded border border-slate-200 placeholder:text-slate-400 focus:outline-primary font-['SpoqaHanSans']"
      {...props}
    />
  ),
);

export default TextArea;
