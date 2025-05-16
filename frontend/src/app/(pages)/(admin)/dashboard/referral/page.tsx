'use client'
import { fetchAllReferral } from "@/app/(pages)/api/fetchers/referral"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react";
import { Columns } from "./_components/column";
import TableReferralAdmin from "./_components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useAxiosAuth from "../../../../../../libs/useAxiosAuth";
import { Bounce, toast, ToastContainer } from "react-toastify";
import AddCodeReffDialog from "./_components/addCodeReffDialog";

export default function AdminReferralPage() {
  const [addCodeReffIsOpen, setAddCodeReffIsOpen] = useState(false)
  const { data, error } = useQuery({
    queryKey: ['dataAllReferral'],
    queryFn: fetchAllReferral
  })

  const columns = React.useMemo(
    () => Columns(), []
  );

  const handleAddCodeReffSave = async(data:any) => {
    try {
      const response = await useAxiosAuth.post('referral', data);
      if (response.status === 201) {
        toast.success('Success');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.msg || 'Request failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
      <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
        <h1 className="text-2xl font-semibold text-center">Manage Referral</h1>
        <div className="flex justify-end m-3">
          <button
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={() => setAddCodeReffIsOpen(true)} // Add your function to handle adding an admin
          >
            <FontAwesomeIcon icon={faPlus} /> Create Code Referral User
          </button>
        </div>
        { data ? (
          <TableReferralAdmin columns={columns} data={data}/>
        ): null}
      </div>
      <AddCodeReffDialog isOpen={addCodeReffIsOpen} setIsOpen={setAddCodeReffIsOpen}
        onSave={handleAddCodeReffSave} />
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