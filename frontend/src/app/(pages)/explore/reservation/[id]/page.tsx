'use client'

import { fetchReservationById } from "@/app/(pages)/api/fetchers/reservation";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface Activity {
  day: string;
  activity: string;
  activity_name: string;
}

interface ReservationData {
  activity: Activity[];
}

export default function ReservationId({ params }: any) {
  const [dataActivity, setDataActivity] = useState<{ day: string; activities: Activity[] }[]>([]);
  const [token, setToken] = useState('')
  const steps = ['Waiting Confirmation Date', 'Deposit', 'Full Payment', 'Enjoy Trip'];
  const getStatusStep = () => {
    switch (dataReservationById.reservation.status_id) {
      case 1:
        return 0; // Langkah 1: Deposit
      case 2:
        return 1; // Langkah 2: Full Payment
      case 3:
        return 2; // Langkah 3: Enjoy Trip
      case 4:
        return 4
      default:
        return -1; // Status tidak valid, tampilkan semua langkah
    }
  };

  const { data: dataReservationById, isLoading: loadingReservation } = useQuery({
    queryKey: ['reservationbyId', params.id],
    queryFn: () => fetchReservationById(params.id),
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

  const payNowButtonHandler = () => {
    setToken(dataReservationById.reservation.token_midtrans)

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
  }

  useEffect(() => {
    try {
      const groupedData: { [key: string]: Activity[] } = {};
      dataReservationById.activity.forEach((activity: Activity) => {
        if (!groupedData[activity.day]) {
          groupedData[activity.day] = [];
        }
        groupedData[activity.day].push(activity);
      });

      const accordionContent = Object.entries(groupedData).map(([day, activities]: [string, Activity[]]) => ({
        day,
        activities: activities.sort((a, b) => parseInt(a.activity) - parseInt(b.activity))
      }));

      setDataActivity(accordionContent);
    } catch (error) {
      console.log(error);
    }
  }, [dataReservationById])

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

  if (dataReservationById) {
    const activeStep = getStatusStep();
    console.log(dataReservationById.reservation.token_midtrans);
    return (
      <div className="flex flex-col xl:flex-row m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-1 xl:w-1/2">
          {dataReservationById && (
            <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
              <div id="snap-container"></div>
              <h1 className="text-center text-xl font-bold">Reservation Package</h1>
              <table className="w-full mt-5 text-lg">
                <tbody>
                  <tr className="w-fit">
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Package Name</td>
                    <td className="font-normal">{dataReservationById.reservation.name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Package Type</td>
                    <td className="font-normal">{dataReservationById.reservation.type_name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Request Date</td>
                    {/* <td className="font-normal">{new Date(dataReservationById.reservation.request_date).toDateString()}</td> */}
                    <td className="font-normal">{moment(dataReservationById.reservation.request_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Days Package</td>
                    {dataReservationById.reservation.max_day > 1 ? (
                      <td className="font-normal">{dataReservationById.reservation.max_day} Days</td>
                    ) :
                      <td className="font-normal">{dataReservationById.reservation.max_day} Day</td>}
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Check-in</td>
                    {/* <td className="font-normal">{new Date(dataReservationById.reservation.check_in).toDateString()}</td> */}
                    <td className="font-normal">{moment(dataReservationById.reservation.check_in).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Check-out</td>
                    <td className="font-normal">
                      {(() => {
                        const checkInDate = moment(dataReservationById.reservation.check_in);
                        const checkOutDate = checkInDate.clone(); // Clone checkInDate to prevent mutation

                        if (dataReservationById.reservation.max_day > 1) {
                          checkOutDate.add(dataReservationById.reservation.max_day - 1, 'days').set({ hour: 12, minute: 0, second: 0 }); // Set checkout time to 12:00 PM
                        } else {
                          checkOutDate.set({ hour: 18, minute: 0, second: 0 }); // Set checkout time to 6:00 PM
                        }
                        return `${checkOutDate.format('dddd, Do MMMM  YYYY')}, ${checkOutDate.format('HH:mm')}`;
                      })()}
                    </td>
                  </tr>
                  {/* <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Minimal Capacity</td>
                    <td className="font-normal">{dataReservationById.reservation.min_capacity} people</td>
                  </tr> */}
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Total People</td>
                    <td className="font-normal">{dataReservationById.reservation.total_people} People</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Base Price Package</td>
                    <td className="font-normal">{rupiah(dataReservationById.reservation.price)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Price Total</td>
                    <td className="font-normal">{rupiah(dataReservationById.reservation.total_price)}
                      <span className="italic text-slate-600"> *Based on the activities and services added</span>
                    </td>
                  </tr>
                  <tr className="w-fit">
                    <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Status</td>
                    <td className="font-semibold">{dataReservationById.reservation.status}</td>
                  </tr>
                  {dataReservationById.reservation.status_id === 2 ? (
                    <tr>
                      <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap"></td>
                      <td className="font-normal">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700" onClick={payNowButtonHandler}>Pay Deposit Now</button>
                      </td>
                    </tr>
                  ): null}
                  {dataReservationById.reservation.status_id === 3 ? (
                    <tr>
                      <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap"></td>
                      <td className="font-normal">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700" onClick={payNowButtonHandler}>Pay Full Payment Now</button>
                      </td>
                    </tr>
                  ): null}
                </tbody>
              </table>
              {/* <Stepper activeStep={dataReservationById.reservation.status_id - 1}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper> */}
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Accordion className="mt-4">
                <AccordionSummary expandIcon={<ChevronDown />} className=" rounded-lg font-semibold mt-3">
                  Payment Detail
                </AccordionSummary>
                <AccordionSummary>
                  <div>
                    <table className="ml-2">
                      <tbody>
                        <tr className="w-fit">
                          <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Deposit Date</td>
                          <td className="font-normal">{moment(dataReservationById.reservation.deposit_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}</td>
                        </tr>
                        <tr className="w-fit">
                          <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Payment Date</td>
                          <td className="font-normal">{moment(dataReservationById.reservation.payment_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}</td>
                        </tr>
                        <tr className="w-fit">
                          <td className="font-semibold md:w-40 lg:w-80 whitespace-no-wrap">Refund Date</td>
                          <td className="font-normal">{dataReservationById.reservation.refund_date}</td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700">Refund</button>
                  </div>
                </AccordionSummary>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold mt-3">
                  Description
                </AccordionSummary>
                <AccordionDetails className="ml-2">
                  {dataReservationById.reservation.description}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold">
                  Activities
                </AccordionSummary>
                <AccordionDetails>
                  {dataActivity.map((accordionItem, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold">
                        Activity - Day {accordionItem.day}
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul>
                          {accordionItem.activities.map((activity: Activity, activityIndex: number) => (
                            <li key={activityIndex}>{activity.activity}. {activity.activity_name}</li>
                          ))}
                        </ul>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} className="bg-blue-100 rounded-lg font-semibold">
                  Services
                </AccordionSummary>
                <AccordionDetails>
                  <ul className="ml-2">
                    <li>
                      <p className="font-semibold">Service Include</p>
                      <ul className="ml-5">
                        {dataReservationById.service
                          .filter((item: { status: number; name: string }) => item.status === 1)
                          .map((service: { name: string }, index: number) => (
                            <li key={index} className="list-disc ml-2">{service.name}</li>
                          ))}
                      </ul>
                    </li>
                    <li>
                      <p className="font-semibold mt-5">Service Exclude</p>
                      <ul className="ml-5">
                        {dataReservationById.service
                          .filter((item: { status: number; name: string }) => item.status === 0)
                          .map((service: { name: string }, index: number) => (
                            <li key={index} className="list-disc ml-2">{service.name}</li>
                          ))}
                      </ul>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            </div>
          )}
        </div>
        <div className="w-full h-full px-1 xl:w-1/2">
          <div className="relative py-5 bg-white rounded-lg mb-5 px-5 shadow-lg">
            <h1 className="text-center text-xl font-bold">Reservation Homestay</h1>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col justify-center items-center py-5 bg-white rounded-lg m-5 px-5 shadow-lg">
      <h1 className="text-center text-xl font-bold">Loading Reservation Information</h1>
      <ClipLoader color="#36d7b7" speedMultiplier={3} className="my-28" />
    </div>
  )
}