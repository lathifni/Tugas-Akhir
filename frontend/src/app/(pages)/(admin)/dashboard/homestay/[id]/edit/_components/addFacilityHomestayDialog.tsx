import { fetchAllHomestayFacility } from "@/app/(pages)/api/fetchers/homestay";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newFacility: any) => void;
  // data: { id: string, name: string, price: number, category: number }
}

export default function AddFacilityHomestayDialog({ isOpen, setIsOpen, onSave, }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['allHomestayFacility',],
    queryFn: () => fetchAllHomestayFacility(),
    // staleTime: 10000
  })
  
  const [facilityId, setFacilityId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>(''); // State untuk validasi

  // Fungsi untuk menyimpan data baru
  const handleSave = () => {
    // Validasi input
    if (!facilityId) {
      setError('Please select a facility.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }

    const newFacility = {
      id_facility: facilityId,         // Mengambil id dari select facility_homestay
      description: description // Mengambil deskripsi dari textarea
    };

    onSave(newFacility); // Kirim data ke onSave
    setIsOpen(false);    // Tutup dialog
  };

  return (
    <Dialog open={isOpen}>
      <h3 className="text-center mx-4">Add New Facility Homestay</h3>
      <DialogContent dividers>
        <div className="m-4">
          <label>Facility Homestay</label>
          {data ? (
          <select
            name="facility_homestay"
            value={facilityId}
            onChange={(e) => {
              setFacilityId(e.target.value);
              setError(''); // Hapus pesan kesalahan saat memilih
            }}
            className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Please choose</option>
            {data.map((data: { id: string; name: string }) => (
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
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" onClick={() => handleSave()}>
          <FontAwesomeIcon icon={faCheck} /> Save
        </button>
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
      </div>
    </Dialog>
  )
}