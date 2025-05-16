import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  gallery: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newData: any) => void;
}

export default function ReferralConfirmationDialog({ isOpen, setIsOpen, onSave, gallery, }: Props) {
  const [error, setError] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  
 const handleSave = () => {
  if (!selectedOption) {
    setError('Please select an option for the refund confirmation.');
    return;
  }

  const data = {
    status: selectedOption,
  };
    onSave(data); // Pass data to onSave function
    setIsOpen(false); // Close dialog
  };

  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }}>
      <h3 className="text-center mx-4">Referral Confirmation</h3>
      <DialogContent dividers>
        <div className="">
          <label className="block mt-2 text-sm font-medium text-gray-900">Confirmation Referral (Is the proof of refund correct?)</label>
          <RadioGroup
            row
            name="confirmation"
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setError(''); // Clear error when a selection is made
            }}
          >
            <FormControlLabel value="1" control={<Radio />} label={
              <span>
                <FontAwesomeIcon icon={faCheck} /> Correct
              </span>
            } />
            <FormControlLabel value="0" control={<Radio />} label={
              <span>
                <FontAwesomeIcon icon={faXmark} /> Incorrect
              </span>
            } />
          </RadioGroup>
        </div>
       <div className="mb-4">
          <label>Referral Proof</label>
          <div className="bg-gray-100 border-2 border-blue-500 border-dashed rounded-lg">
            <img className="p-8" src={`/photos/referral/${gallery}`} alt={gallery} />
          </div>
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