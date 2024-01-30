'use client'

import { fetchGeomEstuary } from "@/app/(pages)/api/fetchers/attraction";
import MapAttraction from "@/components/maps/mapAttraction"
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Goal, MapPin, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import FaciltyTrack from "../_components/facilityTrack";

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapType {
  culinaryPlaces: boolean;
  gazebo: boolean;
  souvenirPlaces: boolean;
  worshipPlaces: boolean;
}

export default function Estuary() {
  const [selectedEstuaryId, setSelectedEstuaryId] = useState('');
  const [attractionDescription, setAttractionDescription] = useState(true)
  const [showLegend, setShowLegend] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isManualLocationClicked, setIsManualLocationClicked] = useState(false);
  const [video_url, setVideo_url] = useState<string | null>(null)

  const { data: dataGeomEstuary, isLoading: loadingListaGeomHomestay } = useQuery({
    queryKey: ['geomEstuary'],
    queryFn: fetchGeomEstuary
  })

  const [objectAroundState, setObjectAroundState] = useState<MapType>({
    culinaryPlaces: false,
    gazebo: false,
    souvenirPlaces: false,
    worshipPlaces: false
  });

  const showLegendHandler = () => {
    setShowLegend((prev) => !prev); // Toggle nilai showLegend
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
    setAttractionDescription(!attractionDescription);
    // setDataTypeMap(null)
  };

  const handleFacilityAlongStateChange = (newState: any) => {
    setObjectAroundState(newState);
  }

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
            {dataGeomEstuary && (
              <MapAttraction isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked}
                setUserLocation={setUserLocation} showLegend={showLegend}
                userLocation={userLocation} eventId={dataGeomEstuary[0].id} />
            )}
          </div>
        </div>
        {attractionDescription ? (
          dataGeomEstuary && (
            <div className="py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
              <div className="text-2xl text-center justify-center font-bold">
                <h1 className="">{dataGeomEstuary[0].name}</h1>
              </div>
              <div className="w-full px-5">
                <div>
                  <p dangerouslySetInnerHTML={{ __html: dataGeomEstuary[0].description.replace(/(?:\r\n|\r|\n)/g, '<br>') }} />
                  <br />
                  <p>Price: {dataGeomEstuary[0].price}</p>
                  <p>Payment category: Group</p>
                  <br />
                </div>
              </div>
              <div className="w-full  p-1 text-center text-blue-500 ">
                <button className="w-[95%] py-1 mb-3 border-solid border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />Open Gallery
                </button>
                <button className="w-[95%] py-1 mb-3 border-solid border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />Play Video
                </button>
                <button onClick={handleSection}
                  className="w-[95%] py-1 mb-3 border-solid border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />More Info
                </button>
              </div>
            </div>
          )
        ) : (
          <FaciltyTrack onCloseClick={handleSection} onStateChange={handleFacilityAlongStateChange} />
        )}
      </div>
    </>
  )
}