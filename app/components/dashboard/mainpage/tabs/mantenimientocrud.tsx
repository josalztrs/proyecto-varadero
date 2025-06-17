'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';

import Form from './Form/form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';
import ExportPdfButton, { PdfColumn } from './pdfbutton';

// Tipos
type Mantenimiento = Tables<'mantenimientos'> & { id: string; doc_empl: string };
type Embarcacion = Tables<'embarcacion'>;

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
    hoverDisplayColumns: { key: string; label: string }[];
  };
}

type MantenimientoForPdf = Mantenimiento & {
  embarcacion: Embarcacion | null;
};

// Campos del formulario
const mantenimientoFormFields = [
  { name: 'matricula_emb', label: 'Matrícula Embarcación', type: 'text', required: true, maxLength: 8, uppercase: true },
  { name: 'concepto', label: 'Concepto de Mantenimiento', type: 'text', required: true, maxLength: 32, uppercase: true },
  { name: 'fecha', label: 'Fecha de Mantenimiento', type: 'date', required: true },
  { name: 'precio', label: 'Precio', type: 'number', required: true, maxLength: 8 },
  { name: 'doc_empl', label: 'Documento del Empleado Responsable', type: 'text', required: true, maxLength: 16, placeholder: 'Doc. Ident. del personal' },
];

// Columnas de la tabla
const mantenimientoTableColumns: TableColumn<Mantenimiento>[] = [
  {
    key: 'matricula_emb',
    label: 'Embarcación',
    isRelated: {
      key: 'matricula_emb',
      label: 'Detalles Embarcación',
      relatedTableName: 'embarcacion',
      relatedIdColumn: 'matricula',
      displayColumn: 'nombre',
      hoverDisplayColumns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'marcmod', label: 'Marca/Modelo' },
        { key: 'matricula', label: 'Matrícula' },
        { key: 'ced_cliente', label: 'Doc. Ident. Cliente' },
      ],
    },
  },
  { key: 'concepto', label: 'Concepto' },
  {
    key: 'fecha',
    label: 'Fecha',
    render: (mantenimiento) => {
      try {
        return new Date(mantenimiento.fecha).toLocaleDateString('es-VE');
      } catch {
        return String(mantenimiento.fecha);
      }
    },
  },
  { key: 'precio', label: 'Precio', render: (mantenimiento) => `$${mantenimiento.precio.toFixed(2)}` },
  {
    key: 'doc_empl',
    label: 'Doc. Ident. Empleado',
    isRelated: {
      key: 'doc_empl',
      label: 'Detalles Empleado',
      relatedTableName: 'personal',
      relatedIdColumn: 'cedula',
      displayColumn: 'cedula',
      hoverDisplayColumns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'cargo', label: 'Cargo' },
        { key: 'telefono', label: 'Teléfono' },
      ],
    },
  },
  { key: 'actions', label: 'Acciones' },
];

// Columnas para PDF
const pdfMantenimientoColumns: PdfColumn<MantenimientoForPdf>[] = [
  { key: 'id', label: 'ID Mantenimiento' },
  {
    key: 'embarcacion_matricula',
    label: 'Matrícula Embarcación',
    format: (item) => item.embarcacion?.matricula ?? 'N/A',
  },
  {
    key: 'embarcacion_nombre',
    label: 'Nombre Embarcación',
    format: (item) => item.embarcacion?.nombre ?? 'N/A',
  },
  { key: 'concepto', label: 'Concepto de Mantenimiento' },
  {
    key: 'fecha',
    label: 'Fecha de Mantenimiento',
    format: (item) => new Date(item.fecha).toLocaleDateString('es-VE'),
  },
  { key: 'precio', label: 'Precio', format: (item) => `$${item.precio.toFixed(2)}` },
  {
    key: 'doc_empl',
    label: 'Doc. Ident. Empleado',
    format: (item) => item.doc_empl ?? 'N/A',
  },
];

// Componente principal
const MantenimientoCRUD = () => {
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
    fetchRelatedItemDetails,
  } = useCrud<Mantenimiento>(supabase, 'mantenimientos', {
    itemsPerPage: 5,
    orderBy: { column: 'fecha', ascending: false },
  });

  const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | null>(null);

  const handleFormSubmit = async (formData: Partial<Mantenimiento>) => {
    try {
      if (editingMantenimiento) {
        await updateItem(editingMantenimiento.id, formData);
        toast.success('Mantenimiento actualizado exitosamente');
        setEditingMantenimiento(null);
      } else {
        await createItem(formData);
        toast.success('Mantenimiento registrado exitosamente');
      }
    } catch (err) {
      console.error('Form submission error caught in component:', err);
      toast.error('Error al procesar el formulario. Revisa los campos e intenta de nuevo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      toast.success('Mantenimiento eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Error al eliminar el mantenimiento.');
    }
  };

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
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center justify-between"
      >
        Mantenimientos Registrados
        <ExportPdfButton<MantenimientoForPdf>
          tableName="mantenimientos"
          columns={pdfMantenimientoColumns}
          fileName="Reporte_Mantenimientos"
          queryBuilder={(query) =>
            query.select(`
              *,
              embarcacion!mantenimientos_matricula_emb_fkey(matricula, nombre, tipo, marcmod)
            `).order('fecha', { ascending: false })
          }
        />
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
          onDelete={handleDelete}
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
