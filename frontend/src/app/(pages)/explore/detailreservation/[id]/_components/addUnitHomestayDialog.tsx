import { fetchAvailableHomestay } from "@/app/(pages)/api/fetchers/homestay";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: string; } | null>>;
  onAddHomestay: (homestay: ListHomestay) => void;
  checkin_date: Date;
  max_day: number;
}

interface ListHomestay {
  id: string;
  capacity: number;
  nama_unit: string;
  unit_type: string;
  price: number;
  unit_number: string;
  name: string;
}

export default function AddUnitHomestayDialog({ isOpen, setIsOpen, checkin_date, max_day, onAddHomestay }: Props) {
  const [listHomestay, setListHomestay] = useState<ListHomestay[]>([])
  const [selectedHomestay, setSelectedHomestay] = useState<ListHomestay | null>(null);

  const { data: dataAvailableHomestay, isLoading: loadingAvailableHomestay } = useQuery({
    queryKey: ['availableHomestay'],
    queryFn: () => fetchAvailableHomestay(checkin_date, max_day),
    refetchOnWindowFocus: false
    // staleTime: 10000
  })  

  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  useEffect(() => {
    if (dataAvailableHomestay) {
      setListHomestay(dataAvailableHomestay);
    }
  }, [dataAvailableHomestay]);

  const handleSelectHomestay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnitNumber = e.target.value;
    
    const homestay = listHomestay.find(h => h.unit_number === selectedUnitNumber);
    if (homestay) {
      setSelectedHomestay(homestay);
    }
  };

  const handleAddClick = () => {
    if (selectedHomestay) {
      onAddHomestay(selectedHomestay);
      
      // setListHomestay(prev => prev.filter(h => h.unit_number !== selectedHomestay.unit_number));
      setSelectedHomestay(null);
      setIsOpen(false);
    }
  };
  
  return (
    <Dialog open={isOpen}>
      <div className="px-4 w-full">
        <h1 className="text-3xl text-center font-bold">Add Unit Homestay</h1>
        <hr className="border-t-1 border-gray-300" />
        <label className="block mt-2 text-sm font-medium text-gray-900 ">Unit Homestay</label>
        <select
          name="homestay"
          className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={handleSelectHomestay}
        >
          <option value="">Please choose unit</option>
          {loadingAvailableHomestay ? (
            <option>Loading...</option>
          ) : (
            dataAvailableHomestay?.map((homestay: any) => (
              <option key={homestay.unit_number} value={homestay.unit_number}>
                {homestay.name} {homestay.nama_unit}-{homestay.unit_number} (Capacity: {homestay.capacity}, {rupiah(homestay.price)})
              </option>
            ))
          )}
        </select>
        <hr className="border-t-1 border-gray-300" />
        <div className="flex m-4 justify-end gap-4">
          <button className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white" onClick={() => setIsOpen(!isOpen)}>Cancel</button>
          <button className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white" onClick={handleAddClick}><FontAwesomeIcon icon={faAdd} /> Add</button>
        </div>
      </div>
    </Dialog>
  )
}