import { Input } from '../atoms/Input';

export function AuthField({
  label,
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-amber-950">{label}</label>
      <Input className='text-black' {...props} />
    </div>
  );
}
