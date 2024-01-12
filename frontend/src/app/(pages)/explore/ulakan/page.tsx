'use client'

import { Eye, Goal, MapPin } from "lucide-react";
import { useState } from "react";
import MapExploreUlakan from "@/components/maps/mapExploreUlakan";
import ExploreUlakanTableSection from "./_components/listExploreUlakan";
import ObjectAroundSection from "./_components/objectAround";
import { useQuery } from "@tanstack/react-query";
import { fetchListGeomCulinary } from "../../api/fetchers/culinary";
import { fetchListGeomWorship } from "../../api/fetchers/worhsip";
import { fetchListGeomSouvenir } from "../../api/fetchers/souvenir";
import { fetchListGeomHomestay } from "../../api/fetchers/homestay";

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapType {
  culinaryPlaces: boolean;
  homestay: boolean;
  souvenirPlaces: boolean;
  worshipPlaces: boolean;
}

interface dataListGeom {
  id: string;
  name: string;
  address: string
  contact_person: string | null;
  capacity: number | null;
  status: number | null;
  lat: number;
  lng: number;
}

export default function Ulakan() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [listExploreUlakan, setListExploreUlakan] = useState(true);
  const [dataTypeMap, setDataTypeMap] = useState<dataListGeom[] | null>(null)
  const [radius, setRadius] = useState(0)
  const [isManualLocationClicked, setIsManualLocationClicked] = useState(false);

  const queryMutiple = () => {
    const resListGeomWorship = useQuery({
      queryKey: ['geomWorship'],
      queryFn: fetchListGeomWorship
    })
    const resListGeomCulinary = useQuery({
      queryKey: ['listGeomCulinary'],
      queryFn: fetchListGeomCulinary,
    })
    const resListGeomSouvenir = useQuery({
      queryKey: ['geomSouvenir'],
      queryFn: fetchListGeomSouvenir
    })
    const resListGeomHomestay = useQuery({
      queryKey: ['listGeomHomestay'],
      queryFn: fetchListGeomHomestay
    })
    return [resListGeomWorship, resListGeomCulinary, resListGeomSouvenir, resListGeomHomestay]
  }

  const [
    { isLoading: loadingListGeomWorship, data: dataListGeomWorship },
    { isLoading: loadingListGeomCulinary, data: dataListGeomCulinary },
    { isLoading: loadingListGeomSouvenir, data: dataListGeomSouvenir },
    { isLoading: loadingListGeomHomestay, data: dataListGeomHomestay }
  ] = queryMutiple()

  const [objectAroundState, setObjectAroundState] = useState<MapType>({
    culinaryPlaces: false,
    homestay: false,
    souvenirPlaces: false,
    worshipPlaces: false
  });

  const handleShowMapClick = (type: string) => {
    if (type === 'culinary') setDataTypeMap(dataListGeomCulinary)
    else if (type === 'worship') setDataTypeMap(dataListGeomWorship)
    else if (type === 'souvenir') setDataTypeMap(dataListGeomSouvenir)
    else setDataTypeMap(dataListGeomHomestay)
  };

  const handleManualLocationUpdate = () => {
    const dialogElement = document.getElementById('manualLocationDialog')as HTMLDialogElement;
    if (dialogElement) dialogElement.showModal();
  };

  const handleModalOk = () => {
    const dialogElement = document.getElementById('manualLocationDialog')as HTMLDialogElement;
    if (dialogElement) {
      setIsManualLocationClicked(true);
      dialogElement.close();
    }
  };

  const handleModalCancel = () => {
    const dialogElement = document.getElementById('manualLocationDialog')as HTMLDialogElement;
    dialogElement.close();
  }

  const handleObjectAroundStateChange = (newState: any) => {
    setObjectAroundState(newState);
  }

  const handleRadiusChange = (value: number) => {
    setRadius(value)
  }

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

  const handleSection = () => {
    setListExploreUlakan(!listExploreUlakan);
    setDataTypeMap(null)
    setRadius(0)
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row mt-3">
        <div className="w-full ml-3 h-full p-2 lg:w-2/3 bg-white rounded-lg">
          <div className="flex flex-col md:flex-row h-auto ">
            <div className=" flex items-center">
              <h1 className="text-lg font-semibold">Google Maps with Location</h1>
            </div>
            <div className="flex flex-wrap m-2 gap-5">
              <div className="p-2 bg-blue-500 rounded-lg" title="Current Location" onClick={fetchUserLocation}>
                <Goal className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Set Manual Location" onClick={handleManualLocationUpdate}>
                <MapPin className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Toggle Legend">
                <Eye className="text-slate-200" />
              </div>
            </div>
          </div>
          <div className=" pb-5">
            <MapExploreUlakan userLocation={userLocation} objectAround={objectAroundState} dataMapforType={dataTypeMap} radius={radius} isManualLocation={isManualLocationClicked} setUserLocation={setUserLocation} />
          </div>
        </div>
        {listExploreUlakan ? (
          <ExploreUlakanTableSection onSearchAroundClick={handleSection} onShowMapClick={handleShowMapClick} />
        ) : (
          <ObjectAroundSection
            onCloseClick={handleSection}
            onRadiusChange={handleRadiusChange}
            onStateChange={handleObjectAroundStateChange} />
        )}
      </div>
      {/* Modal */}
      <dialog id="manualLocationDialog" className="bg-white p-12 mt-72 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-center font-bold">Confirmation</h2>
        <p>Want to set manual location?</p>
        <div className="mt-4 flex justify-center">
          <button onClick={handleModalOk} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded mr-2">
            Yes
          </button>
          <button onClick={handleModalCancel} className="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-800 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </dialog>
    </>
  )
}