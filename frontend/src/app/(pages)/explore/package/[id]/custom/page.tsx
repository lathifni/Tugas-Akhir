'use client'

import { fetchListAllService, fetchListAllServicePackageById, fetchListDayPackageById, fetchPackageActivityById, fetchPackageById } from "@/app/(pages)/api/fetchers/package"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ClipLoader } from "react-spinners"
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartPlus, faCheck, faPencil, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from "@mui/material"
import { fetchListAllObject } from "@/app/(pages)/api/fetchers/gtp"
import Link from "next/link"
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth"
import { useRouter } from 'next/navigation';

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
  price: number;
  category: string;
}

interface PackageService {
  category: number;
  id: string;
  name: string;
  package_id: string;
  price: number;
  service_package_id: string;
  status: number;
}

interface PackageDay {
  package_id: string;
  day: string;
  description: string;
}

export default function CustomIdPage({ params }: any) {
  const { data: session, status, update } = useSession()
  const [packageActivities, setPackageActivities] = useState<PackageActivity[]>([]);
  const [packageService, setPackageService] = useState<PackageService[]>([])
  const [packageDay, setPackageDay] = useState<PackageDay[]>([])
  const [maxDay, setMaxDay] = useState(0);
  const [maxDayPackage, setMaxDayPackage] = useState(0);
  const [addActivitiesOpen, setAddActivitiesOpen] = useState(false)
  const [addDayOpen, setAddDayOpen] = useState(false)
  const [addServiceOpen, setAddServiceOpen] = useState(false)
  const [bookingPackage, setBookingPackage] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false)
  const [fieldAcitivityType, setFieldAcitivityType] = useState('')
  const [selectedObject, setSelectedObject] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedAddDayActivities, setSelectedAddDayActivities] = useState(0)
  const [typeService, setTypeService] = useState(0)
  const [priceTotal, setPriceTotal] = useState(0)
  const [descriptionNewActivites, setDescriptionNewActivities] = useState('')
  const [descriptionNewDay, setDescriptionNewDay] = useState('')
  const router = useRouter();

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
  const { data: dataListAllObject, isLoading: loadingListAllObject } = useQuery({
    queryKey: ['listAllObject'],
    queryFn: () => fetchListAllObject()
  })
  const { data: dataListAllDayPackageById, isLoading: loadingDayPackage } = useQuery({
    queryKey: ['listAllDayPackageById', params.id],
    queryFn: () => fetchListDayPackageById(params.id)
  })
  const { data: dataListAllServicePackage, isLoading: loadingAllServicePackage } = useQuery({
    queryKey: ['listAllReviewPackageById'],
    queryFn: () => fetchListAllService()
  })
  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };
  console.log(session?.user);
  
  const currentTime = new Date();
  const formattedDate = currentTime.toISOString().slice(0, 19).replace('T', ' ');

  const handleAddDay = () => {
    const newDay = parseInt(maxDay.toString()) + 1
    setMaxDay(newDay)
    setSelectedAddDayActivities(newDay)
    console.log(newDay, 'ini bagian newday');

    setAddDayOpen(!addDayOpen)
    const dataSelectedObject = dataListAllObject.filter((object: { id: string, name: string, type: string, price: string, category: string }) => object.id == `${selectedObject}`)
    const price = (dataSelectedObject[0].price).toString()
    const newActivities = [{
      package_id: `${params.id}`,
      object_id: `${selectedObject}`,
      description: `${descriptionNewActivites}`,
      day: newDay,
      activity_type: `${dataSelectedObject[0].type}`,
      activity_name: `${dataSelectedObject[0].name}`,
      activity_lng: '0',
      activity_lat: '000',
      activity: '1',
      price: price,
      category: dataSelectedObject[0].category
    }];
    setPackageActivities([...packageActivities, ...newActivities]);
    const newDayPackage = [{
      package_id: `${params.id}`,
      day: newDay.toString(),
      description: `${descriptionNewDay}`
    }]
    setPackageDay([...packageDay, ...newDayPackage])
  };

  const handleAddActivitiesButton = (days: number) => {
    setAddActivitiesOpen(!addActivitiesOpen)
    setSelectedAddDayActivities(days)
  }

  const saveAddActivities = () => {
    setAddActivitiesOpen(!addActivitiesOpen)
    const isIdExist = packageActivities.some(activity => activity.object_id === `${selectedObject}` && activity.day.toString() == `${selectedAddDayActivities}`);
    // Jika id belum ada, tambahkan data layanan baru
    if (!isIdExist) {
      let maxActivities: number = 0;
      packageActivities.forEach(activities => {
        if (activities.day === selectedAddDayActivities) {
          const activityInt = parseInt(activities.activity); // Konversi string ke integer
          if (activityInt > maxActivities) {
            maxActivities = activityInt;
          }
        }
      });
      const dataSelectedObject = dataListAllObject.filter((object: { id: string, name: string, type: string, price: string, category: string }) => object.id == `${selectedObject}`)

      const newActivity = maxActivities + 1;
      const newActivities = [{
        package_id: `${params.id}`,
        object_id: `${selectedObject}`,
        description: `${descriptionNewActivites}`,
        day: selectedAddDayActivities,
        activity_type: `${dataSelectedObject[0].type}`,
        activity_name: `${dataSelectedObject[0].name}`,
        activity_lng: '0',
        activity_lat: '000',
        activity: newActivity.toString(),
        price: dataSelectedObject[0].price,
        category: dataSelectedObject[0].category
      }];
      setPackageActivities([...packageActivities, ...newActivities]);
    } else {
      console.log("ID already exists, cannot add activities!");
    }
  }

  const handleRemoveActivites = (activityId: string, dayIndex: number) => {
    const activitiesForDay = packageActivities.filter(activity => activity.day == dayIndex);

    // Hapus aktivitas dengan activityId dari array aktivitas yang terkait dengan hari yang dipilih
    const updatedActivitiesForDay = activitiesForDay.filter(activity => activity.activity != activityId);

    // Susun ulang urutan aktivitas di hari yang dipilih
    updatedActivitiesForDay.forEach((activity, index) => {
      activity.activity = String(index + 1);
    });

    // Perbarui state packageActivities dengan array yang telah diperbarui
    let updatedActivities = packageActivities.filter(activity => activity.day != dayIndex)
      .concat(updatedActivitiesForDay);

    // Perbarui nomor urutan aktivitas secara berurutan dari 1 hingga N
    updatedActivitiesForDay.forEach((activity, index) => {
      activity.activity = String(index + 1);
    });

    // Gabungkan kembali aktivitas di hari lain dengan aktivitas yang telah diupdate untuk hari yang dipilih
    updatedActivities = packageActivities.filter(activity => activity.day != dayIndex)
      .concat(updatedActivitiesForDay);

    // Perbarui state packageActivities dengan array yang telah diperbarui
    setPackageActivities(updatedActivities);
    const cekDaysActivitiesAfterRemove = packageActivities.filter(activity => activity.day == dayIndex);
    if (cekDaysActivitiesAfterRemove.length === 1) {
      setMaxDay(Number(maxDay) - 1)
      const updatePackageDay = packageDay.filter(days => days.day != dayIndex.toString())
      setPackageDay(updatePackageDay)
    }
  }

  const handleAddServiceButton = () => {
    setTypeService(1)
    setAddServiceOpen(!addServiceOpen)
  };

  const handleAddNonServiceButton = () => {
    setTypeService(0)
    setAddServiceOpen(!addServiceOpen)
  };

  const saveAddService = () => {
    const isIdExist = dataListAllServicePackageById.some((service: { id: string, name: string, package_id: string, price: number, status: number }) => service.id === `${selectedService}`);
    setAddServiceOpen(!addServiceOpen)
    if (!isIdExist) {
      const selectedServiceData = dataListAllServicePackage.filter((service: { id: string, name: string, package_id: string, price: number, status: number, category: string }) => service.id === `${selectedService}`)
      const newService = [{
        category: selectedServiceData[0].category,
        id: `${selectedServiceData[0].id}`,
        name: `${selectedServiceData[0].name}`,
        package_id: params.id,
        price: Number(selectedServiceData[0].price),
        service_package_id: `${selectedServiceData[0].id}`,
        status: typeService,
      }];
      setPackageService([...packageService, ...newService]);
      console.log("Service added successfully!");
    } else {
      console.log("ID already exists, cannot add service!");
    }
  }

  const handleRemoveService = (id: string) => {
    const updatedServices = [...packageService];

    // Temukan indeks layanan yang sesuai dengan id
    const index = updatedServices.findIndex(service => service.id === id);

    // Jika id ditemukan, hapus layanan dari array
    if (index !== -1) {
      updatedServices.splice(index, 1); // Menghapus elemen pada indeks tertentu
      console.log("Service with id", id, "removed successfully!");
      setPackageService(updatedServices); // Perbarui state packageService
    } else {
      console.log("Service with id", id, "not found!");
    }
  }

  const saveBooking = async () => {
    if (dataPackageById && session && typeof window !== 'undefined') {
      const extendPackageName = `${dataPackageById[0].name} extend by ${session.user.name} at ${formattedDate}`
      console.log(extendPackageName);

      const res = await useAxiosAuth.post('/package/createExtendBooking', ({
        packageDay: packageDay,
        packageActivities: packageActivities,
        packageService: packageService,
        dataPackageById: [{
          id: dataPackageById[0].package_id,
          name: extendPackageName,
          type_id: dataPackageById[0].type_id,
          min_capacity: dataPackageById[0].min_capacity,
          price: priceTotal,
          contact_person: dataPackageById[0].contact_person,
          description: dataPackageById[0].description,
          custom: 1,
          package_name: `${dataPackageById[0].name} custom by ${session.user.name} at ${formattedDate}`,
          user_name: session.user.name
        }]
      }))
      if (res.status == 201) router.push(`/explore/package/${res.data.data}/booking`);
    }
  }

  useEffect(() => {
    if (dataPackageActivityById && dataPackageById && dataListAllServicePackageById) {
      const initialPackageActivities = dataPackageActivityById.map((activity: any) => ({
        ...activity,
      }));
      const initialPackageServices = dataListAllServicePackageById.map((service: any) => ({
        ...service,
      }))
      setPackageActivities(initialPackageActivities);
      setMaxDay(dataPackageById[0].max_day)
      setMaxDayPackage(dataPackageById[0].max_day)
      setPackageService(initialPackageServices)
      setPackageDay(dataListAllDayPackageById)
    }
  }, [dataPackageActivityById, dataPackageById, dataListAllServicePackageById, dataListAllDayPackageById]);

  useEffect(() => {
    if (dataPackageById) {
      const minCapacity: number = dataPackageById[0].min_capacity;
      const totalPriceActivites: number = packageActivities.reduce((total, activity) => {
        if (activity.category === '1') total += activity.price * minCapacity;
        else total += activity.price;
        return total;
      }, 0);

      const totalPriceService: number = packageService.reduce((total, service) => {
        if (service.status == 1) {
          if (service.category == 1) total += service.price * minCapacity * maxDay
          else total += service.price * maxDay;
          return total
        }
        return total
      }, 0)
      const priceTotal = Number(totalPriceService) + Number(totalPriceActivites)
      setPriceTotal(priceTotal)
    }
  }, [packageService, packageActivities, dataPackageById])

  if (dataPackageActivityById && dataListAllServicePackageById && dataPackageById && session && dataListAllObject && dataListAllDayPackageById && dataListAllServicePackage) {
    const extendPackageName = `${dataPackageById[0].name} custom by ${session.user.name} at ${formattedDate}`
    return (
      <>
        <div className="flex flex-col m-1 sm:m-3 lg:m-5">
          <div className="w-full h-full px-1 ">
            <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
              <h1 className="text-center text-xl font-semibold">Custom Package</h1>
              <br />
              <div className="absolute mr-5 right-1 top-14">
                <button className="text-white bg-green-500 px-3 py-1 rounded-lg hover:bg-green-600 mr-3" onClick={() => setBookingPackage(!bookingPackage)}>
                  <FontAwesomeIcon icon={faCartPlus} /> Booking this Package
                </button>
                <Dialog open={bookingPackage} className="text-center rounded-lg">
                  <DialogTitle className="text-blue-500">Ready to booking package?</DialogTitle>
                  <div>
                    <button className="border-solid border-2 p-2 m-1 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white mr-5" onClick={() => setBookingPackage(!bookingPackage)}>
                      <FontAwesomeIcon icon={faXmark} className="mr-2" />Cancel
                    </button>
                    <button className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => saveBooking()}>
                      <FontAwesomeIcon icon={faCartPlus} /> Booking</button>
                  </div>
                </Dialog>
                <button className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600" onClick={() => setCancelDialog(!cancelDialog)}>
                  <FontAwesomeIcon icon={faXmark} /> Cancel
                </button>
                <Dialog open={cancelDialog} className="text-center rounded-lg">
                  <DialogTitle className="text-blue-500">Cancel Package?</DialogTitle>
                  <h2>All changes will be lost</h2>
                  <div>
                    <button className="border-solid border-2 p-2 m-1 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white mr-5" onClick={() => setCancelDialog(!cancelDialog)}>
                      <FontAwesomeIcon icon={faPencil} className="mr-2" />Continue Extend Package
                    </button>
                    <Link href={'/explore/package'}>
                      <button className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white">
                        <FontAwesomeIcon icon={faCheck} /> Im Sure</button>
                    </Link>
                  </div>
                </Dialog>
              </div>
              <table className="w-full mt-5">
                <tbody>
                  <tr className="w-fit">
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Name</td>
                    <td className="font-normal">{extendPackageName}</td>
                  </tr>
                  <tr className="w-fit">
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Package Base</td>
                    <td className="font-normal">{dataPackageById[0].name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Package Type</td>
                    <td className="font-normal">{dataPackageById[0].type_name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Minimal Capacity</td>
                    <td className="font-normal">{dataPackageById[0].min_capacity} people</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Contact Person</td>
                    <td className="font-normal">{dataPackageById[0].contact_person}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Price Total</td>
                    <td className="font-normal">{rupiah(priceTotal)}
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
                <h2 className="text-center text-lg font-semibold">Activity</h2>
                <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => setAddDayOpen(!addDayOpen)}>
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
                            {/* {dayIndex + 1 > maxDayPackage ? (
                              <button className="border-solid border-2 border-red-500 rounded-lg text-red-500 px-2 py-1 hover:text-white hover:bg-red-500" >
                                <FontAwesomeIcon icon={faXmark} />
                              </button>
                            ) : null} */}
                          </div>
                          <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white"
                            onClick={() => handleAddActivitiesButton(day)}>
                            <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" /> <p>Activities</p>
                          </button>
                          {dataListAllDayPackageById
                            .filter((dayPackage: { day: string }) => dayPackage.day === (dayIndex + 1).toString())
                            .map((dayPackage: { description: string }) => (
                              <p key={dayIndex}>{dayPackage.description}</p>
                            ))}
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
                                    <td>{rupiah(activity.price)}</td>
                                    <td>{activity.category == '0'
                                      ? 'Grup'
                                      : activity.category == '1'
                                        ? 'Individu'
                                        : activity.category}</td>
                                    <td className="flex justify-center items-center">
                                      <button className="border-solid border-2 border-red-500 rounded-lg text-red-500 px-2 py-1 hover:text-white hover:bg-red-500"
                                        onClick={() => handleRemoveActivites(activity.activity, dayIndex + 1)}>
                                        <FontAwesomeIcon icon={faXmark} />
                                      </button>
                                    </td>
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
                <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleAddServiceButton}>
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
                              {service.category == 0 ? (
                                <td>Group</td>
                              ) :
                                <td>Individu</td>
                              }
                              <td className="flex justify-center items-center">
                                <button className="border-solid border-2 border-red-500 rounded-lg text-red-500 px-2 py-1 hover:text-white hover:bg-red-500"
                                  onClick={() => handleRemoveService(service.id)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                              </td>
                            </tr>
                          )
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <br />
                <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleAddNonServiceButton}>
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
                              <td className="flex justify-center items-center">
                                <button className="border-solid border-2 border-red-500 rounded-lg text-red-500 px-2 py-1 hover:text-white hover:bg-red-500"
                                  onClick={() => handleRemoveService(service.id)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                              </td>
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
        <Dialog open={addActivitiesOpen} fullWidth maxWidth='sm' className="text-center">
          <DialogTitle className="text-blue-500">Add New Activities</DialogTitle>
          <DialogContent dividers>
            <h2>Activity Type</h2>
            <Select displayEmpty label="Activity type" value={fieldAcitivityType}
              onChange={(event) => {
                setFieldAcitivityType(event.target.value);
              }}>
              <MenuItem disabled value=""><em>Activity type</em></MenuItem>
              <MenuItem value="CP">Culinary</MenuItem>
              <MenuItem value="WP">Worship</MenuItem>
              <MenuItem value="SP">Souvenir Place</MenuItem>
              {/* <MenuItem value="HO">Homestay</MenuItem> */}
              <MenuItem value="FC">Facility</MenuItem>
              <MenuItem value="A">Attraction</MenuItem>
              <MenuItem value="E">Event</MenuItem>
            </Select>
            <h2>Choose Object</h2>
            <Select id="select" value={selectedObject}
              MenuProps={MenuProps}
              onChange={(event) => {
                setSelectedObject(event.target.value);
              }}>
              {dataListAllObject
                .filter((object: { type: string }) => {
                  // Filter daftar objek berdasarkan jenis kegiatan yang dipilih
                  if (fieldAcitivityType === "CP") {
                    return object.type === "CP";
                  } else if (fieldAcitivityType === "WP") {
                    return object.type === "WP";
                  } else if (fieldAcitivityType === "SP") {
                    return object.type === "SP";
                  } else if (fieldAcitivityType === "E") {
                    return object.type === 'E'
                  } else if (fieldAcitivityType === 'A') {
                    return object.type === 'A'
                  } else if (fieldAcitivityType === 'FC') {
                    return object.type === 'FC'
                  }
                })
                .map((object: { id: string, name: string }) => (
                  <MenuItem key={object.id} value={object.id}>
                    {object.name}
                  </MenuItem >
                ))}
            </Select >
            <br />
            <h2>Description for this activites</h2>
            <TextField label="Description" variant="outlined" onChange={(event) => {
              setDescriptionNewActivities(event.target.value)
            }} />
          </DialogContent>
          <DialogActions>
            <div>
              <button className="border-solid border-2 p-2 m-1 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white mr-5" onClick={() => setAddActivitiesOpen(!addActivitiesOpen)}>
                <FontAwesomeIcon icon={faXmark} className="mr-2" />Cancel
              </button>
              <button className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => saveAddActivities()}>
                <FontAwesomeIcon icon={faPlus} /> Save</button>
            </div>
          </DialogActions>
        </Dialog>
        <Dialog open={addDayOpen} fullWidth maxWidth='sm' className="text-center">
          <Box>
            <DialogTitle className="text-blue-500">Add New Day</DialogTitle>
            <p>Description for this Day</p>
            <TextField label="Description" variant="outlined" onChange={(event) => {
              setDescriptionNewDay(event.target.value)
            }} />
            <DialogTitle className="text-blue-500">Add First Activity</DialogTitle>
            <p>Activity Type</p>
            <Select displayEmpty label="Activity type" value={fieldAcitivityType}
              onChange={(event) => {
                setFieldAcitivityType(event.target.value);
              }}>
              <MenuItem disabled value=""><em>Activity type</em></MenuItem>
              <MenuItem value="CP">Culinary</MenuItem>
              <MenuItem value="WP">Worship</MenuItem>
              <MenuItem value="SP">Souvenir Place</MenuItem>
              {/* <MenuItem value="HO">Homestay</MenuItem> */}
              <MenuItem value="FC">Facility</MenuItem>
              <MenuItem value="A">Attraction</MenuItem>
              <MenuItem value="E">Event</MenuItem>
            </Select>
            <p>Choose Object</p>
            <Select id="select" value={selectedObject}
              MenuProps={MenuProps}
              onChange={(event) => {
                setSelectedObject(event.target.value);
              }}>
              {dataListAllObject
                .filter((object: { type: string }) => {
                  // Filter daftar objek berdasarkan jenis kegiatan yang dipilih
                  if (fieldAcitivityType === "CP") {
                    return object.type === "CP";
                  } else if (fieldAcitivityType === "WP") {
                    return object.type === "WP";
                  } else if (fieldAcitivityType === "SP") {
                    return object.type === "SP";
                  } else if (fieldAcitivityType === "E") {
                    return object.type === 'E'
                  } else if (fieldAcitivityType === 'A') {
                    return object.type === 'A'
                  } else if (fieldAcitivityType === 'FC') {
                    return object.type === 'FC'
                  }
                })
                .map((object: { id: string, name: string }) => (
                  <MenuItem key={object.id} value={object.id}>
                    {object.name}
                  </MenuItem >
                ))}
            </Select >
            <br />
            <p>Description for this activites</p>
            <TextField label="Description" variant="outlined" onChange={(event) => {
              setDescriptionNewActivities(event.target.value)
            }} />
            {/* </DialogContent> */}
            <div className="mt-5">
              <button className="border-solid border-2 p-2 m-1 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white mr-5" onClick={() => setAddDayOpen(!addDayOpen)}>
                <FontAwesomeIcon icon={faXmark} className="mr-2" />Cancel
              </button>
              <button className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => handleAddDay()}>
                <FontAwesomeIcon icon={faPlus} /> Save</button>
            </div>
          </Box>
        </Dialog>
        <Dialog open={addServiceOpen} fullWidth maxWidth='sm' className="text-center">
          <Box m={3} p={1}>
          <DialogTitle className="text-blue-500">Add Service</DialogTitle>
          <DialogContent dividers>
            <h2>Service</h2>
            <Select id="select" value={selectedService}
              MenuProps={MenuProps}
              onChange={(event) => {
                setSelectedService(event.target.value);
              }}>
              {dataListAllServicePackage.map((service: { id: string, name: string }) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem >
              ))}
            </Select >
          </DialogContent>
            <div className="mt-5">
              <button className="border-solid border-2 p-2 m-1 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white mr-5" onClick={() => setAddServiceOpen(!addServiceOpen)}>
                <FontAwesomeIcon icon={faXmark} className="mr-2" />Cancel
              </button>
              <button className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => saveAddService()}>
                <FontAwesomeIcon icon={faPlus} /> Save</button>
            </div>
          </Box>
        </Dialog>
      </>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <ClipLoader color="#36d7b7" speedMultiplier={3} className="items-center"/>
    </div>
  )
}