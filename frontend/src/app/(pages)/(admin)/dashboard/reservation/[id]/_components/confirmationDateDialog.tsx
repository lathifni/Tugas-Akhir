import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmation: (value: string) => void;
}

export default function ConfirmationDateDialog({ isOpen, setIsOpen, confirmation }: Props) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isRadioSelected, setIsRadioSelected] = useState(false);
  
  const saveButtonHandler = () => {
    if (selectedValue) {
      setIsOpen(!isOpen)
      confirmation(selectedValue)
    }
  }

  const handleRadioChange = (e:any) => {
    setSelectedValue(e.target.value);
    setIsRadioSelected(true); // Set state untuk menandakan bahwa radio button telah dipilih
  }

  return (
    <Dialog open={isOpen}>
      {/* <div className="px-10 py-2">
        <h1 className="text-3xl text-center font-bold">Confirmation Date Reservation</h1>
      </div> */}
      <h3 className="text-center ">Confirmation Date Reservation</h3>
      <DialogContent dividers>
        <div className="mx-28 flex justify-center">
          <RadioGroup value={selectedValue} onChange={handleRadioChange}>
            <FormControlLabel value="decline" control={<Radio />} label="Decline"/>
            <FormControlLabel value="accept" control={<Radio />} label="Accept" />
          </RadioGroup>
        </div>
      </DialogContent>
      <div className="text-center">
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-700" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
        <button 
          className={`px-4 py-1 m-4 text-white rounded-lg ${isRadioSelected ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`} 
          onClick={isRadioSelected ? saveButtonHandler : undefined} // Tombol "Save" hanya akan aktif jika radio button telah dipilih
          disabled={!isRadioSelected} // Menonaktifkan tombol jika radio button belum dipilih
        >
          <FontAwesomeIcon icon={faCheck} /> Save
        </button>
      </div>
    </Dialog>
  )
}