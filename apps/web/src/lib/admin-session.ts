import { createHmac, timingSafeEqual } from "crypto";

// Minimal signed-cookie session for the admin CMS API routes.
//
// This exists because the current account system (src/lib/auth.ts) is a
// client-only localStorage demo with no server component at all — which
// means the /api/admin/* write routes had no way to verify a request came
// from an admin. Real multi-user sessions belong on top of the Hostinger
// Postgres DB (see PROJECT_PLAN.md, pending decision), but content-write
// endpoints shouldn't stay open in the meantime, so this covers just that.

export const ADMIN_SESSION_COOKIE = "mh_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

const getSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET no está configurada.");
  }
  return secret;
};

const sign = (value: string) => createHmac("sha256", getSecret()).update(value).digest("hex");

export const createAdminSessionToken = (email: string) => {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${email}.${expires}`;
  return `${payload}.${sign(payload)}`;
};

export const verifyAdminSessionToken = (token: string | undefined | null): boolean => {
  if (!token) return false;

  const [email, expiresRaw, signature] = token.split(".");
  if (!email || !expiresRaw || !signature) return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const expectedAdminEmail = process.env.ADMIN_EMAIL;
  if (!expectedAdminEmail || email.toLowerCase() !== expectedAdminEmail.toLowerCase()) return false;

  let expectedSignature: string;
  try {
    expectedSignature = sign(`${email}.${expiresRaw}`);
  } catch {
    return false;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
};

/** Reads the session cookie straight from a Request's Cookie header (no next/headers dependency, so it works in any route handler). */
export const isAdminRequest = (req: Request): boolean => {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));

  if (!match) return false;
  const token = decodeURIComponent(match.slice(ADMIN_SESSION_COOKIE.length + 1));
  return verifyAdminSessionToken(token);
};
