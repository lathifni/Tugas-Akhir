'use client'

import { fetchDataInformation } from "@/app/(pages)/api/fetchers/gtp"
import FileEdit from "@/components/fileEdit";
import FileInput from "@/components/fileInput";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { z } from "zod";
import useAxiosAuth from "../../../../../../libs/useAxiosAuth";

interface Image {
  name: string;
  url: string;
  file: File;
}

const informationSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  ticket_price: z.number().min(1, 'Ticket price cannot be empty'),
  address: z.string().min(1, 'Address cannot be empty'),
  contact_person: z.string().min(1, 'Contact person cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  open: z.string().min(1, 'Open cannot be empty'),
  close: z.string().min(1, 'Close cannot be empty'),
  type_of_tourism: z.string().min(1, 'Type of tourism cannot be empty')
});

export default function Information () {
  const [gallery, setGallery] = useState<Image[]>([]);
  const [deletedGalleryUrls, setDeletedGalleryUrls] = useState<string[]>([]);
  
  const { data, error, refetch } = useQuery({
    queryKey: ['dataInformation'],
    queryFn: fetchDataInformation
  })
  
  const [formDataInput, setFormDataInput] = useState({
    name: "",
    open: "",
    close: "",
    address: "",
    description: "",    
    ticket_price: "",
    contact_person: "",
    type_of_tourism: "",
  });

  useEffect(() => {
    if (data) {
      setFormDataInput({
        name: data.name,
        address: data.address,
        contact_person: data.contact_person,
        open: data.open,
        close: data.close,
        description: data.description,
        type_of_tourism: data.type_of_tourism,
        ticket_price: data.ticket_price,
      });
    }
  }, [data])

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormDataInput({ ...formDataInput, [name]: value });
  };
  
  const handleGalleryChange = (newGallery: any) => {
    setGallery(newGallery);
  }

  const handleDeleteImage = (url: string) => {
    setDeletedGalleryUrls([...deletedGalleryUrls, url]);
  };

  const submitHandler = async (e: any) => {
    const validation = informationSchema.safeParse({
      name: formDataInput.name,
      address: formDataInput.address,
      ticket_price: Number(formDataInput.ticket_price),
      contact_person: formDataInput.contact_person,
      description: formDataInput.description,
      open: formDataInput.open,
      close: formDataInput.close,
      type_of_tourism: formDataInput.type_of_tourism,
    });

    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    const category = 'gtp'
    let  responseGallery
    if (gallery.length > 0) {
      const formDataGallery = new FormData()
      formDataGallery.append('category', category)
      gallery.forEach((image, index) => {
        formDataGallery.append(`images[${index}]`, image.file);
      });
      responseGallery = await axios.post("/api/images", formDataGallery);
    }
    const urlGallery = responseGallery?.data.data

    const dataForm = ({
      ...validation.data,
      gallery: urlGallery,
      delete_gallery: deletedGalleryUrls,
    })
    const response = await useAxiosAuth.put('gtp', dataForm)
    console.log(response.data);
    
    if (response.status == 200) {
      refetch()
      window.scrollTo({
        top: 0,
        behavior: 'smooth'  // Optional: adds smooth scrolling effect
      });
      toast.success('success update information')
    }
  }

  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Edit General Information</h1>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Name</label>
            <input type="text" name='name' onChange={handleChange} value={formDataInput.name}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Type of Tourism</label>
            <input type="text" name='type_of_tourism' onChange={handleChange} value={formDataInput.type_of_tourism}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Address</label>
            <textarea name='address' rows={3} onChange={handleChange} value={formDataInput.address} 
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Description</label>
            <textarea name='description' rows={5} onChange={handleChange} value={formDataInput.description} 
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Contact Person</label>
            <input type="text" name='contact_person' onChange={handleChange} value={formDataInput.contact_person} maxLength={13}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Ticket Price</label>
            <input type="number" name='ticket_price' onChange={handleChange} value={formDataInput.ticket_price}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Open</label>
            <input type="time" name='open' onChange={handleChange} value={formDataInput.open}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Close</label>
            <input type="time" name='close' onChange={handleChange} value={formDataInput.close}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900">Gallery Saved</label>
            <FileEdit galleries={data.gallery} folder="gtp" onDeleteImage={handleDeleteImage} fileType={"image"}/>
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900">Gallery</label>
            <FileInput fileType={"image"} onGalleryChange={handleGalleryChange} />
          </div>
          <div className="flex py-4 px-8 gap-4">
            <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700" onClick={submitHandler}>
              Submit
            </button>
            <Link href={"/dashboard"}>
              <button className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700">
                Cancel
              </button>
            </Link>
          </div>
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
}