'use client';

import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import useAxiosAuth from '@/libs/hooks/useAxiosAuthBackup';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/fetchers/users';

interface User {
   id: number;
   email: string;
   username: string;
   fullname: string | null;
}

const UserPage: React.FC = () => {
   // const [users, setUsers] = useState<User[]>([]);
   // const axiosAuth = useAxiosAuth();
   // const { data: session, update } = useSession()
   
   // useEffect(() => {
   //    const fetchData = async () => {
   //       try {
   //          const response: AxiosResponse<{ data: User[] }> = await axiosAuth.get('/users');
   //          setUsers(response.data.data);
   //       } catch (error) {
   //          console.error('Error fetching user data:', error);
   //       }
   //    };
   //    if (session) {
   //       fetchData();
   //    }
   // }, [update]); // Tambahkan session sebagai dependency

   // if (!session) {
   //    return <div>Loading...</div>; // Atau tampilkan pesan lain saat session belum tersedia
   // }
   const { isError, isSuccess, isLoading, data, error } = useQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
   })

   if (isSuccess && data) {
      return (
         <>
            <div>
               <ul>
                  {data.map((user: User) => (
                     <li key={user.id}>
                        <p>Email: {user.email}</p>
                        <p>Username: {user.username}</p>
                        <p>Fullname: {user.fullname || 'N/A'}</p>
                     </li>
                  ))}
               </ul>
            </div>
         </>
      );
   }
   return <div>Loading ...</div>
};

export default UserPage;
