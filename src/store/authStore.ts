import { create } from 'zustand';
import type { AuthProfile } from '../services/auth/types/auth.response';

interface AuthState {
  user: AuthProfile | null;
  isLoggedIn: boolean;
  isAuthReady: boolean;
  isLoginModalOpen: boolean;
  setUser: (user: AuthProfile) => void;
  clearUser: () => void;
  logout: () => void;
  setAuthReady: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isAuthReady: !localStorage.getItem('hasSession'),
  isLoginModalOpen: false,
  setUser: (user) => {
    localStorage.setItem('hasSession', '1');
    set({ user, isLoggedIn: true, isAuthReady: true });
  },
  clearUser: () => {
    localStorage.removeItem('hasSession');
    set({ user: null, isLoggedIn: false, isAuthReady: true });
  },
  logout: () => {
    localStorage.removeItem('hasSession');
    set({ user: null, isLoggedIn: false, isAuthReady: true });
  },
  setAuthReady: () => set({ isAuthReady: true }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
