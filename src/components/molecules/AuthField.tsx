import { Input } from "../atoms/Input";
import { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
  type,
  ...props
}: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {icon && <span className="text-orange-500">{icon}</span>}
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>

      {/* wrapper WAJIB relative */}
      <div className="relative">
        <Input
          type={isPassword && showPassword ? "text" : type}
          className={`
            w-full px-4 py-2.5 pr-10
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

        {/* toggle button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
