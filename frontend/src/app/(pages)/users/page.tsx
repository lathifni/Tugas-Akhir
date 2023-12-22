'use client';

import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import useAxiosAuth from '@/libs/hooks/useAxiosAuth';
import { useSession } from 'next-auth/react';

interface User {
   id: number;
   email: string;
   username: string;
   fullname: string | null;
}

const UserPage: React.FC = () => {
   const [users, setUsers] = useState<User[]>([]);
   const axiosAuth = useAxiosAuth();
   const { data: session } = useSession()
   // console.log('di page users ', session?.user);
   
   useEffect(() => {
      const fetchData = async () => {
         try {
            const response: AxiosResponse<{ data: User[] }> = await axiosAuth.get('/users');
            setUsers(response.data.data);
         } catch (error) {
            console.error('Error fetching user data:', error);
         }
      };

      // Memeriksa apakah session telah diinisialisasi
      if (session) {
         fetchData();
      }
   }, [session, axiosAuth]); // Tambahkan session sebagai dependency

   if (!session) {
      return <div>Loading...</div>; // Atau tampilkan pesan lain saat session belum tersedia
   }
   return (
      <>
         <div>
            <ul>
               {users.map((user) => (
                  <li key={user.id}>
                     <p>Email: {user.email}</p>
                     <p>Username: {user.username}</p>
                     <p>Fullname: {user.fullname || 'N/A'}</p>
                  </li>
               ))}
            </ul>
         </div>
         {/* <div>
            <button onClick={fetchData}>Get User Posts</button>
            {users && JSON.stringify(users)}
         </div> */}
      </>
   );
};

export default UserPage;
