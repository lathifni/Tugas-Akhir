'use client'

import { fetchServiceById } from "@/app/(pages)/api/fetchers/package"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import EditDialogService from "./_components/editDialog"

export default function ServiceIdPage({ params }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['reservationbyId', params.id],
    queryFn: () => fetchServiceById(params.id),
    // staleTime: 10000
  })
  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 py-5 mb-3 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Detail Service Package Information</h1>
          <table className="w-full md:ml-5">
            <tbody>
              <tr>
                <td className="font-semibold">Name</td>
                <td>: {data.name}</td>
              </tr>
              <tr>
                <td className="font-semibold">Id</td>
                <td>: {data.id}</td>
              </tr>
              <tr>
                <td className="font-semibold">Price</td>
                <td>: {rupiah(data.price)}</td>
              </tr>
              <tr>
                <td className="font-semibold">Category</td>
                {data.category === 0 ? <td>: Group</td> : <td>: Individu</td>}
              </tr>
            </tbody>
          </table>
          <button className="px-3 py-2 bg-blue-500 rounded-lg text-white md:m-5 hover:bg-blue-700" onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faPenToSquare} /> Edit
          </button>
          <EditDialogService isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
        </div>
      </div>
    )
  }
}