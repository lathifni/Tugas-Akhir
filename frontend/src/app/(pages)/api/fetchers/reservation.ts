import useAxiosAuth from "../../../../../libs/useAxiosAuth"

export const postReservationTransaction = async() => {
  const data = {
    name: 'user',
    user_id: 'barangtest123',
    total: 100100
  }
  const res = await useAxiosAuth.post('/reservation/process-transaction', data)
  return res.data.data
}

export const fetchListReservationByUserId = async(id:string) => {
  const res = await useAxiosAuth.get(`/reservation/${id}` )
  return res.data.data
}

export const fetchReservationById = async(id:string) => {
  const res = await useAxiosAuth.get(`/reservation/reservationById/${id}` )
  return res.data.data
}

export const fetchAllReservation = async() => {
  const res = await useAxiosAuth.get('/reservation/all')
  return res.data.data
}

export const confirmationDate = async(id:string) => {
  const res = await useAxiosAuth.get(`/reservation/confirmationDate/${id}`)
  return res.data.data
}

export const bookingHomestayByIdReservation = async(data: any) => {
  const res = await useAxiosAuth.post('/reservation/booking-homestay', data)
  console.log(res.data.data);
  
}