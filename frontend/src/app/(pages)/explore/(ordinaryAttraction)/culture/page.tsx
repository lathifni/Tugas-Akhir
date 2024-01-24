'use client'

import { fetchGeomEstuary, fetchListGeomCulture, fetchListGeomWater } from "@/app/(pages)/api/fetchers/attraction";
import MapAttraction from "@/components/maps/mapAttraction"
import MapOrdinaryAttraction from "@/components/maps/mapOrdinaryAttraction";
import { faImage, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Goal, MapPin, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface UserLocation {
  lat: number;
  lng: number;
}

export default function Culture() {
  const [selectedWaterId, setSelectedWaterId] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isManualLocationClicked, setIsManualLocationClicked] = useState(false);
  const [video_url, setVideo_url] = useState<string | null>(null)

  const { data: data, isLoading: loadingListaGeomCulture } = useQuery({
    queryKey: ['listGeomCulture'],
    queryFn: fetchListGeomCulture
  })

  const showLegendHandler = () => {
    setShowLegend((prev) => !prev); // Toggle nilai showLegend
  };

  const handleShowInfoWindow = (id: string) => {
    setSelectedWaterId(id);
  };

  const fetchUserLocation = async (): Promise<void> => {
    try {
      const position = await getCurrentPosition();
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      console.log(userLocation);

    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-1 mb-3 lg:p-0 lg:mb-0 lg:mr-3 sm:py-3 lg:w-2/3 bg-white rounded-lg">
          <div className="flex flex-col ml-10 sm:m-1 md:flex-row h-auto select-none">
            <div className=" flex items-center">
              <h1 className="text-lg font-semibold md:ml-3">Google Maps with Location</h1>
            </div>
            <div className="flex flex-wrap m-2 gap-5">
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Current Location" onClick={fetchUserLocation}>
                <Goal className="text-slate-200" />
              </div>
              {/* <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Set Manual Location" onClick={handleManualLocationUpdate}>
                <MapPin className="text-slate-200" />
              </div> */}
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Toggle Legend" onClick={showLegendHandler}>
                <Eye className="text-slate-200" />
              </div>
            </div>
          </div>
          <div className="pb-5 md:mx-3">
            <MapOrdinaryAttraction isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked}
            setUserLocation={setUserLocation} showLegend={showLegend}
            userLocation={userLocation} selectedId={selectedWaterId} />
          </div>
        </div>
        <div className="py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
          <div className="text-2xl text-center justify-center font-bold">
            <h1 className="">List Homestay</h1>
          </div>
          <div className="w-full px-5">
            <table className="w-full mt-5 m-5">
              <thead>
                <tr className="border-b border-gray-300 font-semibold text-xl">
                  <td className="py-3">#</td>
                  <td className="py-3">Name</td>
                  <td className="py-3">Action</td>
                </tr>
              </thead>
              <tbody>
                {data?.map((homestay: { id: string, name: string }, index: number) => (
                  <tr key={homestay.id} className="border-b border-gray-300 text-lg">
                    <td className="py-4">{index + 1}</td>
                    <td className="py-4">{homestay.name}</td>
                    <td className="py-4">
                      <button className="bg-blue-500 rounded-lg py-1 px-3 hover:bg-blue-600" onClick={() => handleShowInfoWindow(homestay.id)}>
                        <FontAwesomeIcon icon={faInfo} style={{ color: 'white' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}