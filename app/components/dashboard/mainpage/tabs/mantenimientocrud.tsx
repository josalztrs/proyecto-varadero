// app/components/MantenimientoCRUD.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase'; // Ensure this path is correct
import type { Tables } from '@/app/lib/supabase/db_types'; // Your database types

import Form from './form'; // Assuming 'form' is your GenericForm component
import Table from './table'; // Assuming 'table' is your GenericTable component
import useCrud from '@/app/lib/supabase/db_management/crud'; // Your custom hook

const MantenimientoCRUD = () => {
  // Define the types for Mantenimiento and Embarcacion
  type Mantenimiento = Tables<'mantenimientos'> & { id: number };
  type Embarcacion = Tables<'embarcacion'>; // Needed for related data

  const {
    data: mantenimientos,
    loading,
    error,
    currentPage,
    totalPages,
    createItem,
    updateItem,
    deleteItem,
    goToPage,
    fetchRelatedItemDetails, // Necessary for hover details on related columns
  } = useCrud<Mantenimiento>(supabase, 'mantenimientos', {
    itemsPerPage: 5,
    orderBy: { column: 'fecha', ascending: false }, // Order by date, newest first
  });

  const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | null>(null);

  const handleFormSubmit = async (formData: Partial<Mantenimiento>) => {
    try {
      if (editingMantenimiento) {
        await updateItem(editingMantenimiento.id, formData);
        setEditingMantenimiento(null);
      } else {
        await createItem(formData);
      }
    } catch (err) {
      console.error('Form submission error caught in component:', err);
    }
  };

  // Define form fields for Mantenimiento based on your provided types
  const mantenimientoFormFields = [
    { name: 'matricula_emb', label: 'Matrícula Embarcación', type: 'text', required: true },
    { name: 'concepto', label: 'Concepto de Mantenimiento', type: 'text', required: true },
    { name: 'fecha', label: 'Fecha de Mantenimiento', type: 'date', required: true },
    { name: 'precio', label: 'Precio', type: 'number', required: true },
  ];

  // Re-define TableColumn interface for clarity (can be shared globally)
  interface TableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
    isRelated?: {
      key: keyof T;
      label: string;
      relatedTableName: string;
      relatedIdColumn: string;
      displayColumn: string;
      hoverDisplayColumns: { key: keyof Embarcacion; label: string }[];
    };
  }

  // Define table columns for Mantenimiento based on your provided types
  const mantenimientoTableColumns: TableColumn<Mantenimiento>[] = [
    {
      key: 'matricula_emb',
      label: 'Matrícula Embarcación',
      isRelated: {
        key: 'matricula_emb',
        label: 'Embarcación',
        relatedTableName: 'embarcacion',
        relatedIdColumn: 'matricula', // Foreign key matches 'matricula' in 'embarcacion'
        displayColumn: 'nombre', // Display the name of the boat
        hoverDisplayColumns: [
          { key: 'nombre', label: 'Nombre' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'marcmod', label: 'Marca/Modelo' },
          { key: 'matricula', label: 'Matrícula' },
        ],
      },
    },
    { key: 'concepto', label: 'Concepto' },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (mantenimiento) => {
        // Format date for better readability
        try {
          return new Date(mantenimiento.fecha).toLocaleDateString();
        } catch {
          return mantenimiento.fecha;
        }
      },
    },
    { key: 'precio', label: 'Precio', render: (mantenimiento) => `$${mantenimiento.precio.toFixed(2)}` },
    { key: 'actions', label: 'Acciones' },
  ];

  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Gestión de Mantenimientos
      </h1>

      <Form<Mantenimiento>
        fields={mantenimientoFormFields}
        initialData={editingMantenimiento || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingMantenimiento(null)}
        loading={loading}
        error={error}
        submitButtonText={editingMantenimiento ? 'Guardar Cambios' : 'Registrar Mantenimiento'}
      />

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Mantenimientos Registrados
      </h2>

      <Table<Mantenimiento>
        data={mantenimientos}
        columns={mantenimientoTableColumns}
        onEdit={setEditingMantenimiento}
        onDelete={deleteItem}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        emptyMessage="No hay mantenimientos registrados aún."
        deleteConfirmMessage="¿Estás seguro de que quieres eliminar este mantenimiento? Esta acción es irreversible."
        fetchRelatedItemDetails={fetchRelatedItemDetails} // Pass the function to the table
      />
    </div>
  );
};

export default MantenimientoCRUD;