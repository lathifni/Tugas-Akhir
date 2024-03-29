'use client'

import { fetchAllPackage } from "@/app/(pages)/api/fetchers/package";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Columns } from "./_components/column";
import TablePackageAdmin from "./_components/table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PackageAdmin() {
  const { data, error } = useQuery({
    queryKey: ['dataAllPackage'],
    queryFn: fetchAllPackage
  })

  const columns = React.useMemo(
    () => Columns(), []
  );
  
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Package</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4 hover:bg-blue-700 mr-8">
              <FontAwesomeIcon icon={faPlus} /> New Service
            </button>
          <TablePackageAdmin columns={columns} data={data} />
        </div>
      </div>
    )
  }
}