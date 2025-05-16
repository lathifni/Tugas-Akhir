import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newFacility: any) => void;
  // data: { id: string, name: string, price: number, category: number }
}

export default function FacilityDialog({ isOpen, setIsOpen, onSave, }: Props) {
  const [facilityName, setFacilityName] = useState<string>('')
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    if (!facilityName) {
      setError('Please fill facility name.');
      return;
    }
    const newFacility = { 
      name: facilityName,
    };

    onSave(newFacility);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <h3 className="text-center mx-4">New Facility Unit Homestay</h3>
      <DialogContent dividers>
        <div className="m-4">
          <label>Facility Name</label>
          <input type="text" name='facility_name'
           onChange={(e) => {
            setFacilityName(e.target.value)
            setError('');
          }} 
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
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