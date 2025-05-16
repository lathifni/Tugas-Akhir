'use client'

import { fetchAllPackage } from "@/app/(pages)/api/fetchers/package";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Columns } from "./_components/column";
import TablePackageAdmin from "./_components/table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DeleteDialogPackage from "./_components/deleteDialog";

export default function PackageAdminPage() {
  const [notification, setNotification] = useState<{ message: string, type: string } | null>(null);
  const [rowDelete, setRowDelete] = useState<any>({})
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const router = useRouter();
  const { data, error, refetch } = useQuery({
    queryKey: ['dataAllPackage'],
    queryFn: fetchAllPackage
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
      <>
        <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
          <div className="w-full h-full p-4 mb-2 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-center">Manage Package</h1>
            <Link href={"package/new"}>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8">
                  <FontAwesomeIcon icon={faPlus} /> New Package
              </button>
            </Link>
            <TablePackageAdmin columns={columns} data={data} isOpen={false} setIsOpen={setIsOpenDelete} onRowDelete={handleRowDelete}/>
            <DeleteDialogPackage isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} rowDelete={rowDelete} setNotification={setNotification} onSuccessfulDelete={refetch}/>
          </div>
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
      </>
    )
  }
}