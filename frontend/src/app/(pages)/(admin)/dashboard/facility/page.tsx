'use client'

import { fetchAllFacility } from "@/app/(pages)/api/fetchers/facility"
import { Columns } from "./_components/column";
import { useQuery } from "@tanstack/react-query"
import TableFacilityAdmin from "./_components/table"
import React, { useState } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import DeleteDialogFacility from "./_components/deleteDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddDialogFacility from "./_components/addDialog";
import Link from "next/link";

export default function FacilityAdmin() {
  const [notification, setNotification] = useState<{ message: string, type: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false)
  const [rowDelete, setRowDelete] = useState<any>({})
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, error } = useQuery({
    queryKey: ['dataAllFacility'],
    queryFn: fetchAllFacility
  })

  const columns = React.useMemo(
    () => Columns(), []
  );

  const handleRowDelete = (rowData: any) => {
    setRowDelete(rowData)
    setIsOpenDelete(true)
  };

  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-center">Manage Facility</h1>
          <div className="flex justify-end">
            <Link href={'/dashboard/facility/add'}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8">
                <FontAwesomeIcon icon={faPlus} /> New Facility
              </button>
            </Link>
          </div>
          <TableFacilityAdmin columns={columns} data={data} isOpen={false} setIsOpen={setIsOpenDelete} onRowDelete={handleRowDelete} />
          <DeleteDialogFacility isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} rowDelete={rowDelete} setNotification={setNotification} />
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