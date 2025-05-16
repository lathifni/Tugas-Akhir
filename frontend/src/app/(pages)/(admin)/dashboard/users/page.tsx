'use client'

import { fetchAllAdmin, fetchAllCostumer } from "@/app/(pages)/api/fetchers/users"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import React from "react";
import { Columns } from "./_components/column";
import TableUsers from "./_components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InfoUserDialog from "./_components/infoUserDialog";
import AddAdminDialog from "./_components/addAdminDialog";
import useAxiosAuth from "../../../../../../libs/useAxiosAuth";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DeleteDialog from "./_components/deleteDialog";
import { useRouter } from 'next/navigation'

interface dataUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
}

export default function Users() {
  const [selectedTable, setSelectedTable] = useState<'admin' | 'customer'>('admin');
  const [dataTable, setDataTable] = useState<dataUser[]>([]);
  const [dataInfoUser, setDataInfoUser] = useState<any>(null)
  const [rowDelete, setRowDelete] = useState<any>(null)
  const [infoUserIsOpen, setInfoUserIsOpen] = useState(false)
  const [addAdminIsOpen, setAddAdminIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const router = useRouter();
  const { data: dataAllAdmin, error: errorDataAllAdmin, refetch } = useQuery({
    queryKey: ['dataAllAdmin'],
    queryFn: fetchAllAdmin
  })
  const { data: dataAllCostumer, error: errorDataAllCostumer } = useQuery({
    queryKey: ['dataAllCostumer'],
    queryFn: fetchAllCostumer
  })

  const columns = React.useMemo(
    () => Columns(), []
  );

  const handleTableSelect = (type: 'admin' | 'customer') => {
    setSelectedTable(type);
    setDataTable(type === 'admin' ? dataAllAdmin : dataAllCostumer);
  };

  const handleAddAdmin = async() => {
    return
  }

  const handleInfoClick = (rowData: any) => {
    console.log('Info clicked for: ', rowData);
    setInfoUserIsOpen(true)
    setDataInfoUser(rowData)
    // Handle info click event
  };

  const handleChatClick = (id: any) => {
    console.log('Chat clicked for: ', id);
    router.push(`/explore/chat?id=${id}`)
    // Handle chat click event
  };

  const handleDeleteClick = (rowData: any) => {
    console.log('Delete clicked for: ', rowData);
    setRowDelete(rowData)
    setDeleteIsOpen(true)
  };

  const handleAddAdminSave = async(dataAdmin:any) => {
    console.log(dataAdmin);
    const response = await useAxiosAuth.post('users/new-admin', dataAdmin)
      if (response.status == 201) {
        toast.success('success')
        refetch()
      }
      if (response.status == 200) toast.warning(response.data.status)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await useAxiosAuth.delete(`users/delete-admin/${id}`);
      if (response.status === 200) {
        toast.success('User deleted successfully!');
        refetch(); // Refetch user list after delete
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  if (dataAllCostumer && dataAllAdmin) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Users</h1>
          <div className="flex justify-start m-3">
            <button className={`mr-2 rounded-lg ${selectedTable === 'admin' ? 'p-2 bg-blue-500 text-white' : 'p-2 bg-gray-200 text-black'}`}
            onClick={() => handleTableSelect('admin')}>Admin Account</button>
            <button className={`ml-2 rounded-lg ${selectedTable === 'customer' ? 'p-2 bg-blue-500 text-white' : 'p-2 bg-gray-200 text-black'}`}
            onClick={() => handleTableSelect('customer')}>Customer Account</button>
          </div>
          {selectedTable === 'admin' && (
            <div className="flex justify-end m-3">
              <button
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={() => setAddAdminIsOpen(true)} // Add your function to handle adding an admin
              >
                <FontAwesomeIcon icon={faPlus} /> Add Admin
              </button>
            </div>
          )}
          {/* {dataTable.length == 0 ? (
            <TableUsers columns={columns} data={dataAllAdmin} jenis={selectedTable} />
          ) : (
            <TableUsers columns={columns} data={dataTable} jenis={selectedTable}/>
          )} */}
          <TableUsers 
            columns={columns} 
            data={selectedTable === 'admin' ? dataAllAdmin : dataTable}
            jenis={selectedTable}
            onInfoClick={handleInfoClick} // Pass down the handler
            onChatClick={handleChatClick} // Pass down the handler
            onDeleteClick={handleDeleteClick} // Pass down the handler
          />
          <InfoUserDialog isOpen={infoUserIsOpen} setIsOpen={setInfoUserIsOpen} dataUser={dataInfoUser}/>
          <AddAdminDialog isOpen={addAdminIsOpen} setIsOpen={setAddAdminIsOpen} 
            onSave={handleAddAdminSave}/>
          <DeleteDialog isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen} 
          rowDelete={rowDelete} onDelete={handleDelete}/>
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
      </div>
    )
  }
}