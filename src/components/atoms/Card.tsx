import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Card = ({
  children,
  className = '',
  ...props
}: CardProps) => {
  return (
    <div
      {...props}
      className={`bg-white rounded-xl shadow-md p-6 ${className}`}
    >
      {children}
    </div>
  );
};
