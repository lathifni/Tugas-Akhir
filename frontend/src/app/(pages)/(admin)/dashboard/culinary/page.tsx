'use client'

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Columns } from "./_components/column";
import TableCulinaryAdmin from "./_components/table";
import { fetchAllCulinary } from "@/app/(pages)/api/fetchers/culinary";

export default function CulinaryAdmin () {
  const { data, error } = useQuery({
    queryKey: ['dataAllCulinary'],
    queryFn: fetchAllCulinary
  })

  const columns = React.useMemo(
    () => Columns(), []
  );
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Reservation</h1>
          <TableCulinaryAdmin columns={columns} data={data} />
        </div>
      </div>
    )
  }
}