export function StatValue({
  value,
  color = 'text-blue-600',
}: {
  value: number | string;
  color?: string;
}) {
  return (
    <p className={`text-2xl font-bold mt-2 ${color}`}>
      {value}
    </p>
  );
}
