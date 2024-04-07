import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchGalleriesGtp = async () => {
  const res = await useAxiosAuth.get('/galleries/gtp')
  return res.data.data
}

export const fetchGalleriesFacility = async (id:string) => {
  const res = await useAxiosAuth.get(`/galleries/facility/${id}`)
  return res.data.data
}