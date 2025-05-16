import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
    data: {
      month_year: string;
      total_people: string;
    }[]
}

const PeopleChart: React.FC<ChartProps> = ({ data }) => {
    const labels = data.map(item => item.month_year);
    const revenues = data.map(item => parseFloat(item.total_people));

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Total People',
                data: revenues,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
                text: 'Total Visitor per Month',
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default PeopleChart;