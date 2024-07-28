'use client'

import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, Bounce, toast } from "react-toastify";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import FileInput from "@/components/fileInput";
import Link from "next/link";
import MapEdit from "@/components/maps/mapEdit";
import { fetchGalleriesWorship } from "@/app/(pages)/api/fetchers/galleries";
import FileEdit from "@/components/fileEdit";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { fetchWorshipById } from "@/app/(pages)/api/fetchers/worhsip";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

interface Image {
  name: string;
  url: string;
  file: File;
}

export default function WorshipIdPage({ params }: any) {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const mapInputRef = useRef<any>(null);
  const [geometry, setGeometry] = useState<any | null>(null)
  const [gallery, setGallery] = useState<Image[]>([]);
  const [deletedGalleryUrls, setDeletedGalleryUrls] = useState<string[]>([]);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['worshipById', params.id],
    queryFn: () => fetchWorshipById(params.id),
    // staleTime: 10000
  })

  const [formDataInput, setFormDataInput] = useState({
    name: "",
    price: "",
    category: "",
    address: "",
    capacity:"",
    description: "",
    status: "",
  });

  const { data: galleriesWorship } = useQuery({
    queryKey: ['galleriesWorshipById'],
    queryFn: () => fetchGalleriesWorship(params.id)
  })
  
  const handleDeleteImage = (url: string) => {
    setDeletedGalleryUrls([...deletedGalleryUrls, url]);
  };

  useEffect(() => {
    if (data) {
      setFormDataInput({
        name: data.name,
        price: data.price,
        category: data.category,
        address: data.address,
        capacity: data.capacity,
        description: data.description,
        status: data.status
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
    
    if (formDataInput.name == '') return toast.warn('name cannot be null')
    if (formDataInput.price === '') return toast.warn('price cannot be null')
    if (formDataInput.status === '') return toast.warn('status cannot be null')
    if (formDataInput.address == '') return toast.warn('address worship cannot be null')
    if (formDataInput.description == '') return toast.warn('description worship cannot be null')
    if (gallery.length == 0) url = []

    const formData = new FormData()
    const category = 'worship'
    formData.append('category', category);
    if (deletedGalleryUrls.length !== 0) {
      deletedGalleryUrls.forEach((url, index) => {
        formData.append(`imageDelete[${index}]`, url)
      })
    }
    if (gallery.length !== 0) {
      gallery.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file);
      });
    }

    try {
      await axios.post('/api/deleteImages', formData)
      if (gallery.length !== 0) {
        console.log(params.id);
        
        const response = await axios.post("/api/images", formData);
        url = response.data.data
        if (response.status === 201) {
          const data = {
            id: params.id,
            name: formDataInput.name,
            address: formDataInput.address,
            capacity: formDataInput.capacity,
            status: formDataInput.status,
            description: formDataInput.description,
            price: formDataInput.price,
            newUrl: url,
            deletedUrl: deletedGalleryUrls,
            geom: geometry
          }
          const response = await useAxiosAuth.put(`worship/${params.id}`, data)
          if (response.status === 200) router.push('/dashboard/worship')
        }
      }
      else if (gallery.length == 0) {
        const data = {
          id: params.id,
          name: formDataInput.name,
          address: formDataInput.address,
          capacity: formDataInput.capacity,
          status: formDataInput.status,
          description: formDataInput.description,
          price: formDataInput.price,
          newUrl: url,
          deletedUrl: deletedGalleryUrls,
          geom: geometry
        }
        const response = await useAxiosAuth.put(`worship/${params.id}`, data)
        if (response.status === 200) router.push('/dashboard/worship')
      }

    } catch (error) {
      console.error("Error:", error);
    }
  }
  if (data) {
    return (
      <>
        <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
          <div className="w-full h-full px-2 py-3 mb-4 lg:p-4 lg:mb-0 lg:mr-3 lg:w-5/12 bg-white rounded-lg">
            <h1 className="text-3xl text-center font-bold">Edit Worship</h1>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Worship Name</label>
              <input type="text" name='name' onChange={handleChange} value={formDataInput.name}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Address</label>
              <input type="text" name='address' onChange={handleChange} value={formDataInput.address}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Description</label>
              <textarea name='description' onChange={handleChange} value={formDataInput.description}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Capacity</label>
              <input type="number" name='capacity' onChange={handleChange} value={formDataInput.capacity}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Price</label>
              <input type="number" name='price' onChange={handleChange} value={formDataInput.price}
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
              <label className="block mt-2 text-sm font-medium text-gray-900">Gallery Saved</label>
              <FileEdit galleries={galleriesWorship} folder="worship" onDeleteImage={handleDeleteImage} />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900">Gallery</label>
              <FileInput onGalleryChange={handleGalleryChange} />
            </div>
            <div className="flex py-4 px-8 gap-4">
              <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700" onClick={submitHandler}>
                Submit
              </button>
              <Link href={"/dashboard/worship"}>
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
              <MapEdit onCoordinateChange={handleCoordinateChange} onGeometryChange={handleGeometryChange} ref={mapInputRef} geom={data.geom} />
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
  return (
    <div className="h-full w-full items-center justify-center">
      <p className="text-center">Loading ...</p>
    </div>
  )
}