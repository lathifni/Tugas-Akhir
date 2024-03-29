import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowDelete: { name: string, id: string };
  setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: string; } | null>>;
}

export default function DeleteDialogFacility({ isOpen, setIsOpen, rowDelete, setNotification }: Props) {

  const handleDelete = () => {
    // useAxiosAuth.delete(`/package/service/${rowDelete.id}`)
    // .then((res) => {
    //   setIsOpen(!isOpen)
    //   setNotification({ message: `Success delete data id ${rowDelete.name}`, type: 'success' });
    // })
    // .catch((error) => {
    //   console.log(error);
    //   setNotification({ message: `Failed delete data`, type: 'error' });
    // })
  }

  return (
    <Dialog open={isOpen}>
      <div className="px-10 py-2">
        <h1 className="text-3xl text-center font-bold">Confirmation Delete</h1>
        <p>
          Are you sure to delete data <strong>{rowDelete.name}</strong> id <strong>{rowDelete.id}</strong> ?
        </p>
      </div>
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