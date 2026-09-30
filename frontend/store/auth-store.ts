"use client";

import { create } from "zustand";
import { loginApi, signupApi } from "@/lib/auth-api";

type User = {
  id: string;
  name: string;
  role: "teacher" | "instructor";
};

type AuthActionResult = {
  ok: boolean;
  error?: "EMAIL_EXISTS" | "INVALID_CREDENTIALS";
  message?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  signup: (payload: {
    nickname: string;
    email: string;
    password: string;
    role?: "teacher" | "instructor";
  }) => Promise<AuthActionResult>;
  login: (payload: { email: string; password: string }) => Promise<AuthActionResult>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  signup: async ({ nickname, email, password }) => {
    try {
      await signupApi({ nickname, email, password });
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "SIGNUP_FAILED";
      if (message.includes("exists")) {
        return { ok: false, error: "EMAIL_EXISTS", message };
      }
      return { ok: false, error: "INVALID_CREDENTIALS", message };
    }
  },
  login: async ({ email, password }) => {
    try {
      const session = await loginApi({ email, password });
      set({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        isLoggedIn: true,
      });
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "LOGIN_FAILED";
      return { ok: false, error: "INVALID_CREDENTIALS", message };
    }
  },
  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    }),
}));
