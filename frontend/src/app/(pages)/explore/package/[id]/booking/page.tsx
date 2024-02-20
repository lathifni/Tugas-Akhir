'use client'

import { fetchPackageById } from "@/app/(pages)/api/fetchers/package";
import { faInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, Checkbox, TextField, Typography } from "@mui/material"
import FormControlLabel from '@mui/material/FormControlLabel';
import { useQuery } from "@tanstack/react-query";
import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { addDays, format } from 'date-fns';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from '@mui/material';
import axios from "axios";
import snapMidtrans from "@/hooks/snapMidtrans";
import ReadGuide from "./_components/readGuide";
// import { postReservationTransaction } from "@/app/(pages)/api/fetchers/reservation";

export default function BookingIdPage({ params }: any) {
  const [readCheck, setReadCheck] = useState(false)
  const [totalPeople, setTotalPeople] = useState(0)
  const [totalOrderPackage, setTotalOrderPackage] = useState(0)
  const [totalPricePackage, setTotalPricePackage] = useState(0)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [dateCheckOut, setDateCheckOut] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [handleClose, setHandleClose] = useState(false)
  const [token, setToken] = useState('')
  const [snapShow, setSnapShow] = useState(false)

  // const { snapEmbed } = snapMidtrans()

  const { data: dataPackageById, isLoading: loadingPackageById } = useQuery({
    queryKey: ['PackageById', params.id],
    queryFn: () => fetchPackageById(params.id)
  })
  // const { isLoading, error, data:dataReservation } = useQuery({
  //   queryKey: ['reservationTransaction'],
  //   queryFn: postReservationTransaction
  // });

  console.log(params.id);


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
    const newDate = new Date(inputDate);
    newDate.setHours(12, 0, 0, 0);
    newDate.setDate(newDate.getDate() + daysToAdd - 1);
    const formattedDate = newDate.toISOString().split("T")[0] + 'T12:00';
    setDateCheckOut(formattedDate)
  }

  const saveReservationButtonHandler = async () => {

    if (!readCheck) {
      console.log('tsetststs');
      toast.warn("Please read the guide and fill the checkbox");
    }
    try {
      const data = {
        name: 'user',
        order_id: 'barangtest111000000',
        total: 100100,
        email: 'pargadbrother@gmail.com'
      }
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      const res = await axios.post('http://localhost:3000/reservation/process-transaction', data, config)
      console.log(res.data);


      if (res.status == 201) {
        setToken(res.data.token)

      }
      // setToken('1fda8b50-6513-4606-adb6-f509f62a774b')
      // window.snap.pay('0cd5ef8f-b177-4226-a8a7-5be71cc0933c', {
      //   onSuccess: (result: any) => {
      //     console.log(result, 'di onSuccess');
      //     setToken('')
      //   },
      //   onPending: (result: any) => {
      //     console.log(JSON.stringify(result), 'di onPending');
      //     // localStorage.setItem('pembayaran',JSON.stringify(result))
      //     setToken('')
      //     window.snap.hide()
      //   },
      //   onError: (error: any) => {
      //     console.log(error);

      //   },
      //   onClose: () => {
      //     console.log('di close Anda belum menyelesaikan pembayaran');

      //   }
      // })

      // if (res && res.status === 200) {
      //   console.log('di dalam res responsenya nih');
      //   setToken(res.data.token)

      // const { snapEmbed } = snapMidtrans()
      // snapEmbed(token, 'snap-container', {
      //   onSuccess: function (result: any) {
      //     console.log('success', result);
      //     // action.onSuccess(result)
      // },
      // onPending: function (result: any) {
      //     console.log('pending', result);
      //     // action.onPending(result)
      // },
      // onClose: function () {
      //     // action.onClose()

      // }
      // })
      // }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result: any) => {
          console.log(result, 'di onSuccess');
          setToken('')
        },
        onPending: (result: any) => {
          console.log(JSON.stringify(result), 'di onPending');
          setToken('')
        },
        onError: (error: any) => {
          console.log(error);

        },
        onClose: () => {
          console.log('di close Anda belum menyelesaikan pembayaran');

        }
      })
    }
  }, [token])

  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const myMidtransClientKey = process.env.MIDTRANS_CLIENT_KEY
    const script = document.createElement('script')
    script.src = midtransScriptUrl
    if (myMidtransClientKey) script.setAttribute('data-client-key', myMidtransClientKey);

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
    const myMidtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    console.log(myMidtransClientKey);

    scriptTag.setAttribute('data-client-key', process.env.MIDTRANS_CLIENT_KEY!);
    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    }
  }, []);

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
    const price = dataPackageById[0].price
    let inputTotalPeople = Number(event.target.value)

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
    console.log(dataPackageById);

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
            {snapShow && (
              <div id="snap-container"></div>
            )}
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
          <TextField id="outlined-basic" variant="outlined" size="small" />
          <p className="mt-3">Total Price Package</p>
          {/* <TextField id="outlined-basic" value={rupiah(totalPackageOrder * dataPackageById[0].price)} variant="outlined" size="small" /> */}
          <TextField id="outlined-basic" value={rupiah(totalPricePackage)} variant="outlined" size="small" />
          <p className="mt-3">Deposit</p>
          {/* <TextField id="outlined-basic" value={rupiah(0.2 * totalPackageOrder * dataPackageById[0].price)} variant="outlined" size="small" /> */}
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