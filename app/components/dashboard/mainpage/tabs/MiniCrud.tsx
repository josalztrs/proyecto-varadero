'use client';

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function MiniCrudTable() {
  type CrudItem = { id: number | null; name: string; description: string };
  const [data, setData] = useState<CrudItem[]>([]);
  const [form, setForm] = useState<CrudItem>({ id: null, name: "", description: "" });
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
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                const item = row.original;
                setForm(item);
                setEditing(true);
              }}
              className="text-blue-600 hover:underline"
            >
              Editar
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
              className="text-red-500 hover:underline"
            >
              Eliminar
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
          item.id === form.id
            ? { ...form, id: item.id } as CrudItem
            : item
        )
      );
    } else {
      setData((old) => [...old, { ...form, id: Date.now() }]);
    }

    setForm({ id: null, name: "", description: "" });
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Mini CRUD con React Table y Tailwind 4
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center gap-3 mb-6 bg-white shadow-md rounded-xl p-4"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          {editing ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 border-b">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No hay datos aún.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-all"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 border-b text-gray-800">
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
