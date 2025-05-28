import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import React from 'react';
import MiniCrudTable from '@/app/components/dashboard/mainpage/tabs/MiniCrud';

const initialMaintenanceData = [
  { id: 1, name: 'Cambio de aceite', description: 'Motor del yate X-200' },
  { id: 2, name: 'Revisión eléctrica', description: 'Lancha de pesca Z-15' },
  { id: 3, name: 'Limpieza general', description: 'Moto acuática cliente G' },
];

const MaintainPage = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-4 min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white">
      <div className="row-span-5"><DashSidebar /></div>
      <div className="col-span-4"><Header /></div>

      {/* Contenedor centrado para MiniCrud */}
      <div className="col-span-4 row-span-3 col-start-2 row-start-2 flex justify-center items-start overflow-auto p-4">
        <div className="w-full max-w-6xl">
          <MiniCrudTable initialData={initialMaintenanceData} />
        </div>
      </div>
    </div>
  );
};

export default MaintainPage;
