'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';

import Form from './form';
import Table from './table';
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
    fetchRelatedItemDetails,
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
    { name: 'matricula', label: 'Matrícula', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'nombre', label: 'Nombre Embarcación', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'tipo', label: 'Tipo', type: 'text', maxLength: 32, uppercase: true },
    { name: 'marcmod', label: 'Marca/Modelo', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'caracteristicas', label: 'Caracteristicas', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'id_cliente', label: 'ID Dueño (Cliente)', type: 'number', required: true, maxLength: 32 },
    { name: 'amarres_asign', label: 'Amarres Asignados', type: 'number', required: true, maxLength: 32 },
    { name: 'cuadr_asign', label: 'Cuadrante', type: 'number', required: true, maxLength: 32 },
    { name: 'edo_antes', label: 'Estado al entrar', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'edo_despues', label: 'Estado al salir', type: 'text', maxLength: 32, uppercase: true },
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

  const embarcacionTableColumns: TableColumn<Embarcacion>[] = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo', render: (embarcacion) => embarcacion.tipo || 'N/A' },
    {
      key: 'id_cliente',
      label: 'Id Dueño',
      isRelated: {
        key: 'id_cliente',
        label: 'Dueño',
        relatedTableName: 'cliente',
        relatedIdColumn: 'id',
        displayColumn: 'id_cliente',
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
