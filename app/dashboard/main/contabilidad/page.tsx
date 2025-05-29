import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import React from 'react';
import MiniCrudTable from '@/app/components/dashboard/mainpage/tabs/MiniCrud'; // Ajusta la ruta

// Datos iniciales ejemplo para contabilidad
const initialAccountingData = [
  { id: 1, name: 'Factura 001', description: 'Pago proveedor ABC' },
  { id: 2, name: 'Factura 002', description: 'Servicio mantenimiento embarcación' },
  { id: 3, name: 'Ingreso 001', description: 'Alquiler de amarre yate' },
];

const ContabPage = () => {
  return (
    <div className="flex h-screen md:pl-[220px] pb-16 md:pb-0 bg-gray-100 dark:bg-gray-950">
      <DashSidebar />
      <main className='flex-1 overflow-y-auto'>
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
          <Header />
        </div>
        {/* Contenedor principal para la tabla y formulario CRUD */}
      <div className="col-span-4 row-span-3 col-start-2 row-start-2 flex justify-center items-start overflow-auto p-4">
        <div className="w-full max-w-6xl p-8">
          <MiniCrudTable initialData={initialAccountingData} />
        </div>
      </div>
      </main>
    </div>
  );
};

export default ContabPage;
