'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';
import type { FormField } from './Form/form';

import Form from './Form/form';
import MatriculaAutocompleteInput from './Form/MatriculaAutocompleteInput';
import CedulaAutocompleteInput from './Form/CedulaAutocompleteInput';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';
import ExportPdfButton, { PdfColumn } from './pdfbutton';
import {
  validateConcepto,
  validateDocEmpl,
  validateFecha,
  validateMatriculaEmb,
  validatePrecio,
} from './Form/formmanteniemiento';

// Animaciones para campos individuales
const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

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

// Renderizador de campos personalizados
const renderField = (
  field: FormField,
  value: string,
  error: string | null,
  handleChange: (value: string, name: string) => void,
  disabled: boolean,
  index?: number
): React.ReactNode => {
  if (field.name === 'matricula_emb' && field.type === 'autocomplete') {
    return (
      <motion.div key={field.name} custom={index} variants={fieldVariants}>
        <MatriculaAutocompleteInput
          value={value || ''}
          onChange={(val: string) => handleChange(val, field.name)}
          label={field.label}
          placeholder="ABC-1234"
          disabled={disabled}
          error={error}
          required={field.required}
          maxLength={field.maxLength}
        />
      </motion.div>
    );
  }
  if (field.name === 'doc_empl') {
    return (
      <motion.div key={field.name} custom={index} variants={fieldVariants}>
        <CedulaAutocompleteInput
          value={value || ''}
          onChange={(val: string) => handleChange(val, field.name)}
          label={field.label}
          placeholder={field.placeholder || 'Ej: V-12345678'}
          disabled={disabled}
          error={error}
          required={field.required}
          maxLength={field.maxLength}
          tables={['personal']}
        />
      </motion.div>
    );
  }
  return null;
};

// Campos del formulario
const mantenimientoFormFields: FormField[] = [
  {
    name: 'matricula_emb',
    label: 'Matrícula Embarcación',
    type: 'autocomplete',
    required: true,
    maxLength: 8,
    uppercase: true,
    placeholder: 'Ej: ABC-1234',
    pattern: '^[A-Z]{3}-\\d{4}$',
    customValidate: validateMatriculaEmb,
    inputMode: 'text',
  },
  {
    name: 'concepto',
    label: 'Concepto de Mantenimiento',
    type: 'text',
    required: true,
    maxLength: 32,
    uppercase: true,
    placeholder: 'Ej: CAMBIO DE ACEITE',
    pattern: '^[A-ZÁÉÍÓÚÑ0-9 -]{3,32}$',
    customValidate: validateConcepto,
    inputMode: 'text',
  },
  {
    name: 'fecha',
    label: 'Fecha de Mantenimiento',
    type: 'date',
    required: true,
    customValidate: validateFecha,
  },
  {
    name: 'precio',
    label: 'Precio',
    type: 'text',
    required: true,
    maxLength: 4,
    placeholder: 'Ej: 1500.00',
    pattern: '^\\d{1,4}(\\.\\d{1,2})?$',
    customValidate: validatePrecio,
    inputMode: 'decimal',
  },
  {
    name: 'doc_empl',
    label: 'Documento del Empleado Responsable',
    type: 'text',
    required: true,
    maxLength: 11,
    placeholder: 'Ej: V-12345678',
    pattern: '^[A-Z0-9-]{5,11}$',
    customValidate: validateDocEmpl,
    inputMode: 'text',
  },
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
  {
    key: 'precio',
    label: 'Precio',
    render: (mantenimiento) => `$${mantenimiento.precio.toFixed(2)}`,
  },
  {
    key: 'doc_empl',
    label: 'Doc. Ident. Enncargado',
    isRelated: {
      key: 'doc_empl',
      label: 'Detalles del Empleado Encargado',
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
  {
    key: 'precio',
    label: 'Precio',
    format: (item) => `$${item.precio.toFixed(2)}`,
  },
  {
    key: 'doc_empl',
    label: 'Doc. Ident. Encargado',
    format: (item) => item.doc_empl ?? 'N/A',
  },
];

// Componente principal
const MantenimientoCRUD: React.FC = () => {
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

  function hasError(obj: any): obj is { error: { message?: string } } {
  return obj && typeof obj === 'object' && 'error' in obj;
}

const handleFormSubmit = async (formData: Partial<Mantenimiento>) => {
  try {
    let result: unknown;

    if (editingMantenimiento) {
      result = await updateItem(editingMantenimiento.id, formData);

      if (hasError(result) && result.error) {
        toast.error(`Error al actualizar: ${result.error.message || 'Error desconocido'}`);
        return;
      }

      toast.success('Mantenimiento actualizado exitosamente');
      setEditingMantenimiento(null);
    } else {
      result = await createItem(formData);

      if (hasError(result) && result.error) {
        toast.error(`Error al crear: ${result.error.message || 'Error desconocido'}`);
        return;
      }

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
          renderField={renderField}
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
          headerTitle="Varadero Mar Serena | Mantenimientos"
          queryBuilder={(query) =>
            query
              .select(
                `
              *,
              embarcacion!mantenimientos_matricula_emb_fkey(matricula, nombre, tipo, marcmod)
            `
              )
              .order('fecha', { ascending: false })
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
