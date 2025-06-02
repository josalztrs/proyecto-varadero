import { DashboardCard } from '@/app/ui/card';
import React from 'react';

const Historial = () => {
  return (
    <DashboardCard className="relative bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-amber-200/50 dark:shadow-slate-950/50 overflow-hidden border border-amber-200 dark:border-slate-700">
      {/* Cabezado */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 px-6 py-4  rounded-xl">
        <p className="text-xl font-semibold text-white">Historial</p>
      </div>
      
      {/* Lista con el contenido */}
      <div className="p-4 sm:p-5">
        <ul className="space-y-3">
          {[
            "Registro de mantenimiento - 15/06/2023",
            "Inspección técnica - 02/05/2023",
            "Limpieza completa - 20/04/2023"
          ].map((item, index) => (
            <li 
              key={index}
              className="flex items-start before:content-[''] before:block before:mt-2 before:mr-3 before:w-2 before:h-2 before:rounded-full before:bg-amber-400 dark:before:bg-cyan-500"
            >
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-amber-400 dark:bg-cyan-500" />
    </DashboardCard>
  );
};

export default Historial;