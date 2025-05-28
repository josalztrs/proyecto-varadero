import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import React from 'react';

const HelpPage = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-[auto_1fr] gap-4 min-h-screen">
      {/* Sidebar a la izquierda */}
      <div className="row-span-2"><DashSidebar /></div>

      {/* Header arriba */}
      <div className="col-span-4"><Header /></div>

      {/* Contenido principal más arriba */}
      <div className="col-span-4 col-start-2 row-start-2 flex justify-center items-start p-4">
        <div className="w-full max-w-4xl bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-white rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-amber-500 dark:text-cyan-400">
            Ayuda y Soporte del Proyecto
          </h1>

          <p>
            Bienvenido a la sección de ayuda del sistema de gestión para el varadero. Aquí encontrarás información básica sobre el funcionamiento del sistema.
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Alojamiento:</strong> Registra zonas de descanso y clientes hospedados.
            </li>
            <li>
              <strong>Embarcaciones:</strong> Controla entradas, salidas, reparaciones y custodia.
            </li>
            <li>
              <strong>Contabilidad:</strong> Maneja ingresos, gastos y registros financieros.
            </li>
            <li>
              <strong>Mantenimiento:</strong> Organiza reparaciones, técnicos y herramientas.
            </li>
          </ul>

          <p>
            Para asistencia adicional, contacta al equipo de desarrollo o consulta el manual de usuario.
          </p>

          <div className="text-center">
            <a
              href="/help/Manual_Usuario_Varadero.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition duration-300"
            >
             📘 Descargar Manual del Usuario
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
