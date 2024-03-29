import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: string; } | null>>;
}

export default function AddDialogiSerice({ isOpen, setIsOpen, setNotification }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: ""
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.category) {
      setNotification({ message: 'Please fill in all fields.', type: 'error' });
      return; // Menghentikan proses pengiriman formulir jika ada field yang kosong
    }
    useAxiosAuth.post('/package/service', formData)
      .then((res) => {
        setNotification({ message:`Success to add new data (${formData.name})`, type: 'success'})
      })
      .catch((error) => {
        console.log(error);
        setNotification({ message:`Failed to add data`, type: 'error'})
      })
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen}>
      <div className="px-10 py-2">
        <h1 className="text-3xl text-center font-bold">Add Service</h1>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-900 ">Name</label>
          <input type="text" name='name' onChange={handleChange}
          className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-900 ">Price</label>
          <input type="number" name='price' onChange={handleChange}
          className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-900"  onChange={handleChange}>Category</label>
          <RadioGroup row onChange={handleChange} name="category">
            <FormControlLabel value="0" control={<Radio />} label="Group" />
            <FormControlLabel value="1" control={<Radio />} label="Individu" />
          </RadioGroup>
        </div>
      </div>
      <div className="text-center">
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" onClick={handleSubmit}>
          <FontAwesomeIcon icon={faCheck} /> Submit
        </button>
        <button className="px-4 py-1 m-4 text-white rounded-lg bg-red-500 hover:bg-red-400" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
      </div>
    </Dialog>
  )
}