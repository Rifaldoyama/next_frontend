export function Button({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-blue-600 text-white p-2 rounded w-full ${className}`}
    >
      {children}
    </button>
  );
}
