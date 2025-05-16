import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
    data: {
      month_year: string;
      total_revenue: string;
    }[]
}

const RevenueChart: React.FC<ChartProps> = ({ data }) => {
    const labels = data.map(item => item.month_year);
    const revenues = data.map(item => parseFloat(item.total_revenue));

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Total Revenue',
                data: revenues,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
                text: 'Total Revenue per Month',
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default RevenueChart;