"use client";

import { useAuthStore } from "@/store/auth-store";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const signup = useAuthStore((state) => state.signup);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return { user, accessToken, isLoggedIn, signup, login, logout };
};
