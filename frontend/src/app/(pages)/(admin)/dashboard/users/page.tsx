'use client'

import { fetchAllAdmin, fetchAllCostumer } from "@/app/(pages)/api/fetchers/users"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import React from "react";
import { Columns } from "./_components/column";
import TableUsers from "./_components/table";

interface dataUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
}

export default function Users() {
  const [selectedTable, setSelectedTable] = useState<'admin' | 'customer'>('admin');
  const [dataTable, setDataTable] = useState<dataUser[]>([]);
  const [dataTableAdmin, setDataTableAdmin] = useState<dataUser[]>([])
  const { data: dataAllAdmin, error: errorDataAllAdmin } = useQuery({
    queryKey: ['dataAllAdmin'],
    queryFn: fetchAllAdmin
  })
  const { data: dataAllCostumer, error: errorDataAllCostumer } = useQuery({
    queryKey: ['dataAllCostumer'],
    queryFn: fetchAllCostumer
  })

  const columns = React.useMemo(
    () => Columns(), []
  );

  const handleTableSelect = (type: 'admin' | 'customer') => {
    setSelectedTable(type);
    setDataTable(type === 'admin' ? dataAllAdmin : dataAllCostumer);
  };

  if (dataAllCostumer && dataAllAdmin) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Manage Users</h1>
          <div className="flex justify-start m-3">
            <button className={`mr-2 ${selectedTable === 'admin' ? 'p-2 bg-blue-500 text-white rounded-lg' : 'p-1 bg-gray-200 text-black'}`}
            onClick={() => handleTableSelect('admin')}>Admin Account</button>
            <button className={`ml-2 ${selectedTable === 'customer' ? 'p-2 bg-blue-500 text-white rounded-lg' : 'p-1 bg-gray-200 text-black'}`}
            onClick={() => handleTableSelect('customer')}>Customer Account</button>
          </div>
          {dataTable.length == 0 ? (
            <TableUsers columns={columns} data={dataAllAdmin} />
          ) : (
            <TableUsers columns={columns} data={dataTable} />
          )}
        </div>
      </div>
    )
  }
}