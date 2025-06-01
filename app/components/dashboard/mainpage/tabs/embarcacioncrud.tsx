// app/components/EmbarcacionCRUD.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';
import Form from './form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';

const EmbarcacionCRUD = () => {
  type Embarcacion = Tables<'embarcacion'> & { id: number };
  type Cliente = Tables<'cliente'>; // Also need Cliente type for related data

  const {
    data: embarcaciones,
    loading,
    error,
    currentPage,
    totalPages,
    createItem,
    updateItem,
    deleteItem,
    goToPage,
    fetchRelatedItemDetails, // Get the new function from useCrud
  } = useCrud<Embarcacion>(supabase, 'embarcacion', {
    itemsPerPage: 5,
    orderBy: { column: 'matricula', ascending: true },
  });

  const [editingEmbarcacion, setEditingEmbarcacion] = useState<Embarcacion | null>(null);

  const handleFormSubmit = async (formData: Partial<Embarcacion>) => {
    try {
      if (editingEmbarcacion) {
        await updateItem(editingEmbarcacion.id, formData);
        setEditingEmbarcacion(null);
      } else {
        await createItem(formData);
      }
    } catch (err) {
      console.error('Form submission error caught in component:', err);
    }
  };

  const embarcacionFormFields = [
    { name: 'matricula', label: 'Matrícula', type: 'text', required: true },
    { name: 'nombre', label: 'Nombre Embarcación', type: 'text', required: true },
    { name: 'tipo', label: 'Tipo', type: 'text' },
    { name: 'marcmod', label: 'Marca/Modelo', type: 'text', required: true },
    { name: 'caracteristicas', label: 'Caracteristicas', type: 'text', required: true },
    { name: 'id_cliente', label: 'ID Dueño (Cliente)', type: 'number', required: true },
    { name: 'amarres_asign', label: 'Amarres Asignados', type: 'number', required: true },
    { name: 'cuadr_asign', label: 'Cuadrante', type: 'number', required: true },
    { name: 'edo_antes', label: 'Estado al entrar', type: 'text', required: true },
    { name: 'edo_despues', label: 'Estado al salir', type: 'text' },
  ];

  // TableColumn definition (can be imported from a shared types file)
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
      hoverDisplayColumns: { key: keyof Cliente; label: string }[]; // Type for Cliente
    };
  }

  const embarcacionTableColumns: TableColumn<Embarcacion>[] = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo', render: (embarcacion) => embarcacion.tipo || 'N/A' },
    {
      key: 'id_cliente',
      label: 'Id Dueño',
      isRelated: {
        key: 'id_cliente', // The foreign key column in 'embarcacion'
        label: 'Dueño',
        relatedTableName: 'cliente', // The table it relates to
        relatedIdColumn: 'id', // The ID column in the 'cliente' table
        displayColumn: 'id_cliente', // The column from 'cliente' to display initially (e.g., the client's name)
        hoverDisplayColumns: [ // Columns to show in the hover popover
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
        Gestión de Embarcaciones
      </h1>

      <Form<Embarcacion>
        fields={embarcacionFormFields}
        initialData={editingEmbarcacion || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingEmbarcacion(null)}
        loading={loading}
        error={error}
        submitButtonText={editingEmbarcacion ? 'Guardar Cambios' : 'Registrar Embarcación'}
      />

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Embarcaciones Registradas
      </h2>

      <Table<Embarcacion> // Use Table component
        data={embarcaciones}
        columns={embarcacionTableColumns}
        onEdit={setEditingEmbarcacion}
        onDelete={deleteItem}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        emptyMessage="No hay embarcaciones registradas aún."
        deleteConfirmMessage="¿Estás seguro de que quieres eliminar esta embarcación? Esta acción es irreversible y podría afectar registros relacionados."
        fetchRelatedItemDetails={fetchRelatedItemDetails} // Pass the function to the table
      />
    </div>
  );
};

export default EmbarcacionCRUD;