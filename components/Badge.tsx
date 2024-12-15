import classNames from "classnames";
import { ReactNode } from "react";
import Typography from "./Typography";

interface BadgeProps {
  color: "primary" | "black" | "blue" | "red";
  children: ReactNode;
}
export default function Badge({ color, children }: BadgeProps) {
  return (
    <div
      className={classNames(
        "h-[26px] px-[12px] py-[4px] flex justify-center items-center rounded-[16px] text-nowrap",
        {
          "bg-[#FFEAD0] text-primary": color === "primary",
          "bg-[#F0F0F0] text-[#000000]": color === "black",
          "bg-[#E7EFFF] text-[#2563EB]": color === "blue",
          "bg-[#FFE8E8] text-[#FF3232]": color === "red",
        },
      )}
    >
      <Typography type="body-12" bold>
        {children}
      </Typography>
    </div>
  );
}
