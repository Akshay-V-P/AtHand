import { type InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputField = ({
  label,
  error,
  className = "",
  ...props
}: InputFieldProps) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="text-sm font-medium text-red-700">
          {label}
        </label>
      )}

      <input
        className={`w-full px-5 py-3 rounded-2xl bg-white/95 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm text-sm ${className}`}
              {...props}
      />

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};