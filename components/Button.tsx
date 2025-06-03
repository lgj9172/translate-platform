import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva(
  [
    "h-fit",
    "font-bold",
    "rounded-[8px]",
    "transition-colors",
    "focus:outline-hidden",
    "disabled:bg-gray-200",
    "disabled:text-gray-300",
    "disabled:cursor-not-allowed",
    "disabled:hover:bg-gray-200",
    "disabled:active:bg-gray-200",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary",
          "text-white",
          "hover:bg-[#FFAA78]",
          "active:bg-[#DB5E37]",
        ],
        secondary: [
          "bg-[#F1F3F5]",
          "text-[#8B8C8D]",
          "hover:bg-[#F9FAFB]",
          "active:bg-[#D7D8D9]",
        ],
        subtle: [
          "border",
          "border-[#D7D8D9]",
          "hover:border-[#F1F3F5]",
          "active:border-[#8B8C8D]",
        ],
      },
      size: {
        sm: ["px-[16px]", "py-[4px]", "text-[14px]"],
        md: ["px-[16px]", "py-[12px]", "text-[16px]"],
        lg: ["px-[24px]", "py-[16px]", "text-[16px]"],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={button({ variant, size, className })}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";

export default Button;
