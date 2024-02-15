import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchInfoGtp = async () => {
  const res = await useAxiosAuth.get('/gtp')
  return res.data.data
}

export const fetchGeomGtp = async () => {
  const res = await useAxiosAuth.get('/gtp/geom')
  return res.data.data
}

export const fetchListAllObject = async() => {
  const res = await useAxiosAuth.get('/gtp/allObject')
  return res.data.data
}