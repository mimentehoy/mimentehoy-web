import Link from "next/link";
import fs from "fs";
import path from "path";
import { AdminAccessGate } from "@/components/auth-shell";

const readSubscribers = () => {
  const file = path.join(process.cwd(), "data", "newsletter-subscribers.json");
  if (!fs.existsSync(file)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

type Subscriber = {
  email: string;
  name?: string;
  created_at?: string;
  interests?: string[];
};

export default function AdminNewsletterPage() {
  const subscribers = readSubscribers() as Subscriber[];
  const total = subscribers.length;

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
            <div className="text-xs uppercase tracking-[0.16em] text-stone-500">Suscriptores</div>
            <div className="mt-3 text-3xl font-semibold text-stone-900">{total}</div>
          </div>
          <div className="section-shell p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-stone-500">Campaña</div>
            <div className="mt-3 text-xl font-semibold text-stone-900">Semana 1</div>
          </div>
          <div className="section-shell p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-stone-500">Estado</div>
            <div className="mt-3 text-xl font-semibold text-stone-900">Activa</div>
          </div>
        </div>

        <div className="mt-8 section-shell p-6">
          <h2 className="text-xl font-semibold text-stone-900">Últimos suscriptores</h2>
          <div className="mt-5 space-y-3">
            {subscribers.length === 0 ? (
              <p className="text-sm text-stone-600">Todavía no hay suscriptores guardados.</p>
            ) : (
              subscribers.map((subscriber) => (
                <div key={`${subscriber.email}-${subscriber.created_at ?? "no-date"}`} className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">{subscriber.name || "Sin nombre"}</div>
                    <div className="text-sm text-stone-600">{subscriber.email}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(subscriber.interests || []).map((interest: string) => (
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
