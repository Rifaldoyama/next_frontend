import { AuthForm } from '@/components/organisms/AuthForm';

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-xl mb-4">Register</h1>
      <AuthForm type="register" />
    </>
  );
}
