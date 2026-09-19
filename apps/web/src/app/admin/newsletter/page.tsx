import Link from "next/link";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { AdminAccessGate } from "@/components/auth-shell";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { prisma } from "@/lib/db";

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  interests: string[];
  createdAt: string;
  unsubscribedAt: string | null;
};

const readJsonFallback = (): Subscriber[] => {
  const file = path.join(process.cwd(), "data", "newsletter-subscribers.json");
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(data)) return [];
    return data.map((row: any, index: number) => ({
      id: `fallback-${index}`,
      email: row.email,
      name: row.name || null,
      interests: Array.isArray(row.interests) ? row.interests : [],
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      unsubscribedAt: null,
    }));
  } catch {
    return [];
  }
};

export default async function AdminNewsletterPage() {
  // Server-side gate BEFORE reading any subscriber data: AdminAccessGate below
  // only decides what to *render* on the client, but a Server Component's
  // output (including anything passed as children) still ships to the
  // browser in the RSC payload regardless of what the client chooses to
  // paint. Subscriber emails are personal data, so they must never be read
  // into that payload unless the request actually carries a valid admin
  // session cookie.
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const isAdmin = session?.role === "ADMIN";

  let subscribers: Subscriber[] = [];
  if (isAdmin) {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
        subscribers = rows.map((row) => ({
          id: row.id,
          email: row.email,
          name: row.name,
          interests: row.interests,
          createdAt: row.createdAt.toISOString(),
          unsubscribedAt: row.unsubscribedAt ? row.unsubscribedAt.toISOString() : null,
        }));
      } catch {
        subscribers = [];
      }
    } else {
      subscribers = readJsonFallback();
    }
  }

  const total = subscribers.length;
  const active = subscribers.filter((s) => !s.unsubscribedAt).length;
  const unsubscribed = total - active;

  return (
    <AdminAccessGate>
      <main className="container-shell py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="soft-label">Admin / Newsletter</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Newsletter</h1>
          </div>
          <Link href="/admin" className="secondary-button">Volver</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="section-shell p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-stone-500">Total</div>
            <div className="mt-3 text-3xl font-semibold text-stone-900">{total}</div>
          </div>
          <div className="section-shell p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-stone-500">Activos</div>
            <div className="mt-3 text-3xl font-semibold text-stone-900">{active}</div>
          </div>
          <div className="section-shell p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-stone-500">Bajas</div>
            <div className="mt-3 text-3xl font-semibold text-stone-900">{unsubscribed}</div>
          </div>
        </div>

        <div className="mt-8 section-shell p-6">
          <h2 className="text-xl font-semibold text-stone-900">Suscriptores</h2>
          <div className="mt-5 space-y-3">
            {subscribers.length === 0 ? (
              <p className="text-sm text-stone-600">Todavía no hay suscriptores guardados.</p>
            ) : (
              subscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{subscriber.name || "Sin nombre"}</span>
                      {subscriber.unsubscribedAt && (
                        <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-red-700">
                          Baja
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-stone-600">{subscriber.email}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subscriber.interests.map((interest) => (
                      <span key={interest} className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-stone-600">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </AdminAccessGate>
  );
}
