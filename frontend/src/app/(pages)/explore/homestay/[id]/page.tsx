'use client'

import { fetchCulinaryById } from "@/app/(pages)/api/fetchers/culinary";
import { fetchGalleriesCulinary } from "@/app/(pages)/api/fetchers/galleries";
import { fetchHomestayById } from "@/app/(pages)/api/fetchers/homestay";
import MapDetail from "@/components/maps/mapDetail";
import { useQuery } from "@tanstack/react-query";
import MoonLoader from "react-spinners/MoonLoader";

export default function HomestayId({ params }: any) {
  const { isError, isSuccess, isLoading, data } = useQuery({
    queryKey: ['detailCulinary'],
    queryFn: () => fetchHomestayById(params.id)
  })
  const { isLoading:isLoadingGallery, data:dataGallery } = useQuery({
    queryKey: ['culinaryGallery'],
    queryFn: () => fetchGalleriesCulinary(params.id)
  })

  return (
    <div className="flex flex-col xl:flex-row m-1 sm:m-2 lg:m-4">
      { (data && dataGallery) ? (
        <>
          <div className="w-full h-full px-1 xl:p-0 xl:mb-0 xl:mr-3 xl:w-7/12 ">
            <div className="relative py-5 bg-white rounded-lg mb-4 px-4 shadow-lg">
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
                        <td>: {data.name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Address</td>
                        <td>: {data.address}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Contact Person</td>
                        <td>: {data.contact_person}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h2 className="text-2xl font-semibold">Description</h2>
                  <p className="text-justify">{data.description}</p>
                </>
              ))}
            </div>
            <div className="py-5 bg-white rounded-lg mb-4 px-4 shadow-lg">
              <h1 className="text-2xl font-semibold text-center mb-4">Our Gallery</h1>
              <div className="flex justify-center items-center flex-wrap">
                {/* {dataGallery.map((photo: { url: string }, index: number) => (
                  <img
                    key={index}
                    src={`/photos/package/${photo.url}`}
                    alt={`Photo ${index + 1}`}
                    className="m-2"
                    style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                  />
                ))} */}
              </div>
            </div>
          </div>
          <div className="w-full h-full px-2 py-4 xl:w-5/12 items-center bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-center mb-4">Google Maps</h1>
            <MapDetail geomObject={data.geom} lat={data.lat} 
            lng={data.lng} name={data.name} icon={data.icon}/>
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