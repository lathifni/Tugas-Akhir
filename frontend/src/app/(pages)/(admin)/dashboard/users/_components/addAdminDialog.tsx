import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newFacility: any) => void;
}
const unitSchema = z.object({
  username: z.string().min(1, 'Username cannot be empty'),
  full_name: z.string().min(1, 'Full name cannot be empty'),
  email: z.string().email('Invalid email address').min(1, 'Email cannot be empty'),
});

export default function AddAdminDialog({ isOpen, setIsOpen, onSave, }: Props) {
  const [error, setError] = useState<string>('');
  const [formDataInput, setFormDataInput] = useState({
    username: "",
    full_name: "",
    email: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormDataInput({ ...formDataInput, [name]: value });
  };
  
  const handleSave = () => {
    const validation = unitSchema.safeParse({
      username: formDataInput.username,
      full_name: formDataInput.full_name,
      email: formDataInput.email,
    })
    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        setError(err.message);
      });
      return;
    }
    const data = {
      ...validation.data,
    };
    onSave(data);
    setIsOpen(false);
  }
  return (
    <Dialog open={isOpen} maxWidth="lg" sx={{ "& .MuiDialog-paper": { width: "35%", maxWidth: "none" } }}>
      <h3 className="text-center mx-4">Add New Admin</h3>
      <DialogContent dividers>
        <div className="m-4">
          <label>Username</label>
          <input type="text" name='username'
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4">
          <label>Full Name</label>
          <input type="text" name='full_name'
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4">
          <label>Email</label>
          <input type="text" name='email'
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
        </div>
        <div className="m-4 text-gray-700">
          <p className="text-justify">
            <strong>*Note:</strong> The initial password for the admin account is <strong>@AdminGtp123</strong>. Please make sure to change it after the first login for security purposes.
          </p>
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