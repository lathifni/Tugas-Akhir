'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  // State untuk menyimpan data login
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter()

  // Function untuk meng-handle submit form login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        emailOrUsername,
        password,
      }, { withCredentials: true });

      // Proses response atau tindakan setelah login berhasil
      console.log('Login berhasil:', response.data);
      // router.push('/users')
    } catch (error) {
      // Proses error atau tindakan jika login gagal
      console.error('Login gagal:', error);
    }
  }; 

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailOrUsername">Username:</label>
          <input
            type="text"
            id="emailOrUsername"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}