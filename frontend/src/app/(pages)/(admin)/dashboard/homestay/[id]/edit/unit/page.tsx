'use client'

import { fetchHomestayUnitById } from "@/app/(pages)/api/fetchers/homestay";
import { faImage, faPencilAlt, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FacilityUnitDialog from "./_components/facilityUnitDialog";
import UnitDialog from "./_components/unitDialog";
import FacilityDialog from "./_components/facilityDialog";
import useAxiosAuth from "../../../../../../../../libs/useAxiosAuth";
import { Bounce, toast, ToastContainer } from "react-toastify";
import EditUnitDialog from "./_components/editUnitDialog";
import GalleriesDialog from "./_components/galleriesDialog";
import DeleteUnitDialog from "./_components/deleteDialog";
import DeleteUnitFacilityDialog from "./_components/deleteFacilityUnitDialog";

interface Facility {
  name: string;
  description: string;
  id:string;
}
interface Gallery {
  id: string;
  url: string;
}

interface Unit {
  unit_number: string;
  unit_name: string;
  price: number;
  unit_type: string;
  capacity: number;
  description: string;
  facilities: Facility[];
  galleries: Gallery[]
}

export default function HomestayUnitPage({ params }:any) {
  const [unitHomestayIsOpen, setUnitHomestayIsOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit|null>(null);
  const [selectedUnitGallery, setSelectedUnitGallery] = useState<any[]|null>(null);
  const [facilityUnitIsOpen, setFacilityUnitIsOpen] = useState(false)
  const [facilityIsOpen, setFacilityIsOpen] = useState(false)
  const [editUnitIsOpen, setEditUnitIsOpen] = useState(false)
  const [galleriesIsOpen, setGalleriesIsOpen] = useState(false)
  const [isOpenDeleteUnit, setIsOpenDeleteUnit] = useState(false)
  const [isOpenDeleteFacilityUnit, setIsOpenDeleteFacilityUnit] = useState(false)
  const [rowDeleteUnit, setRowDeleteUnit] = useState<{ name: string; id: string }>({ name: '', id: '' });
  const [rowDeleteFacilityUnit, setRowDeleteFacilityUnit] = useState<{ name: string; facility_id:string; id: string }>({ name: '', facility_id:'', id: '' });
  const { data, isLoading, refetch} = useQuery({
    queryKey: ['homestayUnitById', params.id],
    queryFn: () => fetchHomestayUnitById(params.id),
    // staleTime: 10000
  })
  
  const handleNewUnitSaved = async(data: any) => {
    const response = await useAxiosAuth.post('homestay/add-unit', data)
      if (response.data.status == 'success') {
        toast.success('Success')
        refetch()
      }
  }

  const handleNewFacilityUnitSaved = async (newFacilityUnit:any) => {
    const response = await useAxiosAuth.post('homestay/create-facility-homestay-unit', newFacilityUnit)
      if (response.data.status == 'success') {
        toast.success('Success')
      }
      toast.warning(response.data.message)
  };

  const handleEditUnitButton = async(unitNumber: any) => {
    const selectedUnit = data.units.find((unit: { unit_number: string }) => unit.unit_number === unitNumber);
    if (selectedUnit) {
      setSelectedUnit(selectedUnit); // Simpan selected unit ke state
      setEditUnitIsOpen(true); // Buka dialog edit
    } else {
      console.log('Unit tidak ditemukan');
    }
  }

  const handleOpenGalleriesButton = async(unitNumber: any) => {
    const selectedUnit = data.units.find((unit: { unit_number: string }) => unit.unit_number === unitNumber);
    if (selectedUnit) {
      setSelectedUnitGallery(selectedUnit.galleries);      
      setGalleriesIsOpen(true); // Buka dialog edit
    } else {
      console.log('Unit tidak ditemukan');
    }
  }

  const handleEditUnitSaved = async(editUnit: any) => {
    const response = await useAxiosAuth.put('homestay/update-unit', editUnit)
    if (response.status == 200) {
      toast.success('success')
      refetch()
    } 
  }

  const handleFacilityUnitSaved = async(newFacilityUnit: {idFacilityUnit:string,idUnitHomestay:string,description:string,unit_type:string,idHomestay:string }) => {
    const matchingUnit = data.units.find(
      (unit: { unit_number: string }) => unit.unit_number === newFacilityUnit.idUnitHomestay
    );
    
    const facilityUnitExists = matchingUnit.facilities.some(
      (facility: { id: string }) => facility.id === newFacilityUnit.idFacilityUnit
    );

    if (!facilityUnitExists) {
      newFacilityUnit.idHomestay = params.id
      newFacilityUnit.unit_type = matchingUnit.unit_type
      const response = await useAxiosAuth.post('homestay/facility-unit-by-id', newFacilityUnit)
      if (response.status == 201) refetch()      
    }
  }

  const handleDeleteFacility = async (facilityId: string, unitNumber: string) => {
    const id_homestay = params.id
    const data = { facilityId, unitNumber, id_homestay}
    console.log(`Deleting facility with ID: ${facilityId} from unit: ${unitNumber}`);
    const response = await useAxiosAuth.delete(
      `homestay/facility-unit-detail`, {data})
    if (response.status == 204) refetch()
  };

  const handleDeleteUnit = async(unitNumber:string) => {
    const response = await useAxiosAuth.delete(
      `homestay/facility-unit?homestay_id=${params.id}&unit_number=${unitNumber}`,)
    if (response.status == 204) refetch()
  }
  
  return (
    <>
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 py-3 mb-4 lg:p-4 lg:mb-0 bg-white rounded-lg">
          <h1 className="text-3xl text-center font-bold">Unit Homestay</h1>
          <div className="flex justify-center mb-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8"
            onClick={() => setUnitHomestayIsOpen(true)}>
              <FontAwesomeIcon icon={faPlus} /> Unit
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mr-8"
            onClick={() => setFacilityUnitIsOpen(true)}>
              <FontAwesomeIcon icon={faPlus} /> Facility Unit
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setFacilityIsOpen(true)}>
              <FontAwesomeIcon icon={faPlus} /> Facility
            </button>
          </div>

          {/* Displaying the units dynamically */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.units?.map((unit: Unit) => (
              <div key={unit.unit_number} className="bg-gray-100 rounded-lg p-4 shadow-md relative">
                <h2 className="font-bold text-xl">Room {unit.unit_name} {unit.unit_number}</h2>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <div className="p-2 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => handleOpenGalleriesButton(unit.unit_number)}>
                    <FontAwesomeIcon icon={faImage} />
                  </div>
                  <div className="p-2 border border-yellow-400 rounded-md text-yellow-400 hover:bg-yellow-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => handleEditUnitButton(unit.unit_number)}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </div>
                  <div className="p-2 border border-red-500 rounded-md text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    // onClick={() => handleDeleteUnit(unit.unit_number)}
                    onClick={() => {
                      setRowDeleteUnit({ name: unit.unit_name, id: unit.unit_number });
                      setIsOpenDeleteUnit(true);
                    }}
                    >
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                </div>
                <p>Price: Rp {unit.price.toLocaleString()}</p>
                <p>Capacity: {unit.capacity} guests</p>
                <br />
                <p>{unit.description}</p>
                <br />
                <p>Facilities:</p>
                <table className="w-full mt-2 border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b py-2 text-left">Facility</th>
                      <th className="border-b py-2 text-left">Description</th>
                      <th className="border-b py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.facilities.map((facility) => (
                      facility.name !== null ? (
                        <tr key={facility.id}>
                          <td className="py-2">{facility.name}</td>
                          <td className="py-2">{facility.description}</td>
                          <td className="py-2">
                            <button className="p-2 border border-red-500 rounded-md text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              // onClick={() => handleDeleteFacility(facility.id, unit.unit_number)}
                              onClick={() => {
                                setRowDeleteFacilityUnit({ name: facility.name, id: unit.unit_number, facility_id:facility.id });
                                setIsOpenDeleteFacilityUnit(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ) : null // Mengembalikan null jika facility.name adalah null
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
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
      <UnitDialog isOpen={unitHomestayIsOpen} setIsOpen={setUnitHomestayIsOpen}
        id={params.id} onSave={handleNewUnitSaved}/>
      <FacilityUnitDialog isOpen={facilityUnitIsOpen} setIsOpen={setFacilityUnitIsOpen}
       id={params.id} onSave={handleFacilityUnitSaved} />
      <FacilityDialog isOpen={facilityIsOpen} setIsOpen={setFacilityIsOpen} onSave={handleNewFacilityUnitSaved}/>
      <EditUnitDialog isOpen={editUnitIsOpen} setIsOpen={setEditUnitIsOpen} 
        onSave={handleEditUnitSaved} selectedUnit={selectedUnit} id={params.id}/>
      <GalleriesDialog isOpen={galleriesIsOpen} setIsOpen={setGalleriesIsOpen} 
        selectedUnitGallery={selectedUnitGallery}/>
      <DeleteUnitDialog  isOpen={isOpenDeleteUnit}
        setIsOpen={setIsOpenDeleteUnit}
        rowDelete={rowDeleteUnit}
        onSuccessfulDelete={() => handleDeleteUnit(rowDeleteUnit.id)}
      />
      <DeleteUnitFacilityDialog  isOpen={isOpenDeleteFacilityUnit}
        setIsOpen={setIsOpenDeleteFacilityUnit}
        rowDelete={rowDeleteFacilityUnit}
        onSuccessfulDelete={() => handleDeleteFacility(rowDeleteFacilityUnit.facility_id, rowDeleteFacilityUnit.id)}
      />
    </>
  )
}