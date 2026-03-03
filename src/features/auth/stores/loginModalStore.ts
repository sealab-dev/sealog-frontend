import { create } from 'zustand';

interface LoginModalState {
  isOpen: boolean;
  email: string;
  password: string;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  resetForm: () => void;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  isOpen: false,
  email: '',
  password: '',
  openLoginModal: () => set({ isOpen: true }),
  closeLoginModal: () => set({ isOpen: false, email: '', password: '' }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  resetForm: () => set({ email: '', password: '' }),
}));