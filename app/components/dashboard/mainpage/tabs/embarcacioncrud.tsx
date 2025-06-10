'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';

import Form from './form';
import Table from './table'; // Assuming this imports the updated GenericTable
import useCrud from '@/app/lib/supabase/db_management/crud';
import { toast } from 'sonner'; // ✅ Importar sonner

const EmbarcacionCRUD = () => {
  type Embarcacion = Tables<'embarcacion'> & { id: number };
  type Cliente = Tables<'cliente'>;

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
    fetchRelatedItemDetails, // This fetchRelatedItemDetails is already designed to handle dynamic columns
  } = useCrud<Embarcacion>(supabase, 'embarcacion', {
    itemsPerPage: 5,
    orderBy: { column: 'matricula', ascending: true },
  });

  const [editingEmbarcacion, setEditingEmbarcacion] = useState<Embarcacion | null>(null);

  const handleFormSubmit = async (formData: Partial<Embarcacion>) => {
    try {
      if (editingEmbarcacion) {
        await updateItem(editingEmbarcacion.id, formData);
        toast.success('Embarcación actualizada exitosamente');
        setEditingEmbarcacion(null);
      } else {
        await createItem(formData);
        toast.success('Embarcación registrada exitosamente');
      }
    } catch (err) {
      toast.error('Error al enviar el formulario. Revisa los campos e intenta de nuevo');
      console.error('Form submission error caught in component:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      toast.success('Embarcación eliminada correctamente');
    } catch (err) {
      toast.error('Error al eliminar la embarcación');
      console.error(err);
    }
  };

  const embarcacionFormFields = [
    { name: 'matricula', label: 'Matrícula', type: 'text', required: true, maxLength: 7, uppercase: true, placeholder: "XXX-123", pattern: '[A-Z]{3}-[0-9]{4}' },
    { name: 'nombre', label: 'Nombre Embarcación', type: 'text', required: true, maxLength: 32, uppercase: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select', // Changed to 'select'
      maxLength: 32, // maxLength is not strictly needed for select, but harmless
      uppercase: true, // uppercase will still apply to the selected value (though usually not necessary for select values)
      options: [ // Added options for the dropdown
        { value: 'LANCHA', label: 'Lancha' },
        { value: 'YATE', label: 'Yate' },
        { value: 'MOTO_ACUATICA', label: 'Moto Acuática' },
      ],
    },
    { name: 'marcmod', label: 'Marca/Modelo', type: 'text', required: true, maxLength: 20, uppercase: true },
    { name: 'caracteristicas', label: 'Características', type: 'text', required: true, maxLength: 32, uppercase: true, placeholder:"Caracteristicas fisicas del vehiculo" },
    { name: 'id_cliente', label: 'ID Dueño (Cliente)', type: 'number', required: true, maxLength: 4, placeholder:"El campo ID asociado al cliente" },
    { name: 'amarres_asign', label: 'Amarres Asignados', type: 'number', required: true, maxLength: 4 },
    { name: 'cuadr_asign', label: 'Cuadrante', type: 'number', required: true, maxLength: 24 },
    { name: 'edo_antes', label: 'Estado al entrar', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'edo_despues', label: 'Estado al salir', type: 'text', maxLength: 32, uppercase: true },
  ];

  // Modified TableColumn interface to correctly type `isRelated` for Embarcacion and Cliente
  interface TableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
    isRelated?: {
      key: keyof T; // The foreign key in the current table (e.g., 'id_cliente')
      label: string;
      relatedTableName: string;
      relatedIdColumn: string; // The column in the related table that acts as the primary key/unique identifier (e.g., 'id')
      displayColumn: string; // The column from the related table to display initially (e.g., 'nombre' of the client)
      hoverDisplayColumns: { key: keyof Cliente; label: string }[];
    };
  }

  const embarcacionTableColumns: TableColumn<Embarcacion>[] = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo', render: (embarcacion) => embarcacion.tipo || 'N/A' },
    {
      key: 'id_cliente', // This is the foreign key in 'embarcacion' pointing to 'cliente'
      label: 'Dueño', // Changed label for better readability in the table header
      isRelated: {
        key: 'id_cliente', // The foreign key in 'embarcacion'
        label: 'Dueño', // Label for the related item in the hover popover
        relatedTableName: 'cliente', // The name of the related table
        relatedIdColumn: 'id', // The primary key column in the 'cliente' table
        displayColumn: 'id_cliente', // The column from 'cliente' to display directly in the table
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
    <div className="container mx-auto px-4 min-h-screen text-gray-900 dark:text-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-10 text-center text-amber-500 dark:text-cyan-500"
      >
        Gestión de Embarcaciones
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10"
      >
        <Form<Embarcacion>
          fields={embarcacionFormFields}
          initialData={editingEmbarcacion || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingEmbarcacion(null)}
          loading={loading}
          error={error}
          submitButtonText={editingEmbarcacion ? 'Guardar Cambios' : 'Registrar Embarcación'}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white"
      >
        Embarcaciones Registradas
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
      >
        <Table<Embarcacion>
          data={embarcaciones}
          columns={embarcacionTableColumns}
          onEdit={setEditingEmbarcacion}
          onDelete={handleDelete}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          emptyMessage="No hay embarcaciones registradas aún."
          deleteConfirmMessage="¿Estás seguro de que quieres eliminar esta embarcación? Esta acción es irreversible y podría afectar registros relacionados."
          fetchRelatedItemDetails={fetchRelatedItemDetails}
        />
      </motion.div>
    </div>
  );
};

export default EmbarcacionCRUD;