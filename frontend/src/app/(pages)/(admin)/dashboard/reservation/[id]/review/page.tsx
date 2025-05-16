'use client'

import { fetchHomestayUnitByReservationId, fetchReservationById } from "@/app/(pages)/api/fetchers/reservation"
import Rating from "@mui/material/Rating"
import { useQuery } from "@tanstack/react-query"

export default function ReviewReservationIdPage({ params }: any) {
  const { data: dataReservationById, isLoading: loadingReservation, refetch } = useQuery({
    queryKey: ['reservationbyId', params.id],
    queryFn: () => fetchReservationById(params.id),
    // staleTime: 10000
  })

  const { data: dataHomestayUnitReservationById, isLoading: loadingHomestayUnitReservation, refetch:refetchHomestayUnit } = useQuery({
    queryKey: ['homestayUnitReservationbyId', params.id],
    queryFn: () => fetchHomestayUnitByReservationId(params.id),
    // staleTime: 10000
  })

  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }
  
  if (dataReservationById && dataHomestayUnitReservationById) {
    return (
      <div className="flex flex-col xl:flex-row m-1 sm:m-3 lg:m-4">
        <div className="w-full h-full px-1 xl:w-1/2">
          <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
            <h1 className="text-center text-xl font-bold">Review Package</h1>
            <table>
              </table>
              <tbody>
              
              <tr className="">
                <td className="font-semibold whitespace-no-wrap">Package Name </td>
                <td> {dataReservationById.reservation.name}</td>
              </tr>
              <tr>
                <td className="font-semibold whitespace-no-wrap">Package Type </td>
                <td> {dataReservationById.reservation.type_name}</td>
              </tr>
              <tr>
                <td className="font-semibold whitespace-no-wrap">Price Total </td>
                <td> {rupiah(dataReservationById.reservation.total_price)}</td>
              </tr>
              <tr className="text-justify">
                <td className="font-semibold whitespace-no-wrap">Description </td>
                <td> {dataReservationById.reservation.description}</td>
              </tr>
              <tr className="text-justify">
                <td className="font-semibold whitespace-no-wrap">Rating </td>
                <td> 
                  <Rating
                    name="rating"
                    value={dataReservationById.reservation.rating}
                    size="large"
                    // onChange={(event, newValue) => setRatingValue(newValue)} // Handle rating change
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="font-semibold whitespace-no-wrap">Review </td>
                <td> {/* Tambahkan <td> untuk menampung textarea */}
                  <textarea
                    placeholder="Leave a comment or review"
                    value={dataReservationById.reservation.review}
                    readOnly
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </td>
              </tr>
            </tbody>
          </div>
        </div>
        <div className="w-full h-full px-1 xl:w-1/2">
          <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
            <h1 className="text-center text-xl font-bold">Review Homestay</h1>
            <div>
            {dataHomestayUnitReservationById.map((unit: any, index: number) => (
              <div key={index} className="p-4 border-b">
                <h5 className="font-bold">{`${unit.name} - ${unit.nama_unit} (${unit.name_type} - Unit ${unit.unit_number})`}</h5>
                <p>{unit.description}</p>
                <p>Price: {rupiah(unit.price)}</p>
                <p>Capacity: {unit.capacity}</p>
                <div className="mt-2">
                  <Rating
                    name={`rating-${index}`}
                    value={unit.rating || null} // Simpan rating setiap unit
                    size="large"
                    // onChange={(event, newValue) => handleRatingChange(index, newValue)}
                    readOnly
                  />
                </div>
                <textarea
                  placeholder="Leave a review for this unit"
                  value={unit.review || ""}
                  // onChange={(e) => handleReviewChange(index, e.target.value)}
                  readOnly
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                />
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    )
  }
}