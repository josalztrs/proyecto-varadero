import ExchangeCard from "@/app/components/dashboard/mainpage/exchcard";
import Header from "@/app/components/dashboard/header";
import DashSidebar from "@/app/components/dashboard/sidebar";
import { DashboardCard } from "@/app/ui/card";
import PieChart from "@/app/components/dashboard/mainpage/PieChart";
import LineChart from "@/app/components/dashboard/mainpage/LineChart";

const DashboardPage = () => {
  return (
    <div className="flex h-screen md:pl-[220px] pb-16 md:pb-0 bg-gray-100 dark:bg-gray-950">
      <DashSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
          <Header />

          {/* Fila Superior */}
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="w-full md:w-2/5">
              <ExchangeCard />
            </div>
            <DashboardCard className="w-1/3">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 p-2 rounded-xl text-center">
                <p className="text-xl font-semibold text-white">Distribución de Gastos</p>
              </div>
              <div className="flex-grow flex items-center justify-center w-full pt-1">
                <PieChart />
              </div>
            </DashboardCard>
          </div>

          {/* Fila Inferior */}
          <div className="flex flex-col md:flex-row gap-6">
            <DashboardCard className="w-full">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 p-2 rounded-xl text-center">
                <p className="text-xl font-semibold text-white">Gastos e Ingresos por Mes</p>
              </div>
              <div className="flex-grow flex items-center justify-center w-full pt-1">
                <LineChart />
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
