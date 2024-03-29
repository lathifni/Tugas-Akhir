'use client'

import { fetchAllService } from "@/app/(pages)/api/fetchers/package";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Columns } from "./_components/column";
import TableServiceAdmin from "./_components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddDialogiSerice from "./_components/addDiaolog";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import DeleteDialogService from "./_components/deleteDialog";

export default function ServiceAdmin() {
  const [notification, setNotification] = useState<{ message: string, type: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [rowDelete, setRowDelete] = useState<any>({})
  const { data, error, refetch } = useQuery({
    queryKey: ['dataAllService'],
    queryFn: fetchAllService
  })

  const columns = React.useMemo(
    () => Columns(), []
  );

  const handleRowDelete = (rowData: any) => {
    setRowDelete(rowData)
    setIsOpenDelete(true)
  };

  useEffect(() => {
    const fetchData = async () => {
      if (notification !== null) {
        if (notification.type === 'error') toast.warn(notification.message);
        else {
          toast.success(notification.message);
          await refetch();
        }
      }
    };

    fetchData();
  }, [notification])

  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-center">Manage Service</h1>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8" onClick={() => setIsOpen(!isOpen)}>
              <FontAwesomeIcon icon={faPlus} /> New Service
            </button>
          </div>
          <TableServiceAdmin columns={columns} data={data} isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} onRowDelete={handleRowDelete} />
          <AddDialogiSerice isOpen={isOpen} setIsOpen={setIsOpen} setNotification={setNotification} />
          <DeleteDialogService isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} rowDelete={rowDelete} setNotification={setNotification} />
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