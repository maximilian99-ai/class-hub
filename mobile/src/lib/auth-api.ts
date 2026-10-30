import axios, { AxiosError } from "axios";

type SignupPayload = {
  nickname: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type UserProfile = {
  id: string;
  nickname: string;
  email: string;
};

type TokenResponse = {
  access: string;
  refresh: string;
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
});

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function signupApi(payload: SignupPayload) {
  try {
    const response = await api.post("/auth/signup/", payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail ?? "SIGNUP_FAILED");
    }
    throw error;
  }
}

export async function loginApi(payload: LoginPayload) {
  try {
    const tokenResponse = await api.post<TokenResponse>("/auth/token/", {
      username: payload.email,
      password: payload.password
    });
    
    const tokenData = tokenResponse.data;

    const meResponse = await api.get<UserProfile>("/auth/me/", {
      headers: {
        Authorization: `Bearer ${tokenData.access}`
      }
    });

    const profile = meResponse.data;

    return {
      accessToken: tokenData.access,
      refreshToken: tokenData.refresh,
      user: {
        id: profile.id,
        name: profile.nickname,
        role: "teacher" as const
      }
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.config?.url?.includes("/auth/token/")) {
        throw new Error(error.response?.data?.detail ?? "INVALID_CREDENTIALS");
      }
      if (error.config?.url?.includes("/auth/me/")) {
        throw new Error("PROFILE_FETCH_FAILED");
      }
    }
    throw error;
  }
}
