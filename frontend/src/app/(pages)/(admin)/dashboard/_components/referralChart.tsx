import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, scales } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  data: {
    month_year: string;
    total_reservations: string;
    total_referral_value: string;
  }[]
}

const ReferralChart: React.FC<ChartProps> = ({ data }) => {
  const labels = data.map(item => item.month_year);
  const total_reservations = data.map(item => parseInt(item.total_reservations));
  const total_referral_value = data.map(item => parseFloat(item.total_referral_value.replace(/,/g, ''))); // Mengonversi string ke angka dengan parseFloat
  console.log(total_referral_value);
  
  const chartData = {
    labels: labels,
    datasets: [
        {
            label: 'Reservations',
            data: total_reservations,
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Warna baru untuk Reservations
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        {
            label: 'Referral Value',
            data: total_referral_value,
            backgroundColor: 'rgba(255, 159, 64, 0.6)', // Warna baru untuk Referral Value
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            yAxisID: 'y2', // Menggunakan sumbu Y kedua
        },
    ],
};

  const options = {
      responsive: true,
      plugins: {
          legend: {
              position: 'top' as const,
          },
          title: {
              display: true,
              text: 'Referral Anaylsis per Month',
          },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: Math.max(...total_reservations) + 5,

        },
        y2: {
          type: 'linear' as const, // Pastikan tipe sumbu Y kedua benar
          position: 'right' as const, // Menggunakan string literal yang tepat
          beginAtZero: true,
          min: 0,
          // ticks: {
          //   callback: (value: number) => value.toString(),
          // },
        },
      }
  };

  return <Bar data={chartData} options={options} />;
};

export default ReferralChart;