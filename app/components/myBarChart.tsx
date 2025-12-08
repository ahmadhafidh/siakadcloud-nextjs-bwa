'use client';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MyBarChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Fakultas Teknik", "Fakultas Kedokteran", "Fakultas Saintek"],
        datasets: [
          {
            label: 'Teknik Informatika',
            data: [120, 0, 0],
            backgroundColor: '#6777ef',
          },
          {
            label: 'Teknik Sipil',
            data: [100, 0, 0],
            backgroundColor: '#ffa426',
          },
          {
            label: 'Teknik Industri',
            data: [80, 0, 0],
            backgroundColor: '#63ed7a',
          },
          {
            label: 'Pendidikan Dokter',
            data: [0, 130, 0],
            backgroundColor: '#fc544b',
          },
          {
            label: 'Kedokteran Gigi',
            data: [0, 100, 0],
            backgroundColor: '#47c363',
          },
          {
            label: 'Farmasi',
            data: [0, 90, 0],
            backgroundColor: '#a55eea',
          },
          {
            label: 'Matematika',
            data: [0, 0, 110],
            backgroundColor: '#3abaf4',
          },
          {
            label: 'Biologi',
            data: [0, 0, 95],
            backgroundColor: '#f9ed69',
          },
          {
            label: 'Kimia',
            data: [0, 0, 100],
            backgroundColor: '#e056fd',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
            grid: {
              display: false,
            },
          },
          y: {
            stacked: false,
            beginAtZero: true,
          },
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw as number;
                const label = tooltipItem.dataset.label || '';
                return value !== 0 ? `${label}: ${value}` : '';
              },
            },
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return <canvas ref={chartRef} style={{ height: 300 }} />;
};

export default MyBarChart;
