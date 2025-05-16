import FileInput from "@/components/fileInput";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newData: any) => void;
  account_refund: string
}
interface Image {
  name: string;
  url: string;
  file: File;
}

export default function RefundProofDialog({ isOpen, setIsOpen, onSave, account_refund }: Props) {
  const [error, setError] = useState<string>('');
  const [gallery, setGallery] = useState<Image[]>([]);
  
 const handleSave = () => {
    // Validate input fields
    if (gallery.length == 0) {
      return setError('Please provide a image refund proof.');
    }

    const data = {
      gallery
    };

    onSave(data); // Pass data to onSave function
    setIsOpen(false); // Close dialog
  };

  const handleGalleryChange = (newGallery: any) => {
    setGallery(newGallery);
  }

  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }}>
      <h3 className="text-center mx-4">Submit Proof Refund</h3>
      <DialogContent dividers>
      <div className="mx-8">
        <label>Account Refund</label>
        <div 
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        >
          {account_refund}
        </div>
      </div>
        <div className="px-8">
          <label className="block mt-2 font-medium text-gray-900">Refund Proof</label>
          <FileInput fileType={"image"} onGalleryChange={handleGalleryChange} />
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