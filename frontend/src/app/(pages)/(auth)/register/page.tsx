'use client'

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@mui/material/TextField";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validasi di sini sebelum mengirim data ke backend
    console.log(formData);
  };
  return (
    <div className="bg-white shadow-lg rounded-lg m-8">
      <h1 className="text-center text-2xl font-bold p-8">Register Form</h1>
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit}>
          <TextField id="outlined-basic" label="Full Name" variant="outlined" required/> <br />
          <TextField id="outlined-basic" label="User Name" variant="outlined" required/> <br />
          <TextField id="outlined-basic" label="Email" variant="outlined" required/> <br />
          <TextField id="outlined-basic" label="Address" variant="outlined" required/> <br />
          <TextField id="outlined-basic" label="Phone" variant="outlined" required/> <br />
          <TextField id="outlined-basic" label="Password" variant="outlined" type="password" required/> <br />
          <TextField id="outlined-basic" label="Confirm Password" variant="outlined" type="password" required/> <br />
          <button className="px-4 py-1 m-4 text-white rounded-lg bg-blue-500 hover:bg-green-400" type="submit">
            <FontAwesomeIcon icon={faCheck} /> Register
          </button>
        </form>
      </div>
    </div>
  )
}