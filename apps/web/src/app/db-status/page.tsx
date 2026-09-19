"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DbStatusPage() {
  const [status, setStatus] = useState<{ ok: boolean; database: string; message?: string; detail?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/db-status", { cache: "no-store" });
        const data = await res.json();
        setStatus(data);
      } catch {
        setStatus({ ok: false, database: "error", message: "No se pudo contactar con el endpoint de estado." });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="mx-auto max-w-2xl section-shell p-8">
        <span className="soft-label">Infraestructura</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Estado de la base de datos</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Esta vista permite comprobar si la app tiene una conexión real a la base de datos de Hostinger o si está esperando por <code>DATABASE_URL</code>.
        </p>

        <div className="mt-6 space-y-4 text-sm text-stone-700">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <strong>Endpoint:</strong> <code>/api/db-status</code>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <strong>Objetivo:</strong> detectar si la conexión está disponible antes de desplegar la V1 final.
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <strong>Resultado:</strong>
            {loading ? (
              <span className="ml-2 text-stone-500">Comprobando…</span>
            ) : (
              <span className={`ml-2 font-semibold ${status?.ok ? "text-green-700" : "text-red-700"}`}>
                {status?.ok ? "Conectado" : "No configurada / no disponible"}
              </span>
            )}
          </div>
        </div>

        {status && (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
            <div><strong>Estado:</strong> {status.database}</div>
            <div className="mt-2"><strong>Mensaje:</strong> {status.message || "Sin mensaje adicional."}</div>
            {status.detail && <div className="mt-2"><strong>Detalle:</strong> {status.detail}</div>}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link href="/admin" className="primary-button">Volver al admin</Link>
          <Link href="/" className="secondary-button">Inicio</Link>
        </div>
      </div>
    </main>
  );
}
