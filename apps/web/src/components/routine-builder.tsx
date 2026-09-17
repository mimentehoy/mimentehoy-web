"use client";

import { useEffect, useMemo, useState } from "react";

type RoutineItem = {
  id: string;
  label: string;
  icon: string;
};

const defaultTasks: RoutineItem[] = [
  { id: "1", label: "Levantarse", icon: "☀️" },
  { id: "2", label: "Vestirse", icon: "👕" },
  { id: "3", label: "Desayunar", icon: "🥐" },
  { id: "4", label: "Lavarse los dientes", icon: "🪥" },
  { id: "5", label: "Preparar mochila", icon: "🎒" },
  { id: "6", label: "Colegio", icon: "📚" },
  { id: "7", label: "Comer", icon: "🍽️" },
  { id: "8", label: "Deberes", icon: "✏️" },
  { id: "9", label: "Ducha", icon: "🚿" },
  { id: "10", label: "Cena", icon: "🍲" },
  { id: "11", label: "Dormir", icon: "🌙" },
];

const icons = ["☀️", "🌤️", "🧼", "🎒", "📚", "🍽️", "✏️", "🚿", "🌙", "🧸", "✅", "💧"];

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function RoutineBuilder() {
  const [tasks, setTasks] = useState<RoutineItem[]>(defaultTasks);
  const [newTask, setNewTask] = useState("");
  const [title, setTitle] = useState("Mi rutina visual");

  useEffect(() => {
    const saved = window.localStorage.getItem("mimentehoy-routine");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { title?: string; tasks?: RoutineItem[] };
      if (parsed.title) setTitle(parsed.title);
      if (parsed.tasks?.length) setTasks(parsed.tasks);
    } catch {
      // ignore invalid local storage
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "mimentehoy-routine",
      JSON.stringify({
        title,
        tasks,
      })
    );
  }, [tasks, title]);

  const totalSteps = useMemo(() => tasks.length, [tasks]);

  const addTask = (label?: string) => {
    const value = (label ?? newTask).trim();
    if (!value) return;

    setTasks((current) => [
      ...current,
      { id: makeId(), label: value, icon: icons[current.length % icons.length] },
    ]);
    setNewTask("");
  };

  const updateTask = (id: string, label: string) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, label } : task))
    );
  };

  const moveTask = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= tasks.length) return;

    setTasks((current) => {
      const next = [...current];
      const moving = next[index];
      next[index] = next[target];
      next[target] = moving;
      return next;
    });
  };

  const removeTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="section-shell p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="soft-label">Editor</span>
          <button type="button" onClick={handlePrint} className="secondary-button h-10 px-4 py-2 text-xs">
            Imprimir
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium text-stone-700">Nombre de la rutina</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500"
        />

        <div className="mt-5 space-y-3">
          {tasks.map((task, index) => (
            <div key={task.id} className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveTask(index, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-xs"
                  aria-label="Mover arriba"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveTask(index, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-xs"
                  aria-label="Mover abajo"
                >
                  ↓
                </button>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e1d6] text-lg">
                  {task.icon}
                </span>
                <input
                  value={task.label}
                  onChange={(event) => updateTask(task.id, event.target.value)}
                  className="h-10 flex-1 rounded-full border border-stone-200 bg-stone-50 px-3 text-sm outline-none focus:border-stone-400"
                />
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-xs"
                  aria-label="Eliminar tarea"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <input
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Añadir tarea personalizada"
            className="h-12 flex-1 rounded-full border border-stone-300 bg-white px-4 outline-none placeholder:text-stone-400 focus:border-stone-500"
          />
          <button type="button" onClick={() => addTask()} className="primary-button h-12 min-w-[120px]">
            Añadir
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {defaultTasks.slice(0, 6).map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => addTask(task.label)}
              className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
            >
              + {task.label}
            </button>
          ))}
        </div>
      </div>

      <div className="section-shell bg-[#f3e8df] p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="soft-label">Vista previa</span>
          <span className="text-xs font-medium text-stone-500">{totalSteps} pasos</span>
        </div>

        <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-900">{title || "Mi rutina visual"}</h2>
          <div className="mt-5 space-y-3">
            {tasks.map((task, index) => (
              <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-[#faf7f3] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efcdbb] text-lg">
                  {task.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Paso {index + 1}</div>
                  <div className="text-base font-medium text-stone-800">{task.label || "Nueva tarea"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
