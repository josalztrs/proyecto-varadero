'use client';
import { DashboardCard } from '@/app/ui/card';
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
    <div className="absolute bottom-4 right-28 z-30">
      <div className="rounded-2xl shadow-xl p-4 max-w-[90vw] sm:max-w-xs bg-[#121826] text-black">
        <Calendar
          onChange={handleChange}
          value={value}
          locale="es-VE"
          className={`
            w-full text-sm 
            [&_.react-calendar__navigation]:mb-4 
            [&_.react-calendar__navigation__label]:text-white 
            [&_.react-calendar__navigation__label]:font-semibold 
            [&_.react-calendar__navigation__label]:text-lg
            [&_.react-calendar__navigation__arrow]:text-white 
            [&_.react-calendar__navigation__arrow]:text-lg 
            [&_.react-calendar__navigation__arrow]:hover:bg-blue-700
            [&_.react-calendar__navigation__arrow]:rounded-full
            [&_.react-calendar__navigation__arrow]:transition 
            [&_.react-calendar__month-view__weekdays]:text-blue-400 
            [&_.react-calendar__month-view__weekdays]:uppercase 
            [&_.react-calendar__month-view__weekdays]:text-xs 
            [&_.react-calendar__tile]:text-white 
            [&_.react-calendar__tile]:rounded-xl 
            [&_.react-calendar__tile]:py-3 
            [&_.react-calendar__tile]:hover:bg-blue-700 
            [&_.react-calendar__tile]:transition 
            [&_.react-calendar__tile--now]:bg-blue-900 
            [&_.react-calendar__tile--now]:font-bold 
            [&_.react-calendar__tile--active]:bg-blue-600 
            [&_.react-calendar__tile--active]:font-bold 
            [&_.react-calendar__tile--active]:text-white 
            [&_.react-calendar__tile--active]:shadow-md
            [&_.react-calendar__month-view__days__day--neighboringMonth]:text-gray-500
          `}
          tileContent={({ date, view }) =>
            view === 'month' && tieneEvento(date) ? (
              <div className="relative flex justify-center items-center mt-1">
                <span className="absolute h-2.5 w-2.5 rounded-full bg-pink-500 opacity-75 animate-ping"></span>
                <span className="relative h-2.5 w-2.5 rounded-full bg-pink-600"></span>
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default CalendarWidget;
