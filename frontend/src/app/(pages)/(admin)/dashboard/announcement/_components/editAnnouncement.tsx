import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newFacility: any) => void;
  data: { id: string, id_gtp:string, description: string, status: string }
}

export default function EditAnnouncementDialog({ isOpen, setIsOpen, onSave, data }: Props) {
  const [error, setError] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<number>(0);

  useEffect(() => {
    if (data) {
      setDescription(data.description);
      setStatus(Number(data.status)); // Convert status to number if necessary
    }
  }, [data]);
  
  const handleSave = () => {
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }

    const updatedData = {
      id: data.id,
      id_gtp: data.id_gtp,
      description,
      status,
    };

    onSave(updatedData); // Send updated data to onSave
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }}>
      <h3 className="text-center mx-4">Edit Announcement</h3>
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
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " 
          placeholder="Write description here...">
        </textarea>
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