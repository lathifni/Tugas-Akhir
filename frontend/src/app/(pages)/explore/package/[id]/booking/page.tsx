'use client'

import { fetchPackageById } from "@/app/(pages)/api/fetchers/package";
import { faInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Checkbox } from "@mui/material"
import FormControlLabel from '@mui/material/FormControlLabel';
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import ReadGuide from "./_components/readGuide";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";
import { AxiosError } from 'axios';
import { axiosAuth } from "@/libs/axios";

export default function BookingIdPage({ params }: any) {
  const [readCheck, setReadCheck] = useState(false)
  const [totalPeople, setTotalPeople] = useState(0)
  const [totalOrderPackage, setTotalOrderPackage] = useState(0)
  const [totalPricePackage, setTotalPricePackage] = useState(0)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [dateCheckIn, setDateCheckIn] = useState('')
  const [dateCheckOut, setDateCheckOut] = useState('')
  const [codeReferral, setCodeReferral] = useState('')
  const [idUserReferral, setIdUserReferral] = useState('')
  const [weatherWarnings, setWeatherWarnings] = useState<string[]>([]);
  const [waterWarnings, setWaterWarnings] = useState<string[]>([]);
  const [note, setNote] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession();
  const router = useRouter();

  const { data: dataPackageById, isLoading: loadingPackageById } = useQuery({
    queryKey: ['PackageById', params.id],
    queryFn: () => fetchPackageById(params.id)
  })
  
  const currentTime = new Date();
  const threeDaysLater = new Date(currentTime);
  threeDaysLater.setDate(currentTime.getDate() + 3);
  const formattedDate = threeDaysLater.toISOString().split("T")[0];

  const readCheckHandleChange = () => {
    setReadCheck(!readCheck)
  }

  const readDateHandleChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    setWeatherWarnings([])
    setWaterWarnings([])
    const inputDate = new Date(event.target.value);
    const daysToAdd = parseInt(dataPackageById[0].max_day)
    const formattedDateInput = format(inputDate, "yyyy-MM-dd HH:mm:ss");
    const newDate = new Date(inputDate);
    setDateCheckIn(formattedDateInput)

    newDate.setHours(12, 0, 0, 0);

    newDate.setDate(newDate.getDate() + daysToAdd - 1);
    const formattedDate = format(newDate, "yyyy-MM-dd HH:mm:ss")
    const check_weather = await axiosAuth.get(`integration/weather/${formattedDateInput}/${formattedDate}`)
    const check_water = await axiosAuth.get(`integration/water/${formattedDateInput}/${formattedDate}`)

    setWaterWarnings(check_water.data.data)
    setWeatherWarnings(check_weather.data.data.warnings);
    setDateCheckOut(formattedDate)
  }

  const saveReservationButtonHandler = async () => {
    if (!readCheck) return toast.warn("Please read the guide and fill the checkbox");
    try {
      const currentDate = new Date(); // Mendapatkan tanggal saat ini

      const formattedCurrentDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");
      if (session?.user) {
        if (codeReferral !== '' && idUserReferral==''){
          return toast.warning('Code referral has not been verified yet. Please verify it or clear the field.');
        }
        const data = {
          user_id: session.user.user_id,
          package_id: params.id,
          request_date: formattedCurrentDate,
          check_in: dateCheckIn,
          total_people: totalPeople,
          total_price: totalPricePackage,
          deposit: totalDeposit,
          note: note,
          idUserReferral: idUserReferral,
          package_name: dataPackageById[0].name,
          user_name: session.user.name
        }
        const res = await useAxiosAuth.post('reservation/process-transaction', data)
        if (res.status == 201) {
          if (dataPackageById[0].max_day > 1) {
            toast.success("Successful!");
            toast.info("Redirecting You to Booking Homestay");
            setTimeout(() => {
              router.push(`/explore/detailreservation/${res.data.idReservation}`);
            }, 1300);
          }
          else {
            toast.success("Successful!");
            toast.info("Redirecting You to Reservation");
            setTimeout(() => {
              router.push("/explore/reservation");
            }, 1300);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(number);
  }

  const totalPeopleHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const min_capacity = dataPackageById[0].min_capacity
    let inputTotalPeople = Number(event.target.value)
    setTotalPeople(inputTotalPeople)

    if (inputTotalPeople <= min_capacity) {
      setTotalOrderPackage(1);
      if (inputTotalPeople === 0) setTotalOrderPackage(0)
      else if (inputTotalPeople < 0) setTotalOrderPackage(0)
    }
    else {
      const remainder = inputTotalPeople % min_capacity;
      let additionalPacks = 0

      if (remainder > 0) {
        additionalPacks = remainder < min_capacity / 2 ? 0.5 : 1;
        console.log(remainder, additionalPacks);
      }
      const calculatedTotalOrderPackage = Math.floor(inputTotalPeople / min_capacity) + additionalPacks;
      setTotalOrderPackage(calculatedTotalOrderPackage);
    }
  }

  useEffect(() => {
    if (dataPackageById !== undefined) {
      const calculatedTotalPricePackage = totalOrderPackage * dataPackageById[0].price;
      setTotalPricePackage(calculatedTotalPricePackage);

      const calculatedTotalDeposit = 0.2 * calculatedTotalPricePackage;
      setTotalDeposit(calculatedTotalDeposit);
    }
  }, [totalOrderPackage, dataPackageById]);

  const verifyButtonHandler = async () => {
    if (codeReferral == '') {
      return toast.warning('Code referral cannot be null');
    }
    try {
      const res = await useAxiosAuth.get(`referral/verify/${codeReferral}`);
      if (res.status == 200) {
        setIdUserReferral(res.data.data.id);
        console.log(res.data.data);
        return toast.success('Code referral is available');
      }
    } catch (error: unknown) {
      // Periksa apakah error adalah AxiosError
      if (error instanceof AxiosError) {
        if (error.response && error.response.status == 400) {
          return toast.warning(error.response.data.msg);
        }
      }
      console.log(error);
      toast.error('An unexpected error occurred');
    }
  };  

  if (dataPackageById) {
    return (
      <div className="mx-2 lg:mx-20 pb-10">
        <div className="flex flex-col p-4 shadow-xl bg-white rounded-lg">
          <h1 className="font-bold text-2xl text-center">Reservation of Package</h1>
          <button className="italic text-white bg-red-500 rounded-lg w-fit py-2 px-4 hover:bg-red-700 select-none" onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faInfo} /> Read this guide
          </button>
          <ReadGuide readGuideOpen={isOpen} setReadGuideOpen={setIsOpen} />
          <div className="italic select-none">
            <FormControlLabel control={
              <Checkbox checked={readCheck} onChange={readCheckHandleChange} size="small" required/>
            }
              label="I have read this guide"
            />
          </div>
          <div>
            <h2 className="font-medium text-lg">Information</h2>
            <p className="ml-5">Packaged : {dataPackageById[0].name}</p>
            <p className="ml-5">Minimal Capacity : {dataPackageById[0].min_capacity} People</p>
            <p className="ml-5">Day: {dataPackageById[0].max_day}</p>
            <p className="ml-5">Price : {rupiah(dataPackageById[0].price)}</p>
          </div>
          <div>
            <h2 className="font-medium text-lg">Booking</h2>
            {weatherWarnings.length > 0 && (
              <div className="">
                <h2 className="font-medium text-lg">Weather Forecasting</h2>
                <ul className="ml-5">
                  {weatherWarnings.map((warning, index) => (
                    <div
                    key={index}
                    className={`italic text-white rounded-lg w-fit py-2 px-4 mb-2 select-none ${
                      warning === "The weather is good" ? "bg-green-500" : "bg-red-500"
                    }`}
                    >
                      <li key={index}>{warning}</li>
                    </div>
                  ))}
                </ul>
              </div>
            )}
            {waterWarnings.length > 0 && (
              <div>
                <h2 className="font-medium text-lg">Water Forecasting</h2>
                <ul className="ml-5">
                  {waterWarnings.map((warning, index) => (
                    <div
                    key={index}
                    className={`italic text-white rounded-lg w-fit py-2 px-4 mb-2 select-none ${
                      warning === "All water information forecast is good, but stay careful near the beach!" ? "bg-green-500" : "bg-red-500"
                    }`}
                    >
                      <li key={index}>{warning}</li>
                    </div>
                  ))}
                </ul>
                {/* Hanya tampilkan detail warning jika semua warning tidak hanya pesan default */}
                {waterWarnings.length > 1 || !waterWarnings.includes("All water information forecast is good, but stay careful near the beach!") ? (
                  <div className="px-4 bg-yellow-100 border border-yellow-400 rounded text-justify">
                    <h2 className="text-lg font-semibold text-yellow-700">Warnings</h2>
                    <ul className="list-disc pl-5 text-yellow-700">
                      <li>
                        Avoid coastal areas when wave heights exceed 0.5 meters, as conditions may become hazardous, especially for small boats, surfers, and swimmers.
                      </li>
                      <li>
                        Wave periods below 8 seconds may indicate choppy, unstable sea conditions, making activities like swimming and boating more challenging.
                      </li>
                      <li>
                        Wind waves above 0.1 meters can create additional turbulence on the water surface, leading to dangerous conditions for smaller vessels and swimmers.
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
            <div className="relative w-fit">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Check-In</label>
              {/* <Datetime value={new Date()} className="appearance-none shadow border rounded-lg w-fit py-1 px-2" /> */}
              {/* <CalendarClock className="absolute right-3 top-7 w-10" /> */}
              <input className="appearance-none shadow border rounded-lg w-fit py-1 px-2" onChange={readDateHandleChange} type="datetime-local"
                min={formattedDate + 'T00:00'}
              />
            </div>
            <div className="relative w-fit select-none">
              <label className="block mt-2 text-sm font-medium text-gray-900 ">Check-Out</label>
              {/* <Datetime value={new Date()} className="appearance-none shadow border rounded-lg w-fit py-1 px-2" />
              <CalendarClock className="absolute right-3 top-7 w-10" /> */}
              <input className="appearance-none shadow border rounded-lg w-fit py-1 px-2" defaultValue={dateCheckOut} type="datetime-local" readOnly
              />
            </div>
          </div>
          <div className="">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Total People</label>
            <input type="number" name='type_of_tourism' onChange={totalPeopleHandleChange}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Total Order Package</label>
            <input name='total_order_package' onChange={totalPeopleHandleChange} value={totalOrderPackage + ' Pcs'}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required  />
          </div>
          <div className="">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Note</label>
            <input name='note' onChange={(event) => setNote(event.target.value)}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Total Price Package</label>
            <input name='note' value={rupiah(totalPricePackage)}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required readOnly  />
          </div>
          <div className="">
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Deposit</label>
            <input name='note' value={rupiah(totalDeposit)}
              className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required readOnly  />
          </div>
          <div>
            <label className="block mt-2 text-sm font-medium text-gray-900 ">Code Referral (Optional)</label>
            <div className="flex items-center">
              <input name='code_referral' onChange={(e) => setCodeReferral(e.target.value)}
                className="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={verifyButtonHandler}>Verify</button>
            </div>
          </div>
          <div className="flex py-4 gap-4">
            <button className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700" onClick={() => router.back()}>
              Cancel
            </button>
            <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700" onClick={saveReservationButtonHandler}>
            Save Reservation
            </button>
          </div>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={4500}
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
      </div>
    )
  }
}