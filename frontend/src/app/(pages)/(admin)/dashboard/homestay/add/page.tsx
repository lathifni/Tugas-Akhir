'use client'

import FileInput from "@/components/fileInput";
import MapInput from "@/components/maps/mapInput";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";
import { z } from 'zod';
import Link from "next/link";

interface Image {
  name: string;
  url: string;
  file: File;
}

const homestay_schema = z.object({
  homestay_name: z.string().min(1, 'Homestay name cannot be empty'),
  address: z.string().min(1, 'Address cannot be empty'),
  contact_person: z.string().min(1, 'Contact person cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  gallery: z.array(z.object({
    file: z.any(), // You can customize this if needed
  })).min(1, 'At least one gallery image is required'),
  geometry: z.any().refine(val => val !== null, {
    message: 'Geometry is required and cannot be null',
  }),
})

export default function AddHomestayAdminPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const mapInputRef = useRef<any>(null);
  const [geometry, setGeometry] = useState<any | null>(null)
  const router = useRouter();
  const [gallery, setGallery] = useState<Image[]>([]);
  const [formDataInput, setFormDataInput] = useState({
    homestay_name: "",
    address: "",
    contact_person: "",
    description: ""
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormDataInput({ ...formDataInput, [name]: value });
  };

  const handleGalleryChange = (newGallery: any) => {
    setGallery(newGallery);
  }

  const handleCoordinateChange = (latitude: number | null, longitude: number | null) => {
    setLatitude(latitude)
    setLongitude(longitude)
  };

  const handleLatitudeChange = (event: any) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event: any) => {
    setLongitude(event.target.value);
  };

  const handleSearchButton = () => {
    if (latitude !== null && longitude !== null && mapInputRef.current) {
      console.log('ini button search');
      mapInputRef.current.search(longitude, latitude)
    }
  }

  const handleGeometryChange = (geometry: any) => {
    console.log("Geometry:", geometry);
    setGeometry(geometry)
  }

  const handleDeletePolygon = () => {
    if (mapInputRef.current) {
      mapInputRef.current.deletePolygon();
    }
  };

  const handleSubmit = async() => {
    const validation = homestay_schema.safeParse({
      homestay_name: formDataInput.homestay_name,
      address: formDataInput.address,
      contact_person: formDataInput.contact_person,
      description: formDataInput.description,
      gallery,
      geometry,
    })
    console.log(formDataInput);

    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }
    
    const formData = new FormData()
    formData.append('category', 'homestay');
    gallery.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });

    try {
      const response = await axios.post("/api/images", formData);
      console.log(response.data);
      const url = response.data.data
      if (response.status === 201){
        const data = {
          homestay_name: formDataInput.homestay_name,
          address: formDataInput.address,
          contact_person: formDataInput.contact_person,
          description: formDataInput.description,
          url: url,
          geom: geometry
        }
        const response = await useAxiosAuth.post('homestay', data)
        if (response.status == 201) router.push('/dashboard/homestay')
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 py-3 mb-4 lg:p-4 lg:mb-0 lg:mr-3 lg:w-5/12 bg-white rounded-lg">
          <h1 className="text-3xl text-center font-bold">Add Homestay</h1>
          <div className="mb-4">
            <label>Homestay Name</label>
            <input type="text" name='homestay_name' onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
          </div>
          <div className="mb-4">
            <label>Address</label>
            <input type="text" name='address' onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
          </div>
          <div className="mb-4">
            <label>Contact Person</label>
            <input type="text" name='contact_person' onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
          </div>
          <div className="mb-4">
            <label>Description</label>
            <textarea id="message" name='description' onChange={handleChange}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write description here..."></textarea>
          </div>
          <div className="mb-4">
            <label>Gallery</label>
            <FileInput onGalleryChange={handleGalleryChange} fileType={"image"} />
          </div>
          <div className="flex py-4 px-8 gap-4">
            <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700" 
            onClick={handleSubmit}
            >
              Submit
            </button>
            <Link href={"/dashboard/homestay"}>
              <button className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700">
                Cancel
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full h-full py-5 px-4 lg:w-7/12 items-center bg-white rounded-lg">
          <h1 className="text-3xl text-center font-bold">Google Maps</h1>
          <div className="flex justify-around">
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Latitude</label>
              <input type="number" name='latitude' value={latitude ?? ''} placeholder={`eg. ${latitude !== null ? latitude : '-0.524313'}`} onChange={handleLatitudeChange}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Longitude</label>
              <input type="number" name='longitude' value={longitude ?? ''} placeholder={`eg. ${longitude !== null ? longitude : '100.492351'}`} onChange={handleLongitudeChange}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
          </div>
          <div className="flex p-4 gap-8">
            <button className="px-3 py-2 rounded-lg border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleSearchButton}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <button className="px-3 py-2 rounded-lg text-red-500 border border-red-500 hover:bg-red-500 hover:text-white" onClick={handleDeletePolygon}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <div className="pb-5">
            <MapInput onCoordinateChange={handleCoordinateChange} onGeometryChange={handleGeometryChange} ref={mapInputRef} />
          </div>
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
    </>
  )
}