import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchGalleriesGtp = async () => {
  const res = await useAxiosAuth.get('/galleries/gtp')
  return res.data.data
}