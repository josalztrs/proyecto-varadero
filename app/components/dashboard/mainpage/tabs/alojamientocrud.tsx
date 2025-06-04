'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';

import Form from './form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';

const AlojamientoCRUD = () => {
  type Alojamiento = Tables<'alojamientos'> & { id: number };
  type Cliente = Tables<'cliente'>;

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
    fetchRelatedItemDetails,
  } = useCrud<Alojamiento>(supabase, 'alojamientos', {
    itemsPerPage: 5,
    orderBy: { column: 'fecha', ascending: false },
  });

  const [editingAlojamiento, setEditingAlojamiento] = useState<Alojamiento | null>(null);

  const handleFormSubmit = async (formData: Partial<Alojamiento>) => {
    try {
      if (editingAlojamiento) {
        await updateItem(editingAlojamiento.id, formData);
        toast.success('Alojamiento actualizado exitosamente');
        setEditingAlojamiento(null);
      } else {
        await createItem(formData);
        toast.success('Alojamiento registrado exitosamente');
      }
    } catch (err) {
      console.error('Form submission error caught in component:', err);
      toast.error('Error al procesar el formulario.');
    }
  };

  const alojamientoFormFields = [
    { name: 'fecha', label: 'Fecha de Alojamiento', type: 'date', required: true, maxLength: 32, },
    { name: 'id_cliente', label: 'ID Cliente', type: 'number', required: true, maxLength: 32 },
  ];

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

  const alojamientoTableColumns: TableColumn<Alojamiento>[] = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (alojamiento) => {
        try {
          return new Date(alojamiento.fecha).toLocaleDateString();
        } catch {
          return alojamiento.fecha;
        }
      },
    },
    {
      key: 'id_cliente',
      label: 'ID Cliente',
      isRelated: {
        key: 'id_cliente',
        label: 'Cliente',
        relatedTableName: 'cliente',
        relatedIdColumn: 'id',
        displayColumn: 'nombre',
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
        Gestión de Alojamientos
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10"
      >
        <Form<Alojamiento>
          fields={alojamientoFormFields}
          initialData={editingAlojamiento || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingAlojamiento(null)}
          loading={loading}
          error={error}
          submitButtonText={editingAlojamiento ? 'Guardar Cambios' : 'Registrar Alojamiento'}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white"
      >
        Alojamientos Registrados
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
      >
        <Table<Alojamiento>
          data={alojamientos}
          columns={alojamientoTableColumns}
          onEdit={setEditingAlojamiento}
          onDelete={async (id) => {
            try {
              await deleteItem(id);
              toast.success('Alojamiento eliminado exitosamente');
            } catch {
              toast.error('Error al eliminar el alojamiento.');
            }
          }}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          emptyMessage="No hay alojamientos registrados aún."
          deleteConfirmMessage="¿Estás seguro de que quieres eliminar este alojamiento? Esta acción es irreversible."
          fetchRelatedItemDetails={fetchRelatedItemDetails}
        />
      </motion.div>
    </div>
  );
};

export default AlojamientoCRUD;
