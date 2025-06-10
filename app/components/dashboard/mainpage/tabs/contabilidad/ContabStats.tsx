/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase/supabase';
import { FaChartBar, FaMoneyBillWave, FaDollarSign, FaBoxes, FaCreditCard, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ContabStats() {
  const [totalTransacciones, setTotalTransacciones] = useState<number>(0);
  const [montoTotalGlobal, setMontoTotalGlobal] = useState<number>(0);
  const [montoPromedio, setMontoPromedio] = useState<number>(0);
  const [transaccionesPorModoPago, setTransaccionesPorModoPago] = useState<Record<string, number>>({});
  const [transaccionesConServicio, setTransaccionesConServicio] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Utiliza useCallback para memorizar la función de obtención de estadísticas
  // Esto es bueno si fetchStats se pasa como dependencia a otros Hooks
  const fetchStats = useCallback(async () => {
    setLoading(true); // Opcional: mostrar un spinner pequeño mientras se actualizan las estadísticas
    setError(null);
    try {
      const { data: transacciones, error: fetchError } = await supabase
        .from('transacciones')
        .select('monto_total, modo_pago, id_servicio'); // Solo selecciona las columnas necesarias

      if (fetchError) {
        throw fetchError;
      }

      if (transacciones) {
        setTotalTransacciones(transacciones.length);

        const total = transacciones.reduce((sum, t) => sum + parseFloat(t.monto_total), 0);
        setMontoTotalGlobal(total);

        if (transacciones.length > 0) {
          setMontoPromedio(total / transacciones.length);
        } else {
          setMontoPromedio(0);
        }

        const modoPagoCounts: Record<string, number> = {};
        transacciones.forEach((t) => {
          if (t.modo_pago) {
            modoPagoCounts[t.modo_pago] = (modoPagoCounts[t.modo_pago] || 0) + 1;
          }
        });
        setTransaccionesPorModoPago(modoPagoCounts);

        const servicioCount = transacciones.filter(t => t.id_servicio !== null).length;
        setTransaccionesConServicio(servicioCount);
      }
    } catch (err: any) {
      console.error('Error fetching transaction stats:', err.message);
      setError(`Failed to load statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []); // No hay dependencias aquí, ya que queremos que sea la misma función siempre

  useEffect(() => {
    // 1. Obtener las estadísticas iniciales al montar el componente
    fetchStats();

    // 2. Suscribirse a cambios en tiempo real en la tabla 'transacciones'
    const subscription = supabase
      .channel('transacciones_changes') // Puedes usar cualquier nombre para el canal
      .on(
        'postgres_changes',
        {
          event: '*', // Escucha todos los eventos: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'transacciones',
        },
        (payload) => {
          console.log('Cambio detectado en transacciones:', payload);
          // Cuando ocurre un cambio, vuelve a cargar las estadísticas
          fetchStats();
        }
      )
      .subscribe(); // ¡Importante! No olvides llamar a .subscribe()

    // 3. Función de limpieza: Desuscribirse cuando el componente se desmonte
    return () => {
      supabase.removeChannel(subscription);
      console.log('Suscripción a transacciones_changes removida.');
    };
  }, [fetchStats]); // La dependencia es fetchStats para que useEffect sepa que puede volver a usar la misma instancia de la función.


  // Componente Card para las estadísticas, reutilizable y animado
  const StatCard = ({ title, value, icon: Icon, bgColor, textColor, valueColor }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    bgColor: string;
    textColor: string;
    valueColor: string;
  }) => (
    <motion.div
      className={`relative p-5 rounded-lg shadow-md flex-1 min-w-[180px] flex flex-col items-center justify-center text-center ${bgColor} transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon className={`text-5xl mb-3 ${textColor}`} />
      <p className={`text-sm font-semibold mb-1 ${textColor}`}>{title}</p>
      <p className={`text-4xl font-extrabold ${valueColor}`}>
        {typeof value === 'number' ? value.toLocaleString('es-VE', { minimumFractionDigits: title.includes('Monto') ? 2 : 0 }) : value}
      </p>
      {loading && (
        <div className="absolute top-2 right-2">
          <FaSpinner className="animate-spin text-lg text-gray-500" />
        </div>
      )}
    </motion.div>
  );

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto my-8 shadow-lg dark:bg-red-900 dark:border-red-700 dark:text-red-300" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 border-b-2 pb-3 border-indigo-500 flex items-center">
        <FaChartBar className="mr-3 text-indigo-600 text-3xl" /> Estadísticas de Transacciones
      </h2>

      {loading && !totalTransacciones ? ( // Mostrar spinner de carga inicial solo si no hay datos
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
          <p className="ml-3 text-lg text-gray-600 dark:text-gray-400">Cargando estadísticas iniciales...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total de Transacciones"
              value={totalTransacciones}
              icon={FaMoneyBillWave}
              bgColor="bg-blue-50 dark:bg-blue-900/50"
              textColor="text-blue-600 dark:text-blue-300"
              valueColor="text-blue-800 dark:text-blue-100"
            />
            <StatCard
              title="Monto Total Global"
              value={`$${montoTotalGlobal.toFixed(2)}`}
              icon={FaDollarSign}
              bgColor="bg-green-50 dark:bg-green-900/50"
              textColor="text-green-600 dark:text-green-300"
              valueColor="text-green-800 dark:text-green-100"
            />
            <StatCard
              title="Monto Promedio"
              value={`$${montoPromedio.toFixed(2)}`}
              icon={FaCreditCard}
              bgColor="bg-purple-50 dark:bg-purple-900/50"
              textColor="text-purple-600 dark:text-purple-300"
              valueColor="text-purple-800 dark:text-purple-100"
            />
            <StatCard
              title="Transacciones con Servicio"
              value={transaccionesConServicio}
              icon={FaBoxes}
              bgColor="bg-yellow-50 dark:bg-yellow-900/50"
              textColor="text-yellow-600 dark:text-yellow-300"
              valueColor="text-yellow-800 dark:text-yellow-100"
            />
          </div>

          {/* Estadísticas por Modo de Pago */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-100 dark:border-gray-600">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-300 dark:border-gray-600">
              Desglose por Modo de Pago
            </h3>
            {Object.keys(transaccionesPorModoPago).length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(transaccionesPorModoPago).map(([modo, count]) => (
                  <motion.li
                    key={modo}
                    className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm flex justify-between items-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200 capitalize text-lg">{modo.replace(/_/g, ' ')}:</span>
                    <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{count}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No hay datos de modos de pago para mostrar.</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}