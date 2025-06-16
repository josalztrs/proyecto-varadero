'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { supabase } from '@/app/lib/supabase/supabase';
import { handleSupabaseError } from '@/app/lib/supabase/errorhandler';

ChartJS.register(ArcElement, Tooltip, Legend);

// Definir el tipo para los datos de transacción obtenidos de Supabase
interface Transaction {
  id: number;
  monto_total: string; // Supongamos que viene como string
  id_servicio: number | null;
  servicios: {
    tipo: string;
  } | null; // El tipo de servicio viene anidado
  id_cliente: number; // Para el filtro de gastos
}

interface ChartDataItem {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

const PieChartExpenses = () => {
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: ChartDataItem[] }>({
    labels: [],
    datasets: [
      {
        label: 'Monto en Bs',
        data: [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Verde
          'rgba(236, 72, 153, 0.85)', // Rosa
          'rgba(34, 211, 238, 0.85)', // Cian
          'rgba(251, 191, 36, 0.85)', // Amarillo
          'rgba(99, 102, 241, 0.85)', // Índigo
          'rgba(244, 63, 94, 0.85)',  // Rojo más vibrante
          'rgba(132, 204, 22, 0.85)',  // Verde lima
          'rgba(168, 85, 247, 0.85)', // Púrpura
          'rgba(249, 115, 22, 0.85)',  // Naranja
          'rgba(6, 182, 212, 0.85)',   // Azul cian
        ],
        borderColor: ['#111827', '#111827', '#111827', '#111827', '#111827', '#111827', '#111827', '#111827', '#111827', '#111827'],
        borderWidth: 2,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: transactions, error: transactionsError } = await supabase
          .from('transacciones')
          .select<string, Transaction>(`
            id,
            monto_total,
            id_servicio,
            servicios (
              tipo
            )
          `)

        if (transactionsError) {
          console.error("Error fetching transactions:", transactionsError);
          throw transactionsError;
        }

        console.log("Fetched transactions for Pie Chart:", transactions);

        if (!transactions || transactions.length === 0) {
          setChartData(prevData => ({ ...prevData, labels: [], datasets: [{ ...prevData.datasets[0], data: [] }] }));
          setLoading(false);
          return;
        }

        const expenseAggregates: { [serviceType: string]: number } = {};

        transactions.forEach((tx) => {
          const amount = parseFloat(tx.monto_total);
          const serviceType = tx.servicios?.tipo || 'Sin Categoría'; 

          if (!isNaN(amount)) {
            expenseAggregates[serviceType] = (expenseAggregates[serviceType] || 0) + amount;
          } else {
            console.warn(`Skipping transaction ${tx.id} due to invalid monto_total: ${tx.monto_total}`);
          }
        });

        console.log("Aggregated expenses:", expenseAggregates);

        const labels: string[] = [];
        const dataValues: number[] = [];

        const sortedCategories = Object.keys(expenseAggregates)
          .sort((a, b) => expenseAggregates[b] - expenseAggregates[a]);

        sortedCategories.forEach(category => {
          labels.push(category);
          dataValues.push(expenseAggregates[category]);
        });

        setChartData(prevData => ({
          labels: labels,
          datasets: [{ ...prevData.datasets[0], data: dataValues }],
        }));

      } catch (err: unknown) {
        console.error("Error loading Pie Chart data:", err);
        handleSupabaseError(err, 'No se pudieron cargar los datos del gráfico de gastos.');
        setError('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ChartOptions<'pie'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 10,
          font: {
            size: 12,
            weight: 'bold',
            family: "'Inter', sans-serif",
          },
          color: '#d1d5db',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1f2937',
        titleFont: {
          size: 11,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6',
        padding: 10,
        cornerRadius: 4,
        callbacks: {
            label: function(context) {
                let label = context.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed !== null) {
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((sum: number, current: number) => sum + current, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                    return label + new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(value) + ` (${percentage}%)`;
                }
                return label;
            }
        }
      },
    },
  }), []);

  if (loading) {
    return <div className="text-center p-4">Cargando datos del gráfico de gastos...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (chartData.labels.length === 0) {
    return <div className="text-center p-4 text-gray-500">No hay datos de gastos disponibles para mostrar con la configuración actual.</div>;
  }

  return (
    <div style={{ height: '200px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChartExpenses;