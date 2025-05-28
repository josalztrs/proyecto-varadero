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
    <div className="grid grid-cols-5 grid-rows-5 gap-4 min-h-screen bg-gray-900 text-black">
      <div className="row-span-5"><DashSidebar /></div>
      <div className="col-span-4"><Header /></div>

      <div className="col-span-4 row-span-3 col-start-2 row-start-2 flex justify-center items-start overflow-auto p-4">
        <div className="w-full max-w-6xl">
                <MiniCrudTable initialData={initialAccountingData} />
            </div>
        </div>
    </div>
  );
};

export default ContabPage;
