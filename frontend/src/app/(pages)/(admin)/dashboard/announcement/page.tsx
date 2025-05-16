'use client'

import { fetchListAllAnnouncement } from "@/app/(pages)/api/fetchers/gtp"
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query"
import { useState } from "react";
import TableAnnouncementAdmin from "./_components/table";
import React from "react";
import { Columns } from "./_components/column";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DeleteDialogAnnouncement from "./_components/deleteDialog";
import AddAnnouncementDialog from "./_components/addAnnouncement";
import EditAnnouncementDialog from "./_components/editAnnouncement";
import useAxiosAuth from "../../../../../../libs/useAxiosAuth";

export default function AnnouncementPage() {
  const [notification, setNotification] = useState<{ message: string, type: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [rowEdit, setRowEdit] = useState<any>({})
  const [rowDelete, setRowDelete] = useState<any>({})
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, error, refetch } = useQuery({
    queryKey: ['dataAllAnnouncement'],
    queryFn: () => fetchListAllAnnouncement()
  })
  
  const columns = React.useMemo(
    () => Columns(), []
  );

  const handlingRowEdit = async(rowData: any) => {
    setRowEdit(rowData)
    setIsOpenEdit(true)
  }

  const handleRowDelete = async (rowData: any) => {
    setRowDelete(rowData)
    setIsOpenDelete(true);    
    if (notification?.type == 'error') return toast.error(notification.message)
    return toast.success(notification?.message)
  };

  const editAnnouncementSaved = async(data:any) => {
    const response = await useAxiosAuth.put('gtp/announcement', data)
    if (response.status == 200) {
      toast.success('success')
      refetch()
    } 
  }

  const addAnnouncementSaved = async(data: any) => {
    const response = await useAxiosAuth.post('gtp/announcement', data)
    if (response.status == 201) {
      toast.success('success')
      refetch()
    } 
  }
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Announcement</h1>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8" onClick={() => setIsOpen(!isOpen)}>
              <FontAwesomeIcon icon={faPlus} /> New Announcement
            </button>
          </div>
          <TableAnnouncementAdmin data={data} columns={columns} 
            onRowDelete={handleRowDelete} onRowEdit={handlingRowEdit}/>
          <DeleteDialogAnnouncement isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} 
            rowDelete={rowDelete} setNotification={setNotification} onSuccessfulDelete={refetch}/>
          <EditAnnouncementDialog isOpen={isOpenEdit} setIsOpen={setIsOpenEdit} 
            data={rowEdit} onSave={editAnnouncementSaved} />
          <AddAnnouncementDialog isOpen={isOpen} setIsOpen={setIsOpen} onSave={addAnnouncementSaved} />
          <ToastContainer
            position="top-center"
            autoClose={3500}
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
      </div>
    )
  }
}