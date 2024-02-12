'use client'

import { fetchListAllServicePackageById, fetchPackageActivityById, fetchPackageById } from "@/app/(pages)/api/fetchers/package"
import { useQuery } from "@tanstack/react-query"
import { ClipLoader } from "react-spinners"
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { types } from "util"

interface PackageActivity {
  package_id: string;
  object_id: string;
  description: string;
  day: number;
  activity_type: string;
  activity_name: string;
  activity_lng: string;
  activity_lat: string;
  activity: string;
  canDelete: number;
}

interface PackageService {
  category: number;
  id: string;
  name: string;
  package_id: string;
  price: number;
  service_package_id: string;
  status: number;
  canDelete: number;
}

export default function ExtendIdPage({ params }: any) {
  const { data: session, status, update } = useSession()
  const [packageActivities, setPackageActivities] = useState<PackageActivity[]>([]);
  const [packageService, setPackageService] = useState<PackageService[]>([])
  const [maxDay, setMaxDay] = useState(0);
  const [maxDayPackage, setMaxDayPackage] = useState(0);
  const { data: dataPackageActivityById, isLoading: loadingPackageActivity } = useQuery({
    queryKey: ['packageActivity', params.id],
    queryFn: () => fetchPackageActivityById(params.id)
  })
  const { data: dataListAllServicePackageById, isLoading: loadingListAllServicePackageById } = useQuery({
    queryKey: ['listAllServicePackageById', params.id],
    queryFn: () => fetchListAllServicePackageById(params.id)
  })
  const { data: dataPackageById, isLoading: loadingPackageById } = useQuery({
    queryKey: ['PackageById', params.id],
    queryFn: () => fetchPackageById(params.id)
  })
  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  const handleAddDay = () => {
    const newDay = maxDay + 1
    setMaxDay(newDay)
    // Set initial activities for the new day, or leave it empty if desired
    const newActivities = [{
      package_id: `${params.id}`,
      object_id: 'object',
      description: 'description',
      day: newDay,
      activity_type: 'EV',
      activity_name: 'name test dulu',
      activity_lng: '0',
      activity_lat: '000',
      activity: '1',
      canDelete: 1
    }];
    console.log(newActivities);

    setPackageActivities([...packageActivities, ...newActivities]);
  };

  const handleAddActivities = (days: number) => {
    let maxActivities: number = 0;
    packageActivities.forEach(activities => {
      if (activities.day === days) {
        const activityInt = parseInt(activities.activity); // Konversi string ke integer
        if (activityInt > maxActivities) {
          maxActivities = activityInt;
        }
      }
    });
    const newActivity = maxActivities + 1;
    const newActivities = [{
      package_id: `${params.id}`,
      object_id: 'object',
      description: 'description',
      day: days,
      activity_type: 'EV',
      activity_name: 'name test dulu',
      activity_lng: '0',
      activity_lat: '000',
      activity: newActivity.toString(),
      canDelete: 1
    }];
    setPackageActivities([...packageActivities, ...newActivities]);
  }

  const handleRemoveActivites = (activityId: string) => {
    const updatedActivities = packageActivities.filter(activity => activity.activity !== activityId);
    // Setel ulang state packageActivities dengan array yang telah diperbarui
    setPackageActivities(updatedActivities);
  }


  const handleAddService = () => {
    const newDay = maxDay + 1
    setMaxDay(newDay)
    // Set initial activities for the new day, or leave it empty if desired
    const newService = [{
      category: 1,
      id: "S12",
      name: "Guide",
      package_id: "P0014",
      price: 100000,
      service_package_id: "S01",
      status: 1,
      canDelete: 1,
    }];
    console.log(newService);

    setPackageService([...packageService, ...newService]);
  };

  const handleRemoveService = (id: string) => {
    console.log(id);

  }

  const handleAddNonService = () => {
    const newDay = maxDay + 1
    setMaxDay(newDay)
    // Set initial activities for the new day, or leave it empty if desired
    const newNonService = [{
      category: 1,
      id: "S11",
      name: "Guide",
      package_id: "P0014",
      price: 100000,
      service_package_id: "S01",
      status: 0,
      canDelete: 1,
    }];
    console.log(newNonService);

    setPackageService([...packageService, ...newNonService]);
  };

  const handleRemoveNonService = (id: string) => {
    console.log(id);

  }

  useEffect(() => {
    if (dataPackageActivityById && dataPackageById && dataListAllServicePackageById) {
      const initialPackageActivities = dataPackageActivityById.map((activity: any) => ({
        ...activity,
        canDelete: 0 // Set canDelete to 0 initially
      }));
      const initialPackageServices = dataListAllServicePackageById.map((service: any) => ({
        ...service,
        canDelete: 0 // Set canDelete to 0 initially
      }))
      // setPackageActivities(dataPackageActivityById);
      setPackageActivities(initialPackageActivities);
      setMaxDay(dataPackageById[0].max_day)
      setMaxDayPackage(dataPackageById[0].max_day)
      setPackageService(initialPackageServices)
    }
  }, [dataPackageActivityById, dataPackageById, dataListAllServicePackageById]);

  if (dataPackageActivityById && dataListAllServicePackageById && dataPackageById && session) {
    console.log(dataListAllServicePackageById);

    const currentTime = new Date();
    const formattedDate = currentTime.toISOString().slice(0, 19).replace('T', ' ');
    const extendPackageName = `${dataPackageById[0].name} extend by ${session.user.name} at ${formattedDate}`
    return (
      <div className="flex flex-col m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 ">
          <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
            <h1 className="text-center text-xl font-semibold">Extend Package</h1>
            <table className="w-full mt-5">
              <tbody>
                <tr className="w-fit">
                  <td className="font-semibold w-80 whitespace-no-wrap">Name</td>
                  <td className="font-normal">{extendPackageName}</td>
                </tr>
                <tr className="w-fit">
                  <td className="font-semibold w-80 whitespace-no-wrap">Package Base</td>
                  <td className="font-normal">{dataPackageById[0].name}</td>
                </tr>
                <tr>
                  <td className="font-semibold w-80 whitespace-no-wrap">Package Type</td>
                  <td className="font-normal">{dataPackageById[0].type_name}</td>
                </tr>
                <tr>
                  <td className="font-semibold w-80 whitespace-no-wrap">Minimal Capacity</td>
                  <td className="font-normal">{dataPackageById[0].min_capacity} people</td>
                </tr>
                <tr>
                  <td className="font-semibold w-80 whitespace-no-wrap">Contact Person</td>
                  <td className="font-normal">{dataPackageById[0].contact_person}</td>
                </tr>
                <tr>
                  <td className="font-semibold w-80 whitespace-no-wrap">Price Total</td>
                  <td className="font-normal">{rupiah(dataPackageById[0].price)}
                    <span className="italic text-slate-600"> *Based on the activities and services added</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row ">
          <div className="w-full h-full px-1 xl:w-7/12">
            <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
              <h2 className="text-center text-lg font-semibold">Detail Package</h2>
              <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleAddDay}>
                <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" /> <p>Day</p>
              </button>
              {dataPackageActivityById && (
                <div>
                  {Array.from(new Set(packageActivities.map((activity: { day: number }) => activity.day)))
                    .sort((a, b) => (a as number) - (b as number))// Mengurutkan hari-hari secara numerik
                    .map((day, dayIndex) => (
                      <div key={dayIndex} className="mb-3">
                        <div className="flex justify-between border-t pt-3">
                          <h2 className="text-lg font-semibold">Day {dayIndex + 1}</h2>
                          {dayIndex + 1 > maxDayPackage ? (
                            <button className="border-solid border-2 border-red-500 rounded-lg text-red-500 px-2 py-1 hover:text-white hover:bg-red-500" >
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          ) : null}
                        </div>
                        <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white"
                          onClick={() => handleAddActivities(day)}>
                          <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" /> <p>Activities</p>
                        </button>
                        <p>This is list daily cultural activity</p>
                        {/* Menampilkan aktivitas untuk setiap hari */}
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th>Object</th>
                              <th>Description</th>
                              <th>Price</th>
                              <th>Category</th>
                              <th className="w-1">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {packageActivities
                              .filter((activity: { day: number }) => activity.day === day)
                              .map((activity, index: number) => (
                                <tr key={index} className="mb-1">
                                  <td>{activity.activity}. {activity.activity_name}</td>
                                  <td>{activity.description}</td>
                                  <td>Rp</td>
                                  <td>Category</td>
                                  {activity.canDelete == 1 ? (
                                    <td className="flex justify-center items-center">
                                      <button className="border-solid border-2 border-red-500 rounded-lg text-red-500 px-2 py-1 hover:text-white hover:bg-red-500"
                                        onClick={() => handleRemoveActivites(activity.activity)}>
                                        <FontAwesomeIcon icon={faXmark} />
                                      </button>
                                    </td>
                                  ) : null}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-full px-1 xl:w-5/12">
            <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
              <h2 className="text-center text-lg font-semibold">Service Package</h2>
              <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleAddService}>
                <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" /> <p>Service Package</p>
              </button>
              {dataListAllServicePackageById && (
                <div>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th className="w-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataListAllServicePackageById && packageService.map((service, index: number) => (
                        service.status === 1 && (
                          <tr key={index} className="mb-1">
                            <td>{service.name}</td>
                            <td>{rupiah(service.price)}</td>
                            {service.category == 1 ? (
                              <td>Group</td>
                            ) :
                              <td>Individu</td>
                            }
                            {service.canDelete == 1 ? (
                              <td className="flex justify-center items-center">
                                <button className="border-solid border-2 border-red-500 rounded-lg text-red-500 px-2 py-1 hover:text-white hover:bg-red-500"
                                  onClick={() => handleRemoveService(service.id)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                              </td>
                            ) : null}
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <br />
              <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleAddNonService}>
                <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" /> <p>Non-service Package</p>
              </button>
              {dataListAllServicePackageById && (
                <div>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th className="w-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataListAllServicePackageById && packageService.map((service, index: number) => (
                        service.status === 0 && (
                          <tr key={index} className="mb-1">
                            <td>{service.name}</td>
                            {service.canDelete == 1 ? (
                              <td className="flex justify-center items-center">
                                <button className="border-solid border-2 border-red-500 rounded-lg text-red-500 px-2 py-1 hover:text-white hover:bg-red-500"
                                  onClick={() => handleRemoveNonService(service.id)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                              </td>
                            ) : null}
                          </tr>
                        )))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <ClipLoader color="#36d7b7" speedMultiplier={3} />
    </div>
  )
}