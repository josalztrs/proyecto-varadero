import ExchangeCard from "@/app/components/dashboard/mainpage/exchcard";
import Header from "@/app/components/dashboard/header";
import Historial from "@/app/components/dashboard/mainpage/history";
import DashSidebar from "@/app/components/dashboard/sidebar";
import { DashboardCard } from "@/app/ui/card";
import CalendarWidget from "@/app/components/dashboard/mainpage/calendar";

const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/7 pr-4">
        <DashSidebar />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div>
          <Header />
        </div>

        <div className="flex gap-4">
          <div className="w-1/3">
            <ExchangeCard />
          </div>

          <div className="flex flex-row gap-4 w-1/2">
            <div className="h-1/2">
              <DashboardCard />
            </div>
            <div className="h-1/2">
              <DashboardCard />
            </div>
            <div className="h-1/2">
              <DashboardCard />
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-4">
          <div className="w-1/2">
            <Historial />
          </div>
          <div className="w-1/3">
            <DashboardCard>
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 px-6 py-4  rounded-xl">
                 <p className="text-xl font-semibold text-white">Calendario de eventos</p>
              </div>
              <CalendarWidget />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
