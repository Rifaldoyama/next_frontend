import { create } from 'zustand';

type Role = 'ADMIN' | 'PETUGAS' | 'USER';

type User = {
  id: string;
  email: string;
  username: string;
  role: Role;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isComplete: boolean;
  initialized: boolean;
  setAuth: (user: User, token: string | null, isComplete: boolean) => void;
  finishInit: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isComplete: true,
  initialized: false,

  setAuth: (user, token, isComplete) =>
    set({ user, token, isComplete, initialized: true }),

  finishInit: () => set({ initialized: true }),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isComplete: true, initialized: true });
  },

}));

