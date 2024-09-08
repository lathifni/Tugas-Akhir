import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const fetchUserChats = async(params: any) => {
  const res = await useAxiosAuth.get(`/chat/${params}`)
  return res.data.data
}

export const fetchListAdminChat = async(params:any) => {
  const res = await useAxiosAuth.get(`/chat/add-new-chat-with-admin/${params}`)
  return res.data.data
}

export const createNewRoomChat = async(params:any) => {
  const res = await useAxiosAuth.post(`/chat/create-room-chat`, params)
  return res.data.data
}

export const generateQrCodeWA = async() => {
  const res = await useAxiosAuth.get(`/chat/start`,)
  return res.data.data
}