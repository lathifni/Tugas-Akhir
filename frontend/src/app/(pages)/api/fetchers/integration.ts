import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchWeatherForecast = async () => {
  const res = await useAxiosAuth.get('/integration/weather')
  return res.data.data
}

export const fetchWaterForecast = async () => {
  const res = await useAxiosAuth.get('/integration/water')
  return res.data.data
}