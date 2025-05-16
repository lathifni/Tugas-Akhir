'use client'

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";
import useAxiosAuth from "../../../../../libs/useAxiosAuth";
import { MenuSquare } from "lucide-react";

interface FormData {
  fullname: string;
  email: string;
  address: string;
  phone: string;
}

interface FormErrors {
  fullname: string;
  email: string;
  address: string;
  phone: string;
}

export default function RegisterPage() {
  const { data: session, update, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullname: session?.user?.name || "",
    email: session?.user?.email || "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    fullname: "",
    email: "",
    address: "",
    phone: "",
  });
  const [errorResponse, setErrorResponse] = useState('')
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        fullname: session.user.name || prevData.fullname,
        email: session.user.email || prevData.email,
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
    // Validasi di sini sebelum mengirim data ke backend
    const newErrors = { ...errors };
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const formDataKey = key as keyof FormData;
        if (!formData[formDataKey]) {
          newErrors[formDataKey] = `${key} is required`;
        } else {
          newErrors[formDataKey] = "";
        }
      }
    }

    
    // Validasi khusus untuk email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is not valid";
      toast.warn("Email is not valid");
    }
    
    if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone must contain only numbers";
      toast.warn("Phone must contain only numbers");
    }
    
    setErrors(newErrors);
    
    // Jika tidak ada kesalahan, kirim data ke backend
    console.log("Validation errors:", newErrors); 
    if (Object.values(newErrors).every((error) => !error)) {
      console.log('test lagi');
      console.log('terst');
      
      useAxiosAuth.post('users/register', formData)
        .then((res) => {
          toast.success("Registration Successful!");
          toast.info("Redirecting You to Login Page");
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              setErrorResponse(error.response.data.error);
            } else if (error.response.status === 401) {
              setErrorResponse(error.response.data.msg);
            } else {
              console.log('Other error:', error.response.status);
            }
          } else if (error.request) {
            console.log('Request made but no response received:', error.request);
          } else {
            console.error('Error setting up the request:', error.message);
          }
        });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // return (
  //   <div className="bg-white shadow-lg rounded-lg m-8">
  //     <h1 className="text-center text-2xl font-bold p-8">Register New User Form</h1>
  //     <div className="flex flex-col justify-center items-center p-4">
  //       <form onSubmit={handleSubmit} className="flex flex-col">
  //         <p className="text-center text-red-500">{errorResponse}</p>
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-900 ">Full name</label>
  //           <input type="text" name='fullname' value={formData.fullname} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" readOnly required maxLength={50} />
  //         </div>
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
  //           <input type="email" name='email' value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="user@email.com" readOnly required maxLength={255} />
  //         </div>
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-900 ">Address</label>
  //           <input type="text" name='address' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="happy street" required maxLength={255} />
  //         </div>
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-900 ">Phone</label>
  //           <input type="number" name='phone' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="6281212344321" required maxLength={16} />
  //         </div>
  //         <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" type="submit">
  //           <FontAwesomeIcon icon={faCheck} /> Register
  //         </button>
          
  //       </form>
  //       <Link href={'/login'}>
  //           <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400">
  //             <FontAwesomeIcon icon={faXmark} /> Cancel
  //           </button>
  //         </Link>
  //     </div>
  //     <ToastContainer
  //       position="top-center"
  //       autoClose={3500}
  //       hideProgressBar={false}
  //       newestOnTop={false}
  //       closeOnClick
  //       rtl={false}
  //       pauseOnFocusLoss
  //       draggable
  //       pauseOnHover
  //       theme="light"
  //       transition={Bounce}
  //     />
  //   </div>
  // )
  return (
    <>
      <nav className="w-full mb-16 fixed top-0 z-50 flex items-center justify-between px-4 py-2 bg-white text-blue-800 shadow-md">
        <div>
          <a href="/" className="flex gap-2">
            <img className="w-8 sm:w-14" src="/icon/logo.svg" alt="Icon" />
            <h1 className="text-xl sm:text-4xl lg:tracking-widest font-medium ">Tourism Village</h1>
          </a>
        </div>
        <div>
          <button type="button" className="block md:hidden" onClick={toggleMenu}>
            <MenuSquare className="text-blue-500" size={40} />
          </button>
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col md:flex-row gap-4 items-center text-lg">
              <a href="#home" className="text-blue-600 ">Home</a>
              <a href="#about" className="text-black hover:text-blue-500 ">Explore</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center h-screen bg-blue-600">
        <div className="bg-white shadow-lg rounded-lg m-8 px-10">  
          <h1 className="text-center text-2xl font-bold py-2 px-6 ">Register</h1>
          <div className="flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <p className="text-center text-red-500">{errorResponse}</p>
              <div>
                {/* <label className="block mb-2 text-sm font-medium text-gray-900 ">Full name</label> */}
                <input type="text" name='fullname' value={formData.fullname} onChange={handleChange} className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" readOnly required maxLength={50} />
              </div>
              <div>
                {/* <label className="block mb-2 text-sm font-medium text-gray-900 ">Email</label> */}
                <input type="email" name='email' value={formData.email} onChange={handleChange} className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="user@email.com" readOnly required maxLength={255} />
              </div>
              <div>
                {/* <label className="block mb-2 text-sm font-medium text-gray-900 ">Address</label> */}
                <input type="text" name='address' onChange={handleChange} className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Address" required maxLength={255} />
              </div>
              <div>
                {/* <label className="block mb-2 text-sm font-medium text-gray-900 ">Phone</label> */}
                <input type="number" name='phone' onChange={handleChange} className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Phone number" required maxLength={16} />
              </div>
              <button className="px-4 py-2  text-white rounded-lg bg-blue-500 hover:bg-green-400" type="submit">
                <FontAwesomeIcon icon={faCheck} /> Register
              </button>
            </form>
              <Link href={'/login'}>
                <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400">
                  <FontAwesomeIcon icon={faXmark} /> Cancel
                </button>
              </Link>
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
      </div>
    </>
  )
}