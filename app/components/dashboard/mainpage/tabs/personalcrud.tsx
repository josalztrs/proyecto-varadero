'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types'; // Asegúrate de que esta ruta sea correcta

import Form from './form'; // Tu componente Form genérico
import Table from './table'; // Tu componente Table genérico
import useCrud from '@/app/lib/supabase/db_management/crud'; // Tu hook useCrud

const PersonalCRUD = () => {
  // Definición de tipos para las tablas 'personal' y 'servicios'
  type Personal = Tables<'personal'>;

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
    fetchRelatedItemDetails, // Necesario para la columna 'oficio_id'
  } = useCrud<Personal>(supabase, 'personal', {
    itemsPerPage: 5,
    orderBy: { column: 'nombre', ascending: true },
  });

  const [editingPersonal, setEditingPersonal] = useState<Personal | null>(null);
  const [serviciosOptions, setServiciosOptions] = useState<{ value: number; label: string }[]>([]);

  // Función para cargar los tipos de servicios (oficios) para el select
  const fetchServicios = async () => {
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select('id, tipo') // Seleccionar 'id' para el valor y 'tipo' para la etiqueta
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

  // Cargar los servicios al montar el componente
  React.useEffect(() => {
    fetchServicios();
  }, []);

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

  // Definición de los campos del formulario para el personal
  const personalFormFields = [
    { name: 'nombre', label: 'Nombre Completo', type: 'text', required: true, maxLength: 32, uppercase: true },
    { name: 'cedula', label: 'Cédula', type: 'text', required: true, maxLength: 9, uppercase: true, placeholder: 'V-12345678', pattern: '^[VEJPCG]-\\d{7,9}$' }, // Patrón para cédula venezolana
    { name: 'email', label: 'Correo Electrónico', type: 'email', required: true, maxLength: 32, uppercase: true, placeholder: 'ejemplo@dominio.com', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
    { name: 'telefono', label: 'Teléfono', type: 'tel', required: true, maxLength: 13, uppercase: true, placeholder: '+0012345678901', pattern: '^\\+[0-9]{2}[0-9]{11}$' },
    {
      name: 'oficio_id',
      label: 'Oficio / Servicio',
      type: 'select',
      required: true,
      options: serviciosOptions, // Las opciones se cargarán dinámicamente
    },
    { name: 'salario', label: 'Salario', type: 'number', required: true, maxLength: 32 },
  ];

  // Interfaz de columna para la tabla genérica
  interface TableColumn<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
    isRelated?: {
      key: keyof T; // La clave foránea en la tabla actual
      label: string;
      relatedTableName: string;
      relatedIdColumn: string; // La columna ID única en la tabla relacionada
      displayColumn: string; // La columna a mostrar en la celda de la tabla
      hoverDisplayColumns: { key: string; label: string }[]; // Columnas a mostrar al pasar el mouse
    };
  }

  // Definición de las columnas de la tabla de personal
  const personalTableColumns: TableColumn<Personal>[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    {
      key: 'oficio_id', // Esta es la clave foránea en la tabla 'personal'
      label: 'Oficio',
      isRelated: {
        key: 'oficio_id',
        label: 'Detalles del Oficio',
        relatedTableName: 'servicios', // La tabla relacionada es 'servicios'
        relatedIdColumn: 'id', // El 'id' es la clave primaria en 'servicios'
        displayColumn: 'tipo', // Mostrar el 'tipo' de servicio en la celda de la tabla
        hoverDisplayColumns: [
          { key: 'tipo', label: 'Tipo de Oficio' },
          { key: 'precio', label: 'Precio (Servicio)' },
          { key: 'perdidas', label: 'Pérdidas (Servicio)' },
        ],
      },
    },
    { key: 'salario', label: 'Salario', render: (personal) => `$${personal.salario.toFixed(2)}` },
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
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white"
      >
        Personal Registrado
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
            fetchRelatedItemDetails(tableName, value)
          }
        />
      </motion.div>
    </div>
  );
};

export default PersonalCRUD;