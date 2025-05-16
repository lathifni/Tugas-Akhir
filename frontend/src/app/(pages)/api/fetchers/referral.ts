import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchAllReferral = async() => {
  const res = await useAxiosAuth.get(`/referral/list-all` )
  return res.data.data
}

export const fetchAllReferralByUserId = async(id:string) => {
  const res = await useAxiosAuth.get(`/referral/list-all-by-user-id/${id}` )
  return res.data.data
}

export const fetchReferralById = async(id:string) => {
  const res = await useAxiosAuth.get(`/referral/by-id/${id}`)
  return res.data.data
}
export const fetchMyReferralById = async(id:string) => {
  const res = await useAxiosAuth.get(`/referral/my-referral/${id}`)
  return res.data.data
}