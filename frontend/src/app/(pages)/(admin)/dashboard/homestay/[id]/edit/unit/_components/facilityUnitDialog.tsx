import { fetchAllFacilityUnit, fetchHomestayUnitById } from "@/app/(pages)/api/fetchers/homestay";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  onSave: (newFacility: any) => void;
  // data: { id: string, name: string, price: number, category: number }
}

export default function FacilityUnitDialog({ isOpen, setIsOpen, id, onSave, }: Props) {
  const [unitHomestay, setUnitHomestay] = useState<string>('')
  const [facilityUnit, setFacilityUnit] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [error, setError] = useState<string>('');
  
  const { data:allFacilityUnit, isLoading } = useQuery({
    queryKey: ['allFacilityUnit',],
    queryFn: () => fetchAllFacilityUnit(),
    // staleTime: 10000
  })
  const { data:dataUnitHomestay, isLoading:isLoadingUnitHomestay } = useQuery({
    queryKey: ['allHomestayUnitById',],
    queryFn: () => fetchHomestayUnitById(id),
    // staleTime: 10000
  })  

  const handleSave = () => {
    if (!unitHomestay) {
      setError('Please choose unit homestay');
      return;
    }
    if (!facilityUnit) {
      setError('Please choose facility unit');
      return;
    }
    if (!description) {
      setError('Please provide a description.');
      return;
    }
    
    const newFacilityUnit = { 
      idUnitHomestay: unitHomestay,
      idFacilityUnit: facilityUnit,
      description: description,
    };

    onSave(newFacilityUnit);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <h3 className="text-center ">Facility Unit Homestay</h3>
      <DialogContent dividers>
        <div className="m-4">
          <label>Unit Homestay</label>
          {dataUnitHomestay ? (
          <select
            name="unit_homestay"
            value={unitHomestay}
            onChange={(e) => {
              setUnitHomestay(e.target.value);
              setError(''); // Hapus pesan kesalahan saat memilih
            }}
            className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Please choose</option>
            {dataUnitHomestay.units.map((data: { unit_number:string; unit_name: string }) => (
              <option key={data.unit_number} value={data.unit_number}>
                Room {data.unit_number} {data.unit_name}
              </option>
            ))}
          </select>
          ) : (
            <input type="text" readOnly placeholder="Loading ..." className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
          )}
        </div>
        <div className="m-4">
          <label>Facility Unit</label>
          {allFacilityUnit ? (
          <select
            name="facility_unit"
            value={facilityUnit}
            onChange={(e) => {
              setFacilityUnit(e.target.value);
              setError(''); // Hapus pesan kesalahan saat memilih
            }}
            className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Please choose</option>
            {allFacilityUnit.map((data: { id: string; name: string }) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </select>
          ) : (
            <input type="text" readOnly placeholder="Loading ..." className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
          )}
        </div>
        <div className="m-4">
          <label>Description</label>
          <textarea id="message" name='description'
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError(''); // Hapus pesan kesalahan saat mengetik deskripsi
          }}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write description here..."></textarea>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </DialogContent>
      <div className="text-center">
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" onClick={handleSave}>
          <FontAwesomeIcon icon={faCheck} /> Save
        </button>
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
      </div>
    </Dialog>
  )
}