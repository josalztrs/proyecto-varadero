import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import React from 'react';
import MiniCrudTable from '@/app/components/dashboard/mainpage/tabs/MiniCrud'; // Ajusta la ruta

const initialBoatData = [
  { id: 1, name: 'Yate Prestige 500', description: 'Yate de lujo, 15 metros' },
  { id: 2, name: 'Lancha Speedster', description: 'Lancha rápida para deportes acuáticos' },
  { id: 3, name: 'Pesquero Azul', description: 'Barco pesquero de mediano tamaño' },
];

const VehicPage = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-4 min-h-screen bg-gray-900 text-black">
      <div className="row-span-5"><DashSidebar /></div>
      <div className="col-span-4"><Header /></div>

      <div className="col-span-4 row-span-3 col-start-2 row-start-2 flex justify-center items-start overflow-auto p-4">
        <div className="w-full max-w-6xl">
            <MiniCrudTable initialData={initialBoatData} />
            </div>
        </div>
    </div>
  );
};

export default VehicPage;
