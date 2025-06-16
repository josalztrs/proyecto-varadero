/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { supabase } from '@/app/lib/supabase/supabase';

// Registrar los componentes de Chart.js necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Tipos para los filtros
type FilterType = 'day' | 'month';

const LineChartTransactions = () => {
  const [filter, setFilter] = useState<FilterType>('month'); // Filtro por defecto: mes
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Cantidad de Transacciones',
        data: [] as number[],
        borderColor: 'rgba(75, 192, 192, 0.85)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nombres de los meses y días para formatear las etiquetas
  const monthNames = useMemo(() => [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ], []);
  const dayNames = [ // Este no necesita useMemo si solo es un array estático, no cambia la referencia
    'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
  ];

  // Función para obtener y procesar los datos de Supabase
  // Dependencias: Solo 'filter' porque es el único estado que afecta la lógica de la consulta
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Limpiar errores anteriores

    try {
      // Obtenemos solo la columna 'fecha' para contar transacciones
      const { data: transactions, error: dbError } = await supabase
        .from('transacciones')
        .select('fecha')
        .order('fecha', { ascending: true }); // Ordenamos para un procesamiento cronológico

      if (dbError) {
        console.error("Error al obtener transacciones de Supabase:", dbError);
        throw dbError; // Lanzar el error para que sea capturado por el bloque catch
      }

      console.log("Transacciones obtenidas de Supabase:", transactions);

      if (!transactions || transactions.length === 0) {
        setChartData(prevChartData => ({ // Usar la forma funcional de setChartData
          labels: [],
          datasets: [{ ...prevChartData.datasets[0], data: [] }],
        }));
        setLoading(false);
        return;
      }

      const counts: { [key: string]: number } = {};
      
      transactions.forEach((tx) => {
        // Asegurarse de que tx.fecha es una cadena válida antes de crear una fecha
        if (!tx.fecha || typeof tx.fecha !== 'string') {
            console.warn("Transacción con fecha inválida o nula:", tx);
            return; // Saltar esta transacción
        }
        const date = new Date(tx.fecha);

        // Validar si la fecha es un objeto Date válido
        if (isNaN(date.getTime())) {
            console.warn("Fecha inválida para procesar:", tx.fecha);
            return; // Saltar esta transacción
        }
        
        let key = ''; // Clave para agrupar (ej. '2024-06-15', '2024-06', '14:00')

        switch (filter) {
          case 'day':
            // Agrupar por día (YYYY-MM-DD)
            key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            break;
          case 'month':
            // Agrupar por mes (YYYY-MM)
            key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            break;
        }

        if (!counts[key]) {
          counts[key] = 0;
        }
        counts[key]++;
      });

      console.log("Conteo de transacciones agrupadas (counts):", counts);

      let labels: string[] = [];
      let data: number[] = [];

      // Ordenar las claves para asegurar la cronología en el gráfico
      const sortedKeys = Object.keys(counts).sort();

      labels = sortedKeys.map(key => {
          if (filter === 'month') {
              const [year, monthIndex] = key.split('-');
              return `${monthNames[parseInt(monthIndex) - 1]} ${year}`;
          } else if (filter === 'day') {
              const [year, monthIndex, day] = key.split('-');
              return `${parseInt(day)}/${monthNames[parseInt(monthIndex) - 1].substring(0,3)}`;
          }
          return key; // Fallback, no debería ocurrir
      });
      data = sortedKeys.map(key => counts[key]);

      console.log("Labels finales:", labels);
      console.log("Datos finales (counts):", data);

      setChartData(prevChartData => ({ // ¡Importante!: Usar la forma funcional de setChartData
        labels: labels,
        datasets: [{ ...prevChartData.datasets[0], data: data }],
      }));

    } catch (err: unknown) {
      setError('No se pudieron cargar los datos del gráfico.'); // Mantener un estado de error local también
    } finally {
      setLoading(false);
    }
  }, [filter, monthNames]); // ¡Dependencias corregidas! Solo 'filter' es necesario aquí.

  // Ejecutar fetchData cuando el componente se monta o el filtro cambia
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Esta dependencia es correcta porque fetchData está memoizada con useCallback


  // Opciones del gráfico (Chart.js options) - memoizadas para evitar re-renderizados innecesarios
  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 10,
          font: { size: 12, family: "'Inter', sans-serif" },
          color: '#858585',
        },
      },
      title: {
        display: false,
        text: `Cantidad de Transacciones por ${filter === 'day' ? 'Día' : 'Mes'}`,
        color: '#f9fafb',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1f2937',
        titleFont: { size: 11, weight: 'bold' },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6',
        padding: 10,
        cornerRadius: 4,
        intersect: false,
        mode: 'index',
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += `${context.parsed.y} Transacciones`;
                }
                return label;
            }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          font: { size: 10, family: "'Inter', sans-serif" },
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: { size: 10, family: "'Inter', sans-serif" },
          precision: 0, // Asegura que los ticks sean números enteros para el conteo
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.1)',
        },
      },
    },
  }), [filter]); // Re-memoizar opciones si el filtro cambia (para el título dinámico)


  if (loading) {
    return <div className="text-center p-4">Cargando datos de transacciones...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (chartData.labels.length === 0) {
    return <div className="text-center p-4 text-gray-500">No hay datos de transacciones disponibles para mostrar con el filtro actual.</div>;
  }

  return (
    <div className="">
      <div className="mb-4 flex flex-row">
        <label htmlFor="filter-select" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
          Filtrar por:
        </label>
        <select
          id="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className=" block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="month">Mes</option>
          <option value="day">Día</option>
        </select>
      </div>
      <div style={{ height: '200px' }}> {/* Contenedor con altura para el gráfico */}
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChartTransactions;