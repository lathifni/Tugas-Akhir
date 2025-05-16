'use client'

import { useQuery } from "@tanstack/react-query"
import { fetchListAllBasePackage } from "../../api/fetchers/package"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faPenClip, faPlus, faSquarePlus } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Image from "next/image"
import MoonLoader from "react-spinners/MoonLoader"

export default function PackagePage() {
  const { isError, isSuccess, isLoading, data, error } = useQuery({
    queryKey: ['listAllBasePackage'],
    queryFn: fetchListAllBasePackage
  })

  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  if (isLoading) {
    return (
      <div className="w-full h-96 m-2 px-4 mb-2 bg-white rounded-lg flex flex-col items-center justify-center"> {/* Set height to center loader */}
        <MoonLoader color="#36d7b7" speedMultiplier={3} size={75} />
        <p className='mt-4'>Loading ...</p>
      </div>
    )
  }

  if (data) {
    return (
      <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-4">
        <div className="w-full h-full px-4 mb-2 bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-center">List Package</h1>
          <div className="flex flex-col items-center sm:items-start">
            <div className="w-fit p-2  bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-7" role="button">
              <Link href={`/explore/package/custom`}>
                <FontAwesomeIcon icon={faPlus} /> Custom New Package
              </Link>
            </div>
            <div className="w-full">
              {data.map((item: { id: string, name: string, type_name: string, price: number, cover_url: string, description: string, video_url: string, min_capacity: number }, index: number) => (
                <div key={index} className="flex flex-col lg:flex-row items-center mb-5">
                  <div className="relative mr-4 w-60 lg:w-96 xl:w-64">
                    {/* <Image src={`/photos/package/${item.cover_url}`} alt="foto" width={60}/> */}
                    <img src={`/photos/package/${item.cover_url}`} alt="foto" />
                  </div>
                  <div className="lg:w-4/6 mx-5 lg:mx-3">
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="bg-green-500 w-fit p-1 rounded-lg text-white">{item.type_name}</p>
                    <p>{rupiah(item.price)}</p>
                    <p>Capacity: {item.min_capacity} people</p>
                    <p className="text-justify">
                      {item.description.slice(0, 140)}...
                      <a href={`/explore/package/${item.id}`} className="text-blue-500 hover:text-blue-800">Read more</a>
                    </p>
                    <div className="text-blue-500 lg:mt-2">
                      <Link href={`/explore/package/${item.id}`}>
                        <button className="p-2 border-solid border-2 m-1 border-blue-500 rounded-lg hover:text-blue-800">
                          <FontAwesomeIcon icon={faCircleInfo} /> More Info
                        </button>
                      </Link>
                      <Link href={`/explore/package/${item.id}/extend`}>
                        <button className="p-2 border-solid border-2 m-1 border-blue-500 rounded-lg hover:text-blue-800">
                          <FontAwesomeIcon icon={faSquarePlus} /> Extend
                        </button>
                      </Link>
                      <Link href={`/explore/package/${item.id}/custom`}>
                        <button className="p-2 border-solid border-2 m-1 border-blue-500 rounded-lg hover:text-blue-800">
                          <FontAwesomeIcon icon={faPenClip} /> Custom
                        </button>
                      </Link>
                    </div>
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