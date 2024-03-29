import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomHomestay = async () => {
  const res = await useAxiosAuth.get('/homestay/geom')
  return res.data.data
}

export const fetchAllHomestay = async() => {
  const res = await useAxiosAuth.get('/homestay/all')
  return res.data.data
}