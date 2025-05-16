'use client'

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { fetchDetailUser } from "../../api/fetchers/users"
import MoonLoader from "react-spinners/MoonLoader"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EditProfileDialog from "./_components/editProfileDialog"
import useAxiosAuth from "../../../../../libs/useAxiosAuth"
import { Bounce, toast, ToastContainer } from "react-toastify"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const [fetchingUser, setFetchingUser] = useState(false)
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false)

  const { isError, isSuccess, isLoading, data, error, refetch } = useQuery({
    queryKey: ['fetchDetailUser', session?.user.user_id],
    queryFn: () => fetchDetailUser(session!.user.user_id),
    enabled: fetchingUser && !!session,
    refetchOnWindowFocus: false
  })
  
  useEffect(() => {
    if (session !== undefined) {
      setFetchingUser(true)
    }
  }, [session])

  
  const handleEditProfileSaved = async(editProfile: any) => {
    console.log(editProfile, 'ini edit lhooo');
    const response = await useAxiosAuth.put('users/update-user-information', editProfile)
    if (response.status == 204) {
      toast.success('success')
      refetch()
    } 
  }
  
  return (
    <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-4">
      <div className="w-full h-full px-4 mb-2 bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-center">My Profile</h1>
        {data ? (
        <div className="p-4">
          <div className="m-4">
            <h2 className="text-lg font-semibold">Full Name :</h2>
            <p className="text-gray-700">{data.fullname}</p>
          </div>
          <div className="m-4">
            <h2 className="text-lg font-semibold">Email:</h2>
            <p className="text-gray-700">{data.email}</p>
          </div>
          <div className="m-4">
            <h2 className="text-lg font-semibold">Address:</h2>
            <p className="text-gray-700">{data.address ? data.address : 'No address is saved'}</p>
          </div>
          <div className="m-4">
            <h2 className="text-lg font-semibold">Phone:</h2>
            <p className="text-gray-700">{data.phone ? data.phone : 'No phone number is saved'}</p>
          </div>
          <button className="m-4 w-fit p-2  bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-7"
            onClick={() => setEditProfileIsOpen(true)}>
            <FontAwesomeIcon icon={faPencil} /> Edit My Profile
          </button>
          {data.code_referral !== null ? (
            <div>
              <div className="m-4">
                <h2 className="text-lg font-semibold">Code Referral:</h2>
                <p className="text-gray-700">{data.code_referral ? data.code_referral : 'You don\'t have a referral code'}</p>
              </div>
              <div className="m-4">
                <h2 className="text-lg font-semibold">Account Claim Referral:</h2>
                <p className="text-gray-700">{data.account_referral ? data.account_referral : 'No account claim referral is saved'}</p>
              </div>
              <button
                className="m-4 w-fit p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-7"
                onClick={() => setEditProfileIsOpen(true)}
              >
                <FontAwesomeIcon icon={faPencil} /> Edit Account Claim Referral
              </button>
            </div>
          ) : null}
        </div>
        ): (
          <div className="flex flex-col items-center justify-center w-full h-40"> {/* Set height to center loader */}
            <MoonLoader color="#36d7b7" speedMultiplier={3} size={75} />
            <p className='mt-4'>Loading ...</p>
          </div>
        )}
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
      <EditProfileDialog isOpen={editProfileIsOpen} setIsOpen={setEditProfileIsOpen}
        dataUser={data} onSave={handleEditProfileSaved}/>
    </div>
  )
}