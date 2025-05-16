'use client'

import { fetchAttractionById } from "@/app/(pages)/api/fetchers/attraction";
import { fetchGalleriesAttraction } from "@/app/(pages)/api/fetchers/galleries";
import Galleries from "@/components/galleries";
import MapDetail from "@/components/maps/mapDetail";
import { useQuery } from "@tanstack/react-query";
import MoonLoader from "react-spinners/MoonLoader";

export default function AttractionId({ params }: any) {
  const { isError, isSuccess, isLoading, data } = useQuery({
    queryKey: ['detailCulinary'],
    queryFn: () => fetchAttractionById(params.id)
  })
  const { isLoading:isLoadingGallery, data:dataGallery } = useQuery({
      queryKey: ['attractionGallery'],
      queryFn: () => fetchGalleriesAttraction(params.id)
    })
    console.log(data);
  // console.log(dataGallery);
  return (
    <div className="flex flex-col xl:flex-row m-1 sm:m-2 lg:m-4">
      { (data && dataGallery) ? (
        <>
          <div className="w-full h-full px-1 xl:p-0 xl:mb-0 xl:mr-3 xl:w-7/12 ">
            <div className="relative py-2 bg-white rounded-lg mb-4 px-4 shadow-lg">
              <h1 className="text-2xl font-bold text-center mb-5">Culinary Place Information</h1>
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
                        <td className="font-semibold">Type</td>
                        <td>: {data.type}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Price</td>
                        <td>: Rp{data.price}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h2 className="text-2xl font-semibold">Description</h2>
                  {/* <p className="text-justify" >{data.description}</p> */}
                  <div
                    className="text-justify space-y-4"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                </>
              ))}
            </div>
            <div className="py-2 bg-white rounded-lg mb-4 px-4 shadow-lg">
              <h1 className="text-2xl font-semibold text-center">Our Gallery</h1>
              <div className="flex justify-center items-center flex-wrap">
                <Galleries type={'attraction'} urls={dataGallery} />
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