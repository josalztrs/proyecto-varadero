'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner'; // Ensure toast is also imported from sonner
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';

import Form from './form';
import Table from './table'; // Assuming this imports the updated GenericTable
import useCrud from '@/app/lib/supabase/db_management/crud';

const MantenimientoCRUD = () => {
  type Mantenimiento = Tables<'mantenimientos'> & { id: string };
  type Embarcacion = Tables<'embarcacion'>;

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
    fetchRelatedItemDetails, // This is already correctly passed from useCrud
  } = useCrud<Mantenimiento>(supabase, 'mantenimientos', {
    itemsPerPage: 5,
    orderBy: { column: 'fecha', ascending: false },
  });

  const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | null>(null);

  const handleFormSubmit = async (formData: Partial<Mantenimiento>) => {
    try {
      if (editingMantenimiento) {
        await updateItem(editingMantenimiento.id, formData);
        toast.success('Mantenimiento actualizado exitosamente'); // Added toast notification
        setEditingMantenimiento(null);
      } else {
        await createItem(formData);
        toast.success('Mantenimiento registrado exitosamente'); // Added toast notification
      }
    } catch (err) {
      console.error('Form submission error caught in component:', err);
      toast.error('Error al procesar el formulario. Revisa los campos e intenta de nuevo'); // Added toast notification
    }
  };

  // The handleDelete function needs to be wrapped in a try/catch for toast notifications
  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      toast.success('Mantenimiento eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Error al eliminar el mantenimiento.');
    }
  };

  const mantenimientoFormFields = [
    { name: 'matricula_emb', label: 'Matrícula Embarcación', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'concepto', label: 'Concepto de Mantenimiento', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'fecha', label: 'Fecha de Mantenimiento', type: 'date', required: true, maxLength: 32 },
    { name: 'precio', label: 'Precio', type: 'number', required: true, maxLength: 32 },
  ];

  // Updated TableColumn interface to correctly type `isRelated` for Mantenimiento and Embarcacion
  interface TableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
    isRelated?: {
      key: keyof T; // The foreign key in the current table (e.g., 'matricula_emb')
      label: string;
      relatedTableName: string;
      relatedIdColumn: string; // The unique identifier column in the related table (e.g., 'matricula')
      displayColumn: string; // The column from the related table to display initially (e.g., 'nombre' of the boat)
      hoverDisplayColumns: { key: keyof Embarcacion; label: string }[];
    };
  }

  const mantenimientoTableColumns: TableColumn<Mantenimiento>[] = [
    {
      key: 'matricula_emb', // This is the foreign key in 'mantenimientos'
      label: 'Embarcación', // Changed label for better readability in the table header
      isRelated: {
        key: 'matricula_emb', // The foreign key in 'mantenimientos'
        label: 'Detalles Embarcación', // Label for the related item in the hover popover
        relatedTableName: 'embarcacion', // The name of the related table
        relatedIdColumn: 'matricula', // The UNIQUE IDENTIFIER column in the 'embarcacion' table
        displayColumn: 'nombre', // The column from 'embarcacion' to display directly in the table
        hoverDisplayColumns: [
          { key: 'nombre', label: 'Nombre' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'marcmod', label: 'Marca/Modelo' },
          { key: 'matricula', label: 'Matrícula' }, // Include matricula in hover for clarity
        ],
      },
    },
    { key: 'concepto', label: 'Concepto' },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (mantenimiento) => {
        try {
          return new Date(mantenimiento.fecha).toLocaleDateString();
        } catch {
          return String(mantenimiento.fecha); // Ensure it's a string even if parsing fails
        }
      },
    },
    { key: 'precio', label: 'Precio', render: (mantenimiento) => `$${mantenimiento.precio.toFixed(2)}` },
    { key: 'actions', label: 'Acciones' },
  ];

  return (
    <div className="container mx-auto px-4 min-h-screen text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" richColors />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-10 text-center text-amber-500 dark:text-cyan-500"
      >
        Gestión de Mantenimientos
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10"
      >
        <Form<Mantenimiento>
          fields={mantenimientoFormFields}
          initialData={editingMantenimiento || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingMantenimiento(null)}
          loading={loading}
          error={error}
          submitButtonText={editingMantenimiento ? 'Guardar Cambios' : 'Registrar Mantenimiento'}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white"
      >
        Mantenimientos Registrados
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
      >
        <Table<Mantenimiento>
          data={mantenimientos}
          columns={mantenimientoTableColumns}
          onEdit={setEditingMantenimiento}
          onDelete={handleDelete} // Use the wrapped handleDelete function
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          emptyMessage="No hay mantenimientos registrados aún."
          deleteConfirmMessage="¿Estás seguro de que quieres eliminar este mantenimiento? Esta acción es irreversible."
          fetchRelatedItemDetails={fetchRelatedItemDetails}
        />
      </motion.div>
    </div>
  );
};

export default MantenimientoCRUD;