"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export function AdminUsersList({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string | null }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;

    setError("");
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "No se pudo eliminar el usuario.");
        return;
      }
      router.refresh();
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setPendingId(null);
    }
  };

  if (users.length === 0) {
    return <div className="section-shell p-6 text-stone-600">Todavía no hay usuarios registrados.</div>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {users.map((user) => (
        <div key={user.id} className="section-shell flex items-center justify-between gap-3 p-5">
          <div>
            <div className="text-lg font-semibold text-stone-900">{user.name}</div>
            <div className="text-sm text-stone-600">{user.role === "ADMIN" ? "Administrador" : "Usuario"}</div>
            <div className="text-xs text-stone-500">{user.email}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">
              {user.createdAt.slice(0, 10)}
            </span>
            {user.id !== currentUserId && (
              <button
                onClick={() => handleDelete(user.id)}
                disabled={pendingId === user.id}
                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
              >
                {pendingId === user.id ? "Eliminando…" : "Eliminar"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
