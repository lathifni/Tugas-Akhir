'use client'

import { fetchAllHomestay } from "@/app/(pages)/api/fetchers/homestay";
import { useQuery } from "@tanstack/react-query";
import { Columns } from "./_components/column";
import React from "react";
import TableHomestayAdmin from "./_components/table";

export default function HomestayAdmin () {
  const { data, error } = useQuery({
    queryKey: ['dataAllSouvenir'],
    queryFn: fetchAllHomestay
  })

  const columns = React.useMemo(
    () => Columns(), []
  );
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Reservation</h1>
          <TableHomestayAdmin columns={columns} data={data} />
        </div>
      </div>
    )
  }
}