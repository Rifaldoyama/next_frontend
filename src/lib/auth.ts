import { apiFetch } from './api';

export function login(payload: {
  email: string;
  password: string;
}) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function register(payload: {
  username: string;
  email: string;
  password: string;
}) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
