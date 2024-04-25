'use client'

import { fetchPackageById } from "@/app/(pages)/api/fetchers/package";
import { faInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Checkbox, TextField } from "@mui/material"
import FormControlLabel from '@mui/material/FormControlLabel';
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import ReadGuide from "./_components/readGuide";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
// import { postReservationTransaction } from "@/app/(pages)/api/fetchers/reservation";

export default function BookingIdPage({ params }: any) {
  const [readCheck, setReadCheck] = useState(false)
  const [totalPeople, setTotalPeople] = useState(0)
  const [totalOrderPackage, setTotalOrderPackage] = useState(0)
  const [totalPricePackage, setTotalPricePackage] = useState(0)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [dateCheckIn, setDateCheckIn] = useState('')
  const [dateCheckOut, setDateCheckOut] = useState('')
  const [note, setNote] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession();
  const router = useRouter();

  const { data: dataPackageById, isLoading: loadingPackageById } = useQuery({
    queryKey: ['PackageById', params.id],
    queryFn: () => fetchPackageById(params.id)
  })
  // const { isLoading, error, data:dataReservation } = useQuery({
  //   queryKey: ['reservationTransaction'],
  //   queryFn: postReservationTransaction
  // });

  const currentTime = new Date();
  const threeDaysLater = new Date(currentTime);
  threeDaysLater.setDate(currentTime.getDate() + 3);
  const formattedDate = threeDaysLater.toISOString().split("T")[0];

  const readCheckHandleChange = () => {
    setReadCheck(!readCheck)
  }

  const readDateHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = new Date(event.target.value);
    const daysToAdd = parseInt(dataPackageById[0].max_day)
    const formattedDateInput = format(inputDate, "yyyy-MM-dd HH:mm:ss");
    const newDate = new Date(inputDate);
    setDateCheckIn(formattedDateInput)

    newDate.setHours(12, 0, 0, 0);

    newDate.setDate(newDate.getDate() + daysToAdd - 1);
    const formattedDate = format(newDate, "yyyy-MM-dd HH:mm:ss")

    setDateCheckOut(formattedDate)
  }

  const saveReservationButtonHandler = async () => {
    if (!readCheck) toast.warn("Please read the guide and fill the checkbox");
    try {
      const currentDate = new Date(); // Mendapatkan tanggal saat ini

      const formattedCurrentDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");
      if (session?.user) {
        const data = {
          user_id: session.user.user_id,
          package_id: params.id,
          request_date: formattedCurrentDate,
          check_in: dateCheckIn,
          total_people: totalPeople,
          total_price: totalPricePackage,
          deposit: totalDeposit,
          note: note
        }
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        }
        const res = await axios.post('http://localhost:3000/reservation/process-transaction', data, config)

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

  if (dataPackageById) {
    return (
      <div className="mx-60 bg-white rounded-lg">
        <div className="flex flex-col p-5 shadow-xl ">
          <h1 className="font-bold text-lg text-center">Reservation of Package</h1>
          <div className="italic text-white bg-red-500 rounded-lg w-fit mt-5 py-1 px-3 hover:bg-red-700 select-none" role="button" onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faInfo} /> Read this guide
          </div>
          <ReadGuide readGuideOpen={isOpen} setReadGuideOpen={setIsOpen} />
          <div className="italic select-none">
            <FormControlLabel control={
              <Checkbox checked={readCheck} onChange={readCheckHandleChange} size="small" required />
            }
              label="I have read this guide"
            />
          </div>
          <div>
            <h2 className="font-medium text-lg">Information</h2>
            <p className="ml-5">Packaged : {dataPackageById[0].name}</p>
            <p className="ml-5">Minimal Capacity : {dataPackageById[0].min_capacity}</p>
            <p className="ml-5">Day: {dataPackageById[0].max_day}</p>
            <p className="ml-5">Price : {rupiah(dataPackageById[0].price)}</p>
          </div>
          <div>
            <h2 className="font-medium text-lg">Booking</h2>
            <div className="relative w-fit ml-5">
              <p>Check-in</p>
              {/* <Datetime value={new Date()} className="appearance-none shadow border rounded-lg w-fit py-1 px-2" /> */}
              {/* <CalendarClock className="absolute right-3 top-7 w-10" /> */}
              <input className="appearance-none shadow border rounded-lg w-fit py-1 px-2" onChange={readDateHandleChange} type="datetime-local"
                min={formattedDate + 'T00:00'}
              />
            </div>
            <div className="relative w-fit ml-5 select-none">
              <p>Check-out</p>
              {/* <Datetime value={new Date()} className="appearance-none shadow border rounded-lg w-fit py-1 px-2" />
              <CalendarClock className="absolute right-3 top-7 w-10" /> */}
              <input className="appearance-none shadow border rounded-lg w-fit py-1 px-2" defaultValue={dateCheckOut} type="datetime-local" readOnly
              />
            </div>
          </div>
          <p className="mt-3">Total People</p>
          <TextField id="outlined-basic" required variant="outlined" onChange={totalPeopleHandleChange} size="small" type="number" />
          <p className="mt-3">Total Order Package</p>
          <TextField id="outlined-basic" value={totalOrderPackage + ' Pcs'} variant="outlined" size="small" />
          <p className="mt-3">Note</p>
          <TextField id="outlined-basic" variant="outlined" size="small" onChange={(event) => setNote(event.target.value)} />
          <p className="mt-3">Total Price Package</p>
          <TextField id="outlined-basic" value={rupiah(totalPricePackage)} variant="outlined" size="small" />
          <p className="mt-3">Deposit</p>
          <TextField id="outlined-basic" value={rupiah(totalDeposit)} variant="outlined" size="small" />
          <div className="flex items-center mt-5">
            <button type="button" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 ml-auto disabled:" onClick={saveReservationButtonHandler}>Save Reservation</button>
          </div>
        </div>
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
      </div>
    )
  }
}