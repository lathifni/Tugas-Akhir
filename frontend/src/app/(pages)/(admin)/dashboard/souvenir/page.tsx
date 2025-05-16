'use client'

import { fetchAllSouvenir } from "@/app/(pages)/api/fetchers/souvenir";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Columns } from "./_components/column";
import TableSouvenirAdmin from "./_components/table";
import { ToastContainer, Bounce, toast } from "react-toastify";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import DeleteDialogSouvenir from "./_components/deleteDialog";

export default function Souvenir () {
  const [notification, setNotification] = useState<{ message: string, type: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false)
  const [rowDelete, setRowDelete] = useState<any>({})
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, error, refetch} = useQuery({
    queryKey: ['dataAllSouvenir'],
    queryFn: fetchAllSouvenir
  })

  const columns = React.useMemo(
    () => Columns(), []
  );

  const handleRowDelete = async (rowData: any) => {
    setRowDelete(rowData)
    setIsOpenDelete(true);
    if (notification?.type == 'error') return toast.error(notification.message)
    return toast.success(notification?.message)
  };
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Souvenir</h1>
          <div className="flex justify-end">
            <Link href={'/dashboard/souvenir/add'}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8">
                <FontAwesomeIcon icon={faPlus} /> New Souvenir
              </button>
            </Link>
          </div>
          <TableSouvenirAdmin columns={columns} data={data} 
            isOpen={isOpen} setIsOpen={setIsOpen} onRowDelete={handleRowDelete} />
          <DeleteDialogSouvenir isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} 
            rowDelete={rowDelete} setNotification={setNotification} onSuccessfulDelete={refetch}/>
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