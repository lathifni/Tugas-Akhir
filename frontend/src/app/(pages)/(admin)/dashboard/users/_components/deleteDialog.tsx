import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowDelete: any;
  onDelete: (id: string) => void;
}

export default function DeleteDialog({ isOpen, setIsOpen, rowDelete, onDelete, }: Props) {
  const handleDelete = async () => {
    if (rowDelete?.id) {
      onDelete(rowDelete.id);  // Perform delete action
      setIsOpen(false);  // Close the dialog after delete
    }
  };
  
  return (
    <Dialog open={isOpen}>
      <h3 className="text-center mx-4">Confirmation Delete</h3>
      <DialogContent dividers>
        <p>
          Are you sure to delete data <strong>{rowDelete?.fullname}</strong> id <strong>{rowDelete?.id}</strong> ?
        </p>
      </DialogContent>
        <div className="text-center">
          <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
          <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faXmark} /> Cancel
          </button>
        </div>
    </Dialog>
  )
}