'use client'

import { useSession } from "next-auth/react"
import { Columns } from "./_components/column";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllReferralByUserId } from "../../api/fetchers/referral";
import Link from "next/link";
import TableReferralExplore from "./_components/table";

export default function ExploreReferralPage() {
  const { data: session, status, update } = useSession()

  const { data, error, isLoading } = useQuery({
    queryKey: ['dataAllReferral'],
    queryFn: () => fetchAllReferralByUserId((session!.user.user_id).toString()),
    enabled: !!session
  })
  console.log(data);
  

  const columns = React.useMemo(
    () => Columns(), []   
  );
  
  if (isLoading) return <p className="text-center">Loading ...</p>
  if (data !== undefined && data.length === 0) {    
    return (
      <div className="flex flex-col justify-center items-center h-full">
         <p className="text-center text-xl">No referrals found linked to your account at this time.</p>
        <Link href={"/explore/package"} passHref>
          <p className="hover:text-blue-500 text-lg">Make a new reservation</p>
        </Link>
      </div>
    );
  }

  if (data != undefined) {
    return (
      <div className="flex flex-col m-1 sm:m-2 lg:m-4">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className='text-xl font-bold text-center mb-4'>List My All Referrals</h1>
          <TableReferralExplore columns={columns} data={data} />
        </div>
      </div>
    )
  }
}