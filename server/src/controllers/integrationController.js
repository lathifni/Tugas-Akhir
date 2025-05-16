const axios = require('axios');
const moment = require('moment');

const weatherDescriptions = {
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

const weatherForecastController = async () => {
  const response = await axios.get(
    'https://api.open-meteo.com/v1/forecast?latitude=-0.711577&longitude=100.195636&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m'
  );

  const forecastTime = response.data.hourly.time;
  const days = [
    ...new Set(
      forecastTime.map((time) => new Date(time).toDateString())
    ),
  ];
  const forecast = response.data
  return {
    days, forecast
  }
};

const waterForecastController = async() => {
  const response = await axios.get(
    'https://marine-api.open-meteo.com/v1/marine?latitude=-0.711577&longitude=100.195636&hourly=wave_height,wave_direction,wave_period,wind_wave_height&timezone=Asia%2FSingapore&forecast_days=7'
  );
  const data = response.data;
  const forecastTime = data.hourly.time;
  const days = [
    ...new Set(
      forecastTime.map((time) => new Date(time).toDateString())
    ),
  ];

  const interval = 4; // 4 jam
  const calculateAverages = (arr) => {
    const averaged = [];
    for (let i = 0; i < arr.length; i += interval) {
      const subset = arr.slice(i, i + interval);
      const avg = subset.reduce((sum, val) => sum + val, 0) / subset.length;
      averaged.push(avg);
    }
    return averaged;
  };
  const averagedWaveHeight = calculateAverages(data.hourly.wave_height);
  const averagedWavePeriod = calculateAverages(data.hourly.wave_period);
  const averagedWindWaveHeight = calculateAverages(data.hourly.wind_wave_height);

  const processedData = averagedWaveHeight.map((_, index) => ({
    time: forecastTime[index * interval], // Setiap 4 jam
    wave_height: averagedWaveHeight[index],
    wave_period: averagedWavePeriod[index],
    wind_wave_height: averagedWindWaveHeight[index],
  }));
  return {
    days, forecast:processedData
  }
}

const weatherForecastByDateControllerLama = async(params) => {
  const { date_awal, date_akhir } = params;
  const formattedDateAwal = moment(date_awal).format('YYYY-MM-DD');
  const formattedDateAkhir = moment(date_akhir).format('YYYY-MM-DD');
  console.log('formattedDateAwal:', formattedDateAwal, 'formattedDateAkhir:', formattedDateAkhir);
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=-0.711577&longitude=100.195636&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&start_date=${formattedDateAwal}&end_date=${formattedDateAkhir}`
  );
  if (!response.data || !response.data.hourly) {
    throw new Error('Data tidak ditemukan dari API');
  }
  // console.log(response.data);
  const warnings = checkWeatherForWarnings(response.data.hourly);
  const message = warnings.length === 0 ? "The weather is good." : null;
  
  return {
    success: true,
    data: response.data,
    warnings,
    message,
  };
}

const weatherForecastByDateController = async (params) => {
  const { date_awal, date_akhir } = params;
  const formattedDateAwal = moment(date_awal).format('YYYY-MM-DD');
  const formattedDateAkhir = moment(date_akhir).format('YYYY-MM-DD');
  
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=-0.711577&longitude=100.195636&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&start_date=${formattedDateAwal}&end_date=${formattedDateAkhir}`
  );

  const data = response.data.hourly;
  const weatherWarnings = [];
  let rangeStart = null;
  let previousHour = null;

  data.weather_code.forEach((code, index) => {
    const isRainOrStorm = [61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
    const currentTime = data.time[index];
    const currentHour = new Date(currentTime).getHours();

    if (isRainOrStorm) {
      if (rangeStart === null) {
        // Start new range
        rangeStart = currentTime;
      } else if (previousHour !== null && currentHour !== previousHour + 1) {
        // End previous range if there's a gap
        addWarning(rangeStart, data.time[index - 1], weatherWarnings);
        rangeStart = currentTime;
      }
      previousHour = currentHour;
    } else {
      if (rangeStart !== null) {
        // End previous range since conditions cleared
        addWarning(rangeStart, data.time[index - 1], weatherWarnings);
        rangeStart = null;
        previousHour = null;
      }
    }
  });

  // Handle any final open range
  if (rangeStart) {
    addWarning(rangeStart, data.time[data.time.length - 1], weatherWarnings);
  }

  const message = weatherWarnings.length > 0 ? weatherWarnings : ['The weather is good'];

  return { warnings: message };
};

const addWarning = (startTime, endTime, warningsArray) => {
  // const start = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // const end = new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const start = moment(startTime);
  const end = moment(endTime);

  const formattedStartDate = start.format('DD-MM-YYYY'); // Format date
  const formattedStartTime = start.format('hh:mm A'); // Format time (AM/PM)
  const formattedEndTime = end.format('hh:mm A'); // Format time (AM/PM)

  if (start.isSame(end)) {
    warningsArray.push(`${formattedStartDate} Rain or storm expected  at ${formattedStartTime }`);
  } else {
    warningsArray.push(`${formattedStartDate} Rain or storm expected from ${formattedStartTime } to ${formattedEndTime}`);
  }
};

const checkWeatherForWarnings = (hourlyData) => {
  const { time, weather_code } = hourlyData;
  const rainAndStormCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];
  const warnings = [];

  for (let i = 0; i < weather_code.length; i++) {
    if (rainAndStormCodes.includes(weather_code[i])) {
      warnings.push(`Warning: On ${time[i]} indicates possible rain or storm.`);
    }
  }

  return warnings;
};

const waterForecastByDateController = async(params) => {
  const { date_awal, date_akhir } = params;
  const formattedDateAwal = moment(date_awal).format('YYYY-MM-DD');
  const formattedDateAkhir = moment(date_akhir).format('YYYY-MM-DD');
  console.log(formattedDateAwal);
  

  try {
    const response = await axios.get(
      `https://marine-api.open-meteo.com/v1/marine?latitude=-0.711577&longitude=100.195636&daily=wave_height_max,wave_period_max,wind_wave_height_max&timezone=Asia%2FSingapore&start_date=${formattedDateAwal}&end_date=${formattedDateAkhir}`
    );    

    const data = response.data;
    const { time, wave_height_max, wave_period_max, wind_wave_height_max } = data.daily;

    // Proses data untuk mencari peringatan
    const warnings = time.map((date, index) => {
      const waveHeight = wave_height_max[index];
      const wavePeriod = wave_period_max[index];
      const windWaveHeight = wind_wave_height_max[index];

      const conditions = [];
      if (waveHeight > 0.5) {
        conditions.push("wave height exceeds 0.5m");
      }
      if (wavePeriod < 8) {
        conditions.push("wave period is below 8 seconds");
      }
      if (windWaveHeight > 0.1) {
        conditions.push("wind wave height exceeds 0.1m");
      }

      // Kembalikan pesan peringatan jika ada kondisi
      if (conditions.length > 0) {
        return `Warning on ${date}: ${conditions.join(", ")}.`;
      }
      return null; // Tidak ada peringatan untuk tanggal ini
    }).filter(warning => warning !== null); // Hapus nilai null dari hasil

    // Jika tidak ada peringatan sama sekali
    if (warnings.length === 0) {
      return ["All water information forecast is good, but stay careful near the beach!"];
    }

    // Kembalikan array peringatan
    return warnings;

  } catch (error) {
    console.error("Error fetching marine forecast data:", error.message);
    throw new Error("Failed to fetch marine forecast data.");
  }
}

module.exports = {
  weatherForecastController, waterForecastController, weatherForecastByDateController, waterForecastByDateController
}