import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import React from 'react';
import MantenimientoCRUD from '@/app/components/dashboard/mainpage/tabs/mantenimientocrud';


const MaintainPage = () => {
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
          <MantenimientoCRUD/>
        </div>
      </div>
      </main>
    </div>
  );
};

export default MaintainPage;
