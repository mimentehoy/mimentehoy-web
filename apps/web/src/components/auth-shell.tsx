'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { categories } from "@/data/site";
import { type CurrentUser, fetchCurrentUser, logout } from "@/lib/client-auth";

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "guest" | "not-admin" | "admin">("loading");

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (!user) setStatus("guest");
      else if (user.role !== "ADMIN") setStatus("not-admin");
      else setStatus("admin");
    });
  }, []);

  if (status === "loading") {
    return (
      <main className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl section-shell p-8 text-center text-sm text-stone-500">Comprobando sesión…</div>
      </main>
    );
  }

  if (status === "guest" || status === "not-admin") {
    return (
      <main className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl section-shell p-8 text-center">
          <span className="soft-label">Acceso restringido</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Necesitas permisos de administrador</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Inicia sesión con una cuenta de administrador para gestionar artículos, recursos, usuarios y newsletter.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => router.push("/login")} className="primary-button">Ir al login</button>
            <Link href="/" className="secondary-button">Inicio</Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "No se pudo iniciar sesión.");
        return;
      }

      router.push("/mi-mimentehoy");
      router.refresh();
    } catch {
      setError("No se pudo contactar con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl section-shell p-6 sm:p-8">
      <span className="soft-label">Login</span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Bienvenido de nuevo</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="primary-button w-full" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-stone-600">
        ¿No tienes cuenta? <Link href="/registro" className="font-semibold text-[#7a4a35]">Regístrate</Link>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (value: string) => {
    setInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, interests }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "No se pudo crear la cuenta.");
        return;
      }

      router.push("/mi-mimentehoy");
      router.refresh();
    } catch {
      setError("No se pudo contactar con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl section-shell p-6 sm:p-8">
      <span className="soft-label">Registro</span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Crea tu cuenta</h1>
      <p className="mt-2 text-sm leading-6 text-stone-600">Empieza con lo básico: nombre, email y contraseña.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500"
            minLength={8}
            required
          />
          <p className="mt-1 text-xs text-stone-500">Mínimo 8 caracteres.</p>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-stone-700">¿Qué te interesa? (opcional)</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label key={cat} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs">
                <input type="checkbox" checked={interests.includes(cat)} onChange={() => toggleInterest(cat)} />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="primary-button w-full" disabled={loading}>
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-stone-600">
        ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-[#7a4a35]">Inicia sesión</Link>
      </div>
    </div>
  );
}

export function AccountPanel() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null | undefined>(undefined);

  useEffect(() => {
    fetchCurrentUser().then(setUser);
  }, []);

  if (user === undefined) {
    return (
      <main className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl section-shell p-8 text-center text-sm text-stone-500">Comprobando sesión…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl section-shell p-6 sm:p-8 text-center">
          <h1 className="text-3xl font-semibold text-stone-900">No has iniciado sesión</h1>
          <p className="mt-3 text-stone-600">Accede o crea una cuenta para ver tu panel.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/login" className="primary-button">Iniciar sesión</Link>
            <Link href="/registro" className="secondary-button">Registrarme</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="soft-label">Mi MIMENTEHOY</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Tu espacio personal</h1>
        </div>
        <div className="flex gap-3">
          {user.role === "ADMIN" && <Link href="/admin" className="primary-button">Ir al admin</Link>}
          <button onClick={handleLogout} className="secondary-button">Cerrar sesión</button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="section-shell p-5 md:col-span-2">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">Perfil</div>
          <h2 className="mt-3 text-2xl font-semibold text-stone-900">{user.name}</h2>
          <p className="mt-2 text-sm text-stone-600">{user.email}</p>
          {user.role === "ADMIN" && <p className="mt-3 text-sm font-medium text-[#7a4a35]">Cuenta de administrador</p>}
        </div>

        <div className="section-shell p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">Intereses</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {user.interests.length === 0 && <span className="text-sm text-stone-500">Sin intereses guardados todavía.</span>}
            {user.interests.map((interest) => (
              <span key={interest} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <FavoritesCard />
        <DownloadsCard />
        <NewsletterCard status={user.newsletterStatus} />
        <ChangePasswordCard />
      </div>
    </main>
  );
}

type FavoriteEntry = { targetType: string; targetId: string; title: string; slug: string; createdAt: string };

function FavoritesCard() {
  const [favorites, setFavorites] = useState<FavoriteEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/favorites", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setFavorites(Array.isArray(data.favorites) ? data.favorites : []))
      .catch(() => setFavorites([]));
  }, []);

  return (
    <div className="section-shell p-5">
      <h2 className="text-xl font-semibold text-stone-900">Mis favoritos</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">Artículos y recursos guardados</p>

      {favorites === null && <p className="mt-3 text-sm text-stone-500">Cargando…</p>}
      {favorites?.length === 0 && <p className="mt-3 text-sm text-stone-500">Todavía no has guardado nada.</p>}

      <ul className="mt-3 space-y-2">
        {favorites?.map((fav) => (
          <li key={`${fav.targetType}-${fav.targetId}`}>
            <Link
              href={fav.targetType === "article" ? `/articulos/${fav.slug}` : `/recursos/${fav.slug}`}
              className="text-sm font-medium text-[#0f7290] hover:underline"
            >
              {fav.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type DownloadEntry = { resourceId: string; title: string; slug: string; createdAt: string };

function DownloadsCard() {
  const [downloads, setDownloads] = useState<DownloadEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/downloads", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setDownloads(Array.isArray(data.downloads) ? data.downloads : []))
      .catch(() => setDownloads([]));
  }, []);

  return (
    <div className="section-shell p-5">
      <h2 className="text-xl font-semibold text-stone-900">Mis descargas</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">Historial de recursos descargados</p>

      {downloads === null && <p className="mt-3 text-sm text-stone-500">Cargando…</p>}
      {downloads?.length === 0 && <p className="mt-3 text-sm text-stone-500">Todavía no has descargado nada.</p>}

      <ul className="mt-3 space-y-2">
        {downloads?.map((dl, index) => (
          <li key={`${dl.resourceId}-${index}`}>
            <Link href={`/recursos/${dl.slug}`} className="text-sm font-medium text-[#0f7290] hover:underline">
              {dl.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterCard({ status }: { status: CurrentUser["newsletterStatus"] }) {
  return (
    <div className="section-shell p-5">
      <h2 className="text-xl font-semibold text-stone-900">Newsletter</h2>
      {status === "subscribed" && (
        <>
          <p className="mt-2 text-sm leading-6 text-stone-600">Estás suscrito a la newsletter.</p>
          <Link href="/newsletter/baja" className="mt-3 inline-block text-sm font-semibold text-[#7a4a35]">
            Darme de baja →
          </Link>
        </>
      )}
      {status === "unsubscribed" && (
        <>
          <p className="mt-2 text-sm leading-6 text-stone-600">Te diste de baja de la newsletter.</p>
          <Link href="/newsletter" className="mt-3 inline-block text-sm font-semibold text-[#7a4a35]">
            Volver a suscribirme →
          </Link>
        </>
      )}
      {status === "none" && (
        <>
          <p className="mt-2 text-sm leading-6 text-stone-600">Todavía no estás suscrito.</p>
          <Link href="/newsletter" className="mt-3 inline-block text-sm font-semibold text-[#7a4a35]">
            Suscribirme →
          </Link>
        </>
      )}
    </div>
  );
}

function ChangePasswordCard() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "No se pudo cambiar la contraseña.");
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("No se pudo contactar con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <div className="section-shell p-5">
        <h2 className="text-xl font-semibold text-stone-900">Mi cuenta</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">Detalles del perfil</p>
        <button onClick={() => setOpen(true)} className="mt-4 text-sm font-semibold text-[#7a4a35]">
          Cambiar contraseña →
        </button>
      </div>
    );
  }

  return (
    <div className="section-shell p-5">
      <h2 className="text-xl font-semibold text-stone-900">Cambiar contraseña</h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="password"
          placeholder="Contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="h-11 w-full rounded-full border border-stone-300 bg-white px-4 text-sm outline-none focus:border-stone-500"
          required
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          className="h-11 w-full rounded-full border border-stone-300 bg-white px-4 text-sm outline-none focus:border-stone-500"
          required
        />
        <input
          type="password"
          placeholder="Repite la nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          className="h-11 w-full rounded-full border border-stone-300 bg-white px-4 text-sm outline-none focus:border-stone-500"
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm font-medium text-green-700">Contraseña actualizada.</p>}

        <div className="flex gap-2">
          <button type="submit" className="primary-button flex-1" disabled={loading}>
            {loading ? "Guardando…" : "Guardar"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="secondary-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
