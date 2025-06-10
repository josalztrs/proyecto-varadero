'use client'
import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import ContabStats from '@/app/components/dashboard/mainpage/tabs/contabilidad/ContabStats';
import ContabTransactionsViewer from '@/app/components/dashboard/mainpage/tabs/contabilidad/ContabTable';

const ContabPage = () => {

  return (
    <div className="flex h-screen md:pl-[220px] pb-16 md:pb-0 bg-gray-100 dark:bg-gray-950">
      <DashSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
          <Header />
        </div>
        {/* Contenedor principal para la tabla y formulario CRUD */}
        <div className="col-span-4 row-span-3 col-start-2 row-start-2 flex justify-center items-start overflow-auto">
          <div className="w-full max-w-6xl pl-8 pr-8 pb-8">
            <ContabStats/>
            <ContabTransactionsViewer />

          </div>
        </div>
      </main>
    </div>
  );
};

export default ContabPage;