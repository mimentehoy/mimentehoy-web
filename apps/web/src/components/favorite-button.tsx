"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function FavoriteButton({ targetType, targetId }: { targetType: "article" | "resource"; targetId: string }) {
  const [status, setStatus] = useState<"loading" | "guest" | "idle" | "saving">("loading");
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    fetch(`/api/favorites?targetType=${targetType}&targetId=${targetId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setFavorited(Boolean(data.favorited));
        setStatus("idle");
      })
      .catch(() => setStatus("idle"));
  }, [targetType, targetId]);

  const toggle = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });

      if (res.status === 401) {
        setStatus("guest");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setFavorited(Boolean(data.favorited));
      setStatus("idle");
    } catch {
      setStatus("idle");
    }
  };

  if (status === "guest") {
    return (
      <Link href="/login" className="secondary-button">
        Inicia sesión para guardar
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={status === "loading" || status === "saving"}
      className="secondary-button"
      aria-pressed={favorited}
    >
      {favorited ? "★ Guardado en favoritos" : "☆ Guardar en favoritos"}
    </button>
  );
}
