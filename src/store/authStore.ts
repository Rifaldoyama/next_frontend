import { create } from "zustand";

export type Role = "ADMIN" | "PETUGAS" | "USER";

type User = {
  id: string;
  email: string;
  username: string;
  role: Role;
  is_lengkap: boolean;
  need_profile: boolean;
  detail?: {
    nama_lengkap: string;
    no_hp: string;
    alamat: string;
    verification_status: string;
  };
};

type AuthState = {
  user: User | null;
  token: string | null;
  initialized: boolean;
  profileGateSeen: boolean;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  markProfileGateSeen: () => void;
  finishInit: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  initialized: false,
  profileGateSeen: false, // Default awal false

  setAuth: (user, token) =>
    set({
      user,
      token,
      initialized: true,
      // Jangan set profileGateSeen di sini agar tidak tertimpa saat fetch /me
    }),

  setUser: (user) => set({ user }),

  markProfileGateSeen: () => {
    // Simpan ke browser agar saat refresh tidak muncul lagi
    sessionStorage.setItem("gate_seen", "true");
    set({ profileGateSeen: true });
  },

  finishInit: () => {
    // Saat aplikasi start/refresh, cek apakah user sudah pernah skip/buka modal
    const seen = sessionStorage.getItem("gate_seen") === "true";
    set({ initialized: true, profileGateSeen: seen });
  },

  logout: () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("gate_seen");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sewa-draft-storage")) {
        localStorage.removeItem(key);
      }
    });
    set({
      user: null,
      token: null,
      initialized: true,
      profileGateSeen: false,
    });
  },
}));
