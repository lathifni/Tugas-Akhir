'use client'

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react"
import { fetchListReservationByUserId } from "../../api/fetchers/reservation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Reservation() {
  const { data: session, status, update } = useSession()

  const { isError, isSuccess, isLoading, data: dataReservationByUserId, error } = useQuery({
    queryKey: ['listReservationByUserId'],
    queryFn: () => fetchListReservationByUserId((session!.user.user_id).toString()),
    enabled: !!session
  })

  if (isLoading) return <p className="text-center">Loading ...</p>
  if (dataReservationByUserId !== undefined && dataReservationByUserId.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-center text-xl">Oops, no reservations found for your account.</p>
        <Link href={"/explore/package"} passHref>
          <p className="hover:text-blue-500 text-lg">Make a new reservation</p>
        </Link>
      </div>
    );
  }
  if (dataReservationByUserId !== undefined) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
          <h1 className='text-xl font-bold text-center mb-5'>List Reservation</h1>
          <table className="w3-table-all w3-hoverable w3-card-2">
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
                  <td className="py-3">{new Date(items.request_date).toDateString()}</td>
                  <td className="py-3">{new Date(items.check_in).toDateString()}</td>
                  <td className="py-3">Status</td>
                  <td className="py-3">
                    <Link href={`/explore/reservation/${items.id}`} >
                      <FontAwesomeIcon icon={faCircleInfo} className="p-2 text-blue-500 border-solid border-2 m-1 border-blue-500 rounded-lg hover:text-white hover:bg-blue-500" />
                    </Link>
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