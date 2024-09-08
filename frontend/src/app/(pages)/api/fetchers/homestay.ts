import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomHomestay = async () => {
  const res = await useAxiosAuth.get('/homestay/geom')
  return res.data.data
}

export const fetchAllHomestay = async() => {
  const res = await useAxiosAuth.get('/homestay/all')
  return res.data.data
}

export const fetchAvailableHomestay = async(checkin_date:Date, max_day:number) => {
  const res = await useAxiosAuth.get(`/homestay/available-homestay?checkin_date=${checkin_date}&max_day=${max_day}`)
  return res.data.data
}

export const fetchBookedHomestay = async(id: string) => {
  const res = await useAxiosAuth.get(`/homestay/booked-homestay/${id}`)
  return res.data.data
}

export const fetchHomestayById = async(params: any) => {
  const res = await useAxiosAuth.get(`/homestay/${params}`)
  return res.data.data
}