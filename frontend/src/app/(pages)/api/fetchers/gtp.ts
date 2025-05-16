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

export const fetchDataDashboard = async() => {
  const res = await useAxiosAuth.get('/gtp/dashboard')
  return res.data.data
}

export const fetchDataRevenue = async() => {
  const res = await useAxiosAuth.get('/gtp/revenue')
  return res.data.data
}

export const fetchDataPackageAnalysis = async() => {
  const res = await useAxiosAuth.get('/gtp/package-analysis')
  return res.data.data
}

export const fetchDataDayAnalysis = async() => {
  const res = await useAxiosAuth.get('/gtp/day-analysis')
  return res.data.data
}

export const fetchDataPeopleAnalysis = async() => {
  const res = await useAxiosAuth.get('/gtp/people-analysis')
  return res.data.data
}

export const fetchDataReferralAnalysis = async() => {
  const res = await useAxiosAuth.get('/gtp/referral-analysis')
  return res.data.data
}

export const fetchListAllAnnouncement = async() => {
  const res = await useAxiosAuth.get('/gtp/list-all-announcement')
  return res.data.data
}

export const fetchListAllActiveAnnouncement = async() => {
  const res = await useAxiosAuth.get('/gtp/list-all-active-announcement')
  return res.data.data
}

export const fetchDataInformation = async() => {
  const res = await useAxiosAuth.get('/gtp/information')
  return res.data.data
}