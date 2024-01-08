import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomWorship = async () => {
  const res = await useAxiosAuth.get('/worship/geom')
  return res.data.data
}