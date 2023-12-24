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
   const { isError, isSuccess, isLoading, data, error } = useQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
   })

   if (isSuccess && data) {
      // console.log(data);
      
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
