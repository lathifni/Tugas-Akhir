'use client'

import axios from 'axios';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Redirect() {
  const router = useRouter();
  const searchParams = useSearchParams ()
  const order_id = searchParams.get('order_id')
  
  useEffect(() => {
    const redirect = async() => {
      const res = await axios.get(`http://localhost:3000/reservation/callback/redirect?dp_id=${order_id}`)
      console.log(res.data.data);
      const idReservation = res.data.data.id
      
      router.push(`/explore/reservation/${idReservation}`)
    }
    redirect()
  }, [order_id]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-center text-xl">Redirecting you...</p>
    </div>
  );
}
