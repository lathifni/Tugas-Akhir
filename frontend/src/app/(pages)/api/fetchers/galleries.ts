import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchGalleriesGtp = async () => {
  const res = await useAxiosAuth.get('/galleries/gtp')
  return res.data.data
}

export const fetchGalleriesFacility = async (id:string) => {
  const res = await useAxiosAuth.get(`/galleries/facility/${id}`)
  return res.data.data
}

export const fetchGalleriesCulinary = async (id:string) => {
  const res = await useAxiosAuth.get(`/galleries/culinary/${id}`)
  return res.data.data
}

export const fetchGalleriesWorship = async (id:string) => {
  const res = await useAxiosAuth.get(`/galleries/worship/${id}`)
  return res.data.data
}

export const fetchGalleriesSouvenir = async (id:string) => {
  const res = await useAxiosAuth.get(`/galleries/souvenir/${id}`)
  return res.data.data
}

export const fetchGalleriesAttraction = async (id:string) => {
  const res = await useAxiosAuth.get(`/galleries/attraction/${id}`)
  return res.data.data
}

export const fetchGalleriesHomestay = async (id:string) => {
  const res = await useAxiosAuth.get(`/galleries/homestay/${id}`)
  return res.data.data
}

export const fetchGalleriesHomestayUnit = async (id:string) => {
  const res = await useAxiosAuth.get(`/galleries/homestay/unit/${id}`)
  return res.data.data
}