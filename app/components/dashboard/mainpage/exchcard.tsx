import ExchangePage from '@/app/lib/conversorapi';
import { FechaLocal } from '@/app/lib/datetime';
import { DashboardCard } from '@/app/ui/card';
import React from 'react';

const ExchangeCard = () => {
  return (
    <DashboardCard className="hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <div className="flex flex-col gap-3 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 px-4 py-2 rounded-xl shadow-md">
            <p className="font-semibold text-white text-base sm:text-lg">
              Tasa de Cambio a USD
            </p>
          </div>
          <span className="text-xs sm:text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full whitespace-nowrap">
            Actualizado
          </span>
        </div>

        {/* Rate display */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-none">
            <ExchangePage monto={1} />
          </span>
          <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-1 sm:mb-0 whitespace-nowrap">
            por 1 USD
          </span>
        </div>

        {/* Footer with icon and date */}
        <div className="mt-3 text-xs sm:text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 dark:text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <FechaLocal />
        </div>
      </div>
    </DashboardCard>
  );
};

export default ExchangeCard;
