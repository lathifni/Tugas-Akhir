'use client'

import { fetchAverageRatingPackageById, fetchListAllGalleryPackageById, fetchListAllReviewPackageById, fetchListAllServicePackageById, fetchPackageActivityById, fetchPackageById } from "@/app/(pages)/api/fetchers/package";
import { useQuery } from "@tanstack/react-query";
import { Rating } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import MapPackage from "@/components/maps/mapPackage";
import { SetStateAction, useState } from "react";
import MapHomeCopy from "@/components/maps/mapHomeCopy";

interface UserLocation {
  lat: number;
  lng: number;
}

export default function PackageIdPage({ params }: any) {
  const [showLegend, setShowLegend] = useState(false);
  const [isManualLocationClicked, setIsManualLocationClicked] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  
  const { data: dataListAllServicePackageById, isLoading: loadingListAllServicePackageById } = useQuery({
    queryKey: ['listAllServicePackageById', params.id],
    queryFn: () => fetchListAllServicePackageById(params.id)
  })
  const { data: dataPackageById, isLoading: loadingPackageById } = useQuery({
    queryKey: ['PackageById', params.id],
    queryFn: () => fetchPackageById(params.id)
  })
  const { data: dataAverageRatingById, isLoading: loadingAverageRating } = useQuery({
    queryKey: ['averageRatingById', params.id],
    queryFn: () => fetchAverageRatingPackageById(params.id)
  })
  const { data: dataPackageActivityById, isLoading: loadingPackageActivity } = useQuery({
    queryKey: ['packageActivity', params.id],
    queryFn: () => fetchPackageActivityById(params.id)
  })
  const { data: dataListAllGalleryPackageById, isLoading: loadingGalleryPackage } = useQuery({
    queryKey: ['listAllGalleryPackageById', params.id],
    queryFn: () => fetchListAllGalleryPackageById(params.id)
  })
  const { data: dataListAllReviewPackageById, isLoading: loadingReviewPackage } = useQuery({
    queryKey: ['listAllReviewPackageById', params.id],
    queryFn: () => fetchListAllReviewPackageById(params.id)
  })

  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  if (dataListAllServicePackageById && dataPackageById && dataAverageRatingById && dataListAllGalleryPackageById && dataListAllReviewPackageById) {
    const serviceInclude = dataListAllServicePackageById.filter((item: { name: string, status: number; }) => item.status === 1);
    const serviceExclude = dataListAllServicePackageById.filter((item: { name: string, status: number; }) => item.status === 0);

    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 lg:p-0 lg:mb-0 lg:mr-3 lg:w-7/12 ">
          <div className="relative py-5 bg-white rounded-lg mb-5 px-5">
            <h1 className="text-center text-xl font-semibold">Package Information</h1>
            <div className="absolute right-1 sm:right-5 px-3 py-1 bg-green-500 rounded-lg text-white hover:bg-green-700" role="button">
              <FontAwesomeIcon icon={faCartPlus} /> Booking
            </div>
            <div className="absolute flex right-28 sm:right-36">
              <p className="text-base pt-1">{dataAverageRatingById[0].average_rating}</p>
              <Rating name="half-rating-read" value={parseFloat(dataAverageRatingById[0].average_rating)} precision={0.1}  readOnly size="large" />
            </div>
            <br />
            <br />
            <table className="w-full md:ml-5 lg:">
              <tbody>
                <tr>
                  <td className="font-semibold">Name</td>
                  <td>: {dataPackageById[0].name}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Package Type</td>
                  <td>: {dataPackageById[0].type_name}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Minimal Capacity</td>
                  <td>: {dataPackageById[0].min_capacity} people</td>
                </tr>
                <tr>
                  <td className="font-semibold">Contack Person</td>
                  <td>: {dataPackageById[0].contact_person}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Price</td>
                  <td>: {rupiah(dataPackageById[0].price)}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <h2 className="font-semibold">Description</h2>
            <p className="text-justify">{dataPackageById[0].description}</p>
            <br />
            <h2 className="font-semibold">Service Include</h2>
            <ul className="ml-5">
              {serviceInclude.map((item: { name: string }, index: number) => (
                <li key={index} className="list-disc">{item.name}</li>
              ))}
            </ul>
            <br />
            <h2 className="font-semibold">Service Exclude</h2>
            <ul className="ml-5">
              {serviceExclude.map((item: { name: string }, index: number) => (
                <li key={index} className="list-disc">{item.name}</li>
              ))}
            </ul>
            <div className="w-fit border-solid border-2 p-2 mt-5 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white">
              <FontAwesomeIcon className="mr-2" icon={faCirclePlay} />Play Video
            </div>
          </div>
          {dataPackageActivityById && (
            <div className="py-5 bg-white rounded-lg mb-5 px-5">
              <h1 className="text-center text-xl font-semibold">Package Activity</h1>
              {Array.from(new Set(dataPackageActivityById.map((activity: { day: number }) => activity.day)))
                .sort((a, b) => (a as number) - (b as number))// Mengurutkan hari-hari secara numerik
                .map((day, dayIndex) => (
                  <div key={dayIndex} className="mb-3">
                    <h2 className="text-lg font-semibold">Day {dayIndex+1}</h2>

                    {/* Menampilkan aktivitas untuk setiap hari */}
                    {dataPackageActivityById
                      .filter((activity: { day: number }) => activity.day === day)
                      .map((activity: { object_id: string, description: string, activity:number, activity_name:string }, index: number) => (
                        <div key={index} className="mb-1">
                          <p>{activity.activity}. {activity.activity_name}: {activity.description}</p>
                        </div>
                      ))}
                  </div>
                ))}

            </div>
          )}
          <div className="py-5 bg-white rounded-lg mb-5 px-5">
            <h1 className="text-center text-xl font-semibold">Our Gallery</h1>
            <div className="flex justify-center items-center flex-wrap">
                {dataListAllGalleryPackageById.map((photo:{url:string}, index:number) => (
                    <img
                        key={index}
                        src={`/photos/package/${photo.url}`}
                        alt={`Photo ${index + 1}`}
                        className="m-2"
                        style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                    />
                ))}
            </div>
          </div>
          <div className=" py-5 bg-white rounded-lg mb-5 px-5">
            <h1 className="text-center text-xl font-semibold">Package Review</h1>
            { dataListAllReviewPackageById.map((review:{rating:number, review:string, username_or_fullname:string}, index:number) => (
              <div key={index} className="mb-5">
                <p>@{review.username_or_fullname.slice(0, 3) + '*'.repeat(review.username_or_fullname.length - 3)}</p>
                <p>Rating : <Rating name="half-rating-read" value={review.rating} precision={0.1} readOnly size="small" /></p>
                <p>Review : {review.review}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="py-5 flex flex-col lg:w-5/12 items-center bg-white rounded-lg">
          <h1 className="text-center text-xl font-semibold">Google Maps</h1>
          <div className="pb-5 md:mx-3">
            {/* <MapPackage showLegend={showLegend} 
            // userLocation={null} dataMapforType={null} 
            // objectAround={null} isManualLocation={false} setIsManualLocation={setIsManualLocationClicked}
            // setUserLocation={setUserLocation}
            /> */}
            <MapHomeCopy />
          </div>
        </div>
      </div>
    )
  }
}