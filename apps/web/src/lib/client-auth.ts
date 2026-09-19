// Thin client-side helper around /api/auth/me — the session cookie itself
// is httpOnly, so client components can't read it directly and always go
// through this endpoint to find out who (if anyone) is logged in.

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  interests: string[];
};

export const fetchCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
};

export const logout = async () => {
  try {
    await fetch("/api/auth/login", { method: "DELETE" });
  } catch {
    // Best-effort — the cookie is httpOnly and short-lived either way.
  }
};
