'use client'

import { Eye, Goal, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MapEvent from "@/components/maps/mapEvent";
import { fetchListEvent } from "../../api/fetchers/event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

interface UserLocation {
  lat: number;
  lng: number;
}

export default function Event() {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isManualLocationClicked, setIsManualLocationClicked] = useState(false);
  const [distances, setDistances] = useState<number[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);

  const { isError, isSuccess, isLoading, data, error } = useQuery({
    queryKey: ['listEvent'],
    queryFn: fetchListEvent,
  })

  const handleShowInfoWindow = (eventId: string) => {
    setSelectedEventId(eventId);
  };

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

  const handleManualLocationUpdate = () => {
    const dialogElement = document.getElementById('manualLocationDialog') as HTMLDialogElement;
    if (dialogElement) dialogElement.showModal();
  };

  const handleModalOk = () => {
    const dialogElement = document.getElementById('manualLocationDialog') as HTMLDialogElement;
    if (dialogElement) {
      setIsManualLocationClicked(true);
      dialogElement.close();
    }
  };

  const handleModalCancel = () => {
    const dialogElement = document.getElementById('manualLocationDialog') as HTMLDialogElement;
    dialogElement.close();
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-3 mb-3 lg:p-0 lg:mb-0 lg:mr-3 lg:w-2/3 bg-white rounded-lg">
          <div className="flex flex-col ml-10 sm:m-1 md:flex-row h-auto select-none">
            <div className=" flex items-center">
              <h1 className="text-lg font-semibold md:ml-3">Google Maps with Location</h1>
            </div>
            <div className="flex flex-wrap m-2 gap-5">
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Current Location" onClick={fetchUserLocation}>
                <Goal className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Set Manual Location" onClick={handleManualLocationUpdate}>
                <MapPin className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" role="button" title="Toggle Legend" onClick={showLegendHandler}>
                <Eye className="text-slate-200" />
              </div>
            </div>
          </div>
          <div className="pb-5 md:mx-3">
            <MapEvent selectedEventId={selectedEventId} userLocation={userLocation}
            isManualLocation={isManualLocationClicked} setIsManualLocation={setIsManualLocationClicked} 
            setUserLocation={setUserLocation} showLegend={showLegend}/> 
          </div>
        </div>
        <div className="py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
          <div className="text-2xl text-center justify-center font-bold">
            <h1 className="">List Event</h1>
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
                {data?.map((event: { id:string, name: string }, index:number) => (
                  <tr key={event.id} className="border-b border-gray-300 text-lg">
                    <td className="py-4">{index + 1}</td>
                    <td className="py-4">{event.name}</td>
                    <td className="py-4">
                      <button className="bg-blue-500 rounded-lg py-1 px-3 hover:bg-blue-600" onClick={() => handleShowInfoWindow(event.id)}>
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
      {distances !== null && distances.length !== 0 && (
        <div className="flex flex-col lg:flex-row mx-3 mt-3 mb-10">
          <div className="w-full h-full p-2 bg-white rounded-lg">
            <h1 className="text-center font-semibold text-lg">Directions</h1>
            <table className="w-full">
              <thead className="text-center font-medium">
                <tr>
                  <th>Distance&nbsp;(m)</th>
                  <th>Steps</th>
                </tr>
              </thead>
              <tbody>
                {distances.map((distace, index) => (
                  <tr key={index}>
                    <td className="text-center">{distace}</td>
                    <td dangerouslySetInnerHTML={{ __html: instructions[index] }} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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