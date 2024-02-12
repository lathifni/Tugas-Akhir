'use client'

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react"
import { fetchListReservationByUserId } from "../../api/fetchers/reservation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faInfo } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Reservation() {
  const { data: session, status, update } = useSession()

  const { isError, isSuccess, isLoading, data: dataReservationByUserId, error } = useQuery({
    queryKey: ['listReservationByUserId'],
    queryFn: () => fetchListReservationByUserId((session!.user.user_id).toString()),
    enabled: !!session
  })
  console.log(dataReservationByUserId);


  if (isLoading) return <p className="text-center">Loading ...</p>
  if (dataReservationByUserId !== undefined && dataReservationByUserId.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-center text-xl">Oops, no reservations found for your account.</p>
        <Link href={"/explore/package"}>
          <p className="hover:text-blue-500 text-lg">Make a new reservation</p>
        </Link>
      </div>
    );
  }
  if (dataReservationByUserId !== undefined) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className='text-xl font-bold text-center mb-5'>List Reservation</h1>
          <table className="w-full">
            <thead >
              <tr className="border-b border-gray-300 font-semibold text-lg">
                <td className="py-3">#</td>
                <td className="py-3">Package Name</td>
                <td className="py-3">Request Date</td>
                <td className="py-3">Check In</td>
                <td className="py-3">Status</td>
                <td className="py-3">Actions</td>
              </tr>
            </thead>
            <tbody>
              {dataReservationByUserId?.map((items: { id: string, name: string, request_date: string, check_in: string }, index: number) => (
                <tr key={items.id}>
                  <td className="py-3">{index}</td>
                  <td className="py-3">{items.name}</td>
                  <td className="py-3">{new Date(items.request_date).toLocaleString()}</td>
                  <td className="py-3">{new Date(items.check_in).toLocaleString()}</td>
                  <td className="py-3">Status</td>
                  <td className="py-3">
                    <Link href={`/explore/detailreservation/${items.id}`} >
                      <FontAwesomeIcon icon={faCircleInfo} className="p-2 text-blue-500 border-solid border-2 m-1 border-blue-500 rounded-lg hover:text-white hover:bg-blue-500" />
                    </Link>
                    {/* <a href={`/explore/detailreservation/${items.id}`}>
                    </a> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}