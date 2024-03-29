'use client'

import { fetchAllSouvenir } from "@/app/(pages)/api/fetchers/souvenir";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Columns } from "./_components/column";
import TableSouvenirAdmin from "./_components/table";

export default function Souvenir () {
  const { data, error } = useQuery({
    queryKey: ['dataAllSouvenir'],
    queryFn: fetchAllSouvenir
  })

  const columns = React.useMemo(
    () => Columns(), []
  );
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Reservation</h1>
          <TableSouvenirAdmin columns={columns} data={data} />
        </div>
      </div>
    )
  }
}