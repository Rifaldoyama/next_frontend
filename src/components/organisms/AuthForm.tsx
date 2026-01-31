'use client';

import { Button } from '../atoms/Buttons';
import { AuthField } from '../molecules/AuthField';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import clsx from 'clsx';

type AuthFormProps = {
  type: 'login' | 'register';
  className?: string;
};

export function AuthForm({ type, className }: AuthFormProps) {
  const { submit, loading, error } = useAuth(type);
  const [form, setForm] = useState<Record<string, string>>({});

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(form);
      }}
      className={clsx('space-y-4', className)}
    >
      {type === 'register' && (
        <AuthField
          label="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />
      )}

      <AuthField
        label="Email"
        type="email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <AuthField
        label="Password"
        type="password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button disabled={loading}>
        {loading
          ? 'Loading...'
          : type === 'login'
          ? 'Login'
          : 'Register'}
      </Button>
    </form>
  );
}
