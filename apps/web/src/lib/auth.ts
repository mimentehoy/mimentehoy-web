export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  interests: string[];
  isAdmin?: boolean;
};

const STORAGE_KEY = "mimentehoy_users";
const SESSION_KEY = "mimentehoy_session";

const DEFAULT_USERS: StoredUser[] = [
  {
    id: "demo-admin",
    name: "Admin MIMENTEHOY",
    email: "admin@mimentehoy.com",
    password: "admin123",
    createdAt: new Date().toISOString(),
    interests: ["TDAH", "Crianza", "Sueño", "Emociones"],
    isAdmin: true,
  },
  {
    id: "demo-user",
    name: "Ana García",
    email: "ana@mimentehoy.com",
    password: "mimentehoy123",
    createdAt: new Date().toISOString(),
    interests: ["TDAH", "Sueño", "Crianza"],
    isAdmin: false,
  },
];

const ensureDemoUsers = (users: StoredUser[]) => {
  const merged = [...DEFAULT_USERS, ...users.filter((user) => !DEFAULT_USERS.some((seed) => seed.email.toLowerCase() === user.email.toLowerCase()))];
  return merged;
};

export const readUsers = (): StoredUser[] => {
  if (typeof window === "undefined") return DEFAULT_USERS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }

    const parsed = JSON.parse(raw) as StoredUser[];
    const normalized = ensureDemoUsers(Array.isArray(parsed) ? parsed : []);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
};

export const writeUsers = (users: StoredUser[]) => {
  if (typeof window === "undefined") return;
  const normalized = ensureDemoUsers(users);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
};

export const saveSession = (email: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loggedAt: new Date().toISOString() }));
};

export const getSession = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = () => {
  const session = getSession();
  if (!session?.email) return null;

  const users = readUsers();
  return users.find((user) => user.email.toLowerCase() === session.email.toLowerCase()) || null;
};
