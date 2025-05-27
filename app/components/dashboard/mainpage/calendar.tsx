'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const eventosImportantes = [
  new Date(2025, 4, 20),
  new Date(2025, 4, 25),
  new Date(2025, 5, 1),
];

const tieneEvento = (date: Date) => {
  return eventosImportantes.some(
    (evento) =>
      evento.getFullYear() === date.getFullYear() &&
      evento.getMonth() === date.getMonth() &&
      evento.getDate() === date.getDate()
  );
};

const CalendarWidget = () => {
  const [value, setValue] = useState<Date | null | [Date | null, Date | null]>(new Date());

  const handleChange = (
    val: Date | null | [Date | null, Date | null],
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setValue(val);
  };

  return (
    <div className="rounded-xl shadow-lg p-3 bg-[#121826] black w-full max-w-[360px] min-h-[320px]">
      <Calendar
        onChange={handleChange}
        value={value}
        locale="es-VE"
        className={`
          w-full text-xs
          [&_.react-calendar__navigation]:mb-1
          [&_.react-calendar__navigation__label]:text-white 
          [&_.react-calendar__navigation__label]:text-sm 
          [&_.react-calendar__navigation__arrow]:text-white 
          [&_.react-calendar__navigation__arrow]:text-base 
          [&_.react-calendar__navigation__arrow]:hover:bg-blue-700
          [&_.react-calendar__navigation__arrow]:rounded-full
          [&_.react-calendar__month-view__weekdays]:text-blue-400 
          [&_.react-calendar__month-view__weekdays]:uppercase 
          [&_.react-calendar__month-view__weekdays]:text-[9px]
          [&_.react-calendar__month-view__days]:grid 
          [&_.react-calendar__month-view__days]:grid-rows-2
          [&_.react-calendar__month-view__days]:grid-flow-col
          [&_.react-calendar__tile]:text-white 
          [&_.react-calendar__tile]:rounded 
          [&_.react-calendar__tile]:h-8 
          [&_.react-calendar__tile]:text-xs
          [&_.react-calendar__tile]:hover:bg-blue-600 
          [&_.react-calendar__tile--now]:bg-blue-800 
          [&_.react-calendar__tile--now]:font-semibold 
          [&_.react-calendar__tile--active]:bg-blue-600 
          [&_.react-calendar__tile--active]:shadow 
          [&_.react-calendar__tile--active]:text-white
          [&_.react-calendar__month-view__days__day--neighboringMonth]:text-gray-500
        `}
        tileContent={({ date, view }) =>
          view === 'month' && tieneEvento(date) ? (
            <div className="relative flex justify-center items-center mt-0.5">
              <span className="absolute h-1.5 w-1.5 rounded-full bg-pink-500 opacity-75 animate-ping"></span>
              <span className="relative h-1.5 w-1.5 rounded-full bg-pink-600"></span>
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default CalendarWidget;
