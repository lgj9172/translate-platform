import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: Props) {
  return (
    <div
      className={`p-[20px] border-[1px] border-gray-100 rounded-[16px] ${className}`}
    >
      {children}
    </div>
  );
}
