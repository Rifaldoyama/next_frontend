import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "green" | "red" | "gray" | "blue" | "yellow";
  className?: string;
}

export const Badge = ({
  children,
  color = "gray",
  className = "",
}: BadgeProps) => {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
};
