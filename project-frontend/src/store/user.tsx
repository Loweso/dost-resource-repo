import { create } from "zustand";

interface UserState {
  userId: string | null;
  email: string | null;
  role: string | null;
  isLoggedIn: boolean;
  setUser: (user: { userId: string; email: string; role: string }) => void;
  clearUser: () => void;
}

export const UserStore = create<UserState>((set) => ({
  userId: null,
  email: null,
  role: null,
  isLoggedIn: false,
  setUser: ({ userId, email, role }) =>
    set({ userId, email, role, isLoggedIn: true }),
  clearUser: () =>
    set({ userId: null, email: null, role: null, isLoggedIn: false }),
}));
