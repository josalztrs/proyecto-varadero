/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase/supabase';
import { FaChartBar, FaMoneyBillWave, FaDollarSign, FaCreditCard, FaHourglassHalf, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ContabStats() {
  const [totalTransacciones, setTotalTransacciones] = useState<number>(0);
  const [montoTotalGlobal, setMontoTotalGlobal] = useState<number>(0);
  const [perdidasTotalesGlobales, setPerdidasTotalesGlobales] = useState<number>(0);
  const [transaccionesPendientes, setTransaccionesPendientes] = useState<number>(0);
  const [transaccionesCompletadas, setTransaccionesCompletadas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: transacciones, error: fetchError } = await supabase
        .from('transacciones')
        .select(`
          monto_total,
          modo_pago,
          servicios(perdidas)
        `);

      if (fetchError) {
        throw fetchError;
      }

      if (transacciones) {
        setTotalTransacciones(transacciones.length);

        const totalMonto = transacciones.reduce((sum, t) => sum + parseFloat(t.monto_total), 0);
        setMontoTotalGlobal(totalMonto);

        const totalPerdidas = transacciones.reduce((sum, t) => {
          const perdidas = (t.servicios as unknown as { perdidas: number | null } | null)?.perdidas;
          return sum + (perdidas !== null && perdidas !== undefined ? parseFloat(perdidas.toString()) : 0);
        }, 0);
        setPerdidasTotalesGlobales(totalPerdidas);

        let pendientes = 0;
        let completadas = 0;
        transacciones.forEach(t => {
          if (t.modo_pago === 'Pendiente') {
            pendientes++;
          } else if (t.modo_pago === 'Completado') {
            completadas++;
          }
        });
        setTransaccionesPendientes(pendientes);
        setTransaccionesCompletadas(completadas);
      }
    } catch (err: any) {
      console.error('Error fetching transaction stats:', err.message);
      setError(`Failed to load statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const subscription = supabase
      .channel('contab_transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transacciones',
        },
        (payload) => {
          console.log('Cambio detectado en transacciones:', payload);
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
      console.log('Suscripción a contab_transactions_changes removida.');
    };
  }, [fetchStats]);

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
        {typeof value === 'number' ? value.toLocaleString('es-VE', { minimumFractionDigits: title.includes('Monto') || title.includes('Pérdidas') ? 2 : 0 }) : value}
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

      {loading && !totalTransacciones && !montoTotalGlobal && !perdidasTotalesGlobales ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
          <p className="ml-3 text-lg text-gray-600 dark:text-gray-400">Cargando estadísticas iniciales...</p>
        </div>
      ) : (
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
            title="Pérdidas Totales Globales"
            value={`$${perdidasTotalesGlobales.toFixed(2)}`}
            icon={FaCreditCard}
            bgColor="bg-red-50 dark:bg-red-900/50"
            textColor="text-red-600 dark:text-red-300"
            valueColor="text-red-800 dark:text-red-100"
          />
          {/* NUEVA CARD CONSOLIDADA */}
          <motion.div
            className="relative p-5 rounded-lg shadow-md flex-1 min-w-[180px] flex flex-col items-center justify-center text-center bg-purple-50 dark:bg-purple-900/50 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaHourglassHalf className="text-5xl mb-3 text-purple-600 dark:text-purple-300" />
            <p className="text-sm font-semibold mb-3 text-purple-600 dark:text-purple-300">Estado de Pagos</p>
            <div className="flex justify-around w-full">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-orange-700 dark:text-orange-400">{transaccionesPendientes}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">Pendientes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{transaccionesCompletadas}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">Completadas</span>
              </div>
            </div>
            {loading && (
              <div className="absolute top-2 right-2">
                <FaSpinner className="animate-spin text-lg text-gray-500" />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}