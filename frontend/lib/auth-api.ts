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
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api";

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function signupApi(payload: SignupPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await safeJson<{ detail?: string }>(response);
    throw new Error(data?.detail ?? "SIGNUP_FAILED");
  }
}

export async function loginApi(payload: LoginPayload) {
  const tokenResponse = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: payload.email,
      password: payload.password,
    }),
  });

  if (!tokenResponse.ok) {
    const data = await safeJson<{ detail?: string }>(tokenResponse);
    throw new Error(data?.detail ?? "INVALID_CREDENTIALS");
  }

  const tokenData = (await tokenResponse.json()) as TokenResponse;

  const meResponse = await fetch(`${API_BASE_URL}/auth/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenData.access}`,
    },
  });

  if (!meResponse.ok) {
    throw new Error("PROFILE_FETCH_FAILED");
  }

  const profile = (await meResponse.json()) as UserProfile;

  return {
    accessToken: tokenData.access,
    refreshToken: tokenData.refresh,
    user: {
      id: profile.id,
      name: profile.nickname,
      role: "teacher" as const,
    },
  };
}
