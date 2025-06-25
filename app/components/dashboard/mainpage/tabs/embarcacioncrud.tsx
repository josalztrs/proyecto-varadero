/* eslint-disable @typescript-eslint/no-explicit-any */
// app/your-path/EmbarcacionCRUD.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';
import CedulaAutocompleteInput from './Form/CedulaAutocompleteInput';

import Form from './Form/form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';
import { toast } from 'sonner';

// Importa el nuevo componente ExportPdfButton
import ExportPdfButton from './pdfbutton';

// Usa el tipo PdfColumn importado desde pdfbutton para evitar incompatibilidades
import type { PdfColumn } from './pdfbutton';
import { validateAmarresAsign, validateCaracteristicas, validateCedCliente, validateCuadrAsign, validateMarcaModelo, validateMatricula, validateNombreEmbarcacion, validateTipo } from './Form/formembarcaciones';

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const renderField = (
  field: any,
  value: string,
  error: string | null,
  handleChange: (value: string, name: string) => void,
  disabled: boolean,
  index?: number
): React.ReactNode => {
  if (field.name === 'ced_cliente') {
    return (
      <motion.div key={field.name} custom={index} variants={fieldVariants}>
        <CedulaAutocompleteInput
          value={value || ''}
          onChange={(val: string) => handleChange(val, field.name)}
          label={field.label}
          placeholder={field.placeholder || 'V-12345678'}
          disabled={disabled}
          error={error}
          required={field.required}
          maxLength={field.maxLength}
          tables={['cliente']} // Solo buscará en clientes
        />
      </motion.div>
    );
  }
  return null;
};

