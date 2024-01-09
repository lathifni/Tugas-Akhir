'use client'

import { Eye, Goal, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MapEvent from "@/components/maps/mapEvent";
import { fetchListEvent } from "../../api/fetchers/event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

export default function Event() {
  const [selectedEventId, setSelectedEventId] = useState('');
  const { isError, isSuccess, isLoading, data, error } = useQuery({
    queryKey: ['listEvent'],
    queryFn: fetchListEvent,
  })
  const handleShowInfoWindow = (eventId: string) => {
    setSelectedEventId(eventId);
    console.log('idnya', selectedEventId);
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
              <div className="p-2 bg-blue-500 rounded-lg" title="Current Location">
                <Goal className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Set Manual Location">
                <MapPin className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-500 rounded-lg" title="Toggle Legend">
                <Eye className="text-slate-200" />
              </div>
            </div>
          </div>
          <div className=" pb-5">
            <MapEvent selectedEventId={selectedEventId} /> 
          </div>
        </div>
        <div className="mx-3 py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
          <div className="text-2xl text-center justify-center">
            <h1 className="">List Event</h1>
          </div>
          <div className="w-full px-5">
            <table className="w-full mt-5 m-5">
              <thead>
                <tr>
                  <td>#</td>
                  <td>Name</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {data?.map((event: { id:string, name: string }, index:number) => (
                  <tr key={event.id}>
                    <td>{index + 1}</td>
                    <td>{event.name}</td>
                    <td>
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
    </>
  )
}