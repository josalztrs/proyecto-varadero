// app/your-path/EmbarcacionCRUD.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';

import Form from './form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';
import { toast } from 'sonner';

// Importa el nuevo componente ExportPdfButton
import ExportPdfButton from './pdfbutton';

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
    { name: 'matricula', label: 'Matrícula', type: 'text', required: true, maxLength: 7, uppercase: true, placeholder: "XXX-123", pattern: '[A-Z]{3}-[0-9]{4}' },
    { name: 'nombre', label: 'Nombre Embarcación', type: 'text', required: true, maxLength: 32, uppercase: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      maxLength: 32,
      uppercase: true,
      options: [
        { value: 'LANCHA', label: 'Lancha' },
        { value: 'YATE', label: 'Yate' },
        { value: 'MOTO_ACUATICA', label: 'Moto Acuática' },
      ],
    },
    { name: 'marcmod', label: 'Marca/Modelo', type: 'text', required: true, maxLength: 20, uppercase: true },
    { name: 'caracteristicas', label: 'Características', type: 'text', required: true, maxLength: 32, uppercase: true, placeholder:"Caracteristicas fisicas del vehiculo" },
    { name: 'ced_cliente', label: 'Documento de Identidad', type: 'text', required: true, maxLength: 16, placeholder:"Doc. Ident. del cliente" },
    { name: 'amarres_asign', label: 'Amarres Asignados', type: 'number', required: true, maxLength: 4 },
    { name: 'cuadr_asign', label: 'Cuadrante', type: 'number', required: true, maxLength: 24 },
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
      format: (item: { cliente: { doc_ident: unknown; }; ced_cliente: unknown; }) => item.cliente?.doc_ident || item.ced_cliente || 'N/A', // Prioriza el doc_ident de la relación, luego ced_cliente directo, o 'N/A'
    },
    {
      key: 'nombre_cliente', // Clave inventada para la columna del PDF
      label: 'Nombre del Dueño',
      format: (item: { cliente: { nombre: unknown; }; }) => item.cliente?.nombre || 'N/A', // Accede a la relación anidada
    },
    {
      key: 'correo_cliente', // Clave inventada para la columna del PDF
      label: 'Correo del Dueño',
      format: (item: { cliente: { correo: unknown; }; }) => item.cliente?.correo || 'N/A', // Accede a la relación anidada
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