import classNames from "classnames";
import { ReactNode } from "react";
import Typography from "./Typography";

interface BadgeProps {
  color: "black" | "blue" | "red";
  children: ReactNode;
}
export default function Badge({ color, children }: BadgeProps) {
  return (
    <div
      className={classNames(
        "h-[22px] px-[12px] py-[2px] flex justify-center items-center rounded-[16px]",
        {
          "bg-[#F0F0F0] text-[#000000]": color === "black",
          "bg-[#E7EFFF] text-[#2563EB]": color === "blue",
          "bg-[#FFE8E8] text-[#FF3232]": color === "red",
        }
      )}
    >
      <Typography type="body-12" bold>
        {children}
      </Typography>
    </div>
  );
}
