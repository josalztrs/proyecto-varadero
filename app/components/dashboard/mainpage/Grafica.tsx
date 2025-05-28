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
          'rgba(16, 185, 129, 0.85)',
          'rgba(236, 72, 153, 0.85)',  
          'rgba(34, 211, 238, 0.85)',  
        ],
        borderColor: ['#111827', '#111827', '#111827'], // dark border
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
          boxWidth: 8,
          padding: 8,
          font: {
            size: 9,
            weight: 600,
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
          size: 9,
          family: "'Inter', sans-serif",
        },
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6',
      },
    },
  };

  return (
    <Pie data={data} options={options} />
  );
};

export default PieChart;
