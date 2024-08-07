import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListGeomWorship = async () => {
  const res = await useAxiosAuth.get('/worship/geom')
  return res.data.data
}

export const fetchAllWorship = async() => {
  const res = await useAxiosAuth.get('/worship/all')
  return res.data.data
}

export const fetchWorshipById = async(params: any) => {
  const res = await useAxiosAuth.get(`/worship/${params}`)
  return res.data.data
}