import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomHomestay = async () => {
  const res = await useAxiosAuth.get('/homestay/geom')
  return res.data.data
}