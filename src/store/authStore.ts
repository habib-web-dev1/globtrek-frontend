import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isDemoAdmin: boolean;
  setAuth: (user: AuthUser, token: string, demoAdmin?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isDemoAdmin: false,
      setAuth: (user, token, demoAdmin = false) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("trek_token", token);
        }
        set({ user, token, isDemoAdmin: demoAdmin });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("trek_token");
        }
        set({ user: null, token: null, isDemoAdmin: false });
      },
    }),
    {
      name: "globetrek-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
