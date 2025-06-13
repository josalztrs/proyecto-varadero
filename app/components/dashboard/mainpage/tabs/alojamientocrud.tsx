/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';
import { FaSignOutAlt, FaPlus, FaHouseUser } from 'react-icons/fa';

import Form from './form';
import useCrud from '@/app/lib/supabase/db_management/crud';
import ExportPdfButton from './pdfbutton';
import { FaHouse } from 'react-icons/fa6';

// Tipo Alojamiento basado en tu db_types.ts
type Alojamiento = Tables<'alojamientos'>;
type Cliente = Tables<'cliente'>;

type AlojamientoSlot = {
  slot_number: number;
  // `is_occupied_by_real_client` ahora significa si está realmente ocupado por un cliente con doc_cliente != "VACIO"
  is_occupied_by_real_client: boolean;
  occupancy_data: Alojamiento | null;
  client_details: Cliente | null;
  is_empty_status: boolean; // Nuevo estado para doc_cliente "VACIO"
};

type AlojamientoForPdf = Alojamiento & {
  cliente: Cliente | null;
};

const NUM_ALOJAMIENTO_SLOTS = 8;
const EMPTY_DOC_CLIENTE_STATUS = "VACIO"; // Define la constante para el estado "VACIO"

const AlojamientoCRUD = () => {
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
      // Considera "VACIO" como el estado especial de "no ocupado"
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

  const handleFormSubmit = async (formData: Partial<Alojamiento>) => {
    try {
      const slotId = selectedSlotForForm?.slot_number;
      if (!slotId) {
        toast.error('Error: No se seleccionó un alojamiento para la operación.');
        return;
      }

      const doc_cliente_input = formData.doc_cliente;
      let doc_cliente_to_save: string; // doc_cliente siempre será un string, no null

      if (doc_cliente_input === undefined || doc_cliente_input === null || String(doc_cliente_input).trim() === '') {
        // Si el campo está vacío, la intención es poner el estado "VACIO"
        doc_cliente_to_save = EMPTY_DOC_CLIENTE_STATUS;
      } else {
        doc_cliente_to_save = String(doc_cliente_input).trim().toUpperCase();

        // Si el valor ingresado es "VACIO", lo aceptamos directamente sin verificar en la tabla cliente
        if (doc_cliente_to_save === EMPTY_DOC_CLIENTE_STATUS) {
          // No hace falta verificar en la tabla `cliente` para el ID "VACIO"
          // (Asumiendo que has creado un cliente con doc_ident = "VACIO")
        } else {
          // Si no es "VACIO", validamos que el Documento de Identidad exista en la tabla 'cliente'
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

      // Prepara los datos a actualizar
      const updatePayload: Partial<Alojamiento> = {
        doc_cliente: doc_cliente_to_save,
        fecha: formData.fecha || new Date().toISOString().split('T')[0], // Asegura que siempre haya una fecha
      };

      await updateItem(slotId, updatePayload);
      toast.success(`Alojamiento ${slotId} actualizado exitosamente.`);

      setShowForm(false);
      setSelectedSlotForForm(null);
      fetchAccommodationSlots();
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

  const handleCheckout = async (slotId: number) => {
    const slot = alojamientoSlots.find(s => s.slot_number === slotId);
    // Solo permitir desalojar si realmente está ocupado por un cliente real (no "VACIO")
    if (!slot || !slot.occupancy_data || !slot.is_occupied_by_real_client) {
      toast.error('Error: Este alojamiento no tiene un cliente real asignado para desalojar.');
      return;
    }

    try {
      // Establecer doc_cliente a "VACIO" al desocupar, según el nuevo requisito
      await updateItem(slot.occupancy_data.id, {
        doc_cliente: EMPTY_DOC_CLIENTE_STATUS,
        fecha: new Date().toISOString().split('T')[0], // Actualizar la fecha al día de la desocupación
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

  const handleAddOrEdit = (slot: AlojamientoSlot) => {
    setSelectedSlotForForm(slot);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedSlotForForm(null);
  };

  const alojamientoFormFields = [
    { name: 'fecha', label: 'Fecha de Ocupación', type: 'date', required: true, maxLength: 11 },
    // El placeholder ahora indica el valor especial "VACIO"
    { name: 'doc_cliente', label: 'Doc. Ident. Cliente (VACIO para no ocupado)', type: 'text', maxLength: 16, placeholder: `Dejar vacío o escribir "${EMPTY_DOC_CLIENTE_STATUS}" para no ocupado` },
  ];

  const pdfAlojamientoColumns: PdfColumn<AlojamientoForPdf>[] = [
    { key: 'id', label: 'ID Alojamiento' },
    {
      key: 'doc_cliente_estado',
      label: 'Estado Ocupación',
      format: (item: { doc_cliente: string | null; }) => {
        if (item.doc_cliente === EMPTY_DOC_CLIENTE_STATUS) return 'No Ocupado (VACIO)';
        if (item.doc_cliente === null || item.doc_cliente === "") return 'Disponible (NULL/Vacío Real)'; // En caso de que haya datos antiguos o mal formados
        return String(item.doc_cliente); // Si es un ID de cliente real
      },
    },
    {
      key: 'nombre_cliente',
      label: 'Nombre del Cliente',
      format: (item: { doc_cliente: string | null; cliente: { nombre: any; }; }) => (item.doc_cliente === null || item.doc_cliente === "" || item.doc_cliente === EMPTY_DOC_CLIENTE_STATUS) ? 'N/A' : item.cliente?.nombre || 'N/A',
    },
    {
      key: 'correo_cliente',
      label: 'Correo del Cliente',
      format: (item: { doc_cliente: string | null; cliente: { correo: any; }; }) => (item.doc_cliente === null || item.doc_cliente === "" || item.doc_cliente === EMPTY_DOC_CLIENTE_STATUS) ? 'N/A' : item.cliente?.correo || 'N/A',
    },
    {
      key: 'telefono_cliente',
      label: 'Teléfono del Cliente',
      format: (item: { doc_cliente: string | null; cliente: { telefono: any; }; }) => (item.doc_cliente === null || item.doc_cliente === "" || item.doc_cliente === EMPTY_DOC_CLIENTE_STATUS) ? 'N/A' : item.cliente?.telefono || 'N/A',
    },
    {
      key: 'fecha',
      label: 'Fecha Ocupación',
      format: (item: { fecha: string | number | Date; }) => item.fecha ? new Date(item.fecha).toLocaleDateString('es-VE') : 'N/A',
    },
  ];

  return (
    <div className="container mx-auto px-4 min-h-screen text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-4xl font-extrabold mb-4 text-amber-500 dark:text-cyan-500"
        >
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
                // Inicializar con el valor actual o el estado "VACIO" si no hay datos
                doc_cliente: selectedSlotForForm?.occupancy_data?.doc_cliente || EMPTY_DOC_CLIENTE_STATUS,
              }}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={loading}
              error={error}
              submitButtonText={selectedSlotForForm?.is_occupied_by_real_client ? 'Actualizar Ocupación' : 'Ocupar Alojamiento'}
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
                // Ocupado por un cliente real (doc_cliente no es "VACIO", null o "")
                <>
                  <div className="text-sm">
                    <div>
                      <p className=" text-gray-500 dark:text-slate-400">Cliente</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {slot.client_details?.nombre || 'N/A'}
                      </p>
                    </div>
                    </div>
                    <div>
                      <p className=" text-gray-500 dark:text-slate-400">Correo del Cliente</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium text-xs">
                        {slot.client_details?.correo || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className=" text-gray-500 dark:text-slate-400">Teléfono del Cliente</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {slot.client_details?.telefono || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className=" text-gray-500 dark:text-slate-400">Fecha de ocupación</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {slot.occupancy_data?.fecha ? new Date(slot.occupancy_data.fecha).toLocaleDateString('es-VE') : 'N/A'}
                      </p>
                  </div>
                  <div className="flex justify-center"> {/* Centrar el botón */}
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
                // No ocupado por un cliente real (incluye el estado "VACIO" y null/vacío)
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