import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newData: any) => void;
}

export default function CancelDialog({ isOpen, setIsOpen, onSave, }: Props) {
 const handleSave = () => {
    onSave({}); // Pass data to onSave function
    setIsOpen(false); // Close dialog
  };

  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }}>
      <h3 className="text-center mx-4">Cancel Submit</h3>
      <DialogContent dividers>
        <div className="flex justify-center m-4">
          <label className="font-semibold text-center">Are You sure cancel this reservation ?</label>
        </div>
      </DialogContent>
      <div className="text-center">
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" onClick={() => handleSave()}>
          <FontAwesomeIcon icon={faCheck} /> Yes, Cancel Reservation
        </button>
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> No, Keep Reservation
        </button>
      </div>
    </Dialog>
  )
}