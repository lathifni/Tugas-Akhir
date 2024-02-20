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

export const fetchListAllReviewPackageById = async (id:string) => {
  const res = await useAxiosAuth.get(`/package/listAllReviewPackageById/${id}`)
  return res.data.data
}

export const fetchListDayPackageById = async(id:string) => {
  const res = await useAxiosAuth.get(`/package/listDayPackageById/${id}`)
  return res.data.data
}

export const fetchListAllService = async() => {
  const res = await useAxiosAuth.get(`/package/listAllServicePackage`)
  return res.data.data
}

export const createExtendBooking = async(packageDay:object, packageActivities:object, packageService:object): Promise<any> => {
  console.log(packageDay, 'ini bagian day');
  console.log(packageActivities, 'ini bagian activities');
  console.log(packageService, 'ini bagian service'); 
}