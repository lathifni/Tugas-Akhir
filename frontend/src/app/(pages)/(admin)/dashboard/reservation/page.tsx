'use client'

import { fetchAllReservation } from "@/app/(pages)/api/fetchers/reservation"
import { Columns } from "./_components/column";
import { useQuery } from "@tanstack/react-query"
import TableReservationAdmin from "./_components/table"
import React from "react";

export default function ReservationAdminPage () {
  const { data, error } = useQuery({
    queryKey: ['dataAllReservation'],
    queryFn: fetchAllReservation
  })

  const columns = React.useMemo(
    () => Columns(), []
  );

  console.log(data);
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Reservation</h1>
          <TableReservationAdmin columns={columns} data={data} />
        </div>
      </div>
    )
  }
}