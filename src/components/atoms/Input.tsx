import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`border p-2 rounded w-full ${className}`}
    />
  );
}
