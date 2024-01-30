'use client'

import { useQuery } from "@tanstack/react-query"
import { fetchListAllBasePackage } from "../../api/fetchers/package"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faPlus, faSquarePlus } from "@fortawesome/free-solid-svg-icons"

export default function Package() {
  const { isError, isSuccess, isLoading, data, error } = useQuery({
    queryKey: ['listAllBasePackage'],
    queryFn: fetchListAllBasePackage
  })

  if (isLoading) return <p>Loading ...</p>
  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full p-5 mb-3 bg-white rounded-lg">
          <h1 className="text-xl font-semibold text-center">List Package</h1>
          <div className="flex flex-col items-center sm:items-start">
            <div className="w-fit p-2  bg-blue-500 hover:bg-blue-600 text-white rounded-lg" role="button">
              <FontAwesomeIcon icon={faPlus} /> Costum New Package
            </div>
            <div className="w-full">
              {data.map((item: { id:string, name: string, type_id: string, price: number, description: string, video_url: string, min_capacity: number }, index: number) => (
                <div key={index}>
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="bg-green-500 w-fit p-1 rounded-lg text-white">{item.type_id}</p>
                  <p>Rp{item.price}</p>
                  <p>Capacity: {item.min_capacity} people</p>
                  <p>
                    {item.description.slice(0, 140)}...
                    <a href={`/explore/package/${item.id}`} className="text-blue-500 hover:text-blue-800">Read more</a>
                  </p>
                  <div className="text-blue-500 mb-5">
                    <a href={`/explore/package/${item.id}`}>
                      <button className="p-2 border-solid border-2 m-1 border-blue-500 rounded-lg hover:text-blue-800">
                        <FontAwesomeIcon icon={faCircleInfo} /> More Info
                      </button>
                    </a>
                    <a href={`/explore/package/${item.id}`}>
                      <button className="p-2 border-solid border-2 m-1 border-blue-500 rounded-lg hover:text-blue-800">
                        <FontAwesomeIcon icon={faSquarePlus} /> Extend
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

}