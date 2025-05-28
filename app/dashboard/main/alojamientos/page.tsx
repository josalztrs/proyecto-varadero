import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import React from 'react';
import MiniCrudTable from '@/app/components/dashboard/mainpage/tabs/MiniCrud'; // Ajusta la ruta según dónde guardes el componente

const alojamientoData = [
  { id: 1, name: "Habitación Deluxe", description: "Habitación con vista al mar" },
  { id: 2, name: "Suite Familiar", description: "Ideal para familias grandes" },
  { id: 3, name: "Habitación Standard", description: "Cómoda y económica" },
];

const HotelPage = () => {
  return (
      <div className="grid grid-cols-5 grid-rows-5 gap-4 min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white">
      <div className="row-span-5"><DashSidebar /></div>
      <div className="col-span-4"><Header /></div>

      {/* Contenedor principal para la tabla y formulario CRUD */}
      <div className="col-span-4 row-span-3 col-start-2 row-start-2 flex justify-center items-start overflow-auto p-4">
        <div className="w-full max-w-6xl">
            <MiniCrudTable initialData={alojamientoData} />
            </div>
        </div>
    </div>
  );
};

export default HotelPage;
