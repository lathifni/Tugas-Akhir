'use client'

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react"
import { fetchListReservationByUserId } from "../../api/fetchers/reservation";
import Link from "next/link";
import React, { useState } from "react";
import { Columns } from "./_components/column";
import TableReservationExplore from "./_components/table";
import DeleteDialogReservation from "./_components/deleteDialog";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function ReservationPage() {
  const { data: session, status, update } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [rowDelete, setRowDelete] = useState<any>({})
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [notification, setNotification] = useState<{ message: string, type: string } | null>(null);

  const { isError, isSuccess, isLoading, data: dataReservationByUserId, error, refetch } = useQuery({
    queryKey: ['listReservationByUserId'],
    queryFn: () => fetchListReservationByUserId((session!.user.user_id).toString()),
    enabled: !!session
  })
  console.log(dataReservationByUserId);

  const handleDelete = (data: any) => {
    // if (window.confirm("Are you sure you want to delete this reservation?")) {
    //   // mutation.mutate(id);
    // }
    setRowDelete(data)
    setIsOpenDelete(true);
    if (notification?.type == 'error') return toast.error(notification.message)
    return toast.success(notification?.message)
  };

  const columns = React.useMemo(
    () => Columns(), []
  );

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
      <div className="flex flex-col m-1 sm:m-2 lg:m-4">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className='text-xl font-bold text-center mb-4'>List Reservation</h1>
          <TableReservationExplore columns={columns} data={dataReservationByUserId} 
            onDelete={handleDelete}// Oper handler ke komponen tabel 
          />
          <DeleteDialogReservation 
            isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} 
            rowDelete={rowDelete} setNotification={setNotification} onSuccessfulDelete={refetch}
          />
        </div>
        <ToastContainer
          position="top-center"
          autoClose={4500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    )
  }
}