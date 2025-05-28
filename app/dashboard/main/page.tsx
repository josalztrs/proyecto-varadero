import ExchangeCard from "@/app/components/dashboard/mainpage/exchcard";
import Header from "@/app/components/dashboard/header";
import Historial from "@/app/components/dashboard/mainpage/history";
import DashSidebar from "@/app/components/dashboard/sidebar";
import { DashboardCard } from "@/app/ui/card";
import CalendarWidget from "@/app/components/dashboard/mainpage/calendar";
import PieChart from "@/app/components/dashboard/mainpage/Grafica";

const DashboardPage = () => {
  return (
    <div className="flex h-screen md:pl-[220px] pb-16 md:pb-0 bg-gray-100 dark:bg-gray-950">
      <DashSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
          <Header />

          {/* Primera fila: ExchangeCard y Gráfica */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/5">
              <ExchangeCard />
            </div>
            <DashboardCard>
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 px-6 py-4 rounded-xl w-full text-center">
                <p className="text-xl font-semibold text-white">Distribución de Gastos</p>
              </div>
              <div className="flex-grow flex items-center justify-center w-full pt-6">
                <PieChart />
              </div>
            </DashboardCard>
          </div>

          {/* Segunda fila: Historial y Calendario */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/5">
              <Historial />
            </div>


            <div className="w-full md:w-2/5"> 
              <DashboardCard>
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 px-6 py-4 rounded-xl w-full text-center">
                  <p className="text-xl font-semibold text-white">Calendario de eventos</p>
                </div>
                <div className="flex-grow flex items-center justify-center w-full pt-6">
                  <CalendarWidget />
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
