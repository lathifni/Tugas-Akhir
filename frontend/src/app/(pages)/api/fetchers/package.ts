import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchListAllBasePackage = async() => {
  const res = await useAxiosAuth.get('/package/listAllBasePackage')
  return res.data.data
}

export const fetchPackageById = async (id:string) => {
  const res = await useAxiosAuth.get(`/package/packageById/${id}`)
  return res.data.data
}

export const fetchListAllServicePackageById = async (id:string) => {
  const res = await useAxiosAuth.get(`/package/listAllServicePackageById/${id}`)
  return res.data.data
}

export const fetchAverageRatingPackageById = async(id:string) => {
  const res = await useAxiosAuth.get(`/package/averageRatingPackageById/${id}`)
  return res.data.data
}

export const fetchPackageActivityById = async (id:string) => {
  const res = await useAxiosAuth.get(`/package/listPackageActivityById/${id}`)
  return res.data.data
}

export const fetchListAllGalleryPackageById = async (id:string) => {
  const res = await useAxiosAuth.get(`/package/listAllGalleryPackageById/${id}`)
  return res.data.data
}

export const fetchListAllReviewPackageById =async (id:string) => {
  const res = await useAxiosAuth.get(`/package/listAllReviewPackageById/${id}`)
  return res.data.data
}