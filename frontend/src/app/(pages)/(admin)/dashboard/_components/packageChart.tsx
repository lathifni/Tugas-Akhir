import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  data: {
    month_year: string;
    total_existing_package: string;
    total_custom_package: string;
  }[]
}

const PackageChart: React.FC<ChartProps> = ({ data }) => {
  const labels = data.map(item => item.month_year);
  const existingPackageData = data.map(item => parseInt(item.total_existing_package));
  const customPackageData = data.map(item => parseInt(item.total_custom_package));

  const chartData = {
      labels: labels,
      datasets: [
        {
            label: 'Existing Packages',
            data: existingPackageData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Warna untuk paket yang sudah ada
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
        {
            label: 'Custom Packages',
            data: customPackageData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Warna untuk paket custom
            borderColor: 'rgba(255, 99, 132, 1)',
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
              text: 'Package Customization Anaylsis per Month',
          },
      },
  };

  return <Bar data={chartData} options={options} />;
};

export default PackageChart;