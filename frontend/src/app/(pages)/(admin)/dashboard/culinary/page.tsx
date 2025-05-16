'use client'

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Columns } from "./_components/column";
import TableCulinaryAdmin from "./_components/table";
import { fetchAllCulinary } from "@/app/(pages)/api/fetchers/culinary";
import { ToastContainer, Bounce } from "react-toastify";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import DeleteDialogFacility from "../facility/_components/deleteDialog";

export default function CulinaryAdmin () {
  const [notification, setNotification] = useState<{ message: string, type: string } | null>(null);
  const [rowDelete, setRowDelete] = useState<any>({})
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, error, refetch } = useQuery({
    queryKey: ['dataAllCulinary'],
    queryFn: fetchAllCulinary
  })

  const handleRowDelete = async (rowData: any) => {
    setRowDelete(rowData)
    setIsOpenDelete(true);
  };

  const columns = React.useMemo(
    () => Columns(), []
  );
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
        <h1 className="text-2xl font-semibold text-center">Manage Culinary</h1>
          <div className="flex justify-end">
            <Link href={'/dashboard/culinary/add'}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8">
                <FontAwesomeIcon icon={faPlus} /> New Culinary
              </button>
            </Link>
          </div>
          <TableCulinaryAdmin columns={columns} data={data} isOpen={false} setIsOpen={setIsOpenDelete} onRowDelete={handleRowDelete} />
          <DeleteDialogFacility isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} rowDelete={rowDelete} setNotification={setNotification} onSuccessfulDelete={refetch}/>
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