'use client'

import { fetchReservationById } from "@/app/(pages)/api/fetchers/reservation";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ConfirmationDateDialog from "./_components/confirmationDateDialog";
import useAxiosAuth from "../../../../../../../libs/useAxiosAuth";
import { fetchBookedHomestay } from "@/app/(pages)/api/fetchers/homestay";
import { Bounce, toast, ToastContainer } from "react-toastify";
import RefundProofDialog from "./_components/refundProofDialog";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Activity {
  day: string;
  activity: string;
  activity_name: string;
}

interface ReservationData {
  activity: Activity[];
}

export default function ReservationIdPage({ params }: any) {
  const [dataActivity, setDataActivity] = useState<{ day: string; activities: Activity[] }[]>([]);
  const [token, setToken] = useState('')
  const [totalPriceHomestay, setTotalPriceHomestay] = useState(0)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [refundProofIsOpen, setRefundProofIsOpen] = useState(false)
  const { data: session, status, update } = useSession()
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

  const { data: dataReservationById, isLoading: loadingReservation, refetch } = useQuery({
    queryKey: ['reservationbyId', params.id],
    queryFn: () => fetchReservationById(params.id),
    // staleTime: 10000
  })

  const { data: dataBookedHomestay, isLoading: loadingBookedHomestay } = useQuery({
    queryKey: ['bookedHomestay', params.id],
    queryFn: () => fetchBookedHomestay(params.id),
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

  const confirmation = async (value: string) => {
    const res = await useAxiosAuth.get(`/reservation/confirmationDate/${params.id}/${value}`)
    refetch()
    toast.success('Confirmation is success')
    console.log(res.data.data);
  }

  useEffect(() => {
    try {
      const groupedData: { [key: string]: Activity[] } = {};
      if (dataReservationById && dataBookedHomestay) {
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
        setTotalPriceHomestay(dataBookedHomestay.reduce((total:number, homestay:any) => total + homestay.price, 0)) 
        setDataActivity(accordionContent);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dataReservationById, dataBookedHomestay])

  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;

    scriptTag.setAttribute('data-client-key', process.env.MIDTRANS_CLIENT_KEY!);
    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    }
  }, []);

  const refundProofOnSave = async(data:any) => {
    const formData = new FormData()
    const category = 'refund'
    formData.append('category', category);
    formData.append('images[0]', data.gallery[0]!.file)
    const responseCover = await axios.post("/api/images", formData);
    console.log(responseCover.data.data);
    const dataProof = {
      url: responseCover.data.data,
      admin_refund: session?.user.user_id,
      id: params.id
    }
    const response = await useAxiosAuth.put('reservation/refund/adminproof', dataProof)
    console.log(response.data);
    if (response.data.status == 'success') toast.success('Success upload refund proof')
  }

  if (dataReservationById && dataBookedHomestay) {
    const activeStep = getStatusStep();
    return (
      <div className="flex flex-col xl:flex-row m-1 sm:m-3 lg:m-5">
        <ConfirmationDateDialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} confirmation={confirmation}/>
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
                </tbody>
              </table>
              {dataReservationById.reservation.status_id == 8 && (
                <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                  onClick={() => setRefundProofIsOpen(true)}>
                    {dataReservationById.reservation.refund_check === null
                      ? 'Submit Refund Proof'
                      : dataReservationById.reservation.refund_check === 0
                      ? 'Resubmit Refund Proof'
                      : null}
                  </button>
              )}
              {/* <Stepper activeStep={dataReservationById.reservation.status_id - 1}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper> */}
              {[1, 2, 3, 4].includes(dataReservationById.reservation.status_id) && (
                <Stepper activeStep={activeStep} className="my-2">
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              )}
              {dataReservationById.reservation.status_id === 1 && (
                <div className="flex justify-center">
                  <button className="bg-blue-500 text-white p-2 my-4 rounded-md hover:bg-blue-700" onClick={() => setIsOpenDialog(true)}>Confirmation Date</button>
                </div>
              )}
              <Accordion className="mt-2">
                <AccordionSummary expandIcon={<ChevronDown />} className=" rounded-lg font-semibold mt-3">
                  Payment Detail
                </AccordionSummary>
                <AccordionSummary>
                  <table className="ml-2">
                    <tbody>
                      <tr className="w-fit">
                        <td className="font-semibold whitespace-no-wrap">Total Reservation Include Homestay</td>
                        <td className="font-normal">
                          {rupiah(dataReservationById.reservation.total_price+totalPriceHomestay)}
                        </td>
                      </tr>
                      <tr className="w-fit">
                        <td className="font-semibold whitespace-no-wrap">Deposit Reservation</td>
                        <td className="font-normal">
                          {rupiah(dataReservationById.reservation.deposit)}
                        </td>
                      </tr>
                      <tr className="w-fit">
                        <td className="font-semibold whitespace-no-wrap">Deposit Date</td>
                        <td className="font-normal">
                          {dataReservationById.reservation.deposit_date ? (
                            moment(dataReservationById.reservation.deposit_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')
                          ) : (
                            <span className="italic text-gray-500"> Not available</span>
                          )}
                        </td>
                      </tr>
                      {dataReservationById.reservation.payment_date && (
                        <tr className="w-fit">
                          <td className="font-semibold whitespace-no-wrap">Payment Date</td>
                          <td className="font-normal">
                            {moment(dataReservationById.reservation.payment_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}
                          </td>
                        </tr>
                      )}
                      {dataReservationById.reservation.cancel_date && (
                        <tr className="w-fit">
                          <td className="font-semibold whitespace-no-wrap">Cancel Date</td>
                          <td className="font-normal">
                            {moment(dataReservationById.reservation.cancel_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}
                          </td>
                        </tr>
                      )}
                      {dataReservationById.reservation.refund_date && (
                        <tr className="w-fit">
                          <td className="font-semibold whitespace-no-wrap">refund Date</td>
                          <td className="font-normal">
                            {moment(dataReservationById.reservation.refund_date).utc(true).format('dddd, Do MMMM YYYY, hh:mm')}
                          </td>
                        </tr>
                      )}
                      {dataReservationById.reservation.status_id == 8 && (
                        <tr className="w-fit">
                          <td className="font-semibold whitespace-no-wrap">Account Refund</td>
                          <td className="font-normal">
                            {dataReservationById.reservation.account_refund}
                          </td>
                        </tr>
                      )}
                      {dataReservationById.reservation.status_id == 8 && (
                        <tr className="w-fit">
                          <td colSpan={2} className="text-center">
                            <button
                              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                              onClick={() => setRefundProofIsOpen(true)}
                            >
                              Submit Refund Proof
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
            <table className="w3-table-all w3-hoverable w3-card-2">
              <thead>
                <tr>
                  <th className="w3-center">Homestay</th>
                  <th className="w3-center">Unit</th>
                  <th className="w3-center">Capacity</th>
                  <th className="w3-center">Price</th>
                </tr>
              </thead>
              <tbody >
              {dataBookedHomestay.map((homestay: { name:string, nama_unit:string, unit_number:string, capacity:number, price:number}) => (
              <tr key={homestay.unit_number} className="justify-center">
                <td className="w3-center">{homestay.name}</td>
                <td className="w3-center">{homestay.nama_unit}-{homestay.unit_number}</td>
                <td className="w3-center">{homestay.capacity}</td>
                <td className="w3-center">{rupiah(homestay.price)}</td>
              </tr>
            ))}
                <tr>
                  <th colSpan={2} className="text-left">Total Days</th>
                  <th colSpan={3} className="text-left">: {dataReservationById.reservation.max_day-1} Days</th>
                </tr>
                <tr>
                  <th colSpan={2} className="text-left">Total Price Homestay</th>
                  <th colSpan={3} className="text-left">: {rupiah(totalPriceHomestay)}</th>
                </tr>
              </tbody>
            </table>
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
        <RefundProofDialog isOpen={refundProofIsOpen} setIsOpen={setRefundProofIsOpen}
          onSave={refundProofOnSave} account_refund={dataReservationById.reservation.account_refund}/>
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