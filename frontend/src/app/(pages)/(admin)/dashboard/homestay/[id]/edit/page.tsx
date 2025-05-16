  'use client'

  import { fetchHomestayById, fetchHomestayEditById } from "@/app/(pages)/api/fetchers/homestay";
  import FileEdit from "@/components/fileEdit";
  import FileInput from "@/components/fileInput";
  import MapEdit from "@/components/maps/mapEdit";
  import { faPencil, faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useQuery } from "@tanstack/react-query";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { useEffect, useRef, useState } from "react";
  import { Bounce, toast, ToastContainer } from "react-toastify";
  import useAxiosAuth from "../../../../../../../../libs/useAxiosAuth";
  import { z } from "zod";
  import axios from "axios";
  import NewFacilityDialog from "./_components/newFacilityDialog";
  import AddFacilityHomestayDialog from "./_components/addFacilityHomestayDialog";

  interface Image {
    name: string;
    url: string;
    file: File;
  }

  const homestaySchema = z.object({
    homestay_name: z.string().min(1, 'Name cannot be empty'),
    address: z.string().min(1, 'Address cannot be empty'),
    contact_person: z.string().min(1, 'Contact person cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
  });

  export default function HomestayIdEditPage({ params }: any) {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const mapInputRef = useRef<any>(null);
    const [geometry, setGeometry] = useState<any | null>(null)
    const [gallery, setGallery] = useState<Image[]>([]);
    const [deletedGalleryUrls, setDeletedGalleryUrls] = useState<string[]>([]);
    const [newFacilityIsOpen, setNewFacilityIsOpen] = useState(false)
    const [addFacilityHomestayIsOpen, setAddFacilityHomestayIsOpen] = useState(false)
    const router = useRouter();
    const [formDataInput, setFormDataInput] = useState({
      homestay_name: "",
      address: "",
      contact_person: "",
      description: ""
    });

    const { data, isLoading, refetch } = useQuery({
      queryKey: ['homestayById', params.id],
      queryFn: () => fetchHomestayEditById(params.id),
      // staleTime: 10000
    })
    console.log(data);
    

    useEffect(() => {
      if (data) {
        setFormDataInput({
          homestay_name: data.homestay.name,
          address: data.homestay.address,
          contact_person: data.homestay.contact_person,
          description: data.homestay.description,
        })
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

    const handleDeleteGallery = (url: string) => {
      setDeletedGalleryUrls([...deletedGalleryUrls, url]);
    };

    const handleNewFacilitySaved = async (newFacility: any) => {
      const response = await useAxiosAuth.post('homestay/create-facility-homestay', newFacility)
      if (response.data.status == 'success') {
        toast.success('Success')
      }
      toast.warning(response.data.message)
    };

    const handleAddFacilityHomestaySaved = async (newFacilityHomestay: { id: string; description: string }) => {
      const facilityExists = data.facility.some(
        (facility: { id: string }) => facility.id === newFacilityHomestay.id
      );
    
      if (facilityExists) {
        console.log('Fasilitas sudah ada:', newFacilityHomestay);
        // alert('Facility already exists!');
        return;
      }
      newFacilityHomestay.id = params.id
      
      const response = await useAxiosAuth.post('homestay/facility-homestay-by-id', newFacilityHomestay)
      if (response.status == 201) refetch()
    };

    const handleDeleteFacility = async (facilityId: string) => {
      const isConfirmed = window.confirm(
        `Are you sure you want to remove the service?`
      );
    
      if (!isConfirmed) {
        console.log('User cancelled the action.');
        return; // Batalkan jika user memilih "No"
      }
      const response = await useAxiosAuth.delete(
        `homestay/facility-homestay-by-id/${params.id}/${facilityId}`)
      if (response.status == 200) refetch()
    };

    const submitHandler = async (e: any) => {
      const validation = homestaySchema.safeParse({
        homestay_name: formDataInput.homestay_name,
        address: formDataInput.address,
        contact_person: formDataInput.contact_person,
        description: formDataInput.description,
      });
      if (!validation.success) {
        validation.error.errors.forEach((err) => {
          toast.error(err.message);
        });
        return;
      }

      const category = 'homestay'
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
        homestay_id: params.id,
      })
      const response = await useAxiosAuth.put('homestay', dataForm)
      console.log(response.data);
      if (response.status == 200) {
        refetch()
        window.scrollTo({
          top: 0,
          behavior: 'smooth'  // Optional: adds smooth scrolling effect
        });
        toast.success('success update homestay')
      }

    }

    if (data) {
      return (
        <>
          <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
            <div className="w-full h-full px-2 py-3 mb-4 lg:p-4 lg:mb-0 lg:mr-3 lg:w-5/12 bg-white rounded-lg">
              <h1 className="text-3xl text-center font-bold">Edit Homestay</h1>
              <div className="mb-4">
                <label>Homestay Name</label>
                <input type="text" name='homestay_name' onChange={handleChange} value={formDataInput.homestay_name}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
              </div>
              <div className="mb-4">
                <label>Address</label>
                <input type="text" name='address' onChange={handleChange} value={formDataInput.address}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
              </div>
              <div className="mb-4">
                <label>Contact Person</label>
                <input type="text" name='contact_person' onChange={handleChange} value={formDataInput.contact_person} maxLength={13}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
              </div>
              <div className="mb-4">
                <label>Description</label>
                <textarea id="message" name='description' onChange={handleChange} value={formDataInput.description} rows={5}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write description here..."></textarea>
              </div>
              <div className="mb-4">
                <label className="block mt-2 text-sm font-medium text-gray-900">Gallery Saved</label>
                <FileEdit galleries={data.gallery} folder="homestay" onDeleteImage={handleDeleteGallery} fileType={"image"} />
              </div>
              <div className="mb-4">
                <label>Gallery</label>
                <FileInput onGalleryChange={handleGalleryChange} fileType={"image"} />
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
            <div className="flex flex-col w-full h-full lg:w-7/12 items-center gap-4">
              <div className="w-full bg-white rounded-lg py-4">
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
                  <MapEdit onCoordinateChange={handleCoordinateChange} onGeometryChange={handleGeometryChange} ref={mapInputRef} geom={data.homestay.geom} />
                </div>
              </div>
              <div className=" w-full bg-white rounded-lg py-4">
                <h1 className="text-3xl text-center font-bold">Facility</h1>
                <div className="flex justify-center">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8" onClick={() => setNewFacilityIsOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} /> New Facility
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8" onClick={() => setAddFacilityHomestayIsOpen(true)}>
                    <FontAwesomeIcon icon={faPlus}  /> Add Facility Homestay
                  </button>
                </div>
                <table className="min-w-full mt-4">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-2 px-4 text-left">Facility</th>
                      <th className="py-2 px-4 text-left">Description</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.facility.map((facility: {name:string,description:string,id:string}) => (
                      <tr key={facility.id} className="border-b hover:bg-gray-100">
                        <td className="py-2 px-4">{facility.name}</td>
                        <td className="py-2 px-4">{facility.description}</td>
                        <td className="py-2 px-4">
                          <button className="p-2 border border-red-500 rounded-md text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            onClick={() => handleDeleteFacility(facility.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white rounded-lg mt-4">
                <h1 className="py-4 text-3xl text-center font-bold">Homestay Unit</h1>
                <div className="flex justify-end">
                  <Link href={`/dashboard/homestay/${params.id}/unit`}>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8">
                      <FontAwesomeIcon icon={faPencil} /> Edit Unit
                    </button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.units.map((unit: { unit_name:string, unit_number: string, price:number, capacity:number, facilities: { name: string; description: string; }[] }) => (
                  <div key={unit.unit_number} className="bg-slate-50 rounded-lg flex-1 min-w-[250px] m-1 px-2 shadow-sm">
                    <h4 className="font-bold text-center">Room {unit.unit_name} {unit.unit_number}</h4>
                    <p>Price: Rp{unit.price.toLocaleString()}</p>
                    <p>Capacity: {unit.capacity} guest</p>
                    <p>Facility : </p>
                    <ul className="list-disc pl-5">
                      {unit.facilities.map((facility, index) => (
                        <li key={index}>
                          <strong>{facility.name}</strong> 
                          <p>{facility.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  ))}
                </div>
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
          <NewFacilityDialog isOpen={newFacilityIsOpen} setIsOpen={setNewFacilityIsOpen}
            onSave={handleNewFacilitySaved} />
          <AddFacilityHomestayDialog isOpen={addFacilityHomestayIsOpen} setIsOpen={setAddFacilityHomestayIsOpen}
            onSave={handleAddFacilityHomestaySaved} />
        </>
      )
    }
  }