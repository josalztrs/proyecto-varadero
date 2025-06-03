'use client';

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { DashboardCard } from "@/app/ui/card";

type CrudItem = { id: number; name: string; description: string };

interface MiniCrudTableProps {
  initialData?: CrudItem[];
}

export default function MiniCrudTable({ initialData = [] }: MiniCrudTableProps) {
  const [data, setData] = useState<CrudItem[]>(initialData);

  const [form, setForm] = useState<{ id: number | null; name: string; description: string }>({
    id: null,
    name: "",
    description: "",
  });
  const [editing, setEditing] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
      },
      {
        accessorKey: "description",
        header: "Descripción",
      },
      {
        id: "actions",
        header: "Acciones",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: ({ row }: { row: any }) => (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                const item = row.original;
                setForm(item);
                setEditing(true);
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
            >
              <Pencil size={16} /> Editar
            </button>
            <button
              onClick={() => {
                setData((old) =>
                  old.filter((item) => item.id !== row.original.id)
                );
                if (editing && form.id === row.original.id) {
                  setForm({ id: null, name: "", description: "" });
                  setEditing(false);
                }
              }}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
            >
              <Trash2 size={16} /> Eliminar
            </button>
          </div>
        ),
      },
    ],
    [editing, form.id]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;

    if (editing) {
      setData((old) =>
        old.map((item) =>
          item.id === form.id ? { ...form, id: item.id } : item
        )
      );
    } else {
      setData((old) => [...old, { ...form, id: Date.now() }]);
    }

    setForm({ id: null, name: "", description: "" });
    setEditing(false);
  };

  return (
    <DashboardCard>
      <h2 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-white">CRUD</h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-3 gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white transition-colors"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-cyan-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white transition-colors"
          required
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-md"
        >
          {editing ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="max-h-[224px] overflow-y-auto rounded-lg border border-gray-300 dark:border-slate-600 shadow-sm">
        <table className="w-full table-auto text-sm text-left bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id} 
                    className="p-3 font-semibold border-b border-gray-300 dark:border-slate-600"
                  >
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="p-4 text-center text-gray-400 dark:text-slate-400"
                >
                  No hay datos aún.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      className="p-3 border-b border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
