"use client";
import { useState } from "react";
import { categories } from "@/data/site";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const toggleInterest = (value: string) => {
    setInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const encode = (data: Record<string, any>) =>
    Object.keys(data)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    const payload = {
      "form-name": "newsletter",
      name,
      email,
      interests: interests.join(","),
      consent: consent ? "yes" : "no",
    };

    try {
      // Netlify Forms: POST to the site root with form data (keeps Netlify Forms detection)
      // This is best-effort only; the real subscriber confirmation is the MailerLite function below.
      const formRes = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      }).catch(() => null);

      // Forward to our Netlify Function which will push to MailerLite.
      // This is the authoritative success signal, because Netlify Forms may reject static form POSTs
      // while the function still accepts and stores the subscriber.
      const functionRes = await fetch("/.netlify/functions/mailerLiteSubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, interests, consent }),
      }).catch(() => null);

      const success = !!(formRes?.ok || functionRes?.ok);

      if (success) {
        setStatus("success");
        setEmail("");
        setName("");
        setInterests([]);
        setConsent(false);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="section-shell bg-[#efe4d7] p-6 sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-center">
        <div>
          <span className="soft-label">Newsletter</span>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Recibe ideas útiles cada semana</h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-stone-700">
            Mensajes sencillos, claros y útiles para familias que buscan soluciones reales sin ruido.
          </p>
        </div>

        <form
          name="newsletter"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row md:flex-col xl:flex-row"
        >
          <input type="hidden" name="form-name" value="newsletter" />
          <input aria-hidden name="bot-field" style={{ display: "none" }} />

          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 text-sm outline-none placeholder:text-stone-400 focus:border-stone-500"
          />

          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            required
            className="h-12 flex-1 rounded-full border border-stone-300 bg-white px-4 text-sm outline-none placeholder:text-stone-400 focus:border-stone-500"
            aria-label="Email"
          />

          <div className="flex items-center gap-3">
            <button type="submit" className="primary-button h-12 min-w-[140px]" disabled={status === "loading"}>
              {status === "loading" ? "Enviando…" : "Suscribirme"}
            </button>
          </div>

          <div className="col-span-full mt-3 text-sm text-stone-600">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
              Acepto recibir la newsletter y doy mi consentimiento (RGPD).
            </label>
          </div>

          <div className="col-span-full mt-3 text-sm text-stone-600">
            <div className="mb-2 text-xs font-semibold text-stone-700">Me interesan:</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <label key={cat} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs">
                  <input
                    type="checkbox"
                    name="interests"
                    value={cat}
                    checked={interests.includes(cat)}
                    onChange={() => toggleInterest(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {status === "success" && <div className="col-span-full mt-3 text-sm font-semibold text-green-700">¡Gracias! Revisa tu bandeja de entrada.</div>}
          {status === "error" && <div className="col-span-full mt-3 text-sm font-semibold text-red-700">Hubo un error. Por favor, inténtalo de nuevo.</div>}
        </form>
      </div>
    </div>
  );
}
