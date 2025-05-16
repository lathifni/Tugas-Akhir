import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newData: any) => void;
}

export default function AddAnnouncementDialog({ isOpen, setIsOpen, onSave, }: Props) {
  const [error, setError] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<number>(0);
  
  const handleSave = () => {
    if (!description.trim()) {
      setError('Please provide a description announcement.');
      return;
    }

    const data = {
      description,
      status,
    }
    onSave(data); // Kirim data ke onSave
    setIsOpen(false);    // Tutup dialog
  };

  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }}>
      <h3 className="text-center mx-4">Add New Announcement</h3>
      <DialogContent dividers>
      <div className="m-4">
          <label>Description</label>
          <textarea id="message" name='description' 
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError(''); // Hapus pesan kesalahan saat mengetik deskripsi
            }}
            rows={5}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write description here..."></textarea>
        </div>
        <div className="m-4">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>Not Active</option>
            <option value={1}>Active</option>
          </select>
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