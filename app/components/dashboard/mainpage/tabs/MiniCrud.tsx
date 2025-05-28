'use client';

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

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
    <div className="bg-white/90 shadow-xl rounded-2xl p-6 max-w-5xl mx-auto border border-gray-200 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Mini CRUD</h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-3 gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {editing ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="max-h-[224px] overflow-y-auto rounded-md border border-gray-300 dark:border-gray-600">
        <table className="w-full table-auto text-sm text-left bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-slate-700 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 font-semibold border-b border-gray-300">
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
                <td colSpan={columns.length} className="p-4 text-center text-gray-400">
                  No hay datos aún.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 border-b border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
