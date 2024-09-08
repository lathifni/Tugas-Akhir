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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WaveData {
  hourly: {
    time: string[];
    wave_height: number[];
    wave_period: number[];
    wind_wave_height: number[];
  };
}

interface FilteredData {
  time: string;
  waveHeight: number;
  wavePeriod: number;
  windWaveHeight: number;
}

export default function WaveForecast() {
  const [waveData, setWaveData] = useState<WaveData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchWaveData = async () => {
      try {
        const res = await fetch(
          'https://marine-api.open-meteo.com/v1/marine?latitude=-0.711577&longitude=100.195636&hourly=wave_height,wave_direction,wave_period,wind_wave_height&timezone=Asia%2FSingapore&forecast_days=5'
        );
        const data: WaveData = await res.json();
        console.log(data); // Debugging output
        setWaveData(data);
        setSelectedDate(data.hourly.time[0].split('T')[0]); // Set the initial date
      } catch (error) {
        console.error('Failed to fetch wave data', error);
      }
    };

    fetchWaveData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Set breakpoint for mobile
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!waveData) {
    return <div>Loading...</div>;
  }

  const dates = Array.from(new Set(waveData.hourly.time.map((time) => time.split('T')[0])));

  // Helper function to calculate average for every 4 hours
  const calculateAverages = (arr: number[], interval: number) => {
    const averaged: number[] = [];
    for (let i = 0; i < arr.length; i += interval) {
      const subset = arr.slice(i, i + interval);
      const avg = subset.reduce((sum, val) => sum + val, 0) / subset.length;
      averaged.push(avg);
    }
    return averaged;
  };

  // Filter data for the selected date
  const filteredData: FilteredData[] = waveData.hourly.time
    .map((time: string, index: number) => ({
      time,
      waveHeight: waveData.hourly.wave_height[index],
      wavePeriod: waveData.hourly.wave_period[index],
      windWaveHeight: waveData.hourly.wind_wave_height[index],
    }))
    .filter((data: FilteredData) => data.time.includes(selectedDate!));

  // Labels with 4-hour intervals
  const labels = filteredData
    .map((data: FilteredData) => new Date(data.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    .filter((_, index) => index % 4 === 0); // Keep every 4th time label

  // Generate chart data with averaged values per 4 hours
  const createChartData = (label: string, data: number[], color: string) => ({
    labels,
    datasets: [
      {
        label,
        data: calculateAverages(data, 4), // Calculate averages every 4 hours
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

  return (
    <div className="m-1 sm:m-3 lg:m-5">
      <div className="w-full h-full px-2 py-4 bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-5">Wave Forecast</h1>
        <div className="mb-5 flex justify-center">
          {isMobile ? (
            <div>
              <label htmlFor="date-select" className="mr-2">Select Date:</label>
              <select
                id="date-select"
                value={selectedDate ?? ''}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border rounded-lg"
              >
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex space-x-4">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-2 rounded-lg ${selectedDate === date ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Wave Height */}
        <div className="mb-5">
          <div className="w-full lg:w-1/2 h-64 mx-auto">
            <Line
              data={createChartData('Wave Height (m)', filteredData.map((d) => d.waveHeight), '0, 0, 255')}
              options={options}
            />
          </div>
        </div>

        {/* Wave Period */}
        <div className="mb-5">
          <div className="w-full lg:w-1/2 h-64 mx-auto">
            <Line
              data={createChartData('Wave Period (s)', filteredData.map((d) => d.wavePeriod), '255, 0, 0')}
              options={options}
            />
          </div>
        </div>

        {/* Wind Wave Height */}
        <div className="mb-5">
          <div className="w-full lg:w-1/2 h-64 mx-auto">
            <Line
              data={createChartData('Wind Wave Height (m)', filteredData.map((d) => d.windWaveHeight), '255, 165, 0')}
              options={options}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
