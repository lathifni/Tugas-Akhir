'use client'

import { fetchListAllObject } from "@/app/(pages)/api/fetchers/gtp";
import { fetchAllPackageType, fetchListAllService } from "@/app/(pages)/api/fetchers/package";
import FileInput from "@/components/fileInput"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from 'zod';
import Link from "next/link";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";

interface Image {
  name: string;
  url: string;
  file: File;
}
interface Video {
  name: string;
  url: string;
  file: File;
}
interface PackageActivity {
  object_id: string;
  description: string;
  day: number;
  activity_type: string;
  activity_name: string;
  activity: string;
  price: number;
  category: string;
}
interface PackageService {
  category: number;
  id: string;
  name: string;
  price: number;
  service_package_id: string;
  status: number;
}
interface PackageDay {
  day: string;
  description: string;
}

const packageSchema = z.object({
  package_name: z.string().min(1, 'Package name cannot be empty'),
  package_type: z.string().min(1, 'Package type cannot be empty'),
  price: z.string().min(1, 'Price cannot be empty'),
  min_capacity: z.string().min(1, 'Minimum capacity cannot be empty'),
  contact_person: z.string().min(1, 'Contact person cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  // package_activities: z.array(z.object({
  // })).min(1, 'At least one activity must be selected'),
  // package_service: z.array(z.object({
  // })).min(1, 'At least one service must be selected'),
  // package_day: z.array(z.object({
  // })).min(1, 'At least one day must be selected'),
  package_activities: z.array(z.any()).min(1, 'At least one activity must be selected'),
  package_service: z.array(z.any()).min(1, 'At least one service must be selected'),
  package_day: z.array(z.any()).min(1, 'At least one day must be selected'),
  cover: z.array(z.object({
    file: z.any(), // You can customize this if needed
  })).min(1, 'Cover image is required'),
  gallery: z.array(z.object({
    file: z.any(), // You can customize this if needed
  })).min(1, 'At least one gallery image is required'),
  video: z.array(z.object({
    file: z.any(), // You can customize this if needed
  })).min(1, 'Video is required'),
});

export default function PackageNewPage() {
  const [packageActivities, setPackageActivities] = useState<PackageActivity[]>([]);
  const [packageServices, setPackageServices] = useState<PackageService[]>([])
  const [packageDay, setPackageDay] = useState<PackageDay[]>([])
  const [maxDay, setMaxDay] = useState(0);
  const [addDayOpen, setAddDayOpen] = useState(false)
  const [addServiceOpen, setAddServiceOpen] = useState(false)
  const [addNonServiceOpen, setAddNonServiceOpen] = useState(false)
  const [addActivitiesOpen, setAddActivitiesOpen] = useState(false)
  const [cover, setCover] = useState<Image[]>([]);
  const [gallery, setGallery] = useState<Image[]>([]);
  const [video, setVideo] = useState<Video[]>([]);
  const [fieldAcitivityType, setFieldAcitivityType] = useState('')
  const [selectedObject, setSelectedObject] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [descriptionNewActivites, setDescriptionNewActivities] = useState('')
  const [selectedAddDayActivities, setSelectedAddDayActivities] = useState(0)
  const [descriptionNewDay, setDescriptionNewDay] = useState('')
  const [typeService, setTypeService] = useState(0)
  const [formDataInput, setFormDataInput] = useState({
    package_name: "",
    package_type: "",
    price: "",
    min_capacity: "",
    contact_person: "",
    description: "",
  });

  const { data: dataListAllObject, isLoading: loadingListAllObject } = useQuery({
    queryKey: ['listAllObject'],
    queryFn: () => fetchListAllObject()
  })
  const { data: dataListAllServicePackage, isLoading: loadingAllServicePackage } = useQuery({
    queryKey: ['listAllReviewPackageById'],
    queryFn: () => fetchListAllService()
  })
  const { data: dataAllTypePackage, error } = useQuery({
    queryKey: ['dataAllTypePackage'],
    queryFn: fetchAllPackageType
  })
  console.log(dataListAllObject);
  

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormDataInput({ ...formDataInput, [name]: value });
  };

  const handleSubmit = async () => {
    const validation = packageSchema.safeParse({
      package_name: formDataInput.package_name,
      package_type: formDataInput.package_type,
      price: formDataInput.price,
      min_capacity: formDataInput.min_capacity,
      contact_person: formDataInput.contact_person,
      description: formDataInput.description,
      package_activities: packageActivities,
      package_service: packageServices,
      package_day: packageDay,
      cover, // Adding cover to validation
      gallery, // Adding gallery to validation
      video, // Adding video to validation
    });

    if (!validation.success) {
      validation.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    const formDataCover = new FormData()
    const formDataGallery = new FormData()
    const formDataVideo = new FormData()
    const category = 'package'

    formDataCover.append('category', category);
    formDataGallery.append('category', category)
    formDataVideo.append('category', category)

    formDataCover.append('images[0]', cover[0]!.file)  
    gallery.forEach((image, index) => {
      formDataGallery.append(`images[${index}]`, image.file);
    });
    formDataVideo.append('videos[0]', video[0]!.file)

    try {
      const responseCover = await axios.post("/api/images", formDataCover);
      const responseGallery = await axios.post("/api/images", formDataGallery);
      const responseVideo = await axios.post("/api/videos", formDataVideo);

      const urlCover = responseCover.data.data
      const urlGallery = responseGallery.data.data
      const urlVideo = responseVideo.data.data

      if (responseCover.status===201 && responseGallery.status===201 && responseVideo.status===201) {
        const data = {
          ...validation.data,
          cover: urlCover,
          gallery: urlGallery,
          video: urlVideo,
        };
        console.log(data);

        const response = await useAxiosAuth.post('package', data)
        // console.log(response);
      }
    } catch (error) {
      
    }
    //   packageName,
    //   packageType,
    //   price: Number(price), // Ensure price is a number
    //   minimalCapacity: Number(minimalCapacity),
    //   contactPerson,
    //   description,
    // };
  
    // const validation = packageSchema.safeParse(formData);
  
    // if (!validation.success) {
    //   // Show toast for each validation error
    //   validation.error.errors.forEach((err) => {
    //     toast.error(err.message);
    //   });
    //   return;
    // }
  
    // // Proceed with submitting valid data
    // console.log("Valid data:", validation.data);
  };

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

  const handleGalleryChange = (newGallery: any) => {
    setGallery(newGallery);
  }

  const handleCoverChange = (newCover: any) => {
    setCover(newCover);        
  }

  const handleVideoChange = (newVideo: any) => {
    setVideo(newVideo);
  }

  const handleAddDay = () => {
    const newDay = parseInt(maxDay.toString()) + 1
    setMaxDay(newDay)
    setSelectedAddDayActivities(newDay)

    setAddDayOpen(!addDayOpen)
    const dataSelectedObject = dataListAllObject.filter((object: { id: string, name: string, type: string, price: string, category: string }) => object.id == `${selectedObject}`)
    const price = (dataSelectedObject[0].price).toString()
    const newActivities = [{
      object_id: `${selectedObject}`,
      description: `${descriptionNewActivites}`,
      day: newDay,
      activity_type: `${dataSelectedObject[0].type}`,
      activity_name: `${dataSelectedObject[0].name}`,
      activity: '1',
      price: price,
      category: dataSelectedObject[0].category
    }];
    setPackageActivities([...packageActivities, ...newActivities]);
    const newDayPackage = [{
      day: newDay.toString(),
      description: `${descriptionNewDay}`
    }]
    setPackageDay([...packageDay, ...newDayPackage])
  };

  const handleAddServiceButton = () => {
    setTypeService(1)
    setAddServiceOpen(!addServiceOpen)
  }

  const handleAddNonServiceButton = () => {
    setTypeService(0)
    setAddNonServiceOpen(!addNonServiceOpen)
  };

  const handleAddActivitiesButton = (days: number) => {
    setAddActivitiesOpen(!addActivitiesOpen)
    setSelectedAddDayActivities(days)
  }

  const saveAddService = () => {
    const isIdExist = packageServices.some((service: { id: string, name: string, price: number, status: number }) => service.id === `${selectedService}`);
    setAddServiceOpen(false)
    setAddNonServiceOpen(false)
    if (!isIdExist) {
      const selectedServiceData = dataListAllServicePackage.filter((service: { id: string, name: string, price: number, status: number, category: string }) => service.id === `${selectedService}`)
      const newService = [{
        category: selectedServiceData[0].category,
        id: `${selectedServiceData[0].id}`,
        name: `${selectedServiceData[0].name}`,
        price: Number(selectedServiceData[0].price),
        service_package_id: `${selectedServiceData[0].id}`,
        status: typeService,
      }];
      setPackageServices([...packageServices, ...newService]);
    } else {
      console.log("ID already exists, cannot add service!");
    }
    setSelectedService('')
  }

  const handleRemoveActivites = (activityId: string, dayIndex: number) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to remove the activity "${activityId}" from day ${dayIndex}?`
    );
  
    if (!isConfirmed) {
      console.log('User cancelled the action.');
      return; // Batalkan jika user memilih "No"
    }
    
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

  const handleRemoveService = (id: string) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to remove the service?`
    );
  
    if (!isConfirmed) {
      console.log('User cancelled the action.');
      return; // Batalkan jika user memilih "No"
    }
    const updatedServices = [...packageServices];

    // Temukan indeks layanan yang sesuai dengan id
    const index = updatedServices.findIndex(service => service.id === id);

    // Jika id ditemukan, hapus layanan dari array
    if (index !== -1) {
      updatedServices.splice(index, 1); // Menghapus elemen pada indeks tertentu
      console.log("Service with id", id, "removed successfully!");
      setPackageServices(updatedServices); // Perbarui state packageService
    } else {
      console.log("Service with id", id, "not found!");
    }
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
        object_id: `${selectedObject}`,
        description: `${descriptionNewActivites}`,
        day: selectedAddDayActivities,
        activity_type: `${dataSelectedObject[0].type}`,
        activity_name: `${dataSelectedObject[0].name}`,
        activity: newActivity.toString(),
        price: dataSelectedObject[0].price,
        category: dataSelectedObject[0].category
      }];
      setPackageActivities([...packageActivities, ...newActivities]);
    } else {
      console.log("ID already exists, cannot add activities!");
    }
  }
  
  if (dataListAllObject && dataListAllServicePackage && dataAllTypePackage) {
    return (
      <>
        <div className="flex flex-col lg:flex-row m-1 sm:m-3 lg:m-5">
          <div className="w-full h-full px-2 py-3 mb-4 lg:p-4 lg:mb-0 lg:mr-3 lg:w-5/12 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-center">New Package</h1>
            <div className="mb-4">
              <label>Package Name</label>
              <input type="text" name='package_name' onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
            </div>
            <div className="mb-4">
              <label>Package Type</label>
              {dataAllTypePackage ? (
              <select
                name="package_type"
                value={formDataInput.package_type}
                onChange={handleChange}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Please choose</option>
                {dataAllTypePackage.map((data: { id: string; type_name: string }) => (
                  <option key={data.id} value={data.id}>
                    {data.type_name}
                  </option>
                ))}
              </select>
              ) : (
                <input type="text" readOnly placeholder="Loading ..." className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
              {/* <input type="text" name='package_type' onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/> */}
            </div>
            <div className="mb-4">
              <label>Price</label>
              <input type="number" name='price' onChange={handleChange} min="0"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
            </div>
            <div className="mb-4">
              <label>Minimal Capacity</label>
              <input type="number" name='min_capacity' onChange={handleChange} min="0"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
            </div>
            <div className="mb-4">
              <label>Contact Person</label>
              <input type="text" name='contact_person' onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"/>
            </div>
            <div className="mb-4">
              <label>Description</label>
              <textarea id="message" name='description' onChange={handleChange}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write description here..."></textarea>
            </div>
            <div className="mb-4">
              <label>Package Cover</label>
              <FileInput onGalleryChange={handleCoverChange} fileType={"image"} />
            </div>
            <div className="mb-4">
              <label>Gallery</label>
              <FileInput onGalleryChange={handleGalleryChange} fileType={"image"} />
            </div>
            <div className="mb-4">
              <label>Video</label>
              <FileInput onGalleryChange={handleVideoChange} fileType={"video"} />
            </div>
            <div className="flex py-4 px-8 gap-4">
              <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700" 
              onClick={handleSubmit}
              >
                Submit
              </button>
              <Link href={"/dashboard/package"}>
                <button className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full h-full lg:w-7/12 items-center ">
            <div className=" py-4 px-4 bg-white rounded-lg">
              <h2 className="text-center text-lg font-semibold">Activity</h2>
              <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => setAddDayOpen(!addDayOpen)}>
                <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" />Day
              </button> 
              {packageActivities && (
                  <div>
                    {Array.from(new Set(packageActivities.map((activity: { day: number }) => activity.day)))
                      .sort((a, b) => (a as number) - (b as number))// Mengurutkan hari-hari secara numerik
                      .map((day, dayIndex) => (
                        <div key={dayIndex} className="mb-3">
                          <div className="flex justify-between border-t pt-3">
                            <h2 className="text-lg font-semibold">Day {dayIndex + 1}</h2>
                          </div>
                          <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white"
                            onClick={() => handleAddActivitiesButton(day)}>
                            <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" /> <p>Activities</p>
                          </button>
                          {packageDay
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
            <div className="mt-4  py-4 px-4 bg-white rounded-lg">
              <h2 className="text-center text-lg font-semibold">Service Package</h2>
              <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleAddServiceButton}>
                <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" />Service Package
              </button>
              {packageServices && (
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
                        {packageServices.map((service, index: number) => (
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
              <h2 className="text-center text-lg font-semibold">Non Service Package</h2>
              <button className="px-2 py-1 flex border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleAddNonServiceButton}>
                <FontAwesomeIcon icon={faPlus} className="mr-2 mt-1" /> <p>Non-service Package</p>
              </button>
              {packageServices && (
                <div>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th className="w-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageServices.map((service, index: number) => (
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
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <Dialog open={addActivitiesOpen} fullWidth maxWidth='sm' className="text-center">
          <DialogTitle className="text-blue-500">Add New Acttivities</DialogTitle>
          <DialogContent dividers>
            <p>Activity Type</p>
            <Select displayEmpty label="Activity type" value={fieldAcitivityType}
              onChange={(event) => {
                setFieldAcitivityType(event.target.value);
              }}>
              <MenuItem disabled value=""><em>Activity type</em></MenuItem>
              <MenuItem value="CP">Culinary</MenuItem>
              <MenuItem value="W">Worship</MenuItem>
              <MenuItem value="SP">Souvenir Place</MenuItem>
              <MenuItem value="HO">Homestay</MenuItem>
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
                  } else if (fieldAcitivityType === "W") {
                    return object.type === "WP";
                  } else if (fieldAcitivityType === "SP") {
                    return object.type === "SP";
                  } else if (fieldAcitivityType === "E"){
                    return object.type === 'E';
                  } else if (fieldAcitivityType === 'A') {
                    return object.type === 'A';
                  } else if (fieldAcitivityType === 'FC') {
                    return object.type === 'FC';
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
          <Box m={1}>
            <DialogTitle className="text-blue-500">Add New Day</DialogTitle>
            <DialogContent dividers>
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
                <MenuItem value="W">Worship</MenuItem>
                <MenuItem value="SP">Souvenir Place</MenuItem>
                <MenuItem value="HO">Homestay</MenuItem>
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
                    } else if (fieldAcitivityType === "W") {
                      return object.type === "WP";
                    } else if (fieldAcitivityType === "SP") {
                      return object.type === "SP";
                    } else if (fieldAcitivityType === "E") {
                      return object.type === 'E'
                    } else if (fieldAcitivityType === 'A') {
                      return object.type === 'A';
                    } else if (fieldAcitivityType === 'FC') {
                      return object.type === 'FC';
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
            </DialogContent>
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
          <Box m={1}>
            <DialogTitle className="text-blue-500">Add Service</DialogTitle>
            <DialogContent dividers>
              <p>Service</p>
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
        <Dialog open={addNonServiceOpen} fullWidth maxWidth='sm' className="text-center">
          <Box m={1}>
            <DialogTitle className="text-blue-500">Add Non Service</DialogTitle>
            <DialogContent dividers>
              <p>Service</p>
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
              <button className="border-solid border-2 p-2 m-1 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white mr-5" onClick={() => setAddNonServiceOpen(!addNonServiceOpen)}>
                <FontAwesomeIcon icon={faXmark} className="mr-2" />Cancel
              </button>
              <button className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => saveAddService()}>
                <FontAwesomeIcon icon={faPlus} /> Save</button>
            </div>
          </Box>
        </Dialog>
        <ToastContainer
          position="top-center"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </>
    )
  }
}