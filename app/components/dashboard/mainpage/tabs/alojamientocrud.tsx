'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';
import { FaSignOutAlt, FaPlus, FaHouseUser } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import CedulaAutocompleteInput from './Form/CedulaAutocompleteInput';

import Form from './Form/form';
import useCrud from '@/app/lib/supabase/db_management/crud';
import ExportPdfButton from './pdfbutton';
import { validateDocCliente, validateFecha } from './Form/formalojamiento';

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
  if (field.name === 'doc_cliente') {
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


// Tipos
type Alojamiento = Tables<'alojamientos'>;
type Cliente = Tables<'cliente'>;

type AlojamientoSlot = {
  slot_number: number;
  is_occupied_by_real_client: boolean;
  occupancy_data: Alojamiento | null;
  client_details: Cliente | null;
  is_empty_status: boolean;
};

type AlojamientoForPdf = Alojamiento & {
  cliente: Cliente | null;
};

type PdfColumn<T> = {
  key: keyof T | string;
  label: string;
  format?: (item: T) => string | number;
};

// Constantes
const NUM_ALOJAMIENTO_SLOTS = 8;
const EMPTY_DOC_CLIENTE_STATUS = "VACIO";

const AlojamientoCRUD = () => {
  // Hooks y estado
  const {
    loading,
    error,
    updateItem,
  } = useCrud<Alojamiento>(supabase, 'alojamientos', {
    itemsPerPage: 999,
    orderBy: { column: 'id', ascending: true },
  });

  const [alojamientoSlots, setAlojamientoSlots] = useState<AlojamientoSlot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlotForForm, setSelectedSlotForForm] = useState<AlojamientoSlot | null>(null);

  // Obtener los slots de alojamiento y sus clientes
  const fetchAccommodationSlots = useCallback(async () => {
    const { data: allAlojamientos, error: fetchError } = await supabase
      .from('alojamientos')
      .select(`
        *,
        cliente!alojamientos_doc_cliente_fkey(id, nombre, doc_ident, correo, telefono)
      `);

    if (fetchError) {
      toast.error('Error al cargar alojamientos y detalles de clientes.');
      console.error('Error fetching all alojamientos with client details:', fetchError);
      return;
    }

    const existingRecordsMap = new Map<number, AlojamientoForPdf>();
    allAlojamientos.forEach(a => existingRecordsMap.set(a.id, a as AlojamientoForPdf));

    const slots: AlojamientoSlot[] = Array.from({ length: NUM_ALOJAMIENTO_SLOTS }, (_, i) => {
      const slotNumber = i + 1;
      const currentOccupancyRecord = existingRecordsMap.get(slotNumber);

      const docCliente = currentOccupancyRecord?.doc_cliente;
      const isOccupiedByRealClient = !!currentOccupancyRecord && docCliente !== null && docCliente !== "" && docCliente !== EMPTY_DOC_CLIENTE_STATUS;
      const isEmptyStatus = !!currentOccupancyRecord && docCliente === EMPTY_DOC_CLIENTE_STATUS;

      return {
        slot_number: slotNumber,
        is_occupied_by_real_client: isOccupiedByRealClient,
        is_empty_status: isEmptyStatus,
        occupancy_data: currentOccupancyRecord || null,
        client_details: isOccupiedByRealClient ? currentOccupancyRecord!.cliente : null,
      };
    });

    setAlojamientoSlots(slots);
  }, []);

  useEffect(() => {
    fetchAccommodationSlots();
  }, [fetchAccommodationSlots]);

  // Manejo del formulario de ocupación/desocupación
  const handleFormSubmit = async (formData: Partial<Alojamiento>) => {
    try {
      const slotId = selectedSlotForForm?.slot_number;
      if (!slotId) {
        toast.error('Error: No se seleccionó un alojamiento para la operación.');
        return;
      }

      const doc_cliente_input = formData.doc_cliente;
      let doc_cliente_to_save: string;

      if (doc_cliente_input === undefined || doc_cliente_input === null || String(doc_cliente_input).trim() === '') {
        doc_cliente_to_save = EMPTY_DOC_CLIENTE_STATUS;
      } else {
        doc_cliente_to_save = String(doc_cliente_input).trim().toUpperCase();

        if (doc_cliente_to_save !== EMPTY_DOC_CLIENTE_STATUS) {
          const { data: clientData, error: clientError } = await supabase
            .from('cliente')
            .select('doc_ident')
            .eq('doc_ident', doc_cliente_to_save)
            .single();

          if (clientError || !clientData) {
            if (clientError && clientError.code === 'PGRST116') {
              toast.error(`El Documento de Identidad "${doc_cliente_to_save}" no existe en la base de datos de clientes.`);
            } else {
              toast.error('Error al verificar el Documento de Identidad del cliente.');
            }
            return;
          }
        }
      }

      const updatePayload: Partial<Alojamiento> = {
        doc_cliente: doc_cliente_to_save,
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
      };

      await updateItem(slotId, updatePayload);
      toast.success(`Alojamiento ${slotId} actualizado exitosamente.`);

      setShowForm(false);
      setSelectedSlotForForm(null);
      fetchAccommodationSlots();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Form submission error caught in component:', err);
      if (err.message && err.message.includes('foreign key constraint "alojamientos_doc_cliente_fkey"')) {
        toast.error('Error de clave foránea: El Documento de Identidad del cliente no es válido o no existe. Asegúrese de que "VACIO" esté registrado en la tabla cliente si intenta desocupar.');
      } else if (err.message) {
        toast.error(`Error al procesar el formulario: ${err.message}`);
      } else {
        toast.error('Error desconocido al procesar el formulario.');
      }
    }
  };

  // Desalojar alojamiento
  const handleCheckout = async (slotId: number) => {
    const slot = alojamientoSlots.find(s => s.slot_number === slotId);
    if (!slot || !slot.occupancy_data || !slot.is_occupied_by_real_client) {
      toast.error('Error: Este alojamiento no tiene un cliente real asignado para desalojar.');
      return;
    }

    try {
      await updateItem(slot.occupancy_data.id, {
        doc_cliente: EMPTY_DOC_CLIENTE_STATUS,
        fecha: new Date().toISOString().split('T')[0],
      });
      toast.success(`Alojamiento ${slotId} desalojado exitosamente.`);
      fetchAccommodationSlots();
    } catch (err) {
      console.error('Error al desalojar alojamiento:', err);
      if (err instanceof Error) {
        toast.error(`Error al desalojar el alojamiento: ${err.message}`);
      } else {
        toast.error('Error desconocido al desalojar el alojamiento.');
      }
    }
  };

  // Mostrar formulario para ocupar/desocupar
  const handleAddOrEdit = (slot: AlojamientoSlot) => {
    setSelectedSlotForForm(slot);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedSlotForForm(null);
  };

  // Campos del formulario
  const alojamientoFormFields = [
  {
    name: 'fecha',
    label: 'Fecha de Ocupación',
    type: 'date',
    required: true,
    maxLength: 11,
    customValidate: validateFecha,
  },
  {
    name: 'doc_cliente',
    label: 'Doc. Ident. Cliente (VACIO para no ocupado)',
    type: 'text',
    required: true,
    maxLength: 11,
    placeholder: 'Dejar vacío o escribir "VACIO" para no ocupado',
    inputMode: 'text' as 'text',
    pattern: '^(V|E|J|P|G)-\\d{7,9}$|^VACIO$',
    customValidate: validateDocCliente,
  },
];

  // Columnas para PDF
  const pdfAlojamientoColumns: PdfColumn<AlojamientoForPdf>[] = [
    { key: 'id', label: 'ID Alojamiento' },
    {
      key: 'doc_cliente_estado',
      label: 'Estado Ocupación',
      format: (item: { doc_cliente: string | null; }) => {
        if (item.doc_cliente === EMPTY_DOC_CLIENTE_STATUS) return 'No Ocupado (VACIO)';
        if (item.doc_cliente === null || item.doc_cliente === "") return 'Disponible (NULL/Vacío Real)';
        return String(item.doc_cliente);
      },
    },
    {
      key: 'nombre_cliente',
      label: 'Nombre del Cliente',
      format: (item: AlojamientoForPdf) =>
        item.doc_cliente === null ||
        item.doc_cliente === "" ||
        item.doc_cliente === EMPTY_DOC_CLIENTE_STATUS
          ? 'N/A'
          : item.cliente?.nombre || 'N/A',
    },
    {
      key: 'correo_cliente',
      label: 'Correo del Cliente',
      format: (item: AlojamientoForPdf) =>
        item.doc_cliente === null ||
        item.doc_cliente === "" ||
        item.doc_cliente === EMPTY_DOC_CLIENTE_STATUS
          ? 'N/A'
          : item.cliente?.correo || 'N/A',
    },
    {
      key: 'telefono_cliente',
      label: 'Teléfono del Cliente',
      format: (item: AlojamientoForPdf) =>
        item.doc_cliente === null ||
        item.doc_cliente === "" ||
        item.doc_cliente === EMPTY_DOC_CLIENTE_STATUS
          ? 'N/A'
          : item.cliente?.telefono || 'N/A',
    },
    {
      key: 'fecha',
      label: 'Fecha Ocupación',
      format: (item: { fecha: string | number | Date; }) => item.fecha ? new Date(item.fecha).toLocaleDateString('es-VE') : 'N/A',
    },
  ];

  // Render
  return (
    <div className="container mx-auto px-4 min-h-screen text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.h1 className="text-4xl font-extrabold mb-4 text-amber-500 dark:text-cyan-500">
          Gestión de Alojamientos
        </motion.h1>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-10 border border-amber-200 dark:border-cyan-500/30"
          >
            <Form<Alojamiento>
              fields={alojamientoFormFields}
              initialData={selectedSlotForForm?.occupancy_data || {
                id: selectedSlotForForm?.slot_number || 0,
                fecha: new Date().toISOString().split('T')[0],
                doc_cliente: selectedSlotForForm?.occupancy_data?.doc_cliente || EMPTY_DOC_CLIENTE_STATUS,
              }}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={loading}
              error={error}
              submitButtonText={selectedSlotForForm?.is_occupied_by_real_client ? 'Actualizar Ocupación' : 'Ocupar Alojamiento'}
              renderField={renderField}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center justify-between"
      >
        Estado de Alojamientos
        <ExportPdfButton<AlojamientoForPdf>
          tableName="alojamientos"
          columns={pdfAlojamientoColumns}
          fileName="Reporte_Alojamientos"
          headerTitle="Reporte de Alojamientos"
          queryBuilder={(query) =>
            query.select(`
              *,
              cliente!alojamientos_doc_cliente_fkey(id, nombre, doc_ident, correo, telefono)
            `).order('id', { ascending: true })
          }
        />
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {alojamientoSlots.map((slot) => (
          <motion.div
            key={slot.slot_number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-3 flex flex-col justify-between
                         ${slot.is_occupied_by_real_client ? 'border-l-4 border-amber-500 dark:border-cyan-500' : 'border-l-4 border-gray-300 dark:border-slate-700'}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Alojamiento #{slot.slot_number}
                </h3>
                {slot.is_occupied_by_real_client ? (
                  <FaHouseUser className="text-2xl text-amber-500 dark:text-cyan-500" />
                ) : (
                  <FaHouse className="text-2xl text-gray-400 dark:text-slate-600" />
                )}
              </div>

              {slot.is_occupied_by_real_client ? (
                <>
                  <div className="text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-slate-400">Cliente</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {slot.client_details?.nombre || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-400">Correo del Cliente</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-xs">
                      {slot.client_details?.correo || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-400">Teléfono del Cliente</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {slot.client_details?.telefono || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-400">Fecha de ocupación</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {slot.occupancy_data?.fecha ? new Date(slot.occupancy_data.fecha).toLocaleDateString('es-VE') : 'N/A'}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleCheckout(slot.slot_number)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <FaSignOutAlt /> Desalojar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-24 flex items-center justify-center mb-4">
                    <p className="text-gray-500 dark:text-slate-500 italic">No está ocupado.</p>
                  </div>
                  <button
                    onClick={() => handleAddOrEdit(slot)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-lg transition-colors"
                    disabled={loading}
                  >
                    <FaPlus /> Ocupar
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8 text-gray-700 dark:text-gray-300"
        >
          Cargando alojamientos...
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8 text-red-600 dark:text-red-400"
        >
          Error: {error}
        </motion.div>
      )}
    </div>
  );
};

export default AlojamientoCRUD;