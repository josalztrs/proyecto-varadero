'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner'; // 👈 Incluye Toaster y toast
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';
import Form from './form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';

const ClienteCRUD = () => {
  type Cliente = Tables<'cliente'>;

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

  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const handleFormSubmit = async (formData: Partial<Cliente>) => {
    try {
      if (editingCliente) {
        await updateItem(editingCliente.id, formData);
        setEditingCliente(null);
        toast.success('Cambios guardados con éxito.');
      } else {
        await createItem(formData);
        toast.success('Cliente añadido con éxito.');
      }
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      toast.error('Ocurrió un error al guardar el cliente.');
    }
  };

  const handleDeleteCliente = async (id: number) => {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción es irreversible.');
    if (!confirmed) return;

    try {
      await deleteItem(id);
      toast.success('Cliente eliminado con éxito.');
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      toast.error('No se pudo eliminar el cliente.');
    }
  };

 const clientFormFields = [
  { name: 'nombre', label: 'Nombre Completo', type: 'text', required: true, maxLength: 32 },
  { name: 'doc_ident', label: 'Documento de Identidad', type: 'text', required: true, maxLength: 32 },
  { name: 'correo', label: 'Correo Electrónico', type: 'email', required: true, maxLength: 32 },
  { name: 'nacionalidad', label: 'Nacionalidad', type: 'text', maxLength: 32 },
  { name: 'telefono', label: 'Teléfono', type: 'text', required: true, maxLength: 32 },
];


  interface TableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
  }

  const clientTableColumns: TableColumn<Cliente>[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'doc_ident', label: 'Doc ID' },
    { key: 'correo', label: 'Correo', render: (cliente) => cliente.correo || 'N/A' },
    { key: 'telefono', label: 'Teléfono', render: (cliente) => cliente.telefono || 'N/A' },
    { key: 'nacionalidad', label: 'Nacionalidad', render: (cliente) => cliente.nacionalidad || 'N/A' },
    { key: 'actions', label: '' },
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
        Gestión de Clientes
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10"
      >
        <Form<Cliente>
          fields={clientFormFields}
          initialData={editingCliente || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingCliente(null)}
          loading={loading}
          error={error}
          submitButtonText={editingCliente ? 'Guardar Cambios' : 'Registrar Cliente'}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white"
      >
        Clientes Registrados
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
      >
        <Table<Cliente>
          data={clientes}
          columns={clientTableColumns}
          onEdit={setEditingCliente}
          onDelete={handleDeleteCliente}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          emptyMessage="No hay clientes registrados, aún."
          fetchRelatedItemDetails={async () => null}
        />
      </motion.div>
    </div>
  );
};

export default ClienteCRUD;
