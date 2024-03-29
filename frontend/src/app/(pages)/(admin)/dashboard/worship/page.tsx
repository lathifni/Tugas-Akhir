'use client'

import { fetchAllWorship } from "@/app/(pages)/api/fetchers/worhsip";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Columns } from "./_components/column";
import TableWorshipAdmin from "./_components/table";

export default function WorshipAdmin() {
  const { data, error } = useQuery({
    queryKey: ['dataAllWorship'],
    queryFn: fetchAllWorship
  })

  const columns = React.useMemo(
    () => Columns(), []
  );
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Reservation</h1>
          <TableWorshipAdmin columns={columns} data={data} />
        </div>
      </div>
    )
  }
}