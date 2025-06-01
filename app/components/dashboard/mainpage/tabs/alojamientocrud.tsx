// app/components/AlojamientoCRUD.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase'; // Ensure this path is correct
import type { Tables } from '@/app/lib/supabase/db_types'; // Your database types

import Form from './form'; // Assuming 'form' is your GenericForm component
import Table from './table'; // Assuming 'table' is your GenericTable component
import useCrud from '@/app/lib/supabase/db_management/crud'; // Your custom hook

const AlojamientoCRUD = () => {
  // Define the types for Alojamiento and Cliente
  type Alojamiento = Tables<'alojamientos'> & { id: number };
  type Cliente = Tables<'cliente'>; // Needed for related data

  const {
    data: alojamientos,
    loading,
    error,
    currentPage,
    totalPages,
    createItem,
    updateItem,
    deleteItem,
    goToPage,
    fetchRelatedItemDetails, // Necessary for hover details on related columns
  } = useCrud<Alojamiento>(supabase, 'alojamientos', {
    itemsPerPage: 5,
    orderBy: { column: 'fecha', ascending: false }, // Order by date, newest first
  });

  const [editingAlojamiento, setEditingAlojamiento] = useState<Alojamiento | null>(null);

  const handleFormSubmit = async (formData: Partial<Alojamiento>) => {
    try {
      // Supabase handles 'fecha' default values if you've set them in the DB.
      // If 'fecha' needs to be manually set, you'd add it here:
      // if (!formData.fecha) {
      //   formData.fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      // }

      if (editingAlojamiento) {
        await updateItem(editingAlojamiento.id, formData);
        setEditingAlojamiento(null);
      } else {
        await createItem(formData);
      }
    } catch (err) {
      console.error('Form submission error caught in component:', err);
    }
  };

  // Define form fields for Alojamiento based *strictly* on your provided types
  const alojamientoFormFields = [
    { name: 'fecha', label: 'Fecha de Alojamiento', type: 'date', required: true },
    { name: 'id_cliente', label: 'ID Cliente', type: 'number', required: true },
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
      hoverDisplayColumns: { key: keyof Cliente; label: string }[];
    };
  }

  // Define table columns for Alojamiento based *strictly* on your provided types
  const alojamientoTableColumns: TableColumn<Alojamiento>[] = [
    { key: 'fecha', label: 'Fecha', render: (alojamiento) => {
      // Format date for better readability if it's a string like 'YYYY-MM-DD'
      try {
        return new Date(alojamiento.fecha).toLocaleDateString();
      } catch {
        return alojamiento.fecha;
      }
    }},
    {
      key: 'id_cliente',
      label: 'ID Cliente',
      isRelated: {
        key: 'id_cliente',
        label: 'Cliente',
        relatedTableName: 'cliente',
        relatedIdColumn: 'id',
        displayColumn: 'nombre', // Display client's name from 'cliente' table
        hoverDisplayColumns: [
          { key: 'nombre', label: 'Nombre' },
          { key: 'doc_ident', label: 'Doc. Ident.' },
          { key: 'correo', label: 'Correo' },
          { key: 'telefono', label: 'Teléfono' },
        ],
      },
    },
    { key: 'actions', label: 'Acciones' },
  ];

  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Gestión de Alojamientos
      </h1>

      <Form<Alojamiento>
        fields={alojamientoFormFields}
        initialData={editingAlojamiento || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingAlojamiento(null)}
        loading={loading}
        error={error}
        submitButtonText={editingAlojamiento ? 'Guardar Cambios' : 'Registrar Alojamiento'}
      />

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Alojamientos Registrados
      </h2>

      <Table<Alojamiento>
        data={alojamientos}
        columns={alojamientoTableColumns}
        onEdit={setEditingAlojamiento}
        onDelete={deleteItem}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        emptyMessage="No hay alojamientos registrados aún."
        deleteConfirmMessage="¿Estás seguro de que quieres eliminar este alojamiento? Esta acción es irreversible."
        fetchRelatedItemDetails={fetchRelatedItemDetails} // Pass the function to the table
      />
    </div>
  );
};

export default AlojamientoCRUD;