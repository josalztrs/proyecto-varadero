// app/components/EmbarcacionCRUD.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types'; // Assuming this has Tables<'embarcacion'>
import Form from './form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';

const EmbarcacionCRUD = () => {
  // Define the type for Embarcacion from your Supabase schema and ensure it includes 'id'
  type Embarcacion = Tables<'embarcacion'> & { id: number };
    const tipoOptions = [
        { value: "Lancha", label: "Lancha" },
        { value: "Yate", label: "Yate" },
        { value: "Moto Acuatica", label: "Moto Acuatica" },
    ];
  // Use the generic useCrud hook for the 'embarcacion' table
  const {
    data: embarcaciones, // Renamed data to embarcaciones for clarity
    loading,
    error,
    currentPage,
    totalPages,
    createItem,
    updateItem,
    deleteItem,
    goToPage,
  } = useCrud<Embarcacion>(supabase, 'embarcacion', {
    itemsPerPage: 5,
    orderBy: { column: 'matricula', ascending: true }, // Assuming 'matricula' is a good column to order by
  });

  // State for managing which embarcacion is being edited
  const [editingEmbarcacion, setEditingEmbarcacion] = useState<Embarcacion | null>(null);

  // --- Form Submission Handler (delegating to useCrud) ---
  const handleFormSubmit = async (formData: Partial<Embarcacion>) => {
    try {
      if (editingEmbarcacion) {
        // Update operation
        await updateItem(editingEmbarcacion.id, formData);
        setEditingEmbarcacion(null); // Exit editing mode on success
      } else {
        // Create operation
        await createItem(formData);
      }
    } catch (err) {
      // The useCrud hook already sets the error state,
      // but you can add more specific UI feedback here if needed.
      console.error("Form submission error caught in component:", err);
    }
  };

  // --- Form Field Definitions for Embarcacion ---
  // You need to define these based on your 'embarcacion' table's schema
  const embarcacionFormFields = [
    { name: 'matricula', label: 'Matrícula', type: 'text', required: true },
    { name: 'nombre', label: 'Nombre Embarcación', type: 'text', required: true },
    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions, required: true },
    { name: 'marcmod', label: 'Marca/Modelo', type: 'text' },
    { name: 'caracteristicas', label: 'Alguna caracteristica a considerar', type: 'text' },
    { name: 'amarres_asign', label: 'Cantidad de Amarres', type: 'number' },
    { name: 'dueno_id', label: 'ID Dueño (Cliente)', type: 'number', required: true },
    { name: 'cuadr_asign', label: 'Cuadrante', type: 'number' },
    { name: 'edo_antes', label: 'Estado Antes', type: 'text' },
    { name: 'edo_despues', label: 'Estado Despues', type: 'text' },
  ];

  // --- Table Column Definitions for Embarcacion ---
  // Note: TableColumn was defined in GenericTable, ensure it's available or re-define
  // For simplicity, let's redefine it here or import if from a shared types file
  interface TableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
  }

  const embarcacionTableColumns: TableColumn<Embarcacion>[] = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo', render: (embarcacion) => embarcacion.tipo || 'N/A' },
    { key: 'caracteristicas', label: 'Capacidad', render: (embarcacion) => embarcacion.caracteristicas?.toString() || 'N/A' },
    { key: 'id_cliente', label: 'ID Dueño' }, // You might want to fetch and display the owner's name here in a real app
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Boat Management
      </h1>

      {/* Generic Form for Embarcacion */}
      <Form<Embarcacion>
        fields={embarcacionFormFields}
        initialData={editingEmbarcacion || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingEmbarcacion(null)}
        loading={loading}
        error={error}
        submitButtonText={editingEmbarcacion ? 'Save Changes' : 'Register Boat'}
      />

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Registered Boats
      </h2>

      {/* Generic Table for Embarcacion */}
      <Table<Embarcacion>
        data={embarcaciones}
        columns={embarcacionTableColumns}
        onEdit={setEditingEmbarcacion} // Directly set the embarcacion for editing
        onDelete={deleteItem} // Directly pass deleteItem from the hook
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage} // Directly pass goToPage from the hook
        emptyMessage="No boats registered yet."
        deleteConfirmMessage="Are you sure you want to delete this boat? This action is irreversible and may affect related transactions."
      />
    </div>
  );
};

export default EmbarcacionCRUD;