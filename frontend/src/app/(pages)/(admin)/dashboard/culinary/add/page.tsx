'use client'

import { fetchAllTypeFacility } from "@/app/(pages)/api/fetchers/facility";
import FileInput from "@/components/fileInput";
import MapInput from "@/components/maps/mapInput";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'react-toastify/dist/ReactToastify.css';
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRef, useState } from "react";
import { ToastContainer, Bounce, toast } from "react-toastify";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";
import { useRouter } from 'next/navigation'

interface Image {
  name: string;
  url: string;
  file: File;
}

export default function AddCulinaryAdmin() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const mapInputRef = useRef<any>(null);
  const [geometry, setGeometry] = useState<any | null>(null)
  const [gallery, setGallery] = useState<Image[]>([]);
  // const [linkGallery, setLinkGallery] = useState
  const router = useRouter();
  const [formDataInput, setFormDataInput] = useState({
    name: "",
    address: "",
    contact_person: "",
    open: "",
    close: "",
    capacity: "",
    description: "",    
    status: "",
  });
  const { data: dataAllTypeFacility, error } = useQuery({
    queryKey: ['dataAllTypeFacility'],
    queryFn: fetchAllTypeFacility
  })

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

  const submitHandler = async (e: any) => {
    e.preventDefault();
    
    let url: any
    if (formDataInput.address === '') return toast.warn('address cannot be null');
    if (formDataInput.name == '') return toast.warn('name cannot be null');
    if (formDataInput.contact_person == '') return toast.warn('contact_person cannot be null');
    if (formDataInput.capacity == '') return toast.warn('capacity culinary cannot be null')
    if (formDataInput.open == '') return toast.warn('open culinary cannot be null')
    if (formDataInput.close == '') return toast.warn('close culinary cannot be null')
    if (formDataInput.description == '') return toast.warn('description culinary cannot be null')
    if (formDataInput.status == '') return toast.warn('status culinary cannot be null')
    if (geometry == null) return toast.warn('Geometry on Google Maps cannot be null')
    if (gallery.length == 0) return toast.warn('Gallery cannot be null')

    const formData = new FormData()
    const category = 'culinary'
    formData.append('category', category);
    gallery.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });

    try {
      const response = await axios.post("/api/images", formData);
      console.log(response.data);
      const url = response.data.data
      if (response.status === 201){
        const data = {
          name: formDataInput.name,
          address: formDataInput.address,
          contact_person: formDataInput.contact_person,
          open: formDataInput.open,
          close: formDataInput.close,
          capacity: formDataInput.capacity,
          description: formDataInput.description,
          status: formDataInput.status,
          url: url,
          geom: geometry
        }
        const response = await useAxiosAuth.post('culinary', data)
        console.log(response);
        
        if (response.status === 201) router.push('/dashboard/culinary')
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 py-3 mb-4 lg:p-4 lg:mb-0 lg:mr-3 lg:w-5/12 bg-white rounded-lg">
          <h1 className="text-3xl text-center font-bold">Add Culinary</h1>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 " htmlFor='name'>Culinary Name
            <input type="text" id="name" name='name' onChange={handleChange}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </label>
          </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Address
              <input type="text" name='address' onChange={handleChange} value={formDataInput.address}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </label>
          </div>
          <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Description</label>
              <textarea name='description' onChange={handleChange} value={formDataInput.description} rows={5} 
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Contact Person</label>
              <input type="text" name='contact_person' onChange={handleChange} value={formDataInput.contact_person}
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
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Capacity</label>
              <input type="number" name='capacity' onChange={handleChange} value={formDataInput.capacity}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900">Status</label>
              <RadioGroup row name="status" onChange={handleChange} value={formDataInput.status}>
                <FormControlLabel value="0" control={<Radio />} label="Outside GTP Tourist Area" />
                <FormControlLabel value="1" control={<Radio />} label="Inside GTP Tourist Area" />
              </RadioGroup>
            </div>
          <div className="px-8">
            <label className="block mt-2 text-sm font-medium text-gray-900">Gallery</label>
            <FileInput onGalleryChange={handleGalleryChange} />
          </div>
          <div className="flex py-4 px-8 gap-4">
            <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700" onClick={submitHandler}>
              Submit
            </button>
            <Link href={"/dashboard/facility"}>
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
              <input type="number" name='latutude' value={latitude ?? ''} placeholder={`eg. ${latitude !== null ? latitude : '-0.524313'}`} onChange={handleLatitudeChange}
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