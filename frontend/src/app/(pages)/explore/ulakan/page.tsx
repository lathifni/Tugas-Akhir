'use client'

import { Eye, Goal, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [objectId, setObjectId] = useState<number | null>(null);
  const [listExploreUlakan, setListExploreUlakan] = useState(true);
  const [typeMap, setTypeMap] = useState('')
  const [dataTypeMap, setDataTypeMap] = useState<dataListGeom[] | null>(null)

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

  const [objectAroundState, setObjectAroundState] = useState<any>({
    culinaryPlaces: false,
    Homestay: false,
    souvenirPlaces: false,
    worshipPlaces: false
  });

  const handleShowMapClick = (type: string) => {
    setTypeMap(type)
    if (type === 'culinary') setDataTypeMap(dataListGeomCulinary)
    else if (type === 'worship') setDataTypeMap(dataListGeomWorship)
    else if (type === 'souvenir') setDataTypeMap(dataListGeomSouvenir)
    else setDataTypeMap(dataListGeomHomestay)
  };

  const handleObjectAroundStateChange = (newState: any) => {
    console.log("New ObjectAround state:", newState);
    setObjectAroundState(newState);
  }

  const handleRadiusChange = (value: number) => {
    console.log("New radius value:", value);
  }

  const handleGoToObjectClick = () => {
    setObjectId(1);
    console.log('test click go to');
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

  const handleSection = () => {
    setListExploreUlakan(!listExploreUlakan);
    console.log('testt');
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
              <div className="p-2 bg-blue-500 rounded-lg" title="Set Manual Location">
                <MapPin className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Toggle Legend">
                <Eye className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg text-white" title="Toggle Legend" onClick={handleGoToObjectClick}>go to object</div>
            </div>
          </div>
          <div className=" pb-5">
            <MapExploreUlakan userLocation={userLocation} goToObjectId={objectId} showMapForType={typeMap} dataMapforType={dataTypeMap} />
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
    </>
  )
}