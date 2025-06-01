// app/components/ClienteCRUD.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';
import Form from './form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';

const ClienteCRUD = () => {
  // Define the type for Cliente from your Supabase schema
  type Cliente = Tables<'cliente'>;

  // Use the generic useCrud hook
  const {
    data: clientes,
    loading,
    error,
    currentPage,
    totalPages,
    createItem,
    updateItem,
    deleteItem,
    goToPage,
  } = useCrud<Cliente>(supabase, 'cliente', {
    itemsPerPage: 5,
    orderBy: { column: 'nombre', ascending: true },
  });

  // State for managing which client is being edited
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  // --- Form Submission Handler (delegating to useCrud) ---
  const handleFormSubmit = async (formData: Partial<Cliente>) => {
    try {
      if (editingCliente) {
        // Update operation
        await updateItem(editingCliente.id, formData);
        setEditingCliente(null); // Exit editing mode on success
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

  // --- Form Field Definitions for Cliente ---
  const clientFormFields = [
    { name: 'nombre', label: 'Nombre Completo', type: 'text', required: true },
    { name: 'doc_ident', label: 'Documento de Identidad', type: 'text', required: true },
    { name: 'correo', label: 'Correo Electrónico', type: 'email' },
    { name: 'nacionalidad', label: 'Nacionalidad', type: 'text' },
    { name: 'telefono', label: 'Teléfono', type: 'text' },
  ];

  // --- Table Column Definitions for Cliente ---
  // Note: TableColumn was defined in GenericTable, ensure it's available or re-define
  // For simplicity, let's redefine it here or import if from a shared types file
  interface TableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
  }

  const clientTableColumns: TableColumn<Cliente>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'doc_ident', label: 'Doc ID' },
    { key: 'correo', label: 'Correo', render: (cliente) => cliente.correo || 'N/A' },
    { key: 'telefono', label: 'Telefono', render: (cliente) => cliente.telefono || 'N/A' },
    { key: 'nacionalidad', label: 'Nacionalidad', render: (cliente) => cliente.nacionalidad || 'N/A' },
    { key: 'actions', label: '' }, // Special key for actions
  ];

  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Clientes
      </h1>

      {/* Generic Form for Cliente */}
      <Form<Cliente>
        fields={clientFormFields}
        initialData={editingCliente || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingCliente(null)}
        loading={loading}
        error={error}
        submitButtonText={editingCliente ? 'Guardar Cambios' : 'Registrar'}
      />

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Clientes Registrados
      </h2>

      {/* Generic Table for Cliente */}
      <Table<Cliente>
        data={clientes}
        columns={clientTableColumns}
        onEdit={setEditingCliente}
        onDelete={deleteItem} // Directly pass deleteItem from the hook
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage} // Directly pass goToPage from the hook
        emptyMessage="No hay clientes registrados, aún."
        deleteConfirmMessage="¿Estás seguro de que deseas eliminar este cliente? Esta acción es irreversible y puede afectar registros relacionados (embarcaciones, transacciones)."
      />
    </div>
  );
};

export default ClienteCRUD;