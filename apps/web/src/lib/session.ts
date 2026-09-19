import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Real, DB-backed session handling — replaces both the old localStorage-only
// demo auth (src/lib/auth.ts, now removed) and the single-admin,
// env-var-only cookie this project used as a stopgap (see git history:
// "fix: close open write access + PII leak on admin CMS routes"). Any User
// row can now log in; whether they can reach the admin CMS is decided by
// User.role, not by a separate credential.

export const SESSION_COOKIE = "mh_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const getSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no está configurada.");
  }
  return secret;
};

// --- Password hashing (Node's built-in scrypt — no extra dependency) ---

export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifyPassword = (password: string, stored: string): boolean => {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const derivedKey = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(hashHex, "hex");
  if (derivedKey.length !== storedKey.length) return false;

  return timingSafeEqual(derivedKey, storedKey);
};

// --- Session tokens (signed cookie, no server-side session store needed) ---

export type SessionPayload = {
  userId: string;
  role: "USER" | "ADMIN";
};

const sign = (value: string) => createHmac("sha256", getSecret()).update(value).digest("hex");

export const createSessionToken = ({ userId, role }: SessionPayload): string => {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}.${role}.${expires}`;
  return `${payload}.${sign(payload)}`;
};

export const verifySessionToken = (token: string | undefined | null): SessionPayload | null => {
  if (!token) return null;

  const [userId, role, expiresRaw, signature] = token.split(".");
  if (!userId || !role || !expiresRaw || !signature) return null;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || Date.now() > expires) return null;

  let expectedSignature: string;
  try {
    expectedSignature = sign(`${userId}.${role}.${expiresRaw}`);
  } catch {
    return null;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  if (role !== "USER" && role !== "ADMIN") return null;
  return { userId, role };
};

/** True when the request carries a valid session for a User with role ADMIN. */
export const isAdminRequest = (req: Request): boolean => getSessionFromRequest(req)?.role === "ADMIN";

/** Reads the session straight from a Request's Cookie header — for Route Handlers, which get a raw Request rather than next/headers. */
export const getSessionFromRequest = (req: Request): SessionPayload | null => {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

  if (!match) return null;
  return verifySessionToken(decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)));
};
