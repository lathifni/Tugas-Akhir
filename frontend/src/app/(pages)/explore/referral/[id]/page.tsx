'use client'

import { fetchMyReferralById, fetchReferralById } from "@/app/(pages)/api/fetchers/referral";
import FileInput from "@/components/fileInput";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import useAxiosAuth from "../../../../../../libs/useAxiosAuth";
import moment from "moment";
import ReferralConfirmationDialog from "./_components/referralConfirmationDialog";

interface Image {
  name: string;
  url: string;
  file: File;
}

export default function ReferralIdPage({ params }: any) {
  const [gallery, setGallery] = useState<Image[]>([]);
  const [referralProofIsOpen, setReferralProofIsOpen] = useState(false)
  const { data, error, refetch } = useQuery({
    queryKey: ['dataReferralById'],
    queryFn: () => fetchMyReferralById(params.id)
  })
  const handleGalleryChange = (newGallery: any) => {
    setGallery(newGallery);
  }

  const handleReferralSaved = async (data:any) => {
    // if (gallery.length == 0) {
    //   return toast.error('Referral proof photo cannot be null');
    // }
    // const formData = new FormData()
    // const category = 'referral'
    // formData.append('category', category);
    // formData.append('images[0]', gallery[0]!.file)
    // const response = await axios.post("/api/images", formData);
    // const url = response.data.data

    // if (response.status===201) {      
    //   const dataInput = {
    //     id_reservation: data.id_reservation,
    //     referral_proof: url[0],
    //   };      
    //   const res = await useAxiosAuth.put('referral/add-referral-proof', dataInput)
    //   if (res.status == 200) {
    //     toast.success('success')
    //     refetch()
    //   }
    // }
    data.id = params.id
    console.log(data);
    const response = await useAxiosAuth.put('referral/confirmation', data)
      if (response.data.status == 'success') {
        toast.success('Success')
        refetch()
      }
  }
  
  return (
    <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
      <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
        <h1 className="text-2xl font-semibold text-center">Detail My Referral</h1>
        { data ? (
          <div className="lg:mx-10">
            <table className="min-w-full table-auto text-left">
              <tbody>
                <tr>
                  <th className="px-4 py-2">Reservation ID</th>
                  <td className="px-4 py-2">{data.id}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2">Full Name</th>
                  <td className="px-4 py-2">{data.fullname}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2">Package Name</th>
                  <td className="px-4 py-2">{data.name}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2">Request Date</th>
                  <td className="px-4 py-2">{moment(data.request_date).format('DD MMMM, YYYY')}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2">Amount Referral</th>
                  <td className="px-4 py-2">Rp{data.amount}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2">Status</th>
                  <td className="px-4 py-2">
                    {data.referral_check === 1 ? "Done" : "In Progress"}
                  </td>
                </tr>
                {(data.referral_proof !== null && data.referral_check == 1) && (
                <tr>
                  <th className="px-4 py-2">Referral Proof </th>
                  <td className="px-4 py-2">
                    {data.referral_proof ? (
                      <img src={`/photos/referral/${data.referral_proof}`} alt="Referral Proof" />
                    ) : (
                      <FileInput fileType={"image"} onGalleryChange={handleGalleryChange}/>
                    )}
                  </td>
                </tr>
                )}
              </tbody>
            </table>
            {(data.referral_proof != null && data.referral_check == null ) && (
              <div className="flex py-4 px-8 gap-4">
                <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                  onClick={() => setReferralProofIsOpen(true)}> 
                  Referral Proof / Check
                </button>
              </div>
            )}
          </div>
        ):null}
        <ReferralConfirmationDialog isOpen={referralProofIsOpen} setIsOpen={setReferralProofIsOpen}
          onSave={handleReferralSaved} gallery={data?.referral_proof} />
      </div>
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
  )
}