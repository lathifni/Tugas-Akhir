import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useState } from "react";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataUser: any;
  onSave: (newFacility: any) => void;
}
const unitSchema = z.object({
  fullname: z.string().min(1, 'Full name cannot be empty'),
  address: z.string().min(1, 'Address cannot be empty'),
  phone: z.string().min(1, 'Phone cannot be empty'),
});

export default function EditProfileDialog ({ isOpen, setIsOpen, dataUser, onSave }: Props) {
  const [error, setError] = useState<string>('');
  const [formDataInput, setFormDataInput] = useState({
    fullname: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if(dataUser) {
      setFormDataInput({
        fullname: dataUser.fullname || "",
        address: dataUser.address || "",
        phone: dataUser.phone || "",
      });
      console.log(dataUser);
      
    }
  }, [dataUser])

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormDataInput({ ...formDataInput, [name]: value });
  };
  
  const handleSave = () => {
    const validation = unitSchema.safeParse({
      fullname: formDataInput.fullname,
      address: formDataInput.address,
      phone: formDataInput.phone,
    })
    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        setError(err.message);
      });
      return;
    }
    const data = {
      ...validation.data,
      id: dataUser.id
    };
    onSave(data)
    setIsOpen(false);
  }
  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "35%", maxWidth: "none" } }}>
      <h3 className="text-center ">Edit My Profile</h3>
      <DialogContent dividers>
        <div className="m-4">
          <label>Full Name</label>
          <input type="text" name='full_name'
          onChange={handleChange}
          value={formDataInput.fullname}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4">
          <label>Email</label>
          <input type="text" name='email'
          readOnly
          value={dataUser?.email}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4">
          <label>Address</label>
          <textarea name='address'
          onChange={handleChange}
          value={formDataInput.address}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4">
          <label>Phone</label>
          <input type="text" name='phone'
          onChange={handleChange}
          value={formDataInput.phone}
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