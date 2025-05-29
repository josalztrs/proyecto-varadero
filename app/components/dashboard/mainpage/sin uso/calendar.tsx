'use client'; // Indica que este componente se renderiza del lado del cliente (Next.js)

import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Calendario de terceros
import 'react-calendar/dist/Calendar.css'; // Estilos por defecto del calendario
import { CalendarDays, RefreshCcw } from 'lucide-react'; // Íconos
import { Dialog } from '@headlessui/react'; // Componente para modales accesibles

// Tipo que representa una fecha o un rango de fechas
type Value = Date | [Date | null, Date | null] | null;

// Eventos importantes predefinidos
const eventosImportantes = [
  { fecha: new Date(2025, 4, 20), descripcion: 'Inspección del varadero' },
  { fecha: new Date(2025, 4, 25), descripcion: 'Mantenimiento de embarcación' },
  { fecha: new Date(2025, 5, 1), descripcion: 'Reunión con clientes VIP' },
];

// Verifica si una fecha específica tiene un evento
const tieneEvento = (date: Date) =>
  eventosImportantes.some(
    (evento) =>
      evento.fecha.getFullYear() === date.getFullYear() &&
      evento.fecha.getMonth() === date.getMonth() &&
      evento.fecha.getDate() === date.getDate()
  );

// Obtiene el evento asociado a una fecha (si existe)
const getEvento = (date: Date) =>
  eventosImportantes.find(
    (evento) =>
      evento.fecha.getFullYear() === date.getFullYear() &&
      evento.fecha.getMonth() === date.getMonth() &&
      evento.fecha.getDate() === date.getDate()
  );

// Compara si dos fechas son exactamente el mismo día
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const CalendarWidget = () => {
  const [value, setValue] = useState<Value>(new Date()); // Fecha seleccionada
  const [eventoSeleccionado, setEventoSeleccionado] = useState<{
    fecha: Date;
    descripcion: string;
  } | null>(null); // Evento actual en el modal
  const [activeDate, setActiveDate] = useState(new Date()); // Mes actual mostrado

  const selectedDate = !Array.isArray(value) ? value : null;

  // Cuando se selecciona una fecha
  const handleChange = (val: Value) => {
    if (val && !Array.isArray(val)) {
      setValue(val);
      const evento = getEvento(val); // Verifica si esa fecha tiene un evento
      if (evento) setEventoSeleccionado(evento); // Abre el modal si hay evento
    }
  };

  // Al presionar el botón "Hoy", se vuelve al mes actual y lo centra
  const resetToToday = () => {
    const today = new Date();
    setValue(today);
    setActiveDate(today); // Redirige visualmente al mes actual
  };

  // Muestra la fecha actual formateada en español
  const todayStr = new Date().toLocaleDateString('es-VE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div>
      
      {/* Encabezado con fecha de hoy y botón de "Hoy" */}
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-300 text-lg font-semibold">
          <CalendarDays className="w-5 h-5" />
          <span>{todayStr.charAt(0).toUpperCase() + todayStr.slice(1)}</span>
        </div>
        <button
          onClick={resetToToday}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition"
        >
          <RefreshCcw className="w-4 h-4" />
          Hoy
        </button>
      </div>

      {/* Calendario visual */}
      <div className="flex justify-center">
        <Calendar
          onChange={handleChange}
          value={value}
          locale="es-VE"
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) setActiveDate(activeStartDate); // Captura cambio de mes
          }}
          activeStartDate={activeDate} // Controla el mes visible
          
          // Estilos condicionales para cada día
          tileClassName={({ date, view }) => {
            if (view === 'month') {
              const base = 'relative rounded-lg text-black font-medium';
              if (tieneEvento(date)) return `${base}`; // Día con evento
              if (isSameDay(date, new Date()))
                return `${base} border-2 border-blue-700`; // Día actual
              if (selectedDate && isSameDay(date, selectedDate))
                return `${base} bg-pink-600 text-black shadow-lg`; // Día seleccionado
              if (date.getMonth() !== new Date().getMonth())
                return `${base} text-black-500`; // Días de otro mes
            }
            return '';
          }}

          // Indicador visual si hay evento
          tileContent={({ date, view }) =>
            view === 'month' && tieneEvento(date) ? (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-600 shadow-md"></span>
                </span>
              </div>
            ) : null
          }

          // Estilos personalizados usando Tailwind y CSS Modules de react-calendar
          className="
            rounded-2xl bg-[#121826] p-2
            [&_.react-calendar__navigation]:flex [&_.react-calendar__navigation]:justify-between [&_.react-calendar__navigation]:mb-3
            [&_.react-calendar__navigation__label]:text-white [&_.react-calendar__navigation__label]:font-semibold [&_.react-calendar__navigation__label]:text-lg
            [&_.react-calendar__navigation__arrow]:text-white [&_.react-calendar__navigation__arrow]:hover:bg-blue-800 [&_.react-calendar__navigation__arrow]:rounded-full [&_.react-calendar__navigation__arrow]:p-1
            [&_.react-calendar__month-view__weekdays]:text-blue-400 [&_.react-calendar__month-view__weekdays]:uppercase [&_.react-calendar__month-view__weekdays]:text-xs [&_.react-calendar__month-view__weekdays]:font-semibold
            [&_.react-calendar__month-view__days]:grid [&_.react-calendar__month-view__days]:grid-cols-7 [&_.react-calendar__month-view__days]:gap-2
            [&_.react-calendar__tile]:relative [&_.react-calendar__tile]:cursor-pointer [&_.react-calendar__tile]:h-12 [&_.react-calendar__tile]:flex [&_.react-calendar__tile]:items-center [&_.react-calendar__tile]:justify-center [&_.react-calendar__tile]:rounded-xl
            [&_.react-calendar__tile]:hover:bg-blue-900
          "
        />
      </div>

      {/* Modal para mostrar información del evento */}
      <Dialog
        open={!!eventoSeleccionado}
        onClose={() => setEventoSeleccionado(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1f2937] rounded-xl p-6 max-w-sm w-full text-white shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-2">Evento del día</Dialog.Title>
            <Dialog.Description className="mb-4">
              {eventoSeleccionado?.fecha.toLocaleDateString('es-VE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Dialog.Description>
            <p className="mb-4">{eventoSeleccionado?.descripcion}</p>
            <button
              onClick={() => setEventoSeleccionado(null)}
              className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition"
            >
              Cerrar
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default CalendarWidget;
