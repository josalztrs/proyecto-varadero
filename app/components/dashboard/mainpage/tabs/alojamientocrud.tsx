/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/app/lib/supabase/supabase';
import type { Tables } from '@/app/lib/supabase/db_types';
import { GiSailboat, GiAnchor } from 'react-icons/gi';
import { FaEdit, FaSignOutAlt, FaPlus } from 'react-icons/fa';

import Form from './form';
import useCrud from '@/app/lib/supabase/db_management/crud';

// Alojamiento type based *strictly* on your provided db_types.ts
// 'id' is the primary key, and it's also your slot_number
type Alojamiento = Tables<'alojamientos'>; // No need to add 'id: number' here, as it's already in Tables<'alojamientos'>

type AlojamientoSlot = {
  slot_number: number; // This will now directly correspond to 'alojamientos.id'
  is_occupied: boolean;
  occupancy_data: Alojamiento | null; // The actual DB record if it exists
  client_details: Tables<'cliente'> | null;
};

const NUM_ALOJAMIENTO_SLOTS = 8;

const AlojamientoCRUD = () => {
  const {
    loading,
    error,
    // We will only use updateItem based on the logic that slots always exist
    updateItem,
    // We'll use a direct Supabase query for fetching to manage the 8 slots
  } = useCrud<Alojamiento>(supabase, 'alojamientos', {
    itemsPerPage: 999,
    orderBy: { column: 'id', ascending: true }, // Order by ID (slot number)
  });

  const [alojamientoSlots, setAlojamientoSlots] = useState<AlojamientoSlot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlotForForm, setSelectedSlotForForm] = useState<AlojamientoSlot | null>(null);

  const fetchAccommodationSlots = useCallback(async () => {
    // Fetch all alojamientos records
    const { data: allAlojamientos, error: fetchError } = await supabase
      .from('alojamientos')
      .select('*');

    if (fetchError) {
      toast.error('Error al cargar alojamientos.');
      console.error('Error fetching all alojamientos:', fetchError);
      return;
    }

    // Create a map for quick lookup of existing records by their 'id' (which is the slot number)
    const existingRecordsMap = new Map<number, Alojamiento>();
    allAlojamientos.forEach(a => existingRecordsMap.set(a.id, a));

    // Collect all client IDs from the fetched alojamientos that are actually occupied
    const clientIds = allAlojamientos
      .filter(a => a.id_cliente !== 0) // Filter by id_cliente not being 0 (unoccupied)
      .map(a => a.id_cliente);

    const clientDetailsMap = new Map<number, Tables<'cliente'>>();

    if (clientIds.length > 0) {
      const { data: clients, error: clientsError } = await supabase
        .from('cliente')
        .select('*')
        .in('id', Array.from(new Set(clientIds))); // Use Set to avoid duplicate client ID fetches

      if (clientsError) {
        toast.error('Error al cargar detalles de clientes.');
        console.error('Error fetching client details:', clientsError);
      } else {
        clients.forEach(client => clientDetailsMap.set(client.id, client));
      }
    }

    // Construct the 8 virtual slots
    const slots: AlojamientoSlot[] = Array.from({ length: NUM_ALOJAMIENTO_SLOTS }, (_, i) => {
      const slotNumber = i + 1; // Slots 1 to 8

      // Get the actual DB record for this slot number (its ID)
      const currentOccupancyRecord = existingRecordsMap.get(slotNumber);

      // Determine if it's occupied based on id_cliente being non-zero
      const isOccupied = !!currentOccupancyRecord && currentOccupancyRecord.id_cliente !== 0;

      return {
        slot_number: slotNumber,
        is_occupied: isOccupied,
        occupancy_data: currentOccupancyRecord || null, // Will be null if no corresponding DB record for this slot ID
        client_details: isOccupied ? clientDetailsMap.get(currentOccupancyRecord!.id_cliente) || null : null,
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

      // Client ID validation
      const client_id_input = formData.id_cliente;
      let client_id: number;

      // If id_cliente is empty or 0 and we are trying to occupy
      if (client_id_input === undefined || client_id_input === null || String(client_id_input).trim() === '') {
        // If it's a new occupation, id_cliente cannot be empty
        if (!selectedSlotForForm?.is_occupied) {
          toast.error('Debe ingresar un ID de cliente para ocupar el alojamiento.');
          return;
        }
        client_id = 0; // If clearing/emptying or it's an existing edit to empty (not allowed by current form flow but good for robustness)
      } else {
        const parsedId = Number(client_id_input);
        if (isNaN(parsedId) || parsedId <= 0) {
          toast.error('ID de cliente inválido. Debe ser un número positivo.');
          return;
        }
        client_id = parsedId;
      }

      // Ensure the record for this slot number exists before attempting to update.
      // This relies on the pre-population step done directly in Supabase.
      const existingOccupancyRecord = alojamientoSlots.find(s => s.slot_number === slotId)?.occupancy_data;

      if (!existingOccupancyRecord) {
        // This is a critical error and should not happen if the DB is pre-populated with IDs 1-8.
        toast.error(`Error interno: No se encontró un registro existente para el alojamiento #${slotId}. Por favor, asegúrese de que todos los alojamientos (1-8) estén inicializados en la base de datos.`);
        return;
      }

      // Always use updateItem, using the slotId as the primary key for the update
      await updateItem(slotId, { // The 'id' (primary key) to update is the slotId itself
        id_cliente: client_id,
        fecha: formData.fecha,
      });
      toast.success(`Alojamiento ${slotId} actualizado exitosamente.`);

      setShowForm(false);
      setSelectedSlotForForm(null);
      fetchAccommodationSlots(); // Re-fetch to update UI
    } catch (err: any) {
      console.error('Form submission error caught in component:', err);
      if (err.message && err.message.includes('foreign key constraint')) {
        toast.error('Error: El ID de cliente ingresado no existe. Por favor, verifique el ID del cliente.');
      } else {
        toast.error('Error al procesar el formulario.');
      }
    }
  };

  const handleCheckout = async (slotId: number) => {
    const slot = alojamientoSlots.find(s => s.slot_number === slotId);
    if (!slot || !slot.occupancy_data) {
      toast.error('Error: No hay alojamiento ocupado en este espacio para desocupar.');
      return;
    }

    try {
      // Update the existing record to set id_cliente to 0 (as per your schema) and clear the date
      await updateItem(slot.occupancy_data.id, { // Use the record's primary ID (which is the slot number itself)
        id_cliente: 0, // Set to 0 to indicate unoccupied
        fecha: new Date().toISOString().split('T')[0], // Set to current date for checkout, or null/empty string if schema allows
      });
      toast.success(`Alojamiento ${slotId} desocupado exitosamente.`);
      fetchAccommodationSlots(); // Re-fetch to update UI
    } catch (err) {
      console.error('Error al desocupar alojamiento:', err);
      toast.error('Error al desocupar el alojamiento.');
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
    // 'fecha' is required to be filled if occupying, but if the record is initially 'empty' it might be null.
    // Given your current db_types, fecha is string and has no '?' so it might be non-nullable in DB.
    // If fecha is required on INSERT/UPDATE in DB, it needs to be filled.
    { name: 'fecha', label: 'Fecha de Ocupación', type: 'date', required: true, maxLength: 32 },
    // id_cliente is a number, and 0 is used for unoccupied.
    // It's required if you're trying to occupy, but can be 0.
    { name: 'id_cliente', label: 'ID Cliente', type: 'number', required: true, maxLength: 32 },
  ];

  return (
    <div className="container mx-auto px-4 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Header with animated title */}
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

      {/* Form Section */}
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
              // Initial data for the form based on selected slot
              initialData={selectedSlotForForm?.is_occupied
                           ? selectedSlotForForm.occupancy_data! // If occupied, use its data
                           : {
                               id: selectedSlotForForm?.slot_number || 0, // Ensure id is passed for a new occupation
                               fecha: new Date().toISOString().split('T')[0], // Default current date
                               id_cliente: 0 // Default to 0 for a new occupation
                             }}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={loading}
              error={error}
              submitButtonText={selectedSlotForForm?.is_occupied ? 'Actualizar Ocupación' : 'Ocupar Alojamiento'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accommodation Cards Section */}
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
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 flex flex-col justify-between
                        ${slot.is_occupied ? 'border-l-4 border-amber-500 dark:border-cyan-500' : 'border-l-4 border-gray-300 dark:border-slate-700'}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Alojamiento #{slot.slot_number}
                </h3>
                {slot.is_occupied ? (
                  <GiSailboat className="text-2xl text-amber-500 dark:text-cyan-500" />
                ) : (
                  <GiAnchor className="text-2xl text-gray-400 dark:text-slate-600" />
                )}
              </div>

              {slot.is_occupied ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Cliente</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {slot.client_details?.nombre || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">ID Cliente</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {slot.occupancy_data?.id_cliente}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Fecha de ocupación</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {slot.occupancy_data?.fecha ? new Date(slot.occupancy_data.fecha).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleCheckout(slot.slot_number)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <FaSignOutAlt /> Salida
                    </button>
                    <button
                      onClick={() => handleAddOrEdit(slot)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <FaEdit /> Editar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-24 flex items-center justify-center mb-4">
                    <p className="text-gray-500 dark:text-slate-500 italic">Disponible</p>
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

      {/* Status indicators */}
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