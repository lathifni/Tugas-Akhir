'use client'

import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { ToastContainer, Bounce, toast } from "react-toastify";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";
import axios from "axios";
import { fetchAllTypeFacility, fetchFacilityById } from "@/app/(pages)/api/fetchers/facility";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import FileInput from "@/components/fileInput";
import Link from "next/link";
import MapEdit from "@/components/maps/mapEdit";
import { fetchGalleriesFacility } from "@/app/(pages)/api/fetchers/galleries";
import FileEdit from "@/components/fileEdit";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'

interface Image {
  name: string;
  url: string;
  file: File;
}

export default function FacilityIdPage({ params }: any) {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const mapInputRef = useRef<any>(null);
  const [geometry, setGeometry] = useState<any | null>(null)
  const [gallery, setGallery] = useState<Image[]>([]);
  const [deletedGalleryUrls, setDeletedGalleryUrls] = useState<string[]>([]);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['facilityById', params.id],
    queryFn: () => fetchFacilityById(params.id),
    // staleTime: 10000
  })

  const [formDataInput, setFormDataInput] = useState({
    name: "",
    type: "",
    price: "",
    category: ""
  });
  const { data: dataAllTypeFacility, error } = useQuery({
    queryKey: ['dataAllTypeFacility'],
    queryFn: fetchAllTypeFacility
  })

  const { data: galleriesFacility } = useQuery({
    queryKey: ['galleriesFacility'],
    queryFn: () => fetchGalleriesFacility(params.id)
  })

  const handleDeleteImage = (url: string) => {
    setDeletedGalleryUrls([...deletedGalleryUrls, url]);
  };

  useEffect(() => {
    if (data) {
      setFormDataInput({
        name: data.name,
        type: data.type_id,
        price: data.price,
        category: data.category
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
    let url: any
    if (formDataInput.category === '') {
      toast.warn('category cannot be null')
      return;
    }
    if (formDataInput.name == '') {
      toast.warn('name cannot be null')
      return;
    }
    if (formDataInput.price == '') {
      toast.warn('price cannot be null')
      return;
    }
    if (formDataInput.type == '') {
      toast.warn('type facility cannot be null')
      return;
    }
    if (gallery.length == 0) {
      url = []
    }

    const formData = new FormData()
    const category = 'facility'
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
        const response = await axios.post("/api/images", formData);
        console.log(response.data);
        url = response.data.data
        if (response.status === 201) {
          const data = {
            id: params.id,
            name: formDataInput.name,
            category: formDataInput.category,
            type: formDataInput.type,
            price: formDataInput.price,
            newUrl: url,
            deletedUrl: deletedGalleryUrls,
            geom: geometry
          }
          const response = await useAxiosAuth.put(`facility/${params.id}`, data)
          if (response.status === 200) router.push('/dashboard/facility')
        }
      }
      else if (gallery.length == 0) {
        const data = {
          id: params.id,
          name: formDataInput.name,
          category: formDataInput.category,
          type: formDataInput.type,
          price: formDataInput.price,
          newUrl: url,
          deletedUrl: deletedGalleryUrls,
          geom: geometry
        }
        const response = await useAxiosAuth.put(`facility/${params.id}`, data)
        if (response.status === 200) router.push('/dashboard/facility')
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
            <h1 className="text-3xl text-center font-bold">Add Facility</h1>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Facility Name</label>
              <input type="text" name='name' onChange={handleChange} value={formDataInput.name}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Facility Type</label>
              {dataAllTypeFacility ? (
                <select
                  name="type"
                  value={formDataInput.type}
                  onChange={handleChange}
                  className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Please choose</option>
                  {dataAllTypeFacility.map((service: { id: string; type: string }) => (
                    <option key={service.id} value={service.id}>
                      {service.type}
                    </option>
                  ))}
                </select>
              ) : (
                <input type="text" readOnly placeholder="Loading ..." className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Price</label>
              <input type="text" name='price' onChange={handleChange} value={formDataInput.price}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900">Category</label>
              <RadioGroup row name="category" onChange={handleChange} value={formDataInput.category}>
                <FormControlLabel value="0" control={<Radio />} label="Group" />
                <FormControlLabel value="1" control={<Radio />} label="Individu" />
              </RadioGroup>
            </div>
            <div className="px-8">
              <label className="block mt-2 text-sm font-medium text-gray-900">Gallery Saved</label>
              <FileEdit galleries={galleriesFacility} folder="facility" onDeleteImage={handleDeleteImage} />
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