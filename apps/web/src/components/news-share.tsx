"use client";
import { useState, useSyncExternalStore } from "react";

function subscribeToMobile(callback: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const canShare = () => typeof navigator.share === "function" && window.matchMedia("(max-width: 767px)").matches;
const serverCanShare = () => false;

const icons: Record<string, string> = {
  X: "M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-7.5L5.2 22H2l7.4-8.5L1 2h6.5l4.4 6.9L18.9 2Zm-1.1 18h1.7L6.5 3.9H4.7L17.8 20Z",
  Facebook: "M14 22v-9h3l.5-4H14V6.5c0-1.2.3-2 2-2h2V1.1C17.7 1 16.5 1 15.2 1 12.4 1 10 2.7 10 6v3H7v4h3v9h4Z",
  WhatsApp: "M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2Zm0 2a8 8 0 1 1-4.3 14.7l-.4-.2-2.5.6.6-2.5-.3-.4A8 8 0 0 1 12 4Zm-3 3c-.5 0-1.5.7-1.5 2 0 2.7 4 6.5 6.8 6.5 1.3 0 2-.9 2-1.5l-2.5-1.3-.9 1c-1.2-.5-2.5-1.7-3-2.9l1-.8L9.7 7H9Z",
  LinkedIn: "M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM2 9h4v13H2V9Zm7 0h4v1.8c.6-1.2 1.8-2 3.5-2 3.5 0 4.5 2.2 4.5 5.2v8h-4v-7c0-1.8-.3-3-2-3s-2 1.5-2 3v7H9V9Z",
  Email: "M2 4h20v16H2V4Zm2 2v.5l8 6 8-6V6H4Zm16 3-8 6-8-6v9h16V9Z",
};
export function NewsShare({ title, description, url }: { title: string; description: string; url: string }) {
  const [status, setStatus] = useState("");
  const nativeShare = useSyncExternalStore(subscribeToMobile, canShare, serverCanShare);
  const links = {
    X: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=mimentehoy_`,
    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    WhatsApp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    Email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description} ${url}`)}`,
  };
  return <div className="news-sharing">
    <span className="news-share-label">Comparte esta lectura</span>
    <div className="news-share-actions">
      {Object.entries(links).map(([name, href]) => <a className="news-share-icon" key={name} href={href} aria-label={`Compartir por ${name}`} title={`Compartir por ${name}`} target={name === "Email" ? undefined : "_blank"} rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={icons[name]} /></svg></a>)}
      <button type="button" className="news-copy" onClick={async () => {
        try { await navigator.clipboard.writeText(url); setStatus("Enlace copiado"); }
        catch { setStatus(`Copia este enlace: ${url}`); }
      }}>Copiar enlace</button>
      {nativeShare && <button type="button" className="news-copy" onClick={async () => {
        try { await navigator.share({ title, text: description, url }); }
        catch (error) { if (!(error instanceof Error && error.name === "AbortError")) setStatus("No se ha podido compartir. Usa los enlaces o copia la dirección."); }
      }}>Compartir…</button>}
    </div>
    <span role="status" className="news-share-status">{status}</span>
  </div>;
}
