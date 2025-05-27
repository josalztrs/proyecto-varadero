'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ['Embarcaciones', 'Alojamiento', 'Mantenimiento'],
    datasets: [
      {
        label: 'Gastos en Bs',
        data: [500, 300, 200],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: ['#121212', '#121212', '#121212'],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          font: {
            size: 10,
            weight: 600,
            family: "'Inter', sans-serif",
          },
          color: '#e5e7eb',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#374151',
        titleFont: {
          size: 12,
          weight: 'bold',
        },
        bodyFont: {
          size: 10,
          family: "'Inter', sans-serif",
        },
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6',
      },
    },
  };

  return (
    <div className="w-70 h-34 mx-auto rounded-xl shadow-lg bg-gray-900 p-2">
      <Pie data={data} options={options} className="w-full h-full" />
    </div>
  );
};

export default PieChart;
