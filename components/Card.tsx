import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Card({ children }: Props) {
  return (
    <div className="p-[20px] border-[1px] border-gray-100 rounded-[16px]">
      {children}
    </div>
  );
}
