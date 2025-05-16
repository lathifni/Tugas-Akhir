'use client'

import { fetchGalleriesHomestay } from "@/app/(pages)/api/fetchers/galleries";
import { fetchHomestayById } from "@/app/(pages)/api/fetchers/homestay";
import Galleries from "@/components/galleries";
import MapDetail from "@/components/maps/mapDetail";
import { faComment, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Rating from "@mui/material/Rating";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";

export default function HomestayId({ params }: any) {
  const { isError, isSuccess, isLoading, data } = useQuery({
    queryKey: ['homestayById'],
    queryFn: () => fetchHomestayById(params.id)
    // queryFn: () => fetchHomestayEditById(params.id)
  })
  const { isLoading:isLoadingGallery, data:dataGallery } = useQuery({
    queryKey: ['homestayGallery'],
    queryFn: () => fetchGalleriesHomestay(params.id)
  })
  console.log(data);

  const [openComments, setOpenComments] = useState<string | null>(null);
  const [openGalleryUnit, setOpenGalleryUnit] = useState<string | null>(null)

  const toggleComments = (unitNumber: string) => {
    setOpenComments((prev) => (prev === unitNumber ? null : unitNumber));
  };
  
  const toggleGalleryUnit = (unitNumber: string) => {
    setOpenGalleryUnit((prev) => (prev === unitNumber ? null : unitNumber))
  }
  
  return (
    <div className="flex flex-col xl:flex-row m-1 sm:m-2 lg:m-4">
      { (data && dataGallery) ? (
        <>
          <div className="w-full h-full px-1 xl:p-0 xl:mb-0 xl:mr-3 xl:w-7/12 ">
            <div className="relative py-2 bg-white rounded-lg mb-4 px-4 shadow-lg">
              <h1 className="text-2xl font-bold text-center mb-5">Homestay Information</h1>
              {isLoading ? (
                <p>Loading</p>
              ) : (data == undefined ? (
                <p>Data gaada</p>
              ) : (
                <>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-semibold">Name</td>
                        <td>: {data.homestay.name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Address</td>
                        <td>: {data.homestay.address}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Contact Person</td>
                        <td>: {data.homestay.contact_person}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h2 className="text-2xl font-semibold">Description</h2>
                  <p className="text-justify">{data.homestay.description}</p>
                  <h2 className="text-2xl font-semibold">Description</h2>
                  <ul className="list-disc pl-5">
                    {data.facility.map((facility: { name: string; description: string; id: string }) => (
                      <li key={facility.id}>
                        {facility.name} ({facility.description})
                      </li>
                    ))}
                  </ul>
                </>
              ))}
            </div>
            <div className="bg-white rounded-lg mt-4">
              <h1 className="py-4 text-3xl text-center font-bold">Homestay Unit</h1>
              <div className="flex flex-wrap gap-2">
                {data.units.map((unit: { unit_name:string, unit_number: string, price:number, avg_rating: any, capacity:number, 
                  facilities: { name: string; description: string; }[],
                  review: { rating: number; review: string; username_or_fullname: string }[],
                  gallery: { id:string; url:string }[] }) => (
                <div key={unit.unit_number} className="bg-slate-50 rounded-lg flex-1 min-w-[250px] m-1 px-2 shadow-sm">
                  <h4 className="font-bold text-center">Room {unit.unit_name} {unit.unit_number}</h4>
                  <Rating name="half-rating-read" value={parseFloat(unit.avg_rating)} precision={0.1} readOnly size="large" />
                  <p>Price: Rp{unit.price.toLocaleString()}</p>
                  <p>Capacity: {unit.capacity} guest</p>
                  <br />
                  <p>{unit.facilities[0].description}</p> 
                  <br />
                  <p>Facility : </p>
                  <ul className="list-disc pl-5">
                    {unit.facilities.map((facility, index) => (
                      <li key={index}>
                        {/* <p>{facility.description}</p> */}
                        <strong>{facility.name}</strong> 
                      </li>
                    ))}
                  </ul>
                  <div className="my-2 flex justify-center items-center">
                    <div 
                      className='mx-2 border-2 border-blue-500 p-2 rounded-lg text-blue-500 hover:text-white hover:bg-blue-500 '
                      onClick={() => toggleGalleryUnit(unit.unit_number)}
                    >
                      <FontAwesomeIcon icon={faImage} style={{ fontSize: '1.3em' }}/>
                    </div>
                    <div 
                      className='mx-2 border-2 border-blue-500 p-2 rounded-lg text-blue-500 hover:text-white hover:bg-blue-500 '
                      onClick={() => toggleComments(unit.unit_number)}
                    >
                      <FontAwesomeIcon icon={faComment} style={{ fontSize: '1.3em' }}/>
                    </div>
                  </div>
                  {openGalleryUnit === unit.unit_number && (
                    <div className="mt-2 p-2 border-t border-gray-300">
                      <h5 className="font-bold">Galleries</h5>
                      <div className="flex justify-center items-center flex-wrap">
                        <Galleries type={'homestay'} urls={unit.gallery} />
                      </div>
                    </div>
                  )}
                    {openComments === unit.unit_number && (
                        <div className="mt-2 p-2 border-t border-gray-300">
                          <h5 className="font-bold">Comments</h5>
                          {unit.review.map((rev, idx) => (
                            <div key={idx}>
                              <p>
                                <strong>@{rev.username_or_fullname ?? 'Anonymous'}</strong>
                                <br />
                                {rev.review ?? 'No review text'}
                              </p>
                              <Rating name="half-rating-read" value={parseFloat(rev.rating.toString())} precision={0.1} readOnly size="large" />
                            </div>
                          ))}
                        </div>
                      )}
                </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full h-full px-1 py-4 xl:px-2 xl:w-5/12 items-center bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-center mb-4">Google Maps</h1>
            <MapDetail geomObject={data.homestay.geom} lat={data.homestay.lat} 
            lng={data.homestay.lng} name={data.homestay.name} icon={data.icon}/>
            <div className="py-2 bg-white rounded-lg mb-4 px-4 shadow-lg mt-4">
              <h1 className="text-2xl font-semibold text-center">Our Gallery</h1>
              <div className="flex justify-center items-center flex-wrap">
                <Galleries type={'homestay'} urls={dataGallery} />
              </div>
            </div>
          </div>
          
        </>
      ) : (
        <div className="w-full h-full px-2 py-4 items-center bg-white rounded-lg shadow-lg">
         <MoonLoader color="#36d7b7" />
        </div>
      )}
    </div>
  )
}