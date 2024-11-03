import React, { ButtonHTMLAttributes, forwardRef } from "react";
import classNames from "classnames";

// Button의 크기 타입
type ButtonSize = "sm" | "md" | "lg";
// Button의 스타일 타입
type ButtonVariant = "primary" | "secondary" | "subtle";

// Button 컴포넌트의 Props 타입 정의
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: ButtonSize;
  variant: ButtonVariant;
  children: React.ReactNode;
}

// forwardRef를 이용하여 Button 컴포넌트를 만듭니다.
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = "md", variant = "primary", children, disabled, ...props }, ref) => {
    // Define base styles
    const baseStyles = "font-bold rounded-[8px]";

    // Define size styles
    const sizeStyles = {
      sm: "px-[16px] py-[4px] text-[14px]",
      md: "px-[16px] py-[12px] text-[16px]",
      lg: "px-[24px] py-[16px] text-[16px]",
    };

    // Define variant styles
    const variantStyles = {
      primary: "bg-primary text-white hover:bg-[#FFAA78] active:bg-[#DB5E37]",
      secondary:
        "bg-[#F1F3F5] text-[#8B8C8D] hover:bg-[#F9FAFB] active:bg-[#D7D8D9]",
      subtle:
        "border border-[#D7D8D9] hover:border-[#F1F3F5] active:border-[#8B8C8D]",
      disabled: "bg-gray-200 text-gray-300 cursor-not-allowed",
    };

    return (
      <button
        ref={ref}
        type="button"
        className={classNames(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          { [variantStyles.disabled]: disabled }, // Add disabled styles if disabled
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
