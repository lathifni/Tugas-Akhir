'use client'

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation'

interface FormData {
  fullname: string;
  username: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullname: string;
  username: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    username: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    fullname: "",
    username: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errorResponse, setErrorResponse] = useState('')
  const router = useRouter();

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

    // Validasi untuk password yang sama
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.warn("Passwords do not match");
    }

    if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone must contain only numbers";
      toast.warn("Phone must contain only numbers");
    }

    setErrors(newErrors);

    // Jika tidak ada kesalahan, kirim data ke backend
    if (Object.values(newErrors).every((error) => !error)) {
      axios.post('http://localhost:3000/users/register', formData)
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
  return (
    <div className="bg-white shadow-lg rounded-lg m-8">
      <h1 className="text-center text-2xl font-bold p-8">Register Form</h1>
      <div className="flex flex-col justify-center items-center p-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <p className="text-center text-red-500">{errorResponse}</p>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">Full name</label>
            <input type="text" name='fullname' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" required maxLength={50} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">User name</label>
            <input type="text" name='username' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John12" required maxLength={30} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
            <input type="email" name='email' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="user@email.com" required maxLength={255} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">Address</label>
            <input type="text" name='address' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="happy street" required maxLength={255} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">Phone</label>
            <input type="text" name='phone' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0812341234" required maxLength={15} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
            <input type="password" name='password' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="********" required minLength={8} maxLength={50} />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">Confirm Password</label>
            <input type="password" name='confirmPassword' onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="********" required minLength={8} maxLength={50} />
          </div>
          <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" type="submit">
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
  )
}