'use client';

import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Gastos en Bs',
        data: [500, 700, 450, 600, 800, 550],
        borderColor: 'rgba(16, 185, 129, 0.85)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // Light fill for the area under the line
        borderWidth: 2,
        fill: true, // Fill the area under the line
        tension: 0, // Smooth the line
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Ingresos en Bs',
        data: [600, 650, 500, 700, 750, 600],
        borderColor: 'rgba(236, 72, 153, 0.85)',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0,
        pointBackgroundColor: 'rgba(236, 72, 153, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Display the legend to differentiate lines
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 10,
          font: {
            size: 12,
            weight: 'normal',
            family: "'Inter', sans-serif",
          },
          color: '#858585',
        },
      },
      title: {
        display: false,
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
        intersect: false,
        mode: 'index',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.1)', // Light grid lines
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.1)',
        },
      },
    },
  };

  return (
    <Line data={data} options={options} />
  );
};

export default LineChart;