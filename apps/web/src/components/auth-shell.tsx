'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { clearSession, getCurrentUser, readUsers, saveSession, writeUsers } from "@/lib/auth";

const DEFAULT_INTERESTS = ["TDAH", "Sueño", "Crianza", "Emociones"];

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const isAdmin = Boolean(currentUser?.isAdmin);

  if (!currentUser) {
    return (
      <main className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl section-shell p-8 text-center">
          <span className="soft-label">Acceso restringido</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Necesitas permisos de administrador</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Inicia sesión con la cuenta administrativa para gestionar artículos, recursos, usuarios y newsletter.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => router.push("/login")} className="primary-button">Ir al login</button>
            <Link href="/" className="secondary-button">Inicio</Link>
          </div>
          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left text-sm text-stone-700">
            <div className="font-semibold text-stone-900">Credenciales demo</div>
            <div className="mt-2">Email: admin@mimentehoy.com</div>
            <div>Contraseña: admin123</div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl section-shell p-8 text-center">
          <span className="soft-label">Acceso restringido</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Necesitas permisos de administrador</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Inicia sesión con la cuenta administrativa para gestionar artículos, recursos, usuarios y newsletter.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => router.push("/login")} className="primary-button">Ir al login</button>
            <Link href="/" className="secondary-button">Inicio</Link>
          </div>
          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left text-sm text-stone-700">
            <div className="font-semibold text-stone-900">Credenciales demo</div>
            <div className="mt-2">Email: admin@mimentehoy.com</div>
            <div>Contraseña: admin123</div>
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const users = readUsers();
    const match = users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);

    if (!match) {
      setError("No encontramos ese usuario o la contraseña no coincide.");
      return;
    }

    saveSession(match.email);
    router.push("/mi-mimentehoy");
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
        <button type="submit" className="primary-button w-full">Entrar</button>
      </form>

      <div className="mt-5 text-center text-sm text-stone-600">
        ¿No tienes cuenta? <Link href="/registro" className="font-semibold text-[#7a4a35]">Regístrate</Link>
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
        <div className="font-semibold text-stone-900">Cuentas demo</div>
        <div className="mt-2">Admin: admin@mimentehoy.com / admin123</div>
        <div>User: ana@mimentehoy.com / mimentehoy123</div>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const users = readUsers();

    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      setError("Ya existe una cuenta con ese email.");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      interests: DEFAULT_INTERESTS,
    };

    writeUsers([...users, newUser]);
    saveSession(email);
    router.push("/mi-mimentehoy");
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
            minLength={6}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="primary-button w-full">Crear cuenta</button>
      </form>

      <div className="mt-5 text-center text-sm text-stone-600">
        ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-[#7a4a35]">Inicia sesión</Link>
      </div>
    </div>
  );
}

export function AccountPanel() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const [user] = useState<{ name: string; email: string; interests: string[]; isAdmin?: boolean } | null>(() =>
    currentUser ? { name: currentUser.name, email: currentUser.email, interests: currentUser.interests, isAdmin: currentUser.isAdmin } : null,
  );

  if (!user) {
    return (
      <div className="mx-auto max-w-xl section-shell p-6 sm:p-8 text-center">
        <h1 className="text-3xl font-semibold text-stone-900">No has iniciado sesión</h1>
        <p className="mt-3 text-stone-600">Accede o crea una cuenta para ver tu panel.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/login" className="primary-button">Iniciar sesión</Link>
          <Link href="/registro" className="secondary-button">Registrarme</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="soft-label">Mi MIMENTEHOY</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Tu espacio personal</h1>
        </div>
        <div className="flex gap-3">
          {user.isAdmin && <Link href="/admin" className="primary-button">Ir al admin</Link>}
          <button onClick={handleLogout} className="secondary-button">Cerrar sesión</button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="section-shell p-5 md:col-span-2">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">Perfil</div>
          <h2 className="mt-3 text-2xl font-semibold text-stone-900">{user.name}</h2>
          <p className="mt-2 text-sm text-stone-600">{user.email}</p>
          {user.isAdmin && <p className="mt-3 text-sm font-medium text-[#7a4a35]">Cuenta de administrador</p>}
        </div>

        <div className="section-shell p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">Intereses</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span key={interest} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {[
          { title: "Mis recursos", description: "Recursos descargados y guardados" },
          { title: "Mis descargas", description: "Archivos y plantillas disponibles" },
          { title: "Mis favoritos", description: "Artículos y recursos guardados" },
          { title: "Mis intereses", description: "TDAH, sueño, crianza, emociones" },
          { title: "Mi cuenta", description: "Detalles del perfil" },
          { title: "Newsletter", description: "Estado de suscripción" },
        ].map((card) => (
          <div key={card.title} className="section-shell p-5">
            <h2 className="text-xl font-semibold text-stone-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{card.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
