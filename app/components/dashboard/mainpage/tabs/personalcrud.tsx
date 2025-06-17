'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';

import Form from './Form/form';
import Table from './table';
import useCrud from '@/app/lib/supabase/db_management/crud';
import ExportPdfButton from './pdfbutton';

// Tipos
type Personal = Tables<'personal'>;
type Servicios = Tables<'servicios'>;

// Columnas para la tabla
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

// Columnas para PDF
type PersonalForPdf = Personal & {
  servicios: Servicios | null;
};

type PdfColumn<T> = {
  key: keyof T | string;
  label: string;
  format?: (item: T) => string | number;
};

const PersonalCRUD = () => {
  // Hooks y estado
  const {
    data: personal,
    loading,
    error,
    currentPage,
    totalPages,
    createItem,
    updateItem,
    deleteItem,
    goToPage,
    fetchRelatedItemDetails,
  } = useCrud<Personal>(supabase, 'personal', {
    itemsPerPage: 5,
    orderBy: { column: 'nombre', ascending: true },
  });

  const [editingPersonal, setEditingPersonal] = useState<Personal | null>(null);
  const [serviciosOptions, setServiciosOptions] = useState<{ value: number; label: string }[]>([]);

  // Cargar opciones de servicios
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const { data, error } = await supabase
          .from('servicios')
          .select('id, tipo')
          .order('tipo', { ascending: true });

        if (error) throw error;

        const options = data.map((servicio) => ({
          value: servicio.id,
          label: servicio.tipo,
        }));
        setServiciosOptions(options);
      } catch (err) {
        console.error('Error al cargar los tipos de servicios:', err);
        toast.error('Error al cargar las opciones de oficios.');
      }
    };
    fetchServicios();
  }, []);

  // Manejo de formulario
  const handleFormSubmit = async (formData: Partial<Personal>) => {
    try {
      if (editingPersonal) {
        await updateItem(editingPersonal.id, formData);
        setEditingPersonal(null);
        toast.success('Información del personal actualizada exitosamente.');
      } else {
        await createItem(formData);
        toast.success('Nuevo miembro del personal registrado exitosamente.');
      }
    } catch (err) {
      console.error('Error al enviar el formulario de personal:', err);
      toast.error('Ocurrió un error al guardar los datos del personal.');
    }
  };

  // Manejo de eliminación
  const handleDeletePersonal = async (id: number) => {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este miembro del personal? Esta acción es irreversible.');
    if (!confirmed) return;

    try {
      await deleteItem(id);
      toast.success('Miembro del personal eliminado con éxito.');
    } catch (err) {
      console.error('Error al eliminar miembro del personal:', err);
      toast.error('No se pudo eliminar el miembro del personal.');
    }
  };

  // Campos del formulario
  const personalFormFields = [
  {
    name: 'nombre',
    label: 'Nombre Completo',
    type: 'text',
    required: true,
    maxLength: 32,
    uppercase: true,
    placeholder: 'Ej: MARÍA PÉREZ',
    pattern: '^[A-ZÁÉÍÓÚÑáéíóúñ -]{3,32}$',
    inputMode: 'text' as const,
  },
  {
    name: 'cedula',
    label: 'Cédula',
    type: 'text',
    required: true,
    maxLength: 11, // Para admitir V-123456789
    uppercase: true,
    placeholder: 'Ej: V-12345678',
    pattern: '^[VEJPCG]-\\d{7,9}$',
    inputMode: 'text' as const,
  },
  {
    name: 'email',
    label: 'Correo Electrónico',
    type: 'email',
    required: true,
    maxLength: 32,
    uppercase: true,
    placeholder: 'Ej: ejemplo@dominio.com',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    inputMode: 'email' as const,
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    type: 'tel',
    required: true,
    maxLength: 16, // Para admitir +584121234567
    uppercase: true,
    placeholder: 'Ej: +584121234567',
    pattern: '^\\+\\d{8,15}$',
    inputMode: 'tel' as const,
  },
  {
    name: 'oficio_id',
    label: 'Oficio / Servicio',
    type: 'select',
    required: true,
    options: serviciosOptions,
    placeholder: 'Seleccione un oficio',
  },
];

  // Columnas de la tabla
  const personalTableColumns: TableColumn <Personal>  [] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    {
      key: 'oficio_id',
      label: 'Oficio',
      isRelated: {
        key: 'oficio_id',
        label: 'Detalles del Oficio',
        relatedTableName: 'servicios',
        relatedIdColumn: 'id',
        displayColumn: 'tipo',
        hoverDisplayColumns: [
          { key: 'tipo', label: 'Tipo de Oficio' },
          { key: 'precio', label: 'Precio (Servicio)' },
          { key: 'perdidas', label: 'Pérdidas (Servicio)' },
          { key: 'salario', label: 'Salario (Servicio) ' },
        ],
      },
    },
    { key: 'actions', label: 'Acciones' },
  ];

  // Columnas para PDF
  const pdfPersonalColumns: PdfColumn<PersonalForPdf>[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre Completo' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'telefono', label: 'Teléfono' },
    {
      key: 'oficio',
      label: 'Oficio',
      format: (item: PersonalForPdf) => item.servicios?.tipo ?? 'N/A',
    },
    {
      key: 'salario_servicio',
      label: 'Salario del personal',
      format: (item: PersonalForPdf) => item.servicios?.salario ? `$${item.servicios.salario.toFixed(2)}` : 'N/A',
    },

  ];

  // Render
  return (
    <div className="container mx-auto px-4 min-h-screen text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" richColors />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-10 text-center text-amber-500 dark:text-cyan-500"
      >
        Gestión de Personal
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10"
      >
        <Form<Personal>
          fields={personalFormFields}
          initialData={editingPersonal || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingPersonal(null)}
          loading={loading}
          error={error}
          submitButtonText={editingPersonal ? 'Guardar Cambios' : 'Registrar Personal'}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center justify-between"
      >
        Personal Registrado
        <ExportPdfButton<PersonalForPdf>
          tableName="personal"
          columns={pdfPersonalColumns}
          fileName="Reporte_Personal"
          headerTitle="Reporte de Personal"
          queryBuilder={(query) =>
            query.select(`
              *,
              servicios!personal_oficio_id_fkey(tipo, precio, perdidas, salario)
            `).order('nombre', { ascending: true })
          }
        />
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
      >
        <Table<Personal>
          data={personal}
          columns={personalTableColumns}
          onEdit={setEditingPersonal}
          onDelete={handleDeletePersonal}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          emptyMessage="No hay personal registrado aún."
          deleteConfirmMessage="¿Estás seguro de que quieres eliminar este miembro del personal? Esta acción es irreversible."
          fetchRelatedItemDetails={(tableName, idColumn, value) =>
            fetchRelatedItemDetails(tableName, idColumn, value)
          }
        />
      </motion.div>
    </div>
  );
};

export default PersonalCRUD;