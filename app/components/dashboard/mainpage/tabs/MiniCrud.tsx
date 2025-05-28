'use client';

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

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
              className="text-red-600 hover:underline"
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
    <div className="bg-gray-100/90 shadow-lg rounded-lg p-6 max-w-4xl mx-auto border border-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Mini CRUD </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {editing ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <table className="w-full border rounded-lg overflow-hidden bg-white text-gray-900">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 border-b text-left border-gray-300"
                >
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
                className="p-4 text-center text-gray-500"
              >
                No hay datos aún
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border-b border-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
