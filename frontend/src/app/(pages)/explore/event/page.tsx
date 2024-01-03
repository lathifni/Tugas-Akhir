'use client'

import Map from "@/components/maps/map";
import { Eye, Goal, MapPin } from "lucide-react";
import { fetchGalleriesGtp } from "../../api/fetchers/galleries";
import { useQuery } from "@tanstack/react-query";
import { fetchInfoGtp } from "../../api/fetchers/gtp";
import { Key, useEffect, useState } from "react";
import MapEvent from "@/components/maps/mapEvent";

export default function Event() {
  //   const { isError, isSuccess, isLoading, data, error } = useQuery({
  //     queryKey: ['galleriesGtp'],
  //     queryFn: fetchGalleriesGtp,
  //  })

  const queryMutiple = () => {
    const resGalleries = useQuery({
      queryKey: ['galleriesGtp'],
      queryFn: fetchGalleriesGtp,
    })
    const resInfo = useQuery({
      queryKey: ['infoGtp'],
      queryFn: fetchInfoGtp
    })
    return [resGalleries, resInfo]
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const [
    { isLoading: loadingGalleries, data: dataGalleries },
    { isLoading: loadingInfo, data: dataInfo }
  ] = queryMutiple()

  return (
    <>
      <div className="flex flex-col lg:flex-row mt-3">
        <div className="w-full ml-3 h-full p-2 lg:w-2/3 bg-white rounded-lg">
          <div className="flex flex-col md:flex-row h-auto ">
            <div className=" flex items-center">
              <h1 className="text-lg font-semibold">Google Maps with Location</h1>
            </div>
            <div className="flex flex-wrap m-2 gap-5">
              <div className="p-2 bg-blue-500 rounded-lg" title="Current Location">
                <Goal className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Set Manual Location">
                <MapPin className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Toggle Legend">
                <Eye className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg text-white" title="Toggle Legend">go to object</div>
            </div>
          </div>
          <div className=" pb-5">
            <MapEvent />
          </div>
        </div>
        <div className="mx-3 py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
          <div className="text-2xl text-center justify-center">
            <h1 className="">List Event</h1>
          </div>
          <div className="w-full px-5">
            <table>
              {/* <thead>
                <tr>
                  <td>#</td>
                  <td>Name</td>
                  <td>Action</td>
                </tr>
                <tbody>
                  <tr>
                  <td>1</td>
                  <td>test namanya</td>
                  <td>infonya</td>
                  </tr>
                </tbody>
              </thead> */}
            </table>
          </div>
        </div>
      </div>
    </>
  )
}