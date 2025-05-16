"use client";

import { useState, useEffect } from "react";
import { IoIosCloudy } from 'react-icons/io';
import { IoRainy, IoThunderstorm  } from "react-icons/io5";
import { MdFoggy } from 'react-icons/md';
import { RiDrizzleFill } from 'react-icons/ri';
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherForecast } from "../../api/fetchers/integration";

export default function WeatherForecast() {
  const [forecast, setForecast] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const { isError, isSuccess, isLoading, data, error } = useQuery({
    queryKey: ['fetchWeatherForecast'],
    queryFn: () => fetchWeatherForecast(),
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=-0.711577&longitude=100.195636&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m`;

    // fetch(url)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // setForecast(data);
    //     console.log(data);
        
    //     setSelectedDay(new Date(data.hourly.time[0]).toDateString());
    //   })
    //   .catch((error) => console.error("Error fetching data:", error));
    if (data) {
      setForecast(data)
      console.log(data);
      
      setSelectedDay(data.days[0])
    }
  }, [data]);

  if (!forecast) {
    return <div>Loading...</div>;
  }

  const getWeatherDescription = (code: number) => {
    const weatherDescriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return weatherDescriptions[code] || 'Unknown weather condition';
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <IoIosCloudy />; // Clear sky
    if ([1, 2, 3].includes(code)) return <IoIosCloudy />; // Mainly clear, partly cloudy, overcast
    if ([45, 48].includes(code)) return <MdFoggy />; // Fog, rime fog
    if ([51, 53, 55].includes(code)) return <RiDrizzleFill />; // Drizzle
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <IoRainy />; // Rain and rain showers
    if ([95, 96, 99].includes(code)) return <IoThunderstorm />; // Thunderstorm and hail

    return <IoIosCloudy />; // Default icon if no match
  };

  // const forecastTime: string[] = forecast.hourly.time as string[];
  // const days: string[] = [
  //   ...new Set(
  //     forecastTime.map((time: string) => new Date(time).toDateString())
  //   ),
  // ];

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(event.target.value);
  };

  const handleTabClick = (day: string) => {
    setSelectedDay(day);
  };

  // Fungsi untuk menentukan warna berdasarkan jam
  const getBackgroundColor = (time: string) => {
    const hour = new Date(time).getHours();
    if (hour >= 0 && hour <= 5) {
      return "bg-gradient-to-b from-gray-800 to-gray-600 text-white"; // Jam 00:00 - 05:59 (gelap)
    } else if (hour >= 6 && hour <= 18) {
      return "bg-gradient-to-b from-sky-700 to-sky-500 text-white"; // Jam 06:00 - 18:59 (terang)
    } else {
      return "bg-gradient-to-b from-gray-800 to-gray-600 text-white"; // Jam 19:00 - 23:59 (gelap)
    }
  };

  const filteredForecast = forecast.forecast.hourly.time.reduce(
    (acc: any, time: string, index: number) => {
      const day = new Date(time).toDateString();
      if (day === selectedDay) {
        acc.push({
          time: time,
          temperature: forecast.forecast.hourly.temperature_2m[index],
          weatherCode: forecast.forecast.hourly.weather_code[index],
          humidity: forecast.forecast.hourly.relative_humidity_2m[index],
          wind: forecast.forecast.hourly.wind_speed_10m[index],
          precipitation: forecast.forecast.hourly.precipitation_probability[index],
        });
      }
      return acc;
    },
    []
  );
  
  if (forecast) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 py-4 bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-2">Weather Forecast</h1>
          {/* Dropdown for small screens (until lg) */}
          <div className="block xl:hidden mb-4">
            <select
              value={selectedDay}
              onChange={handleDayChange}
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
            {forecast.days.map((day: string) => (
              <button
                key={day}
                onClick={() => handleTabClick(day)}
                className={`px-4 py-2 mx-2 border-b-2 ${
                  selectedDay === day ? "border-green-500" : "border-transparent"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
  
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredForecast?.map((item: any, index: number) => (
              <div
                key={index}
                className={`p-2 rounded-lg shadow-md ${getBackgroundColor(
                  item.time
                )}`} // Apply background based on time
              >
                <p className="text-lg font-bold text-center">
                  {new Date(item.time).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </p>
                <div className="flex justify-center items-center text-7xl">
                  {getWeatherIcon(item.weatherCode)}
                </div>
                <p className="text-center">{getWeatherDescription(item.weatherCode)}</p>
                <p className="text-xl my-2 font-bold text-center">
                  {item.temperature}°C
                </p>
                <div className="flex justify-center items-center">
                  <WiHumidity className="text-white text-4xl"/> {item.humidity}%
                </div>
                <div className="flex justify-center items-center">
                  <FaWind className="text-yellow-300 text-2xl mr-1"/> {item.wind} km/h
                </div>
                <p className="text-lg text-center">
                  Precipitation {item.precipitation}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
