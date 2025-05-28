import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import React from 'react';
import MiniCrudTable from '@/app/components/dashboard/mainpage/tabs/MiniCrud'; // Ajusta la ruta si es necesario

const initialBoatData = [
  { id: 1, name: 'Yate Prestige 500', description: 'Yate de lujo, 15 metros' },
  { id: 2, name: 'Lancha Speedster', description: 'Lancha rápida para deportes acuáticos' },
  { id: 3, name: 'Pesquero Azul', description: 'Barco pesquero de mediano tamaño' },
];

const VehicPage = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-4 min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white overflow-hidden">
      <div className="row-span-5">
        <DashSidebar />
      </div>
      <div className="col-span-4">
        <Header />
      </div>
      
      <div className="col-span-4 row-span-3 col-start-2 row-start-2 flex justify-center items-start p-4">
        <div className="w-full max-w-6xl h-full overflow-y-auto">
          <MiniCrudTable initialData={initialBoatData} />
        </div>
      </div>
    </div>
  );
};

export default VehicPage;
