'use client'

import { fetchHomestayUnitByReservationId, fetchReservationById } from "@/app/(pages)/api/fetchers/reservation"
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Rating from "@mui/material/Rating"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function ReviewReservationId({ params }: any) {
   const [ratingValue, setRatingValue] = useState<number | null>(null); // State for rating
   const [review, setReview] = useState<string>(""); // State for review
   const [error, setError] = useState<string>('');
   const [localHomestays, setLocalHomestays] = useState<any[]>([]); 
   
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

  const handleRatingChange = (index: number, newValue: number | null) => {    
    const updatedHomestays = [...localHomestays];
    updatedHomestays[index] = { 
      ...updatedHomestays[index], 
      rating: newValue // Update rating
    };
    setLocalHomestays(updatedHomestays); // Simpan perubahan ke state lokal
  };
  

  const handleReviewChange = (index: number, value: string) => {
    const updatedHomestays = [...localHomestays];
    updatedHomestays[index].review = value;
    updatedHomestays[index] = { 
      ...updatedHomestays[index], 
      review: value // Update rating
    };
    setLocalHomestays(updatedHomestays); // Simpan perubahan ke state lokal
  };
  
  const handleSaveAllReviews = async () => {
    console.log(localHomestays);
    const response = await useAxiosAuth.post('reservation/review-homestay', localHomestays)
      if (response.data.status == 'success') {
        toast.success('Success')
        refetch()
      }
  };

  const handleSaveReviewPackage = async () => {
    if (ratingValue === null) {
      return setError('Please provide a rating.');
    }
    if (review == '') {
      return setError('Please provide a review.');
    }
    const newReview = {
      rating: ratingValue,
      review: review,
      id: params.id
    };

    const response = await useAxiosAuth.post('reservation/review-package', newReview)
      if (response.data.status == 'success') {
        toast.success('Success')
        refetch()
      }
  };

  useEffect(() => {
    if (dataHomestayUnitReservationById) {
      setLocalHomestays(dataHomestayUnitReservationById); // Isi state lokal dengan data dari API
    }
  }, [dataHomestayUnitReservationById]);

  useEffect(() => {
    if (dataReservationById) {      
      setRatingValue(dataReservationById.reservation.rating)
      setReview(dataReservationById.reservation.review)
    }
  }, [dataReservationById

  ])

  if (dataReservationById && dataHomestayUnitReservationById) {
    return (
      <div className="flex flex-col xl:flex-row m-1 sm:m-3 lg:m-4">
        <div className="w-full h-full px-1 xl:w-1/2">
          <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
            <h1 className="text-center text-xl font-bold">Review Package</h1>
            <table>
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
                      value={ratingValue}
                      size="large"
                      onChange={(event, newValue) => setRatingValue(newValue)} // Handle rating change
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
            </table>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="text-center">
              <button
                className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400"
                onClick={handleSaveReviewPackage}
              >
                <FontAwesomeIcon icon={faCheck} /> Save
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-full px-1 xl:w-1/2">
          <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
            <h1 className="text-center text-xl font-bold">Review Homestay</h1>
            <div>
            {localHomestays.map((unit: any, index: number) => (
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
                    onChange={(event, newValue) => handleRatingChange(index, newValue)}
                  />
                </div>
                <textarea
                  placeholder="Leave a review for this unit"
                  value={unit.review || ""}
                  onChange={(e) => handleReviewChange(index, e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                />
              </div>
            ))}
            <div className="text-center">
              <button
                className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400"
                onClick={handleSaveAllReviews}
              >
                Save All Reviews
              </button>
            </div>
          </div>

          </div>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    )
  }
}