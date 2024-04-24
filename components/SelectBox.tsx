// import {
//   MouseEventHandler,
//   Ref,
//   forwardRef,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import Typography from "./Typography";

// interface Props {
//   options: { label: string; value: string; disabled?: boolean }[];
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// const SelectBox = forwardRef(
//   (
//     { options, value, onChange, placeholder = "" }: Props,
//     ref: Ref<HTMLButtonElement>,
//   ) => {
//     const selectRef = useRef<HTMLDivElement>(null);

//     const optionsRef = useRef(null);

//     const [open, setOpen] = useState(false);

//     const handleClickSelect: MouseEventHandler<HTMLButtonElement> = () => {
//       setOpen((prev) => !prev);
//     };

//     const handleClickOption = (v: string) => {
//       onChange(v);
//       setOpen(false);
//     };

//     useEffect(() => {
//       const handleOutsideClose = (e: MouseEvent) => {
//         if (
//           open &&
//           selectRef.current &&
//           !selectRef.current.contains(e.target as Node)
//         )
//           setOpen(false);
//       };
//       document.addEventListener("click", handleOutsideClose);
//       return () => document.removeEventListener("click", handleOutsideClose);
//     });

//     return (
//       <div ref={selectRef} className="relative flex items-center">
//         <button
//           ref={ref}
//           type="button"
//           onClick={handleClickSelect}
//           className="flex items-center"
//         >
//           <Typography type="body-16">
//             {options.find((option) => option.value === value)?.label ??
//               placeholder}
//           </Typography>
//           <svg
//             width="18"
//             height="18"
//             viewBox="0 0 18 18"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             {open ? (
//               <path d="M9 6L13.3301 10.5H4.66987L9 6Z" fill="#8B8C8D" />
//             ) : (
//               <path d="M9 12L4.66987 7.5L13.3301 7.5L9 12Z" fill="#8B8C8D" />
//             )}
//           </svg>
//         </button>
//         {open && (
//           <ul
//             ref={optionsRef}
//             className="z-10 absolute top-8 left-0 mt-1 py-3 min-w-[150px] max-h-[248px]
//               border border-[#D7D8D9] rounded-xl bg-white list-none overflow-y-auto"
//           >
//             {options.map((option) => (
//               <li
//                 role="presentation"
//                 key={option.value}
//                 onClick={() => handleClickOption(option.value)}
//                 className="px-4 py-1
//                   overflow-hidden text-ellipsis whitespace-nowrap
//                  hover:bg-[#FFF7ED]"
//               >
//                 <Typography
//                   type="body-16"
//                   color={value.includes(option.value) ? "primary" : "inherit"}
//                 >
//                   {option.label}
//                 </Typography>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     );
//   },
// );

// export default SelectBox;

import { Select, SelectProps } from "@mantine/core";
import { forwardRef } from "react";

const SelectBox = forwardRef<HTMLInputElement, SelectProps>((props, ref) => (
  <Select
    {...props}
    ref={ref}
    size="sm"
    classNames={{
      input: "border-slate-200 focus:border-primary",
    }}
  />
));

export default SelectBox;
