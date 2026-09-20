"use client";
import { useState } from "react";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          interests: [],
          consent,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
        setConsent(false);
      } else {
        setStatus("error");
        console.error("Newsletter submission failed:", data);
      }
    } catch (err) {
      setStatus("error");
      console.error("Newsletter error:", err);
    }
  };

  return (
    <div className="section-shell bg-[#efe4d7] p-6 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="soft-label">Newsletter</span>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Recibe ideas útiles cada semana</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-700">
          Mensajes sencillos, claros y útiles para familias que buscan soluciones reales sin ruido.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-2xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 text-sm outline-none placeholder:text-stone-400 focus:border-stone-500 sm:flex-1"
          />

          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            required
            className="h-12 rounded-full border border-stone-300 bg-white px-4 text-sm outline-none placeholder:text-stone-400 focus:border-stone-500 sm:flex-1"
            aria-label="Email"
          />

          <button type="submit" className="primary-button h-12 shrink-0" disabled={status === "loading"}>
            {status === "loading" ? "Enviando…" : "Suscribirme"}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-stone-600">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
            Acepto recibir la newsletter y doy mi consentimiento (RGPD).
          </label>
        </div>

        {status === "success" && <div className="mt-3 text-center text-sm font-semibold text-green-700">¡Gracias! Revisa tu bandeja de entrada.</div>}
        {status === "error" && <div className="mt-3 text-center text-sm font-semibold text-red-700">Hubo un error. Por favor, inténtalo de nuevo.</div>}
      </form>
    </div>
  );
}
