import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
  avatarColor: string | null;
  setAuth: (token: string, userId: string, username: string, avatarColor: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  username: null,
  avatarColor: null,
  setAuth: (token, userId, username, avatarColor) => set({ token, userId, username, avatarColor }),
  clearAuth: () => set({ token: null, userId: null, username: null, avatarColor: null }),
}));