const EmbarcacionCRUD = () => {
  type Embarcacion = Tables<'embarcacion'>;
  type Cliente = Tables<'cliente'>;

  // Definición del tipo que esperará el ExportPdfButton, incluyendo la relación cliente
  // Es importante que este tipo refleje la forma exacta de los datos que la función queryBuilder devolverá.
  type EmbarcacionForPdf = Embarcacion & {
    cliente: {
      nombre: Cliente['nombre'];
      doc_ident: Cliente['doc_ident'];
      correo: Cliente['correo'];
      telefono: Cliente['telefono'];
    } | null;
  };

  const {
    data: embarcaciones, // Datos paginados para la tabla
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
      // Ya no necesitas fetchAllEmbarcaciones aquí, el botón lo hará por sí mismo
    } catch (err) {
      toast.error('Error al enviar el formulario. Revisa los campos e intenta de nuevo');
      console.error('Form submission error caught in component:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      toast.success('Embarcación eliminada correctamente');
      // Ya no necesitas fetchAllEmbarcaciones aquí
    } catch (err) {
      toast.error('Error al eliminar la embarcación');
      console.error(err);
    }
  };

  const embarcacionFormFields = [
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    required: true,
    maxLength: 32,
    uppercase: true,
    options: [
      { value: 'LANCHA', label: 'Lancha' },
      { value: 'YATE', label: 'Yate' },
      { value: 'MOTO_ACUATICA', label: 'Moto Acuática' },
    ],customValidate: validateTipo,
  },
  { name: 'matricula', label: 'Matrícula', type: 'text', required: true, maxLength: 8, uppercase: true, placeholder: "LNC-1234 / YAT-1234 / MTA-123", inputMode: "text" as const, pattern: '^[A-Z]{3}-\\d{4}$', customValidate: (value: string, allValues?: Record<string, any>) => {
    // Usa el tipo más reciente, ya sea del evento o del formData
    const tipoActual = allValues?.tipo ?? '';
    return validateMatricula(value, { tipo: tipoActual });
  }  },
  { name: 'nombre', label: 'Nombre Embarcación', type: 'text', required: true, maxLength: 32, uppercase: true, inputMode: "text" as const, pattern: '^[A-ZÁÉÍÓÚÑ0-9 -]{3,32}$', placeholder: 'Nombre de la embarcación', customValidate: validateNombreEmbarcacion, },
  { name: 'marcmod', label: 'Marca/Modelo', type: 'text', required: true, maxLength: 20, uppercase: true, inputMode: "text" as const, pattern: '^[A-ZÁÉÍÓÚÑ0-9 -]{2,20}$', placeholder: 'Marca o modelo', customValidate: validateMarcaModelo, },
  { name: 'caracteristicas', label: 'Características', type: 'text', required: true, maxLength: 32, uppercase: true, inputMode: "text" as const, pattern: '^[A-ZÁÉÍÓÚÑ0-9 -]{3,32}$', placeholder: 'Características físicas', customValidate: validateCaracteristicas,  },
  { name: 'ced_cliente', label: 'Documento de Identidad', type: 'text', required: true, maxLength: 11, uppercase: true, inputMode: "text" as const, pattern: '^[VEJPG]-\\d{7,9}$', placeholder: 'V-12345678', customValidate: validateCedCliente, },
  { name: 'amarres_asign', label: 'Amarres Asignados', type: 'text', required: true, maxLength: 2, inputMode: "numeric" as const, pattern: '^\\d{1,2}$', placeholder: 'Cantidad de amarres', customValidate: validateAmarresAsign, },
  { name: 'cuadr_asign', label: 'Cuadrante', type: 'text', required: true, maxLength: 3, inputMode: "numeric" as const, pattern: '^\\d{1,6}$', placeholder: 'Número de cuadrante', customValidate: validateCuadrAsign, },
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
      key: 'ced_cliente',
      label: 'Dueño',
      isRelated: {
        key: 'ced_cliente',
        label: 'Dueño',
        relatedTableName: 'cliente',
        relatedIdColumn: 'doc_ident',
        displayColumn: 'doc_ident',
        hoverDisplayColumns: [
          { key: 'nombre', label: 'Nombre' },
          { key: 'correo', label: 'Correo' },
          { key: 'telefono', label: 'Teléfono' },
        ],
      },
    },
    { key: 'actions', label: 'Acciones' },
  ];

  // Definición de las columnas para el PDF, usando la nueva estructura PdfColumn
  // y especificando la función de formato para los datos relacionados.
  const pdfEmbarcacionColumns: PdfColumn<EmbarcacionForPdf>[] = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'nombre', label: 'Nombre Embarcación' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'marcmod', label: 'Marca/Modelo' },
    { key: 'caracteristicas', label: 'Características' },
    { key: 'amarres_asign', label: 'Amarres Asignados' },
    { key: 'cuadr_asign', label: 'Cuadrante' },
    {
      key: 'doc_cliente', // Usamos esta clave, aunque el dato venga de la relación
      label: 'Doc. Ident. Cliente',
      format: (item: EmbarcacionForPdf) => item.cliente?.doc_ident ?? item.ced_cliente ?? 'N/A', // Prioriza el doc_ident de la relación, luego ced_cliente directo, o 'N/A'
    },
    {
      key: 'nombre_cliente', // Clave inventada para la columna del PDF
      label: 'Nombre del Dueño',
      format: (item: EmbarcacionForPdf) => item.cliente?.nombre ?? 'N/A', // Accede a la relación anidada
    },
    {
      key: 'correo_cliente', // Clave inventada para la columna del PDF
      label: 'Correo del Dueño',
      format: (item: EmbarcacionForPdf) => item.cliente?.correo ?? 'N/A', // Accede a la relación anidada
    },
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
           renderField={renderField}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center justify-between"
      >
        Embarcaciones Registradas
        {/* Aquí integramos el ExportPdfButton */}
        <ExportPdfButton<EmbarcacionForPdf> // Especificamos el tipo para el botón
          tableName="embarcacion"
          columns={pdfEmbarcacionColumns}
          fileName="Reporte_Embarcaciones"
          headerTitle="Varadero Mar Serena | Embarcaciones"
          // Personaliza la consulta para incluir los datos del cliente
          queryBuilder={(query) =>
            query.select(`
              *,
              cliente(nombre, doc_ident, correo, telefono)
            `).order('matricula', { ascending: true })
          }
        />
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