import { AuthForm } from '@/components/organisms/AuthForm';
import { CompleteProfileGate } from '@/components/organisms/CompleteProfileGate';

export default function LoginPage() {
  return (
    <>
      <h1 className="text-xl mb-4 text-gray-950">Login</h1>
      <AuthForm  type="login" />
      <CompleteProfileGate />
    </>
  );
}
