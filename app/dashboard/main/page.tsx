import ExchangeCard from "@/app/components/dashboard/mainpage/exchcard";
import Header from "@/app/components/dashboard/header";
import DashSidebar from "@/app/components/dashboard/sidebar";
import { DashboardCard } from "@/app/ui/card";
import PieChartExpenses from "@/app/components/dashboard/mainpage/PieChart";
import LineChartTransactions from "@/app/components/dashboard/mainpage/LineChart";
import NotificationReserva from "@/app/components/dashboard/mainpage/Notificaciones/notification_reserva"; // <-- Importa aquí

const DashboardPage = () => {
  return (
    <div className="flex h-screen md:pl-[220px] pb-16 md:pb-0 bg-gray-100 dark:bg-gray-950">
      <DashSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
          <Header />
          <NotificationReserva /> {/* <-- Agrega aquí */}

          {/* Sección de los elementos superiores: Exchange Card y Distribución de Ingresos (PieChart) */}
          {/* Se usa un grid de 1 columna en móvil, y 2 columnas en pantallas medianas y superiores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exchange Card: Ocupa 1 columna en móvil y 1 columna (la mitad del ancho) en md+ */}
            <div>
              <ExchangeCard />
            </div>

            {/* Gráfico de Distribución de Ingresos (PieChart): Ocupa 1 columna en móvil y 1 columna (la mitad del ancho) en md+ */}
            <DashboardCard> {/* DashboardCard ya maneja su propio estilo de fondo, sombra, etc. */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 p-2 rounded-xl text-center">
                <p className="text-xl font-semibold text-white">Distribución de Ingresos</p>
              </div>
              <div className="flex-grow flex items-center justify-center w-full pt-1">
                <PieChartExpenses /> {/* Nombre de componente actualizado */}
              </div>
            </DashboardCard>
          </div>

          {/* Sección para el gráfico de Transacciones (LineChart) */}
          {/* Ocupa todo el ancho disponible en todas las pantallas, en una fila separada */}
          <div className="grid grid-cols-1 gap-6"> {/* Un grid de 1 columna para que el elemento ocupe todo el ancho */}
            <DashboardCard>
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 p-2 rounded-xl text-center">
                <p className="text-xl font-semibold text-white">Cantidad de Transacciones</p>
              </div>
              <div className="flex-grow flex items-start justify-start w-full">
                <LineChartTransactions /> {/* Nombre de componente actualizado */}
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;