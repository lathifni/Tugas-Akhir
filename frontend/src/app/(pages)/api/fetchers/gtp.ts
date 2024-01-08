import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchInfoGtp = async () => {
  const res = await useAxiosAuth.get('/gtp')
  return res.data.data
}

export const fetchGeomGtp = async () => {
  const res = await useAxiosAuth.get('/gtp/geom')
  return res.data.data
}