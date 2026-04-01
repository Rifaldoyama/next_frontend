import { Input } from "../atoms/Input";
import { ReactNode } from "react";

type AuthFieldProps = {
  label: string;
  icon?: ReactNode;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function AuthField({
  label,
  icon,
  error,
  required = false,
  className = "",
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {icon && <span className="text-orange-500">{icon}</span>}
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>

      <Input
        className={`
          w-full px-4 py-2.5 
          border-2 rounded-lg 
          text-gray-900 
          placeholder:text-gray-400
          focus:outline-none 
          focus:ring-2 
          focus:ring-orange-500 
          focus:border-transparent
          transition-all
          duration-200
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 hover:border-orange-200"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
