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

export const fetchPackageAllActivityById = async (id:string) => {
  const res = await useAxiosAuth.get(`/package/allActivityById/${id}`)
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

export const fetchAllPackage = async() => {
  const res = await useAxiosAuth.get('/package/all')
  return res.data.data
}

export const fetchAllService = async() => {
  const res = await useAxiosAuth.get('/package/allservice')
  return res.data.data
}

export const fetchServiceById = async(id:string) => {
  const res = await useAxiosAuth.get(`/package/service/${id}`)
  return res.data.data
}

export const fetchAllPackageType = async() => {
  const res = await useAxiosAuth.get(`/package/allPackageType`)
  return res.data.data
}

export const fetchAllPackageInformationById = async(id:string) => {
  const res = await useAxiosAuth.get(`/package/allPackageInformation/${id}`)
  return res.data.data
}

export const fetchExploreOurPackage = async() => {
  const res = await useAxiosAuth.get(`/package/explore-our-package`)
  return res.data.data
}

export const fetchExploreBrowsePackage = async(id: string) => {
  const res = await useAxiosAuth.get(`/package/explore-browse-package/${id}`)
  return res.data.data
}

export const fetchExploreMyPackage = async(idUser:number) => {
  const res = await useAxiosAuth.get(`/package/explore-my-package/${idUser}`)
  return res.data.data
}

// export const fetchAddService = async()