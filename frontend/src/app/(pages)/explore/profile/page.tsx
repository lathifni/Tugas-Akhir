'use client'

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { fetchDetailUser } from "../../api/fetchers/users" // Sesuaikan path
import MoonLoader from "react-spinners/MoonLoader"
// BARU: Tambahkan faKey
import { faPencil, faKey } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EditProfileDialog from "./_components/editProfileDialog"
import useAxiosAuth from "../../../../../libs/useAxiosAuth" // Sesuaikan path
import { Bounce, toast, ToastContainer } from "react-toastify"
import ChangePasswordDialog from "./_components/changePasswordDialog" // BARU: Import modal password
import 'react-toastify/dist/ReactToastify.css'; // BARU: Import CSS Toastify

// BARU: Interface sederhana untuk type safety
interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  id: string
}

interface UserProfileData {
  id: string | number;
  fullname: string;
  email: string;
  address?: string | null;
  phone?: string | null;
  code_referral?: string | null;
  account_referral?: string | null;
  // Tambahkan field lain jika ada
}


export default function ProfilePage() {
  const { data: session } = useSession() // Hapus status, update jika tidak dipakai
  const [fetchingUser, setFetchingUser] = useState(false)
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false)
  // BARU: State untuk modal ganti password
  const [changePasswordIsOpen, setChangePasswordIsOpen] = useState(false)

  const { isLoading, data, error, refetch } = useQuery<UserProfileData, Error>({ // Tambahkan type generic
    queryKey: ['fetchDetailUser', session?.user?.user_id], // Gunakan optional chaining
    queryFn: () => {
       if (!session?.user?.user_id) { // Tambah pengecekan
        return Promise.reject(new Error("User ID not available"));
      }
      return fetchDetailUser(session.user.user_id)
    },
    enabled: !!session?.user?.user_id, // Perbaiki enabled check
    refetchOnWindowFocus: false
  })

  // useEffect tidak perlu diubah, fungsinya hanya trigger fetch
  useEffect(() => {
    // Tidak perlu console.log session di sini
    if (session !== undefined) {
      setFetchingUser(true)
    }
  }, [session])


  const handleEditProfileSaved = async (editProfile: Partial<UserProfileData>) => { // Gunakan Partial
    try { // BARU: Tambah try...catch
      const response = await useAxiosAuth.put('users/update-user-information', editProfile)
      if (response.status == 204 || response.status === 200) { // Cek 200 juga
        toast.success('Profile updated successfully!', { transition: Bounce }) // Tambah pesan & transisi
        refetch()
        setEditProfileIsOpen(false) // BARU: Tutup modal
      }
    } catch (error: any) { // BARU: Tangani error
       console.error("Failed to update profile:", error);
       toast.error(error.response?.data?.message || 'Failed to update profile.', { transition: Bounce });
    }
  }

  // BARU: Handler untuk menyimpan password baru
  const handleChangePasswordSaved = async (passwordInput: Omit<PasswordUpdateData, 'id'>) => {
    if (!session?.user?.user_id) {
        toast.error('User session not found. Please log in again.', { transition: Bounce });
        console.error("User ID is missing from session in handleChangePasswordSaved");
        return; // Hentikan fungsi jika ID tidak ada
    }
    try {
      const completePasswordData: PasswordUpdateData = {
          ...passwordInput, // Ambil currentPassword dan newPassword
          id: String(session.user.user_id) // Tambahkan ID dari session (ubah ke string jika perlu)
      };

        // 3. Kirim data yang sudah lengkap
        const response = await useAxiosAuth.put('users/update-password', completePasswordData);
      if (response.status === 204 || response.status === 200) {
        toast.success('Password updated successfully!', { transition: Bounce });
        setChangePasswordIsOpen(false); // Tutup modal
      }
    } catch (error: any) {
      console.error("Failed to update password:", error);
      toast.error(error.response?.data?.message || 'Failed to update password.', { transition: Bounce });
    }
  }

  // BARU: Handle error dari useQuery
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load profile: ${error.message}`, { transition: Bounce });
    }
  }, [error]);

  return (
    <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-4">
      <div className="w-full h-full px-4 mb-2 bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-center">My Profile</h1>
        {/* Perbaiki kondisi loading */}
        {isLoading || !session ? (
           <div className="flex flex-col items-center justify-center w-full h-40">
             <MoonLoader color="#36d7b7" speedMultiplier={3} size={75} />
             <p className='mt-4'>Loading ...</p>
           </div>
        ) : data ? ( // Tampilkan data jika sudah ada
        <div className="p-4">
          <div className="m-4">
            <h2 className="text-lg font-semibold">Full Name :</h2>
            {/* Tampilkan data asli, jangan ubah */}
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

          {/* BARU: Wrapper untuk tombol agar rapi */}
          <div className="flex flex-wrap gap-4 m-4">
              <button className="w-fit p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg" // Hapus mb-7
                onClick={() => setEditProfileIsOpen(true)}>
                <FontAwesomeIcon icon={faPencil} /> Edit My Profile
              </button>

              {/* BARU: Tombol Ganti Password (Kondisional) */}
              {session?.user?.google === 0 && ( // Gunakan optional chaining
                <button
                  className="w-fit p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                  onClick={() => setChangePasswordIsOpen(true)}
                >
                  <FontAwesomeIcon icon={faKey} /> Change Password
                </button>
              )}
          </div>

          {/* Cek data.code_referral dengan benar */}
          {data.code_referral ? ( // Cukup cek truthy
            <div>
              <div className="m-4">
                <h2 className="text-lg font-semibold">Code Referral:</h2>
                {/* Tampilkan data asli */}
                <p className="text-gray-700">{data.code_referral}</p>
              </div>
              <div className="m-4">
                <h2 className="text-lg font-semibold">Account Claim Referral:</h2>
                <p className="text-gray-700">{data.account_referral ? data.account_referral : 'No account claim referral is saved'}</p>
              </div>
              {/* Tombol edit referral tetap di sini jika perlu */}
              <button
                className="m-4 w-fit p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-7"
                onClick={() => setEditProfileIsOpen(true)}
              >
                <FontAwesomeIcon icon={faPencil} /> Edit Account Claim Referral
              </button>
            </div>
          ) : null}
        </div>
        ) : ( // Kondisi jika data null/undefined tapi tidak loading
           <div className="text-center py-10 text-gray-500">
             Failed to load profile data or profile not found.
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
      {/* Pastikan data ada sebelum render modal edit */}
      {data && (
        <EditProfileDialog isOpen={editProfileIsOpen} setIsOpen={setEditProfileIsOpen}
          dataUser={data} onSave={handleEditProfileSaved}/>
      )}
      {/* BARU: Render modal ganti password */}
      <ChangePasswordDialog
        isOpen={changePasswordIsOpen}
        setIsOpen={setChangePasswordIsOpen}
        onSave={handleChangePasswordSaved}
      />
    </div>
  )
}