"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

export default function NewsletterBajaPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "No se pudo procesar la baja.");
        setStatus("idle");
        return;
      }

      setStatus("done");
    } catch {
      setError("No se pudo contactar con el servidor. Inténtalo de nuevo.");
      setStatus("idle");
    }
  };

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="mx-auto max-w-lg section-shell p-6 text-center sm:p-8">
        <span className="soft-label">Newsletter</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Darse de baja</h1>

        {status === "done" ? (
          <>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Listo. Si ese email estaba en nuestra lista, ya no recibirá más newsletters de MIMENTEHOY.
            </p>
            <Link href="/" className="mt-6 inline-flex primary-button">Volver al inicio</Link>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Escribe el email con el que te suscribiste. Dejarás de recibir la newsletter de inmediato.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                required
                className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 text-sm outline-none focus:border-stone-500"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" className="primary-button w-full" disabled={status === "loading"}>
                {status === "loading" ? "Procesando…" : "Darme de baja"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
