import ExchangePage from '@/app/lib/conversorapi';
import { FechaLocal } from '@/app/lib/datetime';
import { DashboardCard } from '@/app/ui/card';
import React from 'react';

const ExchangeCard = () => {
  return (
    <DashboardCard className="hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col gap-1 p-2">
        <div className="flex items-center justify-between">
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 p-2  rounded-xl">
            <p className=" font-semibold text-white">Tasa de Cambio a USD</p>
          </div>
          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
            Actualizado
          </span>
        </div>
        
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-800 dark:text-white">
            <ExchangePage monto={1} />
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
             por 1USD
          </span>
        </div>
        
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <FechaLocal />
        </div>
      </div>
    </DashboardCard>
  );
};

export default ExchangeCard;