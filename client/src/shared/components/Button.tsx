import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "blue" | "blue_outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "transform transition duration-300 ease px-6 py-2.5 rounded-xl font-medium transition-colors duration-200 text-sm hover:-translate-y-[2px] hover:shadow-lg";

  const variants = {
    primary:
      "bg-[#2A2A2A] hover:bg-black text-white shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",

    outline:
      "bg-transparent text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "text-gray-600 hover:text-gray-900 cursor-pointer",
    blue:
      "bg-[#545CEB] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-blue-200 cursor-pointer",
    blue_outline:
    "w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-[#545CEB] bg-white border border-[#545CEB] hover:bg-blue-50 transition-colors focus:ring-4 focus:ring-blue-100 cursor-pointer",
    
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};