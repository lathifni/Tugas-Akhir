import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartProps {
  data: {
    total_days: number;
    total_reservations: string;
  }[]
}

const DayPieChart: React.FC<ChartProps> = ({ data }) => {
  const labels = data.map(item => `${item.total_days} days`);
  const reservationsData = data.map(item => parseInt(item.total_reservations));

  const chartData = {
    labels: labels,
    datasets: [
        {
            label: 'Reservations',
            data: reservationsData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
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
            text: 'Reservations by Package Duration Last 12 Month',
        },
    },
  };
  return <Pie data={chartData} options={options} />;
}

export default DayPieChart;