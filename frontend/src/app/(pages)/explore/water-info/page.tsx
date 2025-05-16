'use client'

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { fetchWaterForecast } from '../../api/fetchers/integration';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FilteredData {
  time: string;
  wave_height: number;
  wave_period: number;
  wind_wave_height: number;
}

export default function WaveForecast() {
  const [forecast, setForecast] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const { isError, isSuccess, isLoading, data, error } = useQuery({
    queryKey: ['fetchWaterForecast'],
    queryFn: () => fetchWaterForecast(),
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (data) {
      setSelectedDay(data.days[0])
      setForecast(data)
    }
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }
  
  const filteredData: FilteredData[] = forecast?.forecast.filter((entry: any) => {
    return new Date(entry.time).toDateString() === selectedDay;
  });

  // Labels with 4-hour intervals
  const labels = filteredData?.map((d: any) =>
    new Date(d.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );

  // Generate chart data with averaged values per 4 hours
  const createChartData = (label: string, data: number[], color: string) => ({
    labels,
    datasets: [
      {
        label,
        data: data,
        borderColor: color,
        backgroundColor: `rgba(${color}, 0.5)`,
        fill: true,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Wave Forecast',
      },
    },
  };

  if (forecast != null || forecast != undefined) {
    return (
      <div className="m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 py-4 bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-5">Wave Forecast</h1>
          {/* Dropdown for small screens (until lg) */}
          <div className="block xl:hidden mb-4">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {data.days.map((day: string) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          {/* Tabs for large screens (xl and up) */}
          <div className="hidden xl:flex justify-center mb-4">
            {data.days.map((day: string) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 rounded py-2 mx-1 border-b-2 ${
                  selectedDay === day ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Wave Height */}
          <div className="mb-5">
            <div className="w-full lg:w-2/3 h-64 mx-auto">
              <Line
                data={createChartData('Wave Height (m)', filteredData.map((d) => d.wave_height), '0, 0, 255')}
                options={options}
              />
            </div>
          </div>
  
          {/* Wave Period */}
          <div className="mb-5">
            <div className="w-full lg:w-2/3 h-64 mx-auto">
              <Line
                data={createChartData('Wave Period (s)', filteredData.map((d) => d.wave_period), '255, 0, 0')}
                options={options}
              />
            </div>
          </div>
  
          {/* Wind Wave Height */}
          <div className="mb-5">
            <div className="w-full lg:w-2/3 h-64 mx-auto">
              <Line
                data={createChartData('Wind Wave Height (m)', filteredData.map((d) => d.wind_wave_height), '255, 165, 0')}
                options={options}
              />
            </div>
          </div>
          {/* Warning Section */}
        <div className="px-4 bg-yellow-100 border border-yellow-400 rounded text-justify">
          <h2 className="text-lg font-semibold text-yellow-700">Warnings</h2>
          <ul className="list-disc pl-5 text-yellow-700">
            <li>
              Avoid coastal areas when wave heights exceed 0.5 meters, as conditions may become hazardous, especially for small boats, surfers, and swimmers.
            </li>
            <li>
              Wave periods below 8 seconds may indicate choppy, unstable sea conditions, making activities like swimming and boating more challenging.
            </li>
            <li>
              Wind waves above 0.1 meters can create additional turbulence on the water surface, leading to dangerous conditions for smaller vessels and swimmers.
            </li>
          </ul>
        </div>
        </div>
      </div>
    );
  }
}
